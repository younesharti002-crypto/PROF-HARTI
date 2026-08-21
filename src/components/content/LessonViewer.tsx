"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type LessonNav = { id: string; title: string } | null;
type ProgressStatus = "NONE" | "STARTED" | "COMPLETED";

type LessonViewerProps = {
  lang: "ar" | "fr";
  courseId: string;
  courseTitle: string;
  subjectName: string;
  chapterTitle: string;
  lesson: {
    id: string;
    title: string;
    summary: string | null;
    videoUrl: string | null;
    pdfUrl: string | null;
  };
  previousLesson: LessonNav;
  nextLesson: LessonNav;
  initialProgressStatus: ProgressStatus;
};

function getVideoPresentation(url: string | null) {
  if (!url) return { type: "none" as const, url: null };

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id ? { type: "embed" as const, url: `https://www.youtube-nocookie.com/embed/${id}` } : { type: "link" as const, url };
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      const id = parsed.searchParams.get("v") || parsed.pathname.match(/^\/shorts\/([^/]+)/)?.[1] || parsed.pathname.match(/^\/embed\/([^/]+)/)?.[1];
      return id ? { type: "embed" as const, url: `https://www.youtube-nocookie.com/embed/${id}` } : { type: "link" as const, url };
    }

    if (host === "vimeo.com" || host === "player.vimeo.com") {
      const id = parsed.pathname.split("/").filter(Boolean).find((part) => /^\d+$/.test(part));
      return id ? { type: "embed" as const, url: `https://player.vimeo.com/video/${id}` } : { type: "link" as const, url };
    }

    if (/\.(mp4|webm|ogg)$/i.test(parsed.pathname)) {
      return { type: "video" as const, url };
    }
  } catch {
    return { type: "link" as const, url };
  }

  return { type: "link" as const, url };
}

