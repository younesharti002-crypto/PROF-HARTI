import Image from "next/image";
import type { Dictionary } from "@/i18n/dictionaries";
import { PORTRAIT_SRC, Section, SectionHeading } from "@/components/ui/Section";

export function About({ dict }: { dict: Dictionary }) {
  const { about } = dict;

  return (
    <Section id="about" className="border-y border-white/10 bg-board-900/45">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-12">
        <div className="portrait-frame relative mx-auto aspect-square w-full max-w-[18rem] lg:max-w-none">
          <Image
            src={PORTRAIT_SRC}
            alt={dict.hero.imageAlt}
            fill
            sizes="(max-width: 1024px) 60vw, 380px"
            className="object-cover object-top"
          />
        </div>

        <div>
          <SectionHeading eyebrow={about.eyebrow} title={about.title} />

          <div className="mt-5 space-y-4">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-base leading-relaxed text-chalk-dim">
                {paragraph}
              </p>
            ))}
          </div>

          <ul className="mt-7 grid gap-3 sm:grid-cols-3">
            {about.points.map((point) => (
              <li
                key={point}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-relaxed text-chalk"
              >
                <span className="mb-2 block size-1.5 rounded-full bg-accent" aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
