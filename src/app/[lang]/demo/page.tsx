import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";

export default async function ProfBerradaDemoPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const ar = lang === "ar";

  const cards = [
    { label: ar ? "التقدم الدراسي" : "Progression", value: "68%", note: ar ? "17 من 25 درس" : "17 cours sur 25", icon: "↗" },
    { label: ar ? "أفضل نتيجة" : "Meilleur score", value: "92%", note: ar ? "آخر اختبار رياضيات" : "Dernier quiz de maths", icon: "★" },
    { label: ar ? "التسجيلات" : "Replays", value: "12", note: ar ? "حصة متاحة" : "séances disponibles", icon: "▶" },
    { label: ar ? "التمارين" : "Exercices", value: "24", note: ar ? "سلسلة وتمرين" : "séries et quiz", icon: "✓" },
  ];

  return (
    <main className="min-h-screen bg-[#f4f6fa] text-[#101828]" dir={ar ? "rtl" : "ltr"}>
      <div className="mx-auto min-h-screen max-w-[1540px] lg:grid lg:grid-cols-[270px_minmax(0,1fr)]">
        <aside className="hidden min-h-screen bg-[#071426] px-5 py-6 text-white lg:flex lg:flex-col">
          <Link href={`/${lang}`} className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-2xl border border-[#d8b35b]/40 bg-[#d8b35b]/10 text-lg font-black text-[#f0cf7a]">MB</span>
            <span>
              <span className="block text-sm font-black tracking-[0.08em]">PROF BERRADA</span>
              <span className="block text-[9px] font-bold uppercase tracking-[0.28em] text-[#d8b35b]">Math Academy</span>
            </span>
          </Link>

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#d8b35b]">Mathématiques • Collège</p>
            <p className="mt-2 text-sm leading-6 text-white/65">{ar ? "الفهم، المنهجية، ثم التطبيق." : "Comprendre, maîtriser la méthode, puis appliquer."}</p>
          </div>

          <nav className="mt-7 space-y-2">
            {[
              ["⌂", ar ? "الرئيسية" : "Accueil"],
              ["∑", ar ? "دروسي" : "Mes cours"],
              ["▶", ar ? "الحصص والتسجيلات" : "Lives & replays"],
              ["✓", ar ? "التمارين والنتائج" : "Exercices & résultats"],
            ].map(([icon, label], index) => (
              <div key={label} className={`flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-bold ${index === 0 ? "bg-[#d8b35b] text-[#071426]" : "text-white/65"}`}>
                <span className="grid size-8 place-items-center rounded-xl border border-current/15">{icon}</span>
                <span>{label}</span>
              </div>
            ))}
          </nav>

          <div className="mt-auto rounded-3xl border border-[#d8b35b]/25 bg-[#d8b35b]/10 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#f0cf7a]">DEMO</p>
            <p className="mt-2 text-sm font-bold">{ar ? "معاينة منصة التلميذ" : "Aperçu de l'espace élève"}</p>
            <Link href={`/${lang}`} className="mt-4 inline-flex text-xs font-bold text-white/65 hover:text-[#f0cf7a]">{ar ? "العودة للصفحة الرئيسية" : "Retour au site"}</Link>
          </div>
        </aside>

        <section className="min-w-0">
          <header className="sticky top-0 z-30 border-b border-black/[0.06] bg-white/90 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <Link href={`/${lang}`} className="flex items-center gap-2 lg:hidden">
                <span className="grid size-9 place-items-center rounded-xl bg-[#071426] text-xs font-black text-[#d8b35b]">MB</span>
                <span className="text-xs font-black">PROF BERRADA</span>
              </Link>
              <span className="ms-auto rounded-full border border-[#e4d7ae] bg-[#fffaf0] px-3 py-1.5 text-[10px] font-black text-[#8a6718]">DEMO • VIEW ONLY</span>
            </div>
          </header>

          <div className="space-y-6 p-4 sm:p-6 lg:p-8">
            <section className="overflow-hidden rounded-[2rem] bg-[#071426] p-6 text-white shadow-[0_20px_55px_rgba(10,23,45,0.12)] sm:p-8">
              <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
                <div>
                  <span className="inline-flex rounded-full border border-[#d8b35b]/35 bg-[#d8b35b]/10 px-3 py-1.5 text-[11px] font-black text-[#f0cf7a]">{ar ? "فضاء تلميذ Prof Berrada" : "Espace élève Prof Berrada"}</span>
                  <p className="mt-5 text-sm text-white/60">{ar ? "مرحبا" : "Bonjour"}</p>
                  <h1 className="mt-1 text-3xl font-black sm:text-4xl">Yassine • 3AC</h1>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-white/65">{ar ? "كل ما يحتاجه التلميذ في الرياضيات: دروس منظمة، حصص مباشرة، تسجيلات، تمارين ونتائج في مكان واحد." : "Tout ce dont l'élève a besoin en maths : cours structurés, lives, replays, exercices et résultats au même endroit."}</p>
                </div>
                <div className="text-start lg:text-end">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#d8b35b]">Progress</p>
                  <p className="mt-1 text-5xl font-black text-[#f0cf7a]">68%</p>
                  <p className="mt-2 text-xs text-white/55">17 / 25 {ar ? "درس مكتمل" : "cours terminés"}</p>
                </div>
              </div>
              <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[68%] rounded-full bg-[#d8b35b]" /></div>
            </section>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {cards.map((card) => (
                <article key={card.label} className="rounded-3xl border border-[#e1e5ec] bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div><p className="text-xs font-bold text-[#707887]">{card.label}</p><p className="mt-2 text-3xl font-black">{card.value}</p><p className="mt-2 text-xs text-[#9097a3]">{card.note}</p></div>
                    <span className="grid size-10 place-items-center rounded-2xl bg-[#fff6dc] text-[#a27b28]">{card.icon}</span>
                  </div>
                </article>
              ))}
            </section>

            <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
              <article className="rounded-[2rem] border border-[#e1e5ec] bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#a27b28]">{ar ? "الحصة القادمة" : "Prochaine séance"}</p>
                    <h2 className="mt-2 text-xl font-black">{ar ? "المعادلات والمتراجحات — مراجعة تطبيقية" : "Équations & inéquations — révision pratique"}</h2>
                    <p className="mt-3 text-sm text-[#707887]">Mathématiques • 3AC • 18:30</p>
                  </div>
                  <span className="grid size-12 place-items-center rounded-2xl bg-[#fff6dc] text-xl font-black text-[#a27b28]">∑</span>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#071426] px-4 py-2 text-xs font-black text-[#f0cf7a]">LIVE</span>
                  <span className="rounded-full border border-[#e1e5ec] px-4 py-2 text-xs font-bold text-[#6f7785]">60 min</span>
                </div>
              </article>

              <article className="rounded-[2rem] border border-[#e1e5ec] bg-white p-6 shadow-sm">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#a27b28]">{ar ? "آخر نشاط" : "Activité récente"}</p>
                <div className="mt-4 space-y-3">
                  {[
                    ["✓", ar ? "اختبار الحساب الحرفي" : "Quiz calcul littéral", "92%"],
                    ["▶", ar ? "إعادة حصة الهندسة" : "Replay géométrie", ar ? "تمت المشاهدة" : "Vu"],
                    ["∑", ar ? "درس المعادلات" : "Cours équations", "68%"],
                  ].map(([icon, title, value]) => (
                    <div key={title} className="flex items-center gap-3 rounded-2xl border border-[#e7eaf0] p-3.5">
                      <span className="grid size-10 place-items-center rounded-xl bg-[#071426] font-black text-[#f0cf7a]">{icon}</span>
                      <span className="min-w-0 flex-1 text-sm font-bold">{title}</span>
                      <span className="text-xs font-black text-[#a27b28]">{value}</span>
                    </div>
                  ))}
                </div>
              </article>
            </section>

            <section className="rounded-[2rem] border border-[#d8b35b]/30 bg-[#fffaf0] p-5 text-center sm:p-6">
              <p className="text-sm font-black text-[#7b5c18]">{ar ? "هذه نسخة Demo للعرض فقط — بدون أي بيانات حقيقية للتلاميذ." : "Cette version est une démo de présentation — aucune donnée réelle d'élève."}</p>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <Link href={`/${lang}`} className="rounded-xl bg-[#071426] px-5 py-3 text-xs font-black text-[#f0cf7a]">{ar ? "مشاهدة الصفحة الرئيسية" : "Voir la page d'accueil"}</Link>
                <Link href={`/${lang}/login`} className="rounded-xl border border-[#d8b35b] bg-white px-5 py-3 text-xs font-black text-[#7b5c18]">{ar ? "مشاهدة صفحة الدخول" : "Voir la connexion"}</Link>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