export function LessonViewer({
  lang,
  courseId,
  courseTitle,
  subjectName,
  chapterTitle,
  lesson,
  previousLesson,
  nextLesson,
  initialProgressStatus,
}: LessonViewerProps) {
  const ar = lang === "ar";
  const video = getVideoPresentation(lesson.videoUrl);
  const lessonHref = (lessonId: string) => `/${lang}/courses/${courseId}/lessons/${lessonId}`;
  const [progressStatus, setProgressStatus] = useState<ProgressStatus>(initialProgressStatus);
  const [savingProgress, setSavingProgress] = useState(false);
  const [progressError, setProgressError] = useState("");

  useEffect(() => {
    if (initialProgressStatus !== "NONE") return;

    let cancelled = false;
    void (async () => {
      try {
        const response = await fetch("/api/v1/student/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lessonId: lesson.id, status: "STARTED" }),
        });
        if (!response.ok || cancelled) return;
        setProgressStatus("STARTED");
      } catch {
        // Progress tracking must never block lesson viewing.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [initialProgressStatus, lesson.id]);

  async function completeLesson() {
    if (progressStatus === "COMPLETED" || savingProgress) return;

    setSavingProgress(true);
    setProgressError("");
    try {
      const response = await fetch("/api/v1/student/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: lesson.id, status: "COMPLETED" }),
      });
      const json = await response.json();
      if (!response.ok) {
        setProgressError(json.error?.message || (ar ? "تعذر حفظ التقدم." : "Impossible d’enregistrer la progression."));
        return;
      }
      setProgressStatus("COMPLETED");
    } catch {
      setProgressError(ar ? "تعذر حفظ التقدم." : "Impossible d’enregistrer la progression.");
    } finally {
      setSavingProgress(false);
    }
  }

  return (
    <main className="min-h-screen bg-board-900 text-chalk" dir={ar ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="min-w-0">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-accent">{subjectName}</span>
            <p className="mt-1 truncate text-sm text-chalk-dim">{courseTitle} · {chapterTitle}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className={`rounded-full border px-3 py-1.5 text-xs font-black ${progressStatus === "COMPLETED" ? "border-emerald-300/25 bg-emerald-400/10 text-emerald-300" : "border-accent/25 bg-accent/10 text-accent"}`}>
              {progressStatus === "COMPLETED"
                ? ar ? "✓ مكتمل" : "✓ Terminée"
                : ar ? "◌ قيد الإنجاز" : "◌ En cours"}
            </span>
            <Link href={`/${lang}/courses`} className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold transition hover:border-accent/60">
              {ar ? "العودة إلى دروسي" : "Retour à mes cours"}
            </Link>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="min-w-0 space-y-5">
            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-black/30 shadow-2xl shadow-black/20">
              <div className="aspect-video bg-black/60">
                {video.type === "embed" ? (
                  <iframe
                    src={video.url}
                    title={lesson.title}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                ) : video.type === "video" ? (
                  <video src={video.url} controls playsInline className="h-full w-full bg-black object-contain" />
                ) : video.type === "link" ? (
                  <div className="grid h-full place-items-center p-8 text-center">
                    <div>
                      <div className="mx-auto grid size-16 place-items-center rounded-full border border-accent/30 bg-accent/10 text-2xl">▶</div>
                      <h2 className="mt-4 text-xl font-bold">{ar ? "الفيديو متوفر عبر رابط خارجي" : "Vidéo disponible via un lien externe"}</h2>
                      <a href={video.url} target="_blank" rel="noreferrer" className="mt-5 inline-flex rounded-full bg-accent px-5 py-2.5 text-sm font-black text-board-900">
                        {ar ? "فتح الفيديو" : "Ouvrir la vidéo"}
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="grid h-full place-items-center p-8 text-center">
                    <div>
                      <div className="mx-auto grid size-16 place-items-center rounded-full border border-white/10 bg-white/5 text-2xl">◉</div>
                      <h2 className="mt-4 text-xl font-bold">{ar ? "الفيديو لم يُضف بعد" : "La vidéo n’est pas encore ajoutée"}</h2>
                      <p className="mt-2 text-sm text-chalk-dim">{ar ? "سيظهر هنا مباشرة عندما يضيفه الأستاذ." : "Elle apparaîtra ici dès que le professeur l’ajoutera."}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <article className="rounded-[2rem] border border-white/10 bg-board-800/60 p-6 sm:p-8">
              <span className="text-[11px] font-black uppercase tracking-[0.18em] text-violet">LESSON</span>
              <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{lesson.title}</h1>
              {lesson.summary ? <p className="mt-4 max-w-4xl text-sm leading-8 text-chalk-dim sm:text-base">{lesson.summary}</p> : null}

              <div className="mt-6 flex flex-wrap items-center gap-3">
                {lesson.pdfUrl ? (
                  <a href={lesson.pdfUrl} target="_blank" rel="noreferrer" className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold transition hover:border-accent/60">
                    {ar ? "فتح ملخص الدرس PDF" : "Ouvrir le PDF du cours"}
                  </a>
                ) : (
                  <span className="rounded-full border border-white/10 px-5 py-2.5 text-sm text-chalk-dim">{ar ? "PDF غير متوفر بعد" : "PDF pas encore disponible"}</span>
                )}

                <button
                  type="button"
                  onClick={() => void completeLesson()}
                  disabled={progressStatus === "COMPLETED" || savingProgress}
                  className={`rounded-full px-5 py-2.5 text-sm font-black transition ${progressStatus === "COMPLETED" ? "cursor-default border border-emerald-300/25 bg-emerald-400/10 text-emerald-300" : "bg-accent text-board-900 hover:opacity-90 disabled:opacity-60"}`}
                >
                  {progressStatus === "COMPLETED"
                    ? ar ? "✓ تم إكمال الدرس" : "✓ Leçon terminée"
                    : savingProgress
                      ? ar ? "جاري الحفظ..." : "Enregistrement..."
                      : ar ? "تم إكمال الدرس" : "Marquer comme terminée"}
                </button>
              </div>
              {progressError ? <p className="mt-3 text-xs text-violet">{progressError}</p> : null}
            </article>

            {lesson.pdfUrl ? (
              <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.025]">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4 sm:px-6">
                  <h2 className="font-bold">{ar ? "وثيقة الدرس" : "Document du cours"}</h2>
                  <a href={lesson.pdfUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-accent hover:underline">{ar ? "فتح في نافذة كاملة" : "Ouvrir en plein écran"}</a>
                </div>
                <iframe src={lesson.pdfUrl} title={`${lesson.title} PDF`} className="h-[65vh] min-h-[520px] w-full bg-white" />
              </section>
            ) : null}
          </section>

          <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">{ar ? "المسار" : "Parcours"}</p>
              <h2 className="mt-2 font-bold">{chapterTitle}</h2>
              <p className="mt-2 text-sm leading-6 text-chalk-dim">{courseTitle}</p>
            </div>

            <nav className="space-y-3" aria-label={ar ? "التنقل بين الدروس" : "Navigation entre les leçons"}>
              {previousLesson ? (
                <Link href={lessonHref(previousLesson.id)} className="block rounded-3xl border border-white/10 bg-white/[0.035] p-4 transition hover:border-accent/50">
                  <span className="text-[10px] font-black uppercase tracking-[0.18em] text-chalk-dim">{ar ? "الدرس السابق" : "Leçon précédente"}</span>
                  <p className="mt-2 text-sm font-bold">{previousLesson.title}</p>
                </Link>
              ) : null}

              {nextLesson ? (
                <Link href={lessonHref(nextLesson.id)} className="block rounded-3xl border border-accent/30 bg-accent/10 p-4 transition hover:border-accent/60">
                  <span className="text-[10px] font-black uppercase tracking-[0.18em] text-accent">{ar ? "الدرس التالي" : "Leçon suivante"}</span>
                  <p className="mt-2 text-sm font-bold">{nextLesson.title}</p>
                </Link>
              ) : null}

              {!previousLesson && !nextLesson ? (
                <div className="rounded-3xl border border-white/10 p-4 text-sm text-chalk-dim">{ar ? "هذا هو الدرس المنشور الوحيد في هذا الفصل حالياً." : "C’est la seule leçon publiée dans ce chapitre pour le moment."}</div>
              ) : null}
            </nav>
          </aside>
        </div>
      </div>
    </main>
  );
}
