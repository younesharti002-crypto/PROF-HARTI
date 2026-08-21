"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

type Course = { id: string; title: string; slug: string; description: string | null; subjectName: string };
type Chapter = { id: string; courseId: string; title: string; position: number };
type Lesson = { id: string; chapterId: string; title: string; summary: string | null; videoUrl: string | null; pdfUrl: string | null; position: number };
type Progress = { lessonId: string; status: "STARTED" | "COMPLETED" };
type ProgressSummary = { totalLessons: number; startedLessons: number; completedLessons: number; percent: number };
type Data = {
  subscriptionState?: "ACTIVE";
  courses: Course[];
  chapters: Chapter[];
  lessons: Lesson[];
  progress: Progress[];
  progressSummary: ProgressSummary;
};

type LockedState = {
  badge: string;
  icon: string;
  titleAr: string;
  titleFr: string;
  bodyAr: string;
  bodyFr: string;
};

const EMPTY_SUMMARY: ProgressSummary = { totalLessons: 0, startedLessons: 0, completedLessons: 0, percent: 0 };

const LOCKED_STATES: Record<string, LockedState> = {
  SUBSCRIPTION_PENDING: {
    badge: "PENDING",
    icon: "⏳",
    titleAr: "اشتراكك في انتظار التفعيل",
    titleFr: "Votre abonnement est en attente",
    bodyAr: "تم تسجيل الدخول بنجاح. سيتم فتح الدروس تلقائياً مباشرة بعد تفعيل اشتراكك من الإدارة.",
    bodyFr: "Votre connexion est valide. Les cours seront ouverts automatiquement dès l’activation de votre abonnement par l’administration.",
  },
  SUBSCRIPTION_SUSPENDED: {
    badge: "SUSPENDED",
    icon: "⏸",
    titleAr: "تم تعليق الاشتراك مؤقتاً",
    titleFr: "Abonnement temporairement suspendu",
    bodyAr: "حسابك مازال موجوداً، لكن الولوج للمحتوى متوقف حالياً. تواصل مع الإدارة لإعادة التفعيل.",
    bodyFr: "Votre compte reste accessible, mais l’accès aux contenus est suspendu. Contactez l’administration pour le réactiver.",
  },
  SUBSCRIPTION_EXPIRED: {
    badge: "EXPIRED",
    icon: "⌛",
    titleAr: "انتهت مدة الاشتراك",
    titleFr: "Votre abonnement a expiré",
    bodyAr: "يمكنك الدخول لحسابك، لكن الدروس تحتاج إلى تجديد الاشتراك حتى تصبح متاحة من جديد.",
    bodyFr: "Vous pouvez toujours accéder à votre compte, mais un renouvellement est nécessaire pour rouvrir les cours.",
  },
  SUBSCRIPTION_REQUIRED: {
    badge: "LOCKED",
    icon: "🔒",
    titleAr: "لا يوجد اشتراك مفعل",
    titleFr: "Aucun abonnement actif",
    bodyAr: "هذا الحساب غير مرتبط حالياً باشتراك يسمح بالوصول إلى الدروس.",
    bodyFr: "Ce compte n’est actuellement lié à aucun abonnement donnant accès aux cours.",
  },
};

