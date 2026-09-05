import { asc, desc, eq, inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { db, pool } from "@/db";
import {
  groups,
  levels,
  offers,
  streams,
  studentProfiles,
  studentSubscriptions,
  users,
} from "@/db/schema";
import { validateGroupAssignment } from "@/lib/academic/group-assignment-core";
import { authorizeRequest } from "@/lib/auth/authorization";
import { hashPassword } from "@/lib/auth/password";
import { normalizeMoroccanPhone } from "@/lib/auth/phone";
import {
  buildSubscriptionStatusPatch,
  isSubscriptionStatus,
} from "@/lib/subscriptions/core";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type ProgressRow = {
  student_id: string;
  total_lessons: string | number;
  started_lessons: string | number;
  completed_lessons: string | number;
};

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

function makeStudentCode() {
  const suffix = crypto.randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase();
  return `HARTI-${new Date().getFullYear()}-${suffix}`;
}

async function validateAcademicScope(
  levelId: string,
  streamId: string | null,
  primaryGroupId: string | null,
) {
  const [level] = await db
    .select({ id: levels.id })
    .from(levels)
    .where(eq(levels.id, levelId))
    .limit(1);
  if (!level) return { ok: false as const, code: "LEVEL_NOT_FOUND" };

  if (streamId) {
    const [stream] = await db
      .select({ id: streams.id, levelId: streams.levelId })
      .from(streams)
      .where(eq(streams.id, streamId))
      .limit(1);
    if (!stream || stream.levelId !== levelId) {
      return { ok: false as const, code: "STREAM_MISMATCH" };
    }
  }

  if (primaryGroupId) {
    const [group] = await db
      .select({
        id: groups.id,
        levelId: groups.levelId,
        streamId: groups.streamId,
        active: groups.active,
      })
      .from(groups)
      .where(eq(groups.id, primaryGroupId))
      .limit(1);
    if (!group) return { ok: false as const, code: "GROUP_NOT_FOUND" };
    const validation = validateGroupAssignment(
      { levelId, streamId },
      { levelId: group.levelId, streamId: group.streamId, active: group.active },
    );
    if (!validation.ok) return { ok: false as const, code: validation.reason };
  }

  return { ok: true as const };
}

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

  const [studentRows, levelRows, streamRows, groupRows, offerRows] = await Promise.all([
    db
      .select({
        id: studentProfiles.id,
        userId: studentProfiles.userId,
        fullName: users.fullName,
        phone: users.phone,
        status: users.status,
        preferredLanguage: users.preferredLanguage,
        createdAt: users.createdAt,
        lastLoginAt: users.lastLoginAt,
        studentCode: studentProfiles.studentCode,
        levelId: studentProfiles.levelId,
        streamId: studentProfiles.streamId,
        primaryGroupId: studentProfiles.primaryGroupId,
      })
      .from(studentProfiles)
      .innerJoin(users, eq(studentProfiles.userId, users.id))
      .orderBy(asc(users.fullName)),
    db.select().from(levels).orderBy(asc(levels.name)),
    db.select().from(streams).orderBy(asc(streams.name)),
    db.select().from(groups).orderBy(asc(groups.name)),
    db
      .select({
        id: offers.id,
        name: offers.name,
        academicYearId: offers.academicYearId,
        active: offers.active,
      })
      .from(offers)
      .where(eq(offers.active, true))
      .orderBy(asc(offers.name)),
  ]);

  const studentIds = studentRows.map((row) => row.userId);
  const subscriptionRows = studentIds.length
    ? await db
        .select({
          id: studentSubscriptions.id,
          studentId: studentSubscriptions.studentId,
          offerId: studentSubscriptions.offerId,
          offerName: offers.name,
          status: studentSubscriptions.status,
          startsAt: studentSubscriptions.startsAt,
          endsAt: studentSubscriptions.endsAt,
          createdAt: studentSubscriptions.createdAt,
        })
        .from(studentSubscriptions)
        .innerJoin(offers, eq(studentSubscriptions.offerId, offers.id))
        .where(inArray(studentSubscriptions.studentId, studentIds))
        .orderBy(desc(studentSubscriptions.createdAt))
    : [];

  const subscriptionsByStudent = new Map<string, typeof subscriptionRows>();
  for (const row of subscriptionRows) {
    const current = subscriptionsByStudent.get(row.studentId) ?? [];
    current.push(row);
    subscriptionsByStudent.set(row.studentId, current);
  }

  const progress = new Map<string, { totalLessons: number; startedLessons: number; completedLessons: number; percent: number }>();
  if (studentIds.length) {
    const result = await pool.query<ProgressRow>(
      `select
         sp.user_id as student_id,
         count(distinct l.id) as total_lessons,
         count(distinct case when lp.status in ('STARTED', 'COMPLETED') then l.id end) as started_lessons,
         count(distinct case when lp.status = 'COMPLETED' then l.id end) as completed_lessons
       from student_profiles sp
       join student_subscriptions ss
         on ss.student_id = sp.user_id
        and ss.status = 'ACTIVE'
        and (ss.starts_at is null or ss.starts_at <= now())
        and (ss.ends_at is null or ss.ends_at >= now())
       join offers o
         on o.id = ss.offer_id
        and o.active = true
        and o.academic_year_id is not null
        and (o.starts_at is null or o.starts_at <= now())
        and (o.ends_at is null or o.ends_at >= now())
       join courses c
         on c.academic_year_id = o.academic_year_id
        and c.level_id = sp.level_id
        and c.status = 'PUBLISHED'
        and (c.stream_id is null or c.stream_id = sp.stream_id)
       join chapters ch on ch.course_id = c.id and ch.status = 'PUBLISHED'
       join lessons l on l.chapter_id = ch.id and l.status = 'PUBLISHED'
       left join lesson_progress lp on lp.student_id = sp.user_id and lp.lesson_id = l.id
       where sp.user_id = any($1::uuid[])
       group by sp.user_id`,
      [studentIds],
    );

    for (const row of result.rows) {
      const totalLessons = Number(row.total_lessons) || 0;
      const startedLessons = Number(row.started_lessons) || 0;
      const completedLessons = Number(row.completed_lessons) || 0;
      progress.set(row.student_id, {
        totalLessons,
        startedLessons,
        completedLessons,
        percent: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
      });
    }
  }

  const statusPriority = { ACTIVE: 0, PENDING: 1, SUSPENDED: 2, EXPIRED: 3 } as const;
  const students = studentRows.map((row) => {
    const subscriptions = [...(subscriptionsByStudent.get(row.userId) ?? [])].sort(
      (a, b) => statusPriority[a.status] - statusPriority[b.status],
    );
    return {
      ...row,
      subscriptions,
      currentSubscription: subscriptions[0] ?? null,
      progress: progress.get(row.userId) ?? {
        totalLessons: 0,
        startedLessons: 0,
        completedLessons: 0,
        percent: 0,
      },
    };
  });

  return NextResponse.json(
    {
      data: {
        students,
        levels: levelRows,
        streams: streamRows,
        groups: groupRows,
        offers: offerRows,
      },
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: NextRequest) {
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

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return errorResponse(400, "INVALID_REQUEST", "Invalid JSON body.");
  }

  const fullName = text(body.fullName, 180);
  const phone = typeof body.phone === "string" ? normalizeMoroccanPhone(body.phone) : null;
  const password = typeof body.password === "string" ? body.password : "";
  const levelId = uuid(body.levelId);
  const streamId = optionalUuid(body.streamId);
  const primaryGroupId = optionalUuid(body.primaryGroupId);
  const preferredLanguage = body.preferredLanguage === "fr" ? "fr" : "ar";
  const accountStatus = body.status === "DISABLED" ? "DISABLED" : "ACTIVE";
  const studentCode = text(body.studentCode, 64) ?? makeStudentCode();
  const offerId = optionalUuid(body.offerId);
  const subscriptionStatus = body.subscriptionStatus ?? "ACTIVE";

  if (!fullName || !phone || password.length < 8 || password.length > 128 || !levelId) {
    return errorResponse(
      400,
      "INVALID_STUDENT",
      "Full name, valid Moroccan phone, password (8-128 chars) and level are required.",
    );
  }
  if (streamId === undefined || primaryGroupId === undefined || offerId === undefined) {
    return errorResponse(400, "INVALID_ID", "One of the supplied identifiers is invalid.");
  }
  if (offerId && !isSubscriptionStatus(subscriptionStatus)) {
    return errorResponse(400, "INVALID_SUBSCRIPTION_STATUS", "Unsupported subscription status.");
  }

  const scope = await validateAcademicScope(levelId, streamId, primaryGroupId);
  if (!scope.ok) {
    return errorResponse(400, scope.code, "The selected level, stream or group is not compatible.");
  }

  if (offerId) {
    const [offer] = await db.select({ id: offers.id }).from(offers).where(eq(offers.id, offerId)).limit(1);
    if (!offer) return errorResponse(404, "OFFER_NOT_FOUND", "Offer not found.");
  }

  try {
    const passwordHash = await hashPassword(password);
    const now = new Date();
    const result = await db.transaction(async (tx) => {
      const [user] = await tx
        .insert(users)
        .values({
          fullName,
          phone,
          passwordHash,
          role: "STUDENT",
          status: accountStatus,
          preferredLanguage,
        })
        .returning({ id: users.id, fullName: users.fullName, phone: users.phone });
      if (!user) throw new Error("USER_CREATION_FAILED");

      const [profile] = await tx
        .insert(studentProfiles)
        .values({
          userId: user.id,
          levelId,
          streamId,
          primaryGroupId,
          studentCode,
        })
        .returning();
      if (!profile) throw new Error("PROFILE_CREATION_FAILED");

      let subscription = null;
      if (offerId && isSubscriptionStatus(subscriptionStatus)) {
        const statusPatch = buildSubscriptionStatusPatch(subscriptionStatus, now);
        const [created] = await tx
          .insert(studentSubscriptions)
          .values({
            studentId: user.id,
            offerId,
            createdByUserId: authorization.session.user.id,
            startsAt: subscriptionStatus === "ACTIVE" ? now : null,
            ...statusPatch,
          })
          .returning();
        subscription = created ?? null;
      }

      return { user, profile, subscription };
    });

    return NextResponse.json(
      { data: result },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    const pgCode = typeof error === "object" && error !== null && "code" in error ? String(error.code) : "";
    if (pgCode === "23505") {
      return errorResponse(409, "DUPLICATE_STUDENT", "Phone number or student code already exists.");
    }
    if (pgCode === "23503") {
      return errorResponse(400, "INVALID_REFERENCE", "One of the selected academic records no longer exists.");
    }
    console.error("admin.students.create.failed", { pgCode });
    return errorResponse(500, "STUDENT_CREATION_FAILED", "Student creation is temporarily unavailable.");
  }
}
