import Link from "next/link";
import type { Dictionary } from "@/i18n/dictionaries";
import { locales, localeLabel, type Locale } from "@/i18n/config";
import { INSTAGRAM_URL } from "@/components/ui/Section";

export function Footer({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  return (
    <footer className="border-t border-white/10 bg-board-900/70 px-5 py-10 sm:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-bold tracking-wide text-chalk">
            {dict.common.brand} <span className="text-accent">{dict.common.brandSuffix}</span>
          </p>
          <p className="mt-1 text-xs text-chalk-dim">{dict.footer.tagline}</p>
          <p className="mt-1 text-xs text-chalk-dim">Ayoub Harti — Prof Harti</p>
        </div>

        <div className="text-xs text-chalk-dim">
          <p className="font-semibold text-chalk">{dict.contact.title}</p>
          <p className="mt-2">
            {dict.contact.instagramLabel}:{" "}
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="text-accent hover:underline"
            >
              {dict.common.instagram}
            </a>
          </p>
          <p className="mt-1">
            {dict.contact.emailLabel}:{" "}
            <a href={`mailto:${dict.contact.email}`} className="hover:text-chalk">
              {dict.contact.email}
            </a>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-chalk-dim">
          {locales.map((code) => (
            <Link
              key={code}
              href={`/${code}`}
              className={code === locale ? "text-chalk" : "hover:text-chalk"}
            >
              {localeLabel[code]}
            </Link>
          ))}
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="text-accent hover:underline"
          >
            {dict.common.instagram}
          </a>
        </div>
      </div>

      <div className="mx-auto mt-8 w-full max-w-6xl border-t border-white/10 pt-4 text-[11px] text-chalk-dim">
        © {new Date().getFullYear()} PROF HARTI Academy — {dict.footer.rights} · {dict.footer.phase}
      </div>
    </footer>
  );
}