export function StudentCourses({ lang }: { lang: "ar" | "fr" }) {
  const ar = lang === "ar";
  const [data, setData] = useState<Data>({ courses: [], chapters: [], lessons: [], progress: [], progressSummary: EMPTY_SUMMARY });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [errorCode, setErrorCode] = useState("");
  const [activeCourseId, setActiveCourseId] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    setErrorCode("");

    const response = await fetch("/api/v1/student/content", { cache: "no-store" });
    const json = await response.json();
    if (!response.ok) {
      setErrorCode(json.error?.code || "");
      setError(json.error?.message || "Unable to load courses.");
      setLoading(false);
      return;
    }

    const next = json.data as Data;
    setData({ ...next, progress: next.progress || [], progressSummary: next.progressSummary || EMPTY_SUMMARY });
    setActiveCourseId((current) => current || next.courses[0]?.id || "");
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const activeCourse = data.courses.find((course) => course.id === activeCourseId);
  const chapters = useMemo(
    () => data.chapters.filter((chapter) => chapter.courseId === activeCourseId),
    [data.chapters, activeCourseId],
  );
  const progressByLesson = useMemo(
    () => new Map(data.progress.map((item) => [item.lessonId, item.status] as const)),
    [data.progress],
  );
  const activeCourseLessonIds = useMemo(() => {
    const chapterIds = new Set(chapters.map((chapter) => chapter.id));
    return data.lessons.filter((lesson) => chapterIds.has(lesson.chapterId)).map((lesson) => lesson.id);
  }, [chapters, data.lessons]);
  const activeCourseCompleted = activeCourseLessonIds.filter((lessonId) => progressByLesson.get(lessonId) === "COMPLETED").length;
  const activeCoursePercent = activeCourseLessonIds.length > 0 ? Math.round((activeCourseCompleted / activeCourseLessonIds.length) * 100) : 0;
  const lockedState = LOCKED_STATES[errorCode];

  if (loading) {
    return <main className="min-h-screen bg-board-900 px-6 py-12 text-chalk">{ar ? "جاري تحميل دروسك..." : "Chargement de vos cours..."}</main>;
  }

  return (
    <main className="min-h-screen bg-board-900 text-chalk" dir={ar ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.22em] text-accent">PROF HARTI ACADEMY</span>
            <h1 className="mt-2 text-3xl font-bold">{ar ? "دروسي" : "Mes cours"}</h1>
            <p className="mt-2 text-sm text-chalk-dim">{ar ? "المحتوى المنشور والمخصص لمستواك واشتراكك." : "Les contenus publiés correspondant à votre niveau et votre abonnement."}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {!error ? (
              <>
                <span className="rounded-full border border-emerald-300/25 bg-emerald-400/10 px-3 py-1.5 text-xs font-black text-emerald-300">
                  {ar ? "● اشتراك مفعل" : "● Abonnement actif"}
                </span>
                <span className="rounded-full border border-accent/25 bg-accent/10 px-3 py-1.5 text-xs font-black text-accent">
                  {ar ? `التقدم ${data.progressSummary.percent}%` : `Progression ${data.progressSummary.percent}%`}
                </span>
              </>
            ) : null}
            <Link href={`/${lang}/dashboard`} className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold hover:border-accent/60">{ar ? "العودة للرئيسية" : "Retour au tableau de bord"}</Link>
          </div>
        </header>

        {lockedState ? (
          <section className="mx-auto max-w-3xl rounded-[2rem] border border-violet/30 bg-gradient-to-b from-violet/10 to-white/[0.025] p-7 text-center sm:p-10">
            <div className="mx-auto grid size-16 place-items-center rounded-3xl border border-white/10 bg-white/5 text-3xl">{lockedState.icon}</div>
            <span className="mt-5 inline-flex rounded-full border border-violet/30 bg-violet/10 px-3 py-1 text-[11px] font-black tracking-[0.18em] text-violet">
              {lockedState.badge}
            </span>
            <h2 className="mt-4 text-2xl font-bold sm:text-3xl">{ar ? lockedState.titleAr : lockedState.titleFr}</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-chalk-dim sm:text-base">
              {ar ? lockedState.bodyAr : lockedState.bodyFr}
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link href={`/${lang}/dashboard`} className="rounded-full bg-accent px-5 py-2.5 text-sm font-black text-board-900">
                {ar ? "العودة للوحة التلميذ" : "Retour au tableau de bord"}
              </Link>
              <button type="button" onClick={() => void load()} className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold hover:border-accent/60">
                {ar ? "إعادة التحقق" : "Vérifier à nouveau"}
              </button>
            </div>
          </section>
        ) : error ? (
          <div className="rounded-[2rem] border border-violet/30 bg-violet/10 p-6">
            <h2 className="font-bold">{ar ? "المحتوى غير متاح حالياً" : "Contenu indisponible"}</h2>
            <p className="mt-2 text-sm text-chalk-dim">{error}</p>
          </div>
        ) : data.courses.length === 0 ? (
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-8 text-center">
            <p className="text-lg font-bold">{ar ? "مازال ما تنشر حتى كورس ليك." : "Aucun cours n’est encore publié pour vous."}</p>
            <p className="mt-2 text-sm text-chalk-dim">{ar ? "ملي الأستاذ ينشر أول درس غادي يبان هنا مباشرة." : "Le prochain contenu publié apparaîtra ici automatiquement."}</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
            <aside className="space-y-2">
              {data.courses.map((course) => (
                <button key={course.id} onClick={() => setActiveCourseId(course.id)} className={`w-full rounded-3xl border p-4 text-start transition ${activeCourseId === course.id ? "border-accent/50 bg-accent/10" : "border-white/10 bg-white/[0.035] hover:border-white/20"}`}>
                  <span className="text-[10px] font-black uppercase tracking-[0.18em] text-accent">{course.subjectName}</span>
                  <h2 className="mt-2 font-bold">{course.title}</h2>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-chalk-dim">{course.description}</p>
                </button>
              ))}
            </aside>

            <section className="min-w-0">
              {activeCourse ? (
                <div className="mb-5 rounded-[2rem] border border-white/10 bg-board-800/60 p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <span className="text-xs font-black uppercase tracking-[0.18em] text-violet">{activeCourse.subjectName}</span>
                      <h2 className="mt-2 text-2xl font-bold">{activeCourse.title}</h2>
                    </div>
                    <span className="rounded-full border border-accent/25 bg-accent/10 px-3 py-1.5 text-xs font-black text-accent">{activeCoursePercent}%</span>
                  </div>
                  {activeCourse.description ? <p className="mt-3 max-w-3xl text-sm leading-7 text-chalk-dim">{activeCourse.description}</p> : null}
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${activeCoursePercent}%` }} />
                  </div>
                </div>
              ) : null}

              <div className="space-y-4">
                {chapters.map((chapter, chapterIndex) => {
                  const lessons = data.lessons.filter((lesson) => lesson.chapterId === chapter.id);
                  return (
                    <article key={chapter.id} className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035]">
                      <div className="border-b border-white/10 px-5 py-4 sm:px-6">
                        <div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-2xl bg-accent/10 text-xs font-black text-accent">{String(chapterIndex + 1).padStart(2, "0")}</span><h3 className="font-bold sm:text-lg">{chapter.title}</h3></div>
                      </div>
                      <div className="divide-y divide-white/10">
                        {lessons.map((lesson, lessonIndex) => {
                          const progressStatus = progressByLesson.get(lesson.id);
                          return (
                            <div key={lesson.id} className="p-5 sm:p-6">
                              <div className="flex flex-wrap items-start justify-between gap-4">
                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <p className="text-xs font-black text-chalk-dim">LESSON {String(lessonIndex + 1).padStart(2, "0")}</p>
                                    <span className={`rounded-full border px-2.5 py-1 text-[10px] font-black ${progressStatus === "COMPLETED" ? "border-emerald-300/25 bg-emerald-400/10 text-emerald-300" : progressStatus === "STARTED" ? "border-accent/25 bg-accent/10 text-accent" : "border-white/10 bg-white/5 text-chalk-dim"}`}>
                                      {progressStatus === "COMPLETED"
                                        ? ar ? "✓ مكتمل" : "✓ Terminée"
                                        : progressStatus === "STARTED"
                                          ? ar ? "◌ بدأت" : "◌ Commencée"
                                          : ar ? "جديد" : "Nouveau"}
                                    </span>
                                  </div>
                                  <h4 className="mt-2 text-base font-bold sm:text-lg">{lesson.title}</h4>
                                  {lesson.summary ? <p className="mt-2 max-w-3xl text-sm leading-6 text-chalk-dim">{lesson.summary}</p> : null}
                                  <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-chalk-dim">
                                    <span>{lesson.videoUrl ? (ar ? "فيديو" : "Vidéo") : (ar ? "بدون فيديو" : "Sans vidéo")}</span>
                                    <span>·</span>
                                    <span>{lesson.pdfUrl ? "PDF" : (ar ? "بدون PDF" : "Sans PDF")}</span>
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  <Link href={`/${lang}/courses/${activeCourseId}/lessons/${lesson.id}`} className="rounded-full bg-accent px-4 py-2 text-xs font-black text-board-900">
                                    {progressStatus === "COMPLETED"
                                      ? ar ? "مراجعة الدرس" : "Revoir la leçon"
                                      : ar ? "فتح الدرس" : "Ouvrir la leçon"}
                                  </Link>
                                  {lesson.pdfUrl ? <a href={lesson.pdfUrl} target="_blank" rel="noreferrer" className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold hover:border-accent/60">PDF</a> : null}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        {lessons.length === 0 ? <p className="p-5 text-sm text-chalk-dim">{ar ? "لا توجد دروس منشورة في هذا الفصل بعد." : "Aucune leçon publiée dans ce chapitre."}</p> : null}
                      </div>
                    </article>
                  );
                })}
                {chapters.length === 0 ? <p className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 text-sm text-chalk-dim">{ar ? "لا توجد فصول منشورة بعد." : "Aucun chapitre publié pour le moment."}</p> : null}
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
