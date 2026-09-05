import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/db";
import { authorizeRequest } from "@/lib/auth/authorization";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function errorResponse(status: number, code: string, message: string) {
  return NextResponse.json(
    { error: { code, message } },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ studentProfileId: string }> },
) {
  const authorization = await authorizeRequest(request, ["ADMIN"]);
  if (!authorization.ok) {
    return errorResponse(
      authorization.reason === "UNAUTHENTICATED" ? 401 : 403,
      authorization.reason,
      authorization.reason === "UNAUTHENTICATED"
        ? "Authentication required."
        : "Admin access required.",
    );
  }

  const { studentProfileId } = await params;
  if (!UUID_PATTERN.test(studentProfileId)) {
    return errorResponse(400, "INVALID_STUDENT_ID", "Invalid student profile id.");
  }

  const client = await pool.connect();
  try {
    await client.query("begin");
    const target = await client.query<{ user_id: string }>(
      `select user_id from student_profiles where id = $1 limit 1`,
      [studentProfileId],
    );

    const userId = target.rows[0]?.user_id;
    if (!userId) {
      await client.query("rollback");
      return errorResponse(404, "STUDENT_NOT_FOUND", "Student not found.");
    }

    await client.query(`delete from student_devices where student_id = $1`, [userId]);
    await client.query(`delete from auth_sessions where user_id = $1`, [userId]);
    await client.query("commit");

    return NextResponse.json(
      { data: { reset: true, sessionsRevoked: true } },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    await client.query("rollback").catch(() => undefined);
    console.error("admin.student_device.reset.failed", {
      error: error instanceof Error ? error.message : "unknown_error",
    });
    return errorResponse(500, "DEVICE_RESET_FAILED", "Device reset failed.");
  } finally {
    client.release();
  }
}
