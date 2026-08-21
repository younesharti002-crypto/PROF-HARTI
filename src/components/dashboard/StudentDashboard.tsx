import Link from "next/link";

const physicsLessons = [
  "Les ondes mécaniques progressives",
  "Propagation d'une onde lumineuse",
  "Transformations nucléaires",
];

const chemistryLessons = [
  "Transformations rapides et lentes",
  "Suivi temporel d'une transformation",
  "Équilibre chimique",
];

const recordings = [
  { title: "Ondes mécaniques — Série 01", meta: "Physique · 1h 24min", status: "متاح" },
  { title: "Cinétique chimique — Méthode", meta: "Chimie · 58min", status: "جديد" },
  { title: "Radioactivité — Exercices BAC", meta: "Physique · 1h 12min", status: "متاح" },
];

export function StudentDashboard({
  locale,
  studentName,
  demo = false,
  progressPercent = 0,
  progressCompleted = 0,
  progressTotal = 0,
}: {
  locale: "ar" | "fr";
  studentName: string;
  demo?: boolean;
  progressPercent?: number;
  progressCompleted?: number;
  progressTotal?: number;
}) {
  const ar = locale === "ar";

  return (
    <div className="min-h-screen bg-board-900 text-chalk">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-board-900/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href={`/${locale}`} className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-2xl bg-accent text-sm font-black text-board-900">
              PH
            </span>
            <span>
              <span className="block text-sm font-bold">PROF HARTI</span>
              <span className="block text-[10px] uppercase tracking-[0.22em] text-chalk-dim">Academy</span>
            </span>
          </Link>

          <div className="ms-auto flex items-center gap-3">
            {demo ? (
              <span className="hidden rounded-full border border-violet/30 bg-violet/10 px-3 py-1 text-xs font-semibold text-violet sm:inline-flex">
                DEMO MODE
              </span>
            ) : null}
            <div className="hidden text-end sm:block">
              <p className="text-xs text-chalk-dim">{ar ? "حساب التلميذ" : "Compte élève"}</p>
              <p className="text-sm font-semibold">{studentName}</p>
            </div>
            <span className="grid size-10 place-items-center rounded-full border border-white/15 bg-white/5 text-sm font-bold text-accent">
              {studentName.trim().slice(0, 1).toUpperCase() || "S"}
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[220px_1fr] lg:px-8 lg:py-8">
        <aside className="hidden lg:block">
          <nav className="sticky top-24 space-y-2 rounded-3xl border border-white/10 bg-white/[0.035] p-3">
            {[
              ["01", ar ? "الرئيسية" : "Accueil"],
              ["02", ar ? "دروسي" : "Mes cours"],
              ["03", ar ? "التسجيلات" : "Replays"],
              ["04", ar ? "التمارين" : "Exercices"],
              ["05", ar ? "البرنامج" : "Planning"],
            ].map(([num, label], index) => (
              <a
                key={label}
                href={index === 0 ? "#overview" : index === 1 ? "#courses" : index === 2 ? "#replays" : index === 3 ? "#exercises" : "#planning"}
                className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition-colors ${
                  index === 0 ? "bg-accent text-board-900 font-bold" : "text-chalk-dim hover:bg-white/5 hover:text-chalk"
                }`}
              >
                <span className="text-[10px] font-bold opacity-70">{num}</span>
                {label}
              </a>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 space-y-6">
          <section id="overview" className="graph-paper relative overflow-hidden rounded-[2rem] border border-white/10 bg-board-800/70 p-6 sm:p-8">
            <div className="relative z-10 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">2BAC · PC</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-chalk-dim">2026 / 2027</span>
              </div>
              <h1 className="mt-5 text-3xl font-bold leading-tight sm:text-4xl">
                {ar ? `مرحبا ${studentName}، جاهز نكملو؟` : `Bonjour ${studentName}, on continue ?`}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-chalk-dim sm:text-base">
                {ar
                  ? "كل ما تحتاجه في الفيزياء والكيمياء موجود هنا: الحصص المباشرة، التسجيلات، التمارين وتتبع تقدمك في مكان واحد."
                  : "Retrouve tes lives, replays, exercices et ta progression en Physique-Chimie dans un seul espace."}
              </p>
            </div>
          </section>

          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ["02", ar ? "المواد" : "Matières", "Physique + Chimie"],
              ["12", ar ? "التسجيلات" : "Replays", ar ? "جاهزة للمشاهدة" : "disponibles"],
              ["18", ar ? "التمارين" : "Exercices", ar ? "مع التصحيح" : "avec correction"],
              [
                demo ? "74%" : `${progressPercent}%`,
                ar ? "التقدم" : "Progression",
                demo
                  ? ar ? "هذا الشهر" : "ce mois"
                  : ar
                    ? `${progressCompleted}/${progressTotal} دروس مكتملة`
                    : `${progressCompleted}/${progressTotal} leçons terminées`,
              ],
            ].map(([value, label, note]) => (
              <div key={label} className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
                <p className="text-2xl font-bold text-accent">{value}</p>
                <p className="mt-2 text-sm font-semibold">{label}</p>
                <p className="mt-1 text-xs text-chalk-dim">{note}</p>
              </div>
            ))}
          </section>

          <section id="planning" className="grid gap-4 xl:grid-cols-[1.35fr_.65fr]">
            <div className="overflow-hidden rounded-[2rem] border border-accent/20 bg-gradient-to-br from-accent/15 via-board-800 to-board-800 p-6 sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">LIVE CLASS</p>
                  <h2 className="mt-3 text-2xl font-bold">{ar ? "الحصة المباشرة القادمة" : "Prochain cours en direct"}</h2>
                  <p className="mt-2 text-sm text-chalk-dim">Physique · Ondes mécaniques progressives</p>
                </div>
                <span className="rounded-2xl bg-board-900/60 px-4 py-3 text-center ring-1 ring-white/10">
                  <span className="block text-lg font-bold">20:00</span>
                  <span className="block text-[11px] text-chalk-dim">{ar ? "الأحد" : "Dimanche"}</span>
                </span>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <button className="rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-board-900 transition-opacity hover:opacity-90">
                  {ar ? "دخول الحصة" : "Rejoindre le live"}
                </button>
                <button className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-chalk hover:border-accent/50">
                  {ar ? "تحميل الملخص" : "Télécharger le résumé"}
                </button>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet">OBJECTIF BAC</p>
              <p className="mt-3 text-3xl font-bold">14 / 20</p>
              <p className="mt-1 text-sm text-chalk-dim">{ar ? "هدف النقطة هذا الشهر" : "Objectif du mois"}</p>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[70%] rounded-full bg-violet" />
              </div>
              <p className="mt-3 text-xs leading-5 text-chalk-dim">
                {ar ? "باقي 3 سلاسل تمارين باش تكمل هدف الأسبوع." : "Encore 3 séries pour compléter l'objectif de la semaine."}
              </p>
            </div>
          </section>

          <section id="courses">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">PROGRAMME</p>
                <h2 className="mt-2 text-2xl font-bold">{ar ? "موادي" : "Mes matières"}</h2>
              </div>
              <span className="text-xs text-chalk-dim">2BAC Sciences Physiques</span>
            </div>

            {demo ? (
              <div className="grid gap-4 xl:grid-cols-2">
                <CourseCard
                  code="PHY"
                  title={ar ? "الفيزياء" : "Physique"}
                  subtitle="2BAC · Sciences Physiques"
                  progress={78}
                  lessons={physicsLessons}
                  locale={locale}
                />
                <CourseCard
                  code="CHI"
                  title={ar ? "الكيمياء" : "Chimie"}
                  subtitle="2BAC · Sciences Physiques"
                  progress={69}
                  lessons={chemistryLessons}
                  locale={locale}
                />
              </div>
            ) : (
              <Link href={`/${locale}/courses`} className="block rounded-[2rem] border border-white/10 bg-board-800/60 p-6 transition hover:border-accent/40 sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-black uppercase tracking-[0.18em] text-accent">{ar ? "المحتوى الحقيقي" : "Contenu réel"}</span>
                    <h3 className="mt-2 text-2xl font-bold">{ar ? "دروسي المنشورة" : "Mes cours publiés"}</h3>
                    <p className="mt-2 text-sm text-chalk-dim">
                      {ar ? "شاهد الدروس المتاحة وتتبع تقدمك من نفس المسار." : "Consultez vos leçons disponibles et suivez votre progression au même endroit."}
                    </p>
                  </div>
                  <span className="rounded-full border border-accent/25 bg-accent/10 px-4 py-2 text-sm font-black text-accent">{progressPercent}%</span>
                </div>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${progressPercent}%` }} />
                </div>
                <p className="mt-4 text-sm font-bold text-accent">{ar ? "فتح دروسي ←" : "Ouvrir mes cours →"}</p>
              </Link>
            )}
          </section>

          <section id="replays" className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet">REPLAYS</p>
                <h2 className="mt-2 text-xl font-bold">{ar ? "آخر التسجيلات" : "Derniers replays"}</h2>
              </div>
              <button className="text-xs font-semibold text-accent">{ar ? "عرض الكل" : "Tout voir"}</button>
            </div>
            <div className="mt-5 divide-y divide-white/10">
              {recordings.map((item, index) => (
                <div key={item.title} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-board-800 text-xs font-black text-accent ring-1 ring-white/10">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold sm:text-base">{item.title}</p>
                    <p className="mt-1 text-xs text-chalk-dim">{item.meta}</p>
                  </div>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-chalk-dim">{item.status}</span>
                </div>
              ))}
            </div>
          </section>

          <section id="exercises" className="grid gap-4 md:grid-cols-3">
            {[
              ["S01", ar ? "سلسلة الموجات" : "Série Ondes", "8 exercices · Corrigé"],
              ["S02", ar ? "سلسلة التحولات النووية" : "Série Nucléaire", "10 exercices · Corrigé"],
              ["BAC", ar ? "امتحان تجريبي" : "Bac blanc", "2h · Barème /20"],
            ].map(([code, title, meta]) => (
              <article key={code} className="rounded-3xl border border-white/10 bg-board-800/55 p-5 transition-transform hover:-translate-y-0.5">
                <span className="text-xs font-black tracking-[0.18em] text-accent">{code}</span>
                <h3 className="mt-4 font-bold">{title}</h3>
                <p className="mt-2 text-xs text-chalk-dim">{meta}</p>
                <button className="mt-5 text-xs font-semibold text-chalk hover:text-accent">
                  {ar ? "فتح التمارين ←" : "Ouvrir les exercices →"}
                </button>
              </article>
            ))}
          </section>

          <footer className="border-t border-white/10 py-6 text-center text-xs text-chalk-dim">
            PROF HARTI ACADEMY · {ar ? "منصة التعلم الخاصة بالمشتركين" : "Espace privé des abonnés"}
          </footer>
        </main>
      </div>
    </div>
  );
}

function CourseCard({
  code,
  title,
  subtitle,
  progress,
  lessons,
  locale,
}: {
  code: string;
  title: string;
  subtitle: string;
  progress: number;
  lessons: string[];
  locale: "ar" | "fr";
}) {
  const ar = locale === "ar";

  return (
    <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-board-800/60">
      <div className="border-b border-white/10 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-black tracking-[0.2em] text-accent">{code}</span>
            <h3 className="mt-2 text-2xl font-bold">{title}</h3>
            <p className="mt-1 text-xs text-chalk-dim">{subtitle}</p>
          </div>
          <span className="text-lg font-bold text-chalk">{progress}%</span>
        </div>
        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-accent" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className="p-4">
        {lessons.map((lesson, index) => (
          <button
            key={lesson}
            className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-start transition-colors hover:bg-white/5"
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-white/5 text-[10px] font-bold text-chalk-dim">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="min-w-0 flex-1 truncate text-sm">{lesson}</span>
            <span className="text-xs text-chalk-dim">{ar ? "فتح" : "Voir"}</span>
          </button>
        ))}
      </div>
    </article>
  );
}
