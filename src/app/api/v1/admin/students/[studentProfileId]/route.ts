import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import {
  authSessions,
  groups,
  levels,
  streams,
  studentProfiles,
  users,
} from "@/db/schema";
import { validateGroupAssignment } from "@/lib/academic/group-assignment-core";
import { authorizeRequest } from "@/lib/auth/authorization";
import { normalizeMoroccanPhone } from "@/lib/auth/phone";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function errorResponse(status: number, code: string, message: string) {
  return NextResponse.json(
    { error: { code, message } },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

function text(value: unknown, max = 180): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value.trim();
  return cleaned.length > 0 && cleaned.length <= max ? cleaned : null;
}

function uuid(value: unknown): string | null {
  return typeof value === "string" && UUID_PATTERN.test(value) ? value : null;
}

function optionalUuid(value: unknown): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  return uuid(value) ?? undefined;
}

async function loadStudent(studentProfileId: string) {
  const [row] = await db
    .select({
      id: studentProfiles.id,
      userId: studentProfiles.userId,
      fullName: users.fullName,
      phone: users.phone,
      status: users.status,
      preferredLanguage: users.preferredLanguage,
      levelId: studentProfiles.levelId,
      streamId: studentProfiles.streamId,
      primaryGroupId: studentProfiles.primaryGroupId,
      studentCode: studentProfiles.studentCode,
    })
    .from(studentProfiles)
    .innerJoin(users, eq(studentProfiles.userId, users.id))
    .where(eq(studentProfiles.id, studentProfileId))
    .limit(1);
  return row ?? null;
}

async function validateAcademicScope(
  levelId: string,
  streamId: string | null,
  primaryGroupId: string | null,
) {
  const [level] = await db.select({ id: levels.id }).from(levels).where(eq(levels.id, levelId)).limit(1);
  if (!level) return false;

  if (streamId) {
    const [stream] = await db
      .select({ id: streams.id, levelId: streams.levelId })
      .from(streams)
      .where(eq(streams.id, streamId))
      .limit(1);
    if (!stream || stream.levelId !== levelId) return false;
  }

  if (primaryGroupId) {
    const [group] = await db
      .select({ levelId: groups.levelId, streamId: groups.streamId, active: groups.active })
      .from(groups)
      .where(eq(groups.id, primaryGroupId))
      .limit(1);
    if (!group || !validateGroupAssignment({ levelId, streamId }, group).ok) return false;
  }

  return true;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ studentProfileId: string }> },
) {
  const authorization = await authorizeRequest(request, ["ADMIN"]);
  if (!authorization.ok) {
    return errorResponse(
      authorization.reason === "UNAUTHENTICATED" ? 401 : 403,
      authorization.reason,
      authorization.reason === "UNAUTHENTICATED" ? "Authentication required." : "Admin access required.",
    );
  }

  const { studentProfileId } = await params;
  if (!UUID_PATTERN.test(studentProfileId)) {
    return errorResponse(400, "INVALID_STUDENT_ID", "Invalid student profile id.");
  }

  const current = await loadStudent(studentProfileId);
  if (!current) return errorResponse(404, "STUDENT_NOT_FOUND", "Student not found.");

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return errorResponse(400, "INVALID_REQUEST", "Invalid JSON body.");
  }

  const fullName = body.fullName === undefined ? current.fullName : text(body.fullName, 180);
  const phone = body.phone === undefined
    ? current.phone
    : typeof body.phone === "string"
      ? normalizeMoroccanPhone(body.phone)
      : null;
  const levelId = body.levelId === undefined ? current.levelId : uuid(body.levelId);
  const parsedStreamId = optionalUuid(body.streamId);
  const parsedGroupId = optionalUuid(body.primaryGroupId);
  const streamId = body.streamId === undefined ? current.streamId : parsedStreamId;
  const primaryGroupId = body.primaryGroupId === undefined ? current.primaryGroupId : parsedGroupId;
  const studentCode = body.studentCode === undefined ? current.studentCode : text(body.studentCode, 64);
  const status = body.status === undefined ? current.status : body.status;
  const preferredLanguage = body.preferredLanguage === undefined ? current.preferredLanguage : body.preferredLanguage;

  if (
    !fullName || !phone || !levelId || streamId === undefined || primaryGroupId === undefined || !studentCode ||
    !["ACTIVE", "DISABLED"].includes(String(status)) || !["ar", "fr"].includes(String(preferredLanguage))
  ) {
    return errorResponse(400, "INVALID_STUDENT", "One or more student fields are invalid.");
  }

  if (!(await validateAcademicScope(levelId, streamId, primaryGroupId))) {
    return errorResponse(400, "ACADEMIC_SCOPE_MISMATCH", "Level, stream and group are not compatible.");
  }

  try {
    await db.transaction(async (tx) => {
      await tx
        .update(users)
        .set({
          fullName,
          phone,
          status: status as "ACTIVE" | "DISABLED",
          preferredLanguage: preferredLanguage as "ar" | "fr",
          updatedAt: new Date(),
        })
        .where(eq(users.id, current.userId));

      await tx
        .update(studentProfiles)
        .set({ levelId, streamId, primaryGroupId, studentCode, updatedAt: new Date() })
        .where(eq(studentProfiles.id, studentProfileId));

      if (status === "DISABLED") {
        await tx.delete(authSessions).where(eq(authSessions.userId, current.userId));
      }
    });

    const student = await loadStudent(studentProfileId);
    return NextResponse.json({ data: { student } }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const pgCode = typeof error === "object" && error !== null && "code" in error ? String(error.code) : "";
    if (pgCode === "23505") {
      return errorResponse(409, "DUPLICATE_STUDENT", "Phone number or student code already exists.");
    }
    console.error("admin.students.update.failed", { studentProfileId, pgCode });
    return errorResponse(500, "STUDENT_UPDATE_FAILED", "Student update is temporarily unavailable.");
  }
}
