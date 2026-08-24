import Link from "next/link";
import { notFound } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { isLocale } from "@/i18n/config";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const isAr = lang === "ar";
  const backLabel = isAr ? "العودة إلى الموقع" : "Retour au site";
  const lead = isAr
    ? "دروس الرياضيات، التسجيلات، التمارين والنتائج في فضاء واحد."
    : "Cours de maths, replays, exercices et résultats dans un seul espace.";
  const welcome = isAr ? "مرحبا بك في أكاديمية Prof Berrada" : "Bienvenue chez Prof Berrada";

  return (
    <main className="graph-paper relative min-h-screen overflow-hidden bg-[#090515] px-4 py-5 sm:px-7 sm:py-8 lg:px-10">
      <div aria-hidden="true" className="pointer-events-none absolute -end-40 -top-40 size-[34rem] rounded-full bg-accent/[0.09] blur-3xl" />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between gap-4 pb-5">
        <Link href={`/${lang}`} className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-full border border-[#d7bd62]/40 bg-[#21104c] text-sm font-black text-[#d7bd62]">MB</span>
          <span className="leading-tight">
            <span className="block text-sm font-bold tracking-[0.12em] text-chalk">PROF BERRADA</span>
            <span className="block text-[9px] font-bold tracking-[0.3em] text-accent">MATHÉMATIQUES</span>
          </span>
        </Link>

        <Link
          href={`/${lang}`}
          className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-chalk-dim transition hover:border-accent/40 hover:text-accent"
        >
          {backLabel}
        </Link>
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-accent/25 bg-[#110825]/88 shadow-[0_35px_100px_rgba(0,0,0,0.55)] lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative hidden min-h-[42rem] overflow-hidden bg-[radial-gradient(circle_at_50%_42%,rgba(139,108,236,0.20),transparent_22rem)] lg:grid lg:place-items-center">
          <div className="relative grid size-[22rem] place-items-center rounded-full border border-white/10 bg-[#0a0517] shadow-[0_28px_80px_rgba(0,0,0,0.5)]">
            <div className="absolute inset-[-1rem] rounded-full border-[0.9rem] border-accent/80 border-e-transparent rotate-[20deg]" />
            <div className="absolute inset-[-2rem] rounded-full border-2 border-white/80 border-s-transparent" />
            <div className="text-center">
              <div className="flex items-end justify-center gap-1 leading-none"><span className="gold-text text-7xl font-black italic">M</span><span className="text-7xl font-black italic text-white">B</span></div>
              <p className="mt-1 text-lg font-black uppercase tracking-[0.04em] text-white">Math Berrada</p>
              <p className="mt-2 text-[9px] font-black uppercase tracking-[0.34em] text-[#d7bd62]">Mathématiques</p>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 p-8 xl:p-10">
            <div className="inline-flex rounded-full border border-[#d7bd62]/30 bg-[#090515]/75 px-3 py-1.5 text-xs font-bold text-[#e6d37c] backdrop-blur-xl">
              PROF BERRADA Academy
            </div>
            <h1 className="mt-4 max-w-md text-4xl font-black leading-tight text-chalk">{welcome}</h1>
            <p className="mt-3 max-w-md text-sm leading-7 text-chalk-dim">{lead}</p>
            <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">De la compréhension à la réussite.</p>
          </div>
        </div>

        <div className="flex min-h-[36rem] items-center p-5 sm:p-8 lg:p-10 xl:p-14">
          <div className="w-full">
            <div className="mb-7 lg:hidden">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">PROF BERRADA Academy</p>
              <h1 className="mt-2 text-3xl font-black text-chalk">{welcome}</h1>
              <p className="mt-2 text-sm leading-7 text-chalk-dim">{lead}</p>
            </div>
            <LoginForm locale={lang} />
            <Link href={`/${lang}/demo-berrada`} className="mt-5 inline-flex text-xs font-bold text-accent hover:text-accent-soft">
              {isAr ? "فتح الديمو بدون تسجيل" : "Ouvrir la démo sans connexion"} →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
