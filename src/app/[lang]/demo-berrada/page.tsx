import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";

const courses = [
  { code: "3AC", title: "Calcul numérique & puissances", progress: 78, lessons: 12 },
  { code: "3AC", title: "Théorème de Thalès", progress: 56, lessons: 9 },
  { code: "3AC", title: "Équations & inéquations", progress: 34, lessons: 10 },
];

export default async function ProfBerradaDemoPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const ar = lang === "ar";

  const labels = ar
    ? {
        home: "الرئيسية",
        courses: "الدروس",
        live: "البث المباشر",
        exercises: "التمارين",
        results: "النتائج",
        hello: "مرحبا بك في أكاديمية Prof Berrada",
        sub: "من الفهم إلى النجاح — رياضيات الثالثة إعدادي في فضاء واحد.",
        progress: "تقدمك",
        score: "أفضل نتيجة",
        replays: "التسجيلات",
        next: "الحصة القادمة",
        myCourses: "مساري في الرياضيات",
        continue: "متابعة الدرس",
        liveTitle: "الحصة المباشرة القادمة",
        liveDesc: "مراجعة مركزة + أسئلة وأجوبة + تمارين تطبيقية.",
        quiz: "اختبار سريع",
        quizDesc: "اختبر مستواك في Thalès قبل الحصة المباشرة.",
        start: "ابدأ الاختبار",
        powered: "Powered by Growth Partner",
      }
    : {
        home: "Accueil",
        courses: "Cours",
        live: "Live",
        exercises: "Exercices",
        results: "Résultats",
        hello: "Bienvenue dans l’académie Prof Berrada",
        sub: "De la compréhension à la réussite — les maths 3AC dans un seul espace.",
        progress: "Progression",
        score: "Meilleur score",
        replays: "Replays",
        next: "Prochain live",
        myCourses: "Mon parcours en mathématiques",
        continue: "Continuer",
        liveTitle: "Prochaine séance en direct",
        liveDesc: "Révision ciblée + questions/réponses + exercices d’application.",
        quiz: "Quiz express",
        quizDesc: "Testez votre niveau sur Thalès avant le live.",
        start: "Commencer le quiz",
        powered: "Powered by Growth Partner",
      };

  return (
    <main className="min-h-screen bg-[#f4f2f8] text-[#17131f]" dir={ar ? "rtl" : "ltr"}>
      <div className="mx-auto min-h-screen max-w-[1580px] lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="hidden min-h-screen border-e border-white/10 bg-[#130a33] px-5 py-6 text-white lg:flex lg:flex-col">
          <Link href={`/${lang}`} className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-full border border-[#d7bd62]/50 bg-gradient-to-br from-[#7d5ce7] to-[#2c145f] text-lg font-black text-white shadow-[0_0_30px_rgba(124,92,231,0.28)]">MB</span>
            <span>
              <span className="block text-sm font-black tracking-[0.08em]">PROF BERRADA</span>
              <span className="block text-[9px] font-bold uppercase tracking-[0.26em] text-[#c9b7ff]">Mathématiques</span>
            </span>
          </Link>

          <nav className="mt-10 space-y-2">
            {[
              ["⌂", labels.home, "#top"],
              ["▣", labels.courses, "#courses"],
              ["▶", labels.live, "#live"],
              ["✎", labels.exercises, "#quiz"],
              ["★", labels.results, "#results"],
            ].map(([icon, label, href], index) => (
              <a
                key={label}
                href={href}
                className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition ${index === 0 ? "bg-gradient-to-r from-[#7d5ce7] to-[#9a79f4] text-white shadow-[0_14px_34px_rgba(98,66,196,0.28)]" : "text-[#c9c0df] hover:bg-white/[0.07] hover:text-white"}`}
              >
                <span className="grid size-8 place-items-center rounded-xl border border-white/10 bg-white/[0.05] text-xs">{icon}</span>
                {label}
              </a>
            ))}
          </nav>

          <div className="mt-auto rounded-3xl border border-[#8d6dec]/25 bg-white/[0.04] p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#d7bd62]">3AC • Maths</p>
            <p className="mt-2 text-sm font-bold">Demo Student</p>
            <p className="mt-4 text-[10px] uppercase tracking-[0.15em] text-[#8f84aa]">{labels.powered}</p>
          </div>
        </aside>

        <section className="min-w-0" id="top">
          <header className="sticky top-0 z-30 border-b border-black/[0.06] bg-white/90 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <Link href={`/${lang}`} className="flex items-center gap-2 lg:hidden">
                <span className="grid size-10 place-items-center rounded-full bg-[#21104c] text-xs font-black text-[#d7bd62]">MB</span>
                <span className="text-xs font-black text-[#21104c]">PROF BERRADA</span>
              </Link>
              <div className="ms-auto flex items-center gap-3">
                <span className="hidden rounded-full border border-[#d9cff1] bg-[#f7f3ff] px-3 py-1.5 text-xs font-black text-[#6748bc] sm:inline-flex">3AC • Mathématiques</span>
                <div className="grid size-10 place-items-center rounded-full bg-[#21104c] text-xs font-black text-white">D</div>
              </div>
            </div>
          </header>

          <div className="space-y-6 p-4 sm:p-6 lg:p-8">
            <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#21104c] via-[#2f1768] to-[#0f0827] p-6 text-white shadow-[0_24px_70px_rgba(40,19,84,0.22)] sm:p-8">
              <div className="pointer-events-none absolute -end-16 -top-20 size-72 rounded-full border-[28px] border-[#8b6cec]/20" />
              <div className="pointer-events-none absolute end-12 top-12 size-40 rounded-full border border-white/10" />
              <div className="relative max-w-3xl">
                <span className="inline-flex rounded-full border border-[#d7bd62]/35 bg-[#d7bd62]/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-[#f2d77f]">PROF BERRADA • 3AC</span>
                <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">{labels.hello}</h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-[#d9d0ec] sm:text-base">{labels.sub}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href="#courses" className="rounded-full bg-[#8b6cec] px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-[#8b6cec]/20">{labels.continue}</a>
                  <a href="#live" className="rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-sm font-bold text-white">{labels.live}</a>
                </div>
              </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" id="results">
              {[
                [labels.progress, "78%", "↗", "#efe9ff", "#6748bc"],
                [labels.score, "92%", "★", "#fff6da", "#9a741d"],
                [labels.replays, "08", "▶", "#e9f1ff", "#466ea6"],
                [labels.next, ar ? "غداً 19:00" : "Demain 19:00", "◉", "#fbe9f1", "#a43b6c"],
              ].map(([title, value, icon, bg, fg]) => (
                <article key={title} className="rounded-3xl border border-[#e4deef] bg-white p-5 shadow-[0_12px_32px_rgba(36,24,60,0.06)]">
                  <div className="flex items-start justify-between gap-3">
                    <div><p className="text-xs font-bold text-[#7b7487]">{title}</p><p className="mt-2 text-3xl font-black text-[#211b2a]">{value}</p></div>
                    <span className="grid size-10 place-items-center rounded-2xl text-lg" style={{ background: bg, color: fg }}>{icon}</span>
                  </div>
                </article>
              ))}
            </section>

            <section id="courses" className="rounded-[2rem] border border-[#e4deef] bg-white p-5 shadow-[0_14px_38px_rgba(36,24,60,0.06)] sm:p-6">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div><p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7956cf]">Mathématiques • 3AC</p><h2 className="mt-2 text-2xl font-black text-[#211b2a]">{labels.myCourses}</h2></div>
                <span className="rounded-full bg-[#f3effc] px-3 py-1.5 text-xs font-black text-[#6748bc]">3 modules actifs</span>
              </div>
              <div className="mt-5 grid gap-4 lg:grid-cols-3">
                {courses.map((course) => (
                  <article key={course.title} className="rounded-3xl border border-[#e6e0ef] bg-[#fbfaff] p-5">
                    <div className="flex items-center justify-between"><span className="rounded-full bg-[#21104c] px-2.5 py-1 text-[10px] font-black text-[#d7bd62]">{course.code}</span><span className="text-xs font-black text-[#6748bc]">{course.progress}%</span></div>
                    <h3 className="mt-4 min-h-12 text-lg font-black text-[#231c2d]">{course.title}</h3>
                    <p className="mt-2 text-xs text-[#81798c]">{course.lessons} {ar ? "دروس" : "leçons"}</p>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#e8e2f0]"><div className="h-full rounded-full bg-gradient-to-r from-[#6d4dca] to-[#9a79f4]" style={{ width: `${course.progress}%` }} /></div>
                    <button className="mt-5 w-full rounded-full border border-[#d8cfeb] bg-white px-4 py-2.5 text-xs font-black text-[#5d3fb2]">{labels.continue}</button>
                  </article>
                ))}
              </div>
            </section>

            <section className="grid gap-5 xl:grid-cols-2">
              <article id="live" className="relative overflow-hidden rounded-[2rem] bg-[#1a0d3d] p-6 text-white shadow-[0_18px_45px_rgba(40,19,84,0.18)] sm:p-7">
                <div className="absolute end-5 top-5 size-28 rounded-full border-[18px] border-[#8b6cec]/20" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#d7bd62]">LIVE • 3AC</p>
                <h2 className="mt-3 text-2xl font-black">{labels.liveTitle}</h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-[#cfc5e5]">{labels.liveDesc}</p>
                <div className="mt-6 flex items-center gap-3"><span className="rounded-full bg-[#8b6cec] px-4 py-2 text-xs font-black">19:00</span><span className="text-xs text-[#b8abcF]">Théorème de Thalès</span></div>
              </article>

              <article id="quiz" className="rounded-[2rem] border border-[#e4deef] bg-white p-6 shadow-[0_14px_38px_rgba(36,24,60,0.06)] sm:p-7">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7956cf]">QUIZ • 10 MIN</p>
                <h2 className="mt-3 text-2xl font-black text-[#211b2a]">{labels.quiz}</h2>
                <p className="mt-3 text-sm leading-7 text-[#7b7487]">{labels.quizDesc}</p>
                <div className="mt-5 flex gap-2"><span className="rounded-full bg-[#f3effc] px-3 py-1.5 text-xs font-bold text-[#6748bc]">8 questions</span><span className="rounded-full bg-[#fff7df] px-3 py-1.5 text-xs font-bold text-[#8a6718]">Correction immédiate</span></div>
                <button className="mt-6 rounded-full bg-[#21104c] px-5 py-2.5 text-sm font-black text-white">{labels.start}</button>
              </article>
            </section>

            <footer className="flex flex-col gap-2 border-t border-[#ddd5e8] py-5 text-xs text-[#8a8393] sm:flex-row sm:items-center sm:justify-between">
              <span>PROF BERRADA — De la compréhension à la réussite.</span>
              <span>{labels.powered}</span>
            </footer>
          </div>
        </section>
      </div>
    </main>
  );
}
