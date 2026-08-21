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

  const backLabel = lang === "ar" ? "العودة إلى الموقع" : "Retour au site";
  const title = lang === "ar" ? "PROF HARTI Academy" : "PROF HARTI Academy";
  const subtitle = lang === "ar" ? "الفيزياء والكيمياء • باك 2027" : "Physique & Chimie • BAC 2027";

  return (
    <main className="graph-paper relative min-h-screen overflow-hidden px-5 py-8 sm:px-8 sm:py-12">
      <div className="relative z-10 mx-auto w-full max-w-md">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link href={`/${lang}`} className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-accent/15 text-sm font-bold text-accent ring-1 ring-accent/40">
              PH
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-bold tracking-wide text-chalk">{title}</span>
              <span className="block text-[11px] text-chalk-dim">{subtitle}</span>
            </span>
          </Link>

          <Link
            href={`/${lang}`}
            className="text-xs font-semibold text-chalk-dim transition-colors hover:text-chalk"
          >
            {backLabel}
          </Link>
        </div>

        <LoginForm locale={lang} />
      </div>
    </main>
  );
}
