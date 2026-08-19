import Image from "next/image";
import type { Dictionary } from "@/i18n/dictionaries";
import { ElectronOrbit } from "@/components/ElectronOrbit";
import { PORTRAIT_SRC } from "@/components/ui/Section";

export function Hero({ dict }: { dict: Dictionary }) {
  return (
    <div className="graph-paper relative overflow-hidden border-b border-white/10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 end-[-10%] size-[28rem] rounded-full bg-accent/12 blur-[110px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-12rem] start-[-8%] size-[24rem] rounded-full bg-violet/10 blur-[110px]"
      />

      <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-5 pb-14 pt-10 sm:px-8 md:pb-20 md:pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14">
        <div className="order-2 lg:order-1">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-accent-soft">
            <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
            {dict.hero.badge}
          </span>

          <h1 className="mt-5 text-[2rem] font-bold leading-[1.15] text-chalk sm:text-4xl md:text-[3.25rem] md:leading-[1.1]">
            {dict.hero.title}
          </h1>

          <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-base font-semibold">
            <span className="text-accent">{dict.hero.name}</span>
            <span className="text-white/25" aria-hidden="true">/</span>
            <span className="text-violet">{dict.hero.imageCaption}</span>
          </p>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-chalk-dim md:text-[1.05rem]">
            {dict.hero.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#subscriber-access"
              className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-board-900 shadow-[0_12px_30px_rgba(242,121,43,0.28)] transition-opacity hover:opacity-90"
            >
              {dict.hero.primaryCta}
            </a>
            <a
              href="#cours"
              className="rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-chalk transition-colors hover:border-accent hover:text-accent"
            >
              {dict.hero.secondaryCta}
            </a>
          </div>

          <dl className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {dict.hero.stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
              >
                <dt className="text-xs leading-snug text-chalk-dim">{stat.label}</dt>
                <dd className="mt-1 text-lg font-bold text-chalk">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="order-1 lg:order-2">
          <div className="relative mx-auto w-full max-w-[22rem] sm:max-w-[26rem] lg:max-w-none">
            <ElectronOrbit
              className="pointer-events-none absolute inset-x-[-14%] top-[-10%] hidden h-auto w-[128%] opacity-45 sm:block"
              animated
            />

            <figure className="portrait-frame relative aspect-[4/5] w-full sm:aspect-[3/4]">
              <Image
                src={PORTRAIT_SRC}
                alt={dict.hero.imageAlt}
                fill
                priority
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 60vw, 520px"
                className="object-cover object-top"
              />

              <figcaption className="absolute inset-x-0 bottom-0 z-10 flex flex-wrap items-center justify-between gap-2 p-4 sm:p-5">
                <span className="rounded-full bg-board-900/70 px-3 py-1.5 text-xs font-semibold text-chalk backdrop-blur">
                  {dict.hero.name}
                </span>
                <span className="rounded-full bg-accent px-3 py-1.5 text-xs font-bold text-board-900">
                  {dict.hero.badge}
                </span>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </div>
  );
}
