"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type LiveSession = {
  id: string;
  title: string;
  subjectName: string;
  scheduledAt: string;
  durationMinutes: number;
  status: "SCHEDULED" | "LIVE" | "COMPLETED";
  replayUrl: string | null;
};

export function StudentHome({
  locale,
  studentName,
  progressPercent,
  progressCompleted,
  progressTotal,
}: {
  locale: "ar" | "fr";
  studentName: string;
  progressPercent: number;
  progressCompleted: number;
  progressTotal: number;
}) {
  const ar = locale === "ar";
  const [sessions, setSessions] = useState<LiveSession[]>([]);

  useEffect(() => {
    let active = true;
    fetch("/api/v1/student/live", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : null)
      .then((json) => {
        if (active && json?.data?.sessions) setSessions(json.data.sessions as LiveSession[]);
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);

  const liveNow = sessions.find((session) => session.status === "LIVE");
  const scheduled = sessions
    .filter((session) => session.status === "SCHEDULED")
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())[0];
  const nextLive = liveNow || scheduled || null;
  const replayCount = sessions.filter((session) => session.status === "COMPLETED" && session.replayUrl).length;

  const formatDate = (value: string) => new Intl.DateTimeFormat(ar ? "ar-MA" : "fr-MA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

  return (
    <main className="min-h-screen bg-board-900 text-chalk" dir={ar ? "rtl" : "ltr"}>
      <header className="border-b border-white/10 bg-board-900/90">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href={`/${locale}`} className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-2xl bg-accent text-sm font-black text-board-900">PH</span>
            <span>
              <span className="block text-sm font-bold">PROF HARTI</span>
              <span className="block text-[10px] uppercase tracking-[0.22em] text-chalk-dim">Academy</span>
            </span>
          </Link>
          <div className="ms-auto text-end">
            <p className="text-xs text-chalk-dim">{ar ? "حساب التلميذ" : "Compte élève"}</p>
            <p className="text-sm font-semibold">{studentName}</p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-7 sm:px-6 lg:px-8">
        <section className="graph-paper overflow-hidden rounded-[2rem] border border-white/10 bg-board-800/70 p-6 sm:p-8">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-accent">STUDENT SPACE</span>
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{ar ? `مرحبا ${studentName}` : `Bonjour ${studentName}`}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-chalk-dim sm:text-base">
            {ar ? "دروسك، الحصص المباشرة، التسجيلات والتقدم الحقيقي ديالك في مكان واحد." : "Vos cours, lives, replays et votre progression réelle dans un seul espace."}
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <article className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-accent">{ar ? "التقدم" : "Progression"}</p>
            <p className="mt-3 text-3xl font-bold">{progressPercent}%</p>
            <p className="mt-2 text-xs text-chalk-dim">{progressCompleted} / {progressTotal} {ar ? "درس مكتمل" : "leçons terminées"}</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-accent" style={{ width: `${progressPercent}%` }} /></div>
          </article>

          <article className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-violet">REPLAYS</p>
            <p className="mt-3 text-3xl font-bold">{replayCount}</p>
            <p className="mt-2 text-xs text-chalk-dim">{ar ? "تسجيل منشور ومتاح" : "replays publiés et disponibles"}</p>
            <Link href={`/${locale}/live`} className="mt-5 inline-flex text-sm font-bold text-violet hover:underline">{ar ? "فتح التسجيلات" : "Voir les replays"}</Link>
          </article>

          <article className={`rounded-[2rem] border p-6 ${nextLive?.status === "LIVE" ? "border-red-400/30 bg-red-400/[0.06]" : "border-white/10 bg-white/[0.035]"}`}>
            <p className={`text-xs font-black uppercase tracking-[0.16em] ${nextLive?.status === "LIVE" ? "text-red-300" : "text-accent"}`}>{nextLive?.status === "LIVE" ? "● LIVE NOW" : "NEXT LIVE"}</p>
            {nextLive ? (
              <>
                <h2 className="mt-3 font-bold">{nextLive.title}</h2>
                <p className="mt-1 text-xs text-chalk-dim">{nextLive.subjectName} · {formatDate(nextLive.scheduledAt)}</p>
              </>
            ) : (
              <p className="mt-3 text-sm text-chalk-dim">{ar ? "لا توجد حصة مبرمجة حالياً." : "Aucun live programmé pour le moment."}</p>
            )}
            <Link href={`/${locale}/live`} className="mt-5 inline-flex text-sm font-bold text-accent hover:underline">{ar ? "الحصص المباشرة" : "Voir les lives"}</Link>
          </article>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <Link href={`/${locale}/courses`} className="group rounded-[2rem] border border-accent/25 bg-accent/10 p-7 transition hover:border-accent/50">
            <p className="text-xs font-black tracking-[0.18em] text-accent">01 · COURSES</p>
            <h2 className="mt-3 text-2xl font-bold">{ar ? "دروسي" : "Mes cours"}</h2>
            <p className="mt-2 text-sm leading-6 text-chalk-dim">{ar ? "الكورسات، الفصول، الدروس والـPDF مع تتبع التقدم." : "Cours, chapitres, leçons, PDF et suivi de progression."}</p>
            <span className="mt-5 inline-flex text-sm font-black text-accent">{ar ? "فتح دروسي ←" : "Ouvrir mes cours →"}</span>
          </Link>

          <Link href={`/${locale}/live`} className="group rounded-[2rem] border border-violet/25 bg-violet/10 p-7 transition hover:border-violet/50">
            <p className="text-xs font-black tracking-[0.18em] text-violet">02 · LIVE & REPLAYS</p>
            <h2 className="mt-3 text-2xl font-bold">{ar ? "الحصص والتسجيلات" : "Lives & replays"}</h2>
            <p className="mt-2 text-sm leading-6 text-chalk-dim">{ar ? "الحصة القادمة، الدخول للبث والتسجيلات بعد نهاية الحصة." : "Prochain live, accès au direct et replays après la séance."}</p>
            <span className="mt-5 inline-flex text-sm font-black text-violet">{ar ? "فتح الحصص ←" : "Ouvrir les lives →"}</span>
          </Link>
        </section>
      </div>
    </main>
  );
}
