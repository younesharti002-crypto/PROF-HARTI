import type { Dictionary } from "@/i18n/dictionaries";

export function Hero({ dict }: { dict: Dictionary }) {
  return (
    <section className="graph-paper relative overflow-hidden border-b border-accent/15 bg-[#090515]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_42%_34%,rgba(139,108,236,0.16),transparent_28rem)]" />
      <div aria-hidden="true" className="pointer-events-none absolute -end-24 top-10 size-[30rem] rounded-full border-[2rem] border-accent/[0.06]" />

      <div className="premium-hero-grid relative mx-auto grid w-full max-w-[90rem] gap-8 px-5 pb-12 pt-10 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-14 lg:px-10 lg:py-16">
        <div className="relative mx-auto grid min-h-[34rem] w-full max-w-[34rem] place-items-center lg:min-h-[42rem]">
          <div aria-hidden="true" className="absolute size-[28rem] rounded-full bg-accent/10 blur-3xl" />
          <div className="relative grid size-[22rem] place-items-center rounded-full border border-white/10 bg-[#0d071f] shadow-[0_35px_90px_rgba(0,0,0,0.55)] sm:size-[27rem]">
            <div className="absolute inset-[-1.15rem] rounded-full border-[1.1rem] border-accent/80 border-e-transparent rotate-[18deg]" />
            <div className="absolute inset-[-2.35rem] rounded-full border-2 border-[#f4f0ff]/90 border-s-transparent" />
            <div className="absolute inset-[1.4rem] rounded-full border border-[#d7bd62]/30 bg-[radial-gradient(circle_at_45%_38%,rgba(139,108,236,0.22),rgba(10,5,23,0.96)_65%)]" />

            <div className="relative z-10 text-center">
              <div className="mx-auto flex items-end justify-center gap-1 leading-none">
                <span className="gold-text text-[5.8rem] font-black italic tracking-[-0.12em] sm:text-[7rem]">M</span>
                <span className="text-[5.8rem] font-black italic tracking-[-0.12em] text-white sm:text-[7rem]">B</span>
              </div>
              <p className="-mt-1 text-lg font-black uppercase tracking-[0.04em] text-white sm:text-xl">Math Berrada</p>
              <p className="mt-2 text-[10px] font-black uppercase tracking-[0.36em] text-[#d7bd62]">Mathématiques</p>
            </div>

            <span className="absolute start-[13%] top-[27%] rotate-[-12deg] text-2xl font-black text-white/30">x²</span>
            <span className="absolute end-[11%] top-[33%] rotate-[9deg] text-xl font-black text-white/25">√x</span>
            <span className="absolute bottom-[25%] end-[14%] text-sm font-black text-[#d7bd62]/60">a²+b²</span>
          </div>

          <div className="absolute bottom-6 rounded-full border border-[#d7bd62]/25 bg-[#090515]/80 px-4 py-2 text-xs font-black text-[#e8d98e] backdrop-blur-xl">
            {dict.hero.imageCaption}
          </div>
        </div>

        <div className="premium-hero-copy py-4 lg:py-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/35 bg-accent/[0.08] px-4 py-2 text-xs font-bold text-accent-soft">
            <span className="size-1.5 rounded-full bg-[#d7bd62]" aria-hidden="true" />
            {dict.hero.badge}
          </div>

          <p className="mt-7 text-sm font-black uppercase tracking-[0.18em] text-[#d7bd62]">PROF BERRADA</p>
          <h1 className="mt-3 max-w-3xl text-[2.55rem] font-black leading-[1.08] tracking-[-0.025em] text-chalk sm:text-5xl md:text-[4.1rem]">
            {dict.hero.title}
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-chalk-dim md:text-lg">
            {dict.hero.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#subscriber-access"
              className="gold-button inline-flex items-center gap-3 rounded-full px-6 py-3.5 text-sm font-black transition hover:-translate-y-0.5 hover:brightness-105"
            >
              {dict.hero.primaryCta}
              <span aria-hidden="true">←</span>
            </a>
            <a
              href="#cours"
              className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.025] px-6 py-3.5 text-sm font-bold text-chalk transition hover:border-accent hover:bg-accent/[0.08]"
            >
              <span className="grid size-5 place-items-center rounded-full border border-white/25 text-[9px]" aria-hidden="true">▶</span>
              {dict.hero.secondaryCta}
            </a>
          </div>

          <dl className="premium-panel mt-10 grid max-w-3xl grid-cols-1 divide-y divide-white/[0.07] overflow-hidden rounded-2xl sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:[direction:ltr]">
            {dict.hero.stats.map((stat) => (
              <div key={stat.label} className="px-5 py-5 text-center [direction:inherit]">
                <dd className="text-xl font-black text-[#e4cc75] sm:text-2xl">{stat.value}</dd>
                <dt className="mt-1 text-xs leading-relaxed text-chalk-dim">{stat.label}</dt>
              </div>
            ))}
          </dl>

          <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">Powered by Growth Partner</p>
        </div>
      </div>
    </section>
  );
}
