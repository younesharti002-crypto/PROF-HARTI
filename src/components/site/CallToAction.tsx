import Link from "next/link";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { Section } from "@/components/ui/Section";

export function CallToAction({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  return (
    <Section id="subscriber-access" className="border-t border-accent/10 bg-[#090515]">
      <div className="relative overflow-hidden rounded-[2rem] border border-accent/25 bg-gradient-to-br from-[#251052] via-[#160b33] to-[#090515] p-7 shadow-[0_30px_80px_rgba(0,0,0,0.4)] sm:p-9 lg:p-12">
        <div aria-hidden="true" className="pointer-events-none absolute -end-20 -top-24 size-80 rounded-full border-[1.3rem] border-accent/[0.09]" />
        <div aria-hidden="true" className="pointer-events-none absolute -end-5 -top-10 size-52 rounded-full border border-[#d7bd62]/10" />

        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="flex items-center gap-3"><span className="h-px w-9 bg-[#d7bd62]/70" /><p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#d7bd62]">{dict.cta.eyebrow}</p></div>
            <h2 className="mt-4 max-w-3xl text-3xl font-black leading-tight text-chalk sm:text-4xl lg:text-[2.65rem]">{dict.cta.title}</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-chalk-dim sm:text-base">{dict.cta.description}</p>
          </div>

          <div className="flex flex-wrap gap-3 lg:flex-col">
            <Link href={`/${locale}/demo-berrada`} className="gold-button inline-flex min-w-44 items-center justify-center gap-3 rounded-full px-6 py-3.5 text-sm font-black transition hover:-translate-y-0.5 hover:brightness-105">
              {dict.cta.primary}<span aria-hidden="true">←</span>
            </Link>
            <a href="#cours" className="inline-flex min-w-44 items-center justify-center rounded-full border border-white/15 bg-white/[0.025] px-6 py-3.5 text-sm font-bold text-chalk transition hover:border-accent/40 hover:text-accent">
              {dict.cta.secondary}
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}
