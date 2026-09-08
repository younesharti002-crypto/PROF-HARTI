"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type LiveSession = {
  id: string;
  title: string;
  subjectName: string;
  scheduledAt: string;
  durationMinutes: number;
  status: "SCHEDULED" | "LIVE" | "COMPLETED";
  replayUrl: string | null;
};

type AssessmentAttempt = { assessmentId: string; percent: number };
type AssessmentItem = { id: string };

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
  const [assessments, setAssessments] = useState<AssessmentItem[]>([]);
  const [attempts, setAttempts] = useState<AssessmentAttempt[]>([]);

  useEffect(() => {
    let active = true;

    fetch("/api/v1/student/live", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((json) => {
        if (active && json?.data?.sessions) setSessions(json.data.sessions as LiveSession[]);
      })
      .catch(() => undefined);

    fetch("/api/v1/student/assessments", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((json) => {
        if (!active || !json?.data) return;
        setAssessments((json.data.assessments || []) as AssessmentItem[]);
        setAttempts((json.data.attempts || []) as AssessmentAttempt[]);
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, []);

  const nextLive = useMemo(() => {
    const live = sessions.find((session) => session.status === "LIVE");
    if (live) return live;
    return sessions
      .filter((session) => session.status === "SCHEDULED")
      .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())[0] || null;
  }, [sessions]);

  const replayCount = sessions.filter(
    (session) => session.status === "COMPLETED" && session.replayUrl,
  ).length;

  const bestQuizScore = attempts.length
    ? Math.max(...attempts.map((attempt) => attempt.percent))
    : null;

  const formatDate = (value: string) =>
    new Intl.DateTimeFormat(ar ? "ar-MA" : "fr-MA", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));

  const navItems = [
    { href: `/${locale}/dashboard`, icon: "⌂", label: ar ? "الرئيسية" : "Accueil", active: true },
    { href: `/${locale}/courses`, icon: "∑", label: ar ? "دروسي" : "Mes cours" },
    { href: `/${locale}/live`, icon: "▶", label: ar ? "الحصص والتسجيلات" : "Lives & replays" },
    { href: `/${locale}/assessments`, icon: "✓", label: ar ? "التمارين والنتائج" : "Exercices & résultats" },
  ];

  return (
    <main className="min-h-screen bg-[#f4f6fa] text-[#101828]" dir={ar ? "rtl" : "ltr"}>
      <div className="mx-auto min-h-screen max-w-[1540px] lg:grid lg:grid-cols-[270px_minmax(0,1fr)]">
        <aside className="hidden min-h-screen bg-[#071426] px-5 py-6 text-white lg:flex lg:flex-col">
          <Link href={`/${locale}`} className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-2xl border border-[#d8b35b]/40 bg-[#d8b35b]/10 text-lg font-black text-[#f0cf7a]">MB</span>
            <span>
              <span className="block text-sm font-black tracking-[0.08em]">PROF BERRADA</span>
              <span className="block text-[9px] font-bold uppercase tracking-[0.28em] text-[#d8b35b]">Math Academy</span>
            </span>
          </Link>

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#d8b35b]">Mathématiques • Collège</p>
            <p className="mt-2 text-sm leading-6 text-white/65">
              {ar ? "الفهم، المنهجية، ثم التطبيق." : "Comprendre, maîtriser la méthode, puis appliquer."}
            </p>
          </div>

          <nav className="mt-7 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-bold transition ${
                  item.active
                    ? "bg-[#d8b35b] text-[#071426] shadow-lg shadow-black/15"
                    : "text-white/70 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                <span className="grid size-8 place-items-center rounded-xl border border-current/15">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-auto rounded-3xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#d8b35b]">
              {ar ? "حساب التلميذ" : "Compte élève"}
            </p>
            <p className="mt-2 truncate text-sm font-black">{studentName}</p>
            <Link href={`/${locale}`} className="mt-4 inline-flex text-xs font-semibold text-white/60 hover:text-[#d8b35b]">
              {ar ? "العودة إلى موقع Prof Berrada" : "Retour au site Prof Berrada"}
            </Link>
          </div>
        </aside>

        <section className="min-w-0">
          <header className="sticky top-0 z-30 border-b border-black/[0.06] bg-white/90 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <Link href={`/${locale}`} className="flex items-center gap-2 lg:hidden">
                <span className="grid size-9 place-items-center rounded-xl bg-[#071426] text-xs font-black text-[#d8b35b]">MB</span>
                <span className="text-xs font-black">PROF BERRADA</span>
              </Link>
              <div className="ms-auto flex items-center gap-3">
                <div className="hidden text-end sm:block">
                  <p className="text-[11px] text-[#7a8190]">{ar ? "مرحبا بك" : "Bienvenue"}</p>
                  <p className="max-w-[180px] truncate text-sm font-black">{studentName}</p>
                </div>
                <div className="grid size-10 place-items-center rounded-full border border-[#dfe3ea] bg-white text-sm font-black shadow-sm">
                  {studentName.trim().charAt(0).toUpperCase() || "S"}
                </div>
              </div>
            </div>
            <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:hidden">
              {navItems.map((item) => (
                <Link
                  key={`mobile-${item.href}`}
                  href={item.href}
                  className={`whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-bold ${
                    item.active ? "bg-[#071426] text-[#f0cf7a]" : "border border-[#dfe3ea] bg-white text-[#566070]"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </header>

          <div className="space-y-6 p-4 sm:p-6 lg:p-8">
            <section className="overflow-hidden rounded-[2rem] bg-[#071426] p-6 text-white shadow-[0_20px_55px_rgba(10,23,45,0.12)] sm:p-8">
              <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
                <div>
                  <span className="inline-flex rounded-full border border-[#d8b35b]/35 bg-[#d8b35b]/10 px-3 py-1.5 text-[11px] font-black text-[#f0cf7a]">
                    {ar ? "فضاء تلميذ Prof Berrada" : "Espace élève Prof Berrada"}
                  </span>
                  <p className="mt-5 text-sm text-white/60">{ar ? "مرحبا" : "Bonjour"}</p>
                  <h1 className="mt-1 text-3xl font-black sm:text-4xl">{studentName}</h1>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-white/65">
                    {ar
                      ? "كمّل مسارك في الرياضيات: راجع الدروس، طبّق بالتمارين، وتابع تقدمك من مكان واحد."
                      : "Continue ton parcours en mathématiques : cours, exercices, lives et progression au même endroit."}
                  </p>
                </div>
                <div className="text-start lg:text-end">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#d8b35b]">Progress</p>
                  <p className="mt-1 text-5xl font-black text-[#f0cf7a]">{progressPercent}%</p>
                  <p className="mt-2 text-xs text-white/55">{progressCompleted} / {progressTotal} {ar ? "درس مكتمل" : "leçons terminées"}</p>
                </div>
              </div>
              <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-[#d8b35b]" style={{ width: `${progressPercent}%` }} />
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard label={ar ? "تقدمك الدراسي" : "Progression"} value={`${progressPercent}%`} note={`${progressCompleted}/${progressTotal}`} icon="↗" />
              <StatCard label={ar ? "أفضل نتيجة" : "Meilleur score"} value={bestQuizScore === null ? "—" : `${bestQuizScore}%`} note={`${attempts.length} ${ar ? "محاولة" : "tentatives"}`} icon="★" />
              <StatCard label={ar ? "التسجيلات المتاحة" : "Replays"} value={String(replayCount)} note={ar ? "حصص مسجلة" : "séances enregistrées"} icon="▶" />
              <StatCard label={ar ? "التمارين" : "Exercices"} value={String(assessments.length)} note={ar ? "اختبارات منشورة" : "évaluations publiées"} icon="✓" />
            </section>

            <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
              <article className="rounded-[2rem] border border-[#e1e5ec] bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#a27b28]">{ar ? "الحصة القادمة" : "Prochaine séance"}</p>
                    <h2 className="mt-2 text-xl font-black">
                      {nextLive ? nextLive.title : ar ? "لا توجد حصة مبرمجة حالياً" : "Aucune séance programmée"}
                    </h2>
                    {nextLive ? (
                      <p className="mt-3 text-sm text-[#707887]">{nextLive.subjectName} · {formatDate(nextLive.scheduledAt)}</p>
                    ) : (
                      <p className="mt-3 text-sm leading-6 text-[#707887]">{ar ? "ملي تتبرمج الحصة غادي تبان هنا مباشرة." : "La prochaine séance apparaîtra ici dès sa programmation."}</p>
                    )}
                  </div>
                  <span className={`grid size-12 place-items-center rounded-2xl text-lg font-black ${nextLive?.status === "LIVE" ? "bg-red-50 text-red-600" : "bg-[#fff6dc] text-[#a27b28]"}`}>
                    {nextLive?.status === "LIVE" ? "●" : "∑"}
                  </span>
                </div>
                <Link href={`/${locale}/live`} className="mt-6 inline-flex rounded-xl bg-[#071426] px-4 py-2.5 text-xs font-black text-[#f0cf7a]">
                  {ar ? "فتح الحصص والتسجيلات" : "Ouvrir les lives et replays"}
                </Link>
              </article>

              <article className="rounded-[2rem] border border-[#e1e5ec] bg-white p-5 shadow-sm sm:p-6">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#a27b28]">{ar ? "وصول سريع" : "Accès rapide"}</p>
                <div className="mt-4 grid gap-3">
                  <QuickLink href={`/${locale}/courses`} title={ar ? "دروس الرياضيات" : "Cours de mathématiques"} note={ar ? "شرح ومنهجية منظمة" : "Cours et méthode structurés"} symbol="∑" />
                  <QuickLink href={`/${locale}/assessments`} title={ar ? "التمارين والاختبارات" : "Exercices & quiz"} note={ar ? "طبّق وراجع النتيجة" : "S'entraîner et suivre ses résultats"} symbol="✓" />
                  <QuickLink href={`/${locale}/live`} title={ar ? "Lives & Replays" : "Lives & Replays"} note={ar ? "تابع الحصص المباشرة والمسجلة" : "Séances en direct et enregistrées"} symbol="▶" />
                </div>
              </article>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({ label, value, note, icon }: { label: string; value: string; note: string; icon: string }) {
  return (
    <article className="rounded-3xl border border-[#e1e5ec] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-[#707887]">{label}</p>
          <p className="mt-2 text-3xl font-black">{value}</p>
          <p className="mt-2 text-xs text-[#9097a3]">{note}</p>
        </div>
        <span className="grid size-10 place-items-center rounded-2xl bg-[#fff6dc] text-[#a27b28]">{icon}</span>
      </div>
    </article>
  );
}

function QuickLink({ href, title, note, symbol }: { href: string; title: string; note: string; symbol: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 rounded-2xl border border-[#e7eaf0] p-3.5 transition hover:border-[#d8b35b] hover:bg-[#fffaf0]">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#071426] font-black text-[#f0cf7a]">{symbol}</span>
      <span className="min-w-0">
        <span className="block text-sm font-black">{title}</span>
        <span className="mt-0.5 block text-xs text-[#7a8190]">{note}</span>
      </span>
    </Link>
  );
}
