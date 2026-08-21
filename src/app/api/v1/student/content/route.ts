import { and, asc, eq, inArray, isNull, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { chapters, courses, lessons } from "@/db/content-schema";
import { offers, studentProfiles, studentSubscriptions, subjects } from "@/db/schema";
import { authorizeRequest } from "@/lib/auth/authorization";
import { isSubscriptionEntitled } from "@/lib/subscriptions/core";

function errorResponse(status: number, code: string, message: string) {
  return NextResponse.json({ error: { code, message } }, { status, headers: { "Cache-Control": "no-store" } });
}

export async function GET(request: NextRequest) {
  const authorization = await authorizeRequest(request, ["STUDENT"]);
  if (!authorization.ok) {
    return errorResponse(
      authorization.reason === "UNAUTHENTICATED" ? 401 : 403,
      authorization.reason,
      authorization.reason === "UNAUTHENTICATED" ? "Authentication required." : "Student access required.",
    );
  }

  const userId = authorization.session.user.id;
  const [profile] = await db
    .select({ levelId: studentProfiles.levelId, streamId: studentProfiles.streamId })
    .from(studentProfiles)
    .where(eq(studentProfiles.userId, userId))
    .limit(1);

  if (!profile) {
    return errorResponse(403, "STUDENT_PROFILE_REQUIRED", "Student academic profile is required.");
  }

  const subscriptionRows = await db
    .select({
      academicYearId: offers.academicYearId,
      subscriptionStatus: studentSubscriptions.status,
      subscriptionStartsAt: studentSubscriptions.startsAt,
      subscriptionEndsAt: studentSubscriptions.endsAt,
      offerActive: offers.active,
      offerStartsAt: offers.startsAt,
      offerEndsAt: offers.endsAt,
    })
    .from(studentSubscriptions)
    .innerJoin(offers, eq(studentSubscriptions.offerId, offers.id))
    .where(and(eq(studentSubscriptions.studentId, userId), eq(studentSubscriptions.status, "ACTIVE")));

  const now = new Date();
  const entitledAcademicYearIds = Array.from(
    new Set(
      subscriptionRows
        .filter((row) =>
          Boolean(row.academicYearId) &&
          isSubscriptionEntitled(
            { status: row.subscriptionStatus, startsAt: row.subscriptionStartsAt, endsAt: row.subscriptionEndsAt },
            { active: row.offerActive, startsAt: row.offerStartsAt, endsAt: row.offerEndsAt },
            now,
          ),
        )
        .map((row) => row.academicYearId as string),
    ),
  );

  if (!entitledAcademicYearIds.length) {
    return errorResponse(403, "SUBSCRIPTION_REQUIRED", "An active subscription is required.");
  }

  const streamCondition = profile.streamId
    ? or(isNull(courses.streamId), eq(courses.streamId, profile.streamId))
    : isNull(courses.streamId);

  const courseRows = await db
    .select({
      id: courses.id,
      title: courses.title,
      slug: courses.slug,
      description: courses.description,
      subjectId: courses.subjectId,
      subjectName: subjects.name,
      academicYearId: courses.academicYearId,
      levelId: courses.levelId,
      streamId: courses.streamId,
      publishedAt: courses.publishedAt,
    })
    .from(courses)
    .innerJoin(subjects, eq(courses.subjectId, subjects.id))
    .where(
      and(
        eq(courses.status, "PUBLISHED"),
        eq(courses.levelId, profile.levelId),
        inArray(courses.academicYearId, entitledAcademicYearIds),
        streamCondition,
      ),
    )
    .orderBy(asc(subjects.name), asc(courses.title));

  const courseIds = courseRows.map((course) => course.id);
  const chapterRows = courseIds.length
    ? await db
        .select()
        .from(chapters)
        .where(and(inArray(chapters.courseId, courseIds), eq(chapters.status, "PUBLISHED")))
        .orderBy(asc(chapters.position), asc(chapters.title))
    : [];

  const chapterIds = chapterRows.map((chapter) => chapter.id);
  const lessonRows = chapterIds.length
    ? await db
        .select()
        .from(lessons)
        .where(and(inArray(lessons.chapterId, chapterIds), eq(lessons.status, "PUBLISHED")))
        .orderBy(asc(lessons.position), asc(lessons.title))
    : [];

  return NextResponse.json(
    { data: { courses: courseRows, chapters: chapterRows, lessons: lessonRows } },
    { headers: { "Cache-Control": "no-store" } },
  );
}
