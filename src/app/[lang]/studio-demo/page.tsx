import Link from "next/link";

export default async function StudioDemoPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = lang === "fr" ? "fr" : "ar";
  const ar = locale === "ar";

  const modules = [
    { icon: "▣", title: ar ? "الدروس والمحتوى" : "Cours & contenu", desc: ar ? "إضافة الدروس، تنظيم الوحدات ونشر المحتوى للتلاميذ." : "Ajouter des leçons, organiser les modules et publier le contenu." },
    { icon: "▶", title: ar ? "البث المباشر والإعادات" : "Lives & replays", desc: ar ? "برمجة الحصص المباشرة وإضافة روابط الإعادات." : "Planifier les lives et ajouter les liens de replay." },
    { icon: "✎", title: ar ? "التمارين والاختبارات" : "Exercices & quiz", desc: ar ? "إنشاء تمارين واختبارات ومتابعة النتائج." : "Créer des exercices, quiz et suivre les résultats." },
    { icon: "♙", title: ar ? "إدارة التلاميذ" : "Gestion des élèves", desc: ar ? "إضافة وتفعيل وإيقاف التلاميذ وتتبع التقدم." : "Ajouter, activer, suspendre les élèves et suivre leur progression." },
  ];

  return (
    <main className="min-h-screen bg-[#f4f6fb] text-[#0b1830]" dir={ar ? "rtl" : "ltr"}>
      <div className="mx-auto grid min-h-screen max-w-[1500px] lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="hidden bg-[#07182d] px-5 py-7 text-white lg:flex lg:flex-col">
          <Link href={`/${locale}`} className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-2xl border border-[#d5aa38]/40 bg-[#d5aa38]/10 text-lg font-black text-[#f0c85a]">MB</span>
            <span>
              <span className="block text-sm font-black tracking-[0.08em]">PROF BERRADA</span>
              <span className="block text-[9px] font-bold uppercase tracking-[0.28em] text-[#f0c85a]">TEACHER STUDIO</span>
            </span>
          </Link>
          <nav className="mt-10 space-y-2 text-sm font-bold">
            {[ar ? "لوحة التحكم" : "Tableau de bord", ar ? "المحتوى" : "Contenu", ar ? "البث المباشر" : "Lives", ar ? "التمارين" : "Exercices", ar ? "التلاميذ" : "Élèves"].map((label, i) => (
              <div key={label} className={`rounded-2xl px-4 py-3 ${i === 0 ? "bg-[#d5aa38] text-[#07182d]" : "text-white/70"}`}>{label}</div>
            ))}
          </nav>
          <div className="mt-auto rounded-3xl border border-white/10 bg-white/5 p-4 text-xs leading-6 text-white/70">
            {ar ? "نسخة عرض آمنة: لا تحتوي على أي بيانات حقيقية للتلاميذ." : "Démo sécurisée : aucune donnée réelle d’élève."}
          </div>
        </aside>

        <section className="min-w-0">
          <header className="border-b border-black/5 bg-white/90 px-5 py-4 backdrop-blur sm:px-8">
            <div className="flex items-center gap-3">
              <div className="lg:hidden">
                <span className="grid size-10 place-items-center rounded-xl bg-[#07182d] text-xs font-black text-[#f0c85a]">MB</span>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a47813]">PROF BERRADA</p>
                <h1 className="text-lg font-black">{ar ? "Studio الأستاذ" : "Studio professeur"}</h1>
              </div>
              <span className="ms-auto rounded-full border border-[#dbe3ef] bg-[#f8fbff] px-3 py-1.5 text-xs font-bold text-[#46607d]">DEMO</span>
            </div>
          </header>

          <div className="space-y-6 p-5 sm:p-8">
            <section>
              <p className="text-sm text-[#6b7890]">{ar ? "مرحبا أستاذ Berrada" : "Bienvenue Prof Berrada"}</p>
              <h2 className="mt-1 text-3xl font-black tracking-tight">{ar ? "إدارة أكاديميتك من مكان واحد" : "Gérez votre académie depuis un seul espace"}</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[#6b7890]">
                {ar ? "هاد الواجهة كتوريك كيفاش تقدر تدير المحتوى، الحصص، التمارين والتلاميذ من Studio واحد." : "Cette interface montre comment gérer le contenu, les lives, les exercices et les élèves depuis un seul Studio."}
              </p>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                [ar ? "التلاميذ" : "Élèves", "128", "+12"],
                [ar ? "الدروس المنشورة" : "Leçons publiées", "24", "+3"],
                [ar ? "الحصص هذا الشهر" : "Lives ce mois", "8", "2 live"],
                [ar ? "متوسط التقدم" : "Progression moyenne", "72%", "+6%"],
              ].map(([label, value, change]) => (
                <article key={label} className="rounded-3xl border border-[#e2e7ef] bg-white p-5 shadow-[0_12px_30px_rgba(15,30,55,0.05)]">
                  <p className="text-xs font-bold text-[#7b879b]">{label}</p>
                  <p className="mt-2 text-3xl font-black">{value}</p>
                  <p className="mt-2 text-xs font-bold text-[#a47813]">{change}</p>
                </article>
              ))}
            </section>

            <section className="grid gap-4 md:grid-cols-2">
              {modules.map((item) => (
                <article key={item.title} className="rounded-[2rem] border border-[#e2e7ef] bg-white p-6 shadow-[0_12px_30px_rgba(15,30,55,0.05)]">
                  <div className="flex items-start gap-4">
                    <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#07182d] text-lg font-black text-[#f0c85a]">{item.icon}</span>
                    <div>
                      <h3 className="text-lg font-black">{item.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-[#6b7890]">{item.desc}</p>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <section className="rounded-[2rem] border border-[#d9e1ed] bg-[#07182d] p-6 text-white sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#f0c85a]">GROWTH PARTNER DEMO</p>
                  <h3 className="mt-2 text-2xl font-black">{ar ? "هاد هو Studio اللي غادي يخدم به الأستاذ" : "Le Studio de gestion du professeur"}</h3>
                  <p className="mt-2 text-sm leading-7 text-white/65">{ar ? "النسخة النهائية كتربط مباشرة ببيانات الأستاذ وتلاميذه بعد التفعيل." : "La version finale sera reliée aux vraies données après activation."}</p>
                </div>
                <Link href={`/${locale}/demo`} className="inline-flex shrink-0 justify-center rounded-full bg-[#d5aa38] px-5 py-3 text-sm font-black text-[#07182d]">
                  {ar ? "شوف فضاء التلميذ" : "Voir l’espace élève"}
                </Link>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
