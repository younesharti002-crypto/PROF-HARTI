"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

type Course = { id: string; title: string; slug: string; description: string | null; subjectName: string };
type Chapter = { id: string; courseId: string; title: string; position: number };
type Lesson = { id: string; chapterId: string; title: string; summary: string | null; videoUrl: string | null; pdfUrl: string | null; position: number };
type Data = { courses: Course[]; chapters: Chapter[]; lessons: Lesson[] };

export function StudentCourses({ lang }: { lang: "ar" | "fr" }) {
  const ar = lang === "ar";
  const [data, setData] = useState<Data>({ courses: [], chapters: [], lessons: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCourseId, setActiveCourseId] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const response = await fetch("/api/v1/student/content", { cache: "no-store" });
    const json = await response.json();
    if (!response.ok) {
      setError(json.error?.message || "Unable to load courses.");
      setLoading(false);
      return;
    }
    const next = json.data as Data;
    setData(next);
    setActiveCourseId((current) => current || next.courses[0]?.id || "");
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const activeCourse = data.courses.find((course) => course.id === activeCourseId);
  const chapters = useMemo(
    () => data.chapters.filter((chapter) => chapter.courseId === activeCourseId),
    [data.chapters, activeCourseId],
  );

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
          <Link href={`/${lang}/dashboard`} className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold hover:border-accent/60">{ar ? "العودة للرئيسية" : "Retour au tableau de bord"}</Link>
        </header>

        {error ? (
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
                  <span className="text-xs font-black uppercase tracking-[0.18em] text-violet">{activeCourse.subjectName}</span>
                  <h2 className="mt-2 text-2xl font-bold">{activeCourse.title}</h2>
                  {activeCourse.description ? <p className="mt-3 max-w-3xl text-sm leading-7 text-chalk-dim">{activeCourse.description}</p> : null}
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
                        {lessons.map((lesson, lessonIndex) => (
                          <div key={lesson.id} className="p-5 sm:p-6">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-black text-chalk-dim">LESSON {String(lessonIndex + 1).padStart(2, "0")}</p>
                                <h4 className="mt-2 text-base font-bold sm:text-lg">{lesson.title}</h4>
                                {lesson.summary ? <p className="mt-2 max-w-3xl text-sm leading-6 text-chalk-dim">{lesson.summary}</p> : null}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {lesson.videoUrl ? <a href={lesson.videoUrl} target="_blank" rel="noreferrer" className="rounded-full bg-accent px-4 py-2 text-xs font-black text-board-900">{ar ? "مشاهدة الفيديو" : "Voir la vidéo"}</a> : null}
                                {lesson.pdfUrl ? <a href={lesson.pdfUrl} target="_blank" rel="noreferrer" className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold hover:border-accent/60">PDF</a> : null}
                              </div>
                            </div>
                          </div>
                        ))}
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
