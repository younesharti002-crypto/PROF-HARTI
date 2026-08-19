import Link from "next/link";
import type { Dictionary } from "@/i18n/dictionaries";
import { locales, localeLabel, type Locale } from "@/i18n/config";

export function Header({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const navItems = [
    { href: "#about", label: dict.nav.about },
    { href: "#cours", label: dict.nav.cours },
    { href: "#lives", label: dict.nav.lives },
    { href: "#replays", label: dict.nav.replays },
    { href: "#exercices", label: dict.nav.exercices },
    { href: "#instagram", label: dict.common.instagram },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-board-900/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-5 py-3 sm:px-8">
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-xl bg-accent/15 text-sm font-bold text-accent ring-1 ring-accent/40">
            PH
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-bold tracking-wide text-chalk">
              {dict.common.brand}
            </span>
            <span className="block text-[11px] uppercase tracking-[0.2em] text-chalk-dim">
              {dict.common.brandSuffix}
            </span>
          </span>
        </Link>

        <nav className="mx-auto hidden items-center gap-6 text-sm text-chalk-dim lg:flex">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="transition-colors hover:text-chalk">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-2 lg:ms-0">
          <div
            className="flex items-center rounded-full border border-white/15 p-0.5 text-xs"
            aria-label={dict.common.languageLabel}
          >
            {locales.map((code) => (
              <Link
                key={code}
                href={`/${code}`}
                aria-current={code === locale ? "page" : undefined}
                className={`rounded-full px-2.5 py-1 transition-colors ${
                  code === locale
                    ? "bg-chalk text-board-900 font-semibold"
                    : "text-chalk-dim hover:text-chalk"
                }`}
              >
                {localeLabel[code]}
              </Link>
            ))}
          </div>

          <a
            href="#subscriber-access"
            className="hidden rounded-full bg-accent px-4 py-2 text-xs font-semibold text-board-900 transition-opacity hover:opacity-90 sm:inline-block"
          >
            {dict.nav.cta}
          </a>
        </div>
      </div>

      <nav className="flex gap-4 overflow-x-auto border-t border-white/10 px-5 py-2 text-xs text-chalk-dim lg:hidden">
        {navItems.map((item) => (
          <a key={item.href} href={item.href} className="whitespace-nowrap hover:text-chalk">
            {item.label}
          </a>
        ))}
        <a href="#subscriber-access" className="whitespace-nowrap font-semibold text-accent">
          {dict.nav.cta}
        </a>
      </nav>
    </header>
  );
}
