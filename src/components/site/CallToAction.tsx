import type { Dictionary } from "@/i18n/dictionaries";
import { Section } from "@/components/ui/Section";

export function CallToAction({ dict }: { dict: Dictionary }) {
  return (
    <Section id="subscriber-access">
      <div className="graph-paper relative overflow-hidden rounded-3xl border border-accent/25 bg-board-800/70 p-8 md:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
          {dict.cta.eyebrow}
        </p>
        <h2 className="mt-3 max-w-2xl text-2xl font-bold leading-tight text-chalk sm:text-3xl md:text-4xl">
          {dict.cta.title}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-chalk-dim">
          {dict.cta.description}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <span
            aria-disabled="true"
            className="cursor-not-allowed rounded-full bg-accent px-6 py-3 text-sm font-semibold text-board-900 opacity-70"
          >
            {dict.cta.primary}
          </span>
          <a
            href="#cours"
            className="rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-chalk transition-colors hover:border-accent hover:text-accent"
          >
            {dict.cta.secondary}
          </a>
        </div>
      </div>
    </Section>
  );
}
