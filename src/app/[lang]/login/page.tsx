import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { LoginForm } from "@/components/auth/LoginForm";

export default async function LoginPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const ar = lang === "ar";

  return (
    <main className="graph-paper relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col">
        <div className="flex items-center justify-between gap-4">
          <Link href={`/${lang}`} className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-2xl bg-accent text-sm font-black text-board-900">PH</span>
            <span>
              <span className="block text-sm font-bold">PROF HARTI</span>
              <span className="block text-[10px] uppercase tracking-[0.22em] text-chalk-dim">Academy</span>
            </span>
          </Link>
          <Link href={`/${lang}`} className="text-xs font-semibold text-chalk-dim hover:text-chalk">
            {ar ? "الرجوع للرئيسية" : "Retour à l'accueil"}
          </Link>
        </div>

        <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1fr_.82fr]">
          <div className="hidden max-w-xl lg:block">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">PRIVATE LEARNING SPACE</p>
            <h2 className="mt-5 text-5xl font-bold leading-[1.15]">
              {ar ? "تعلم. طبّق. وتابع تقدمك حتى الباك." : "Apprends. Pratique. Progresse jusqu'au BAC."}
            </h2>
            <p className="mt-5 max-w-lg text-base leading-8 text-chalk-dim">
              {ar
                ? "منصة خاصة بمشتركي Prof Harti تجمع الحصص المباشرة، التسجيلات، التمارين والتتبع في تجربة واحدة بسيطة ومنظمة."
                : "L'espace privé des abonnés Prof Harti réunit lives, replays, exercices et suivi dans une expérience simple et structurée."}
            </p>
            <div className="mt-8 grid grid-cols-3 gap-3">
              {[ar ? "حصص مباشرة" : "Cours live", ar ? "تسجيلات" : "Replays", ar ? "تمارين مصححة" : "Exercices corrigés"].map((item, i) => (
                <div key={item} className="rounded-3xl border border-white/10 bg-white/[0.035] p-4">
                  <span className="text-xs font-black text-accent">0{i + 1}</span>
                  <p className="mt-3 text-sm font-semibold">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <LoginForm locale={lang} />
          </div>
        </div>
      </div>
    </main>
  );
}
