import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/db";
import { authorizeRequest } from "@/lib/auth/authorization";

function errorResponse(status: number, code: string, message: string) {
  return NextResponse.json(
    { error: { code, message } },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

type DeviceAdminRow = {
  student_profile_id: string;
  user_id: string;
  full_name: string;
  phone: string;
  student_code: string;
  account_status: "ACTIVE" | "DISABLED";
  device_token_hash: string | null;
  user_agent: string | null;
  first_seen_at: Date | null;
  last_seen_at: Date | null;
};

export async function GET(request: NextRequest) {
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

  try {
    const result = await pool.query<DeviceAdminRow>(
      `select
         sp.id as student_profile_id,
         u.id as user_id,
         u.full_name,
         u.phone,
         sp.student_code,
         u.status as account_status,
         sd.device_token_hash,
         sd.user_agent,
         sd.first_seen_at,
         sd.last_seen_at
       from student_profiles sp
       join users u on u.id = sp.user_id
       left join student_devices sd on sd.student_id = u.id
       order by u.full_name asc`,
    );

    return NextResponse.json(
      {
        data: {
          students: result.rows.map((row) => ({
            studentProfileId: row.student_profile_id,
            userId: row.user_id,
            fullName: row.full_name,
            phone: row.phone,
            studentCode: row.student_code,
            accountStatus: row.account_status,
            deviceBound: Boolean(row.device_token_hash),
            userAgent: row.user_agent,
            firstSeenAt: row.first_seen_at?.toISOString() ?? null,
            lastSeenAt: row.last_seen_at?.toISOString() ?? null,
          })),
        },
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("admin.student_devices.list.failed", {
      error: error instanceof Error ? error.message : "unknown_error",
    });
    return errorResponse(500, "DEVICE_LIST_UNAVAILABLE", "Device list is temporarily unavailable.");
  }
}
