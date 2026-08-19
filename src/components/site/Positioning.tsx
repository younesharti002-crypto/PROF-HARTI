import type { Dictionary } from "@/i18n/dictionaries";
import { Card, Section, SectionHeading } from "@/components/ui/Section";

export function Positioning({ dict }: { dict: Dictionary }) {
  const { positioning } = dict;

  const columns = [
    { data: positioning.physics, tone: "accent" as const },
    { data: positioning.chemistry, tone: "violet" as const },
  ];

  return (
    <Section id="positioning">
      <SectionHeading
        eyebrow={positioning.eyebrow}
        title={positioning.title}
        lead={positioning.lead}
      />

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {columns.map(({ data, tone }) => (
          <Card
            key={data.title}
            className={tone === "accent" ? "border-accent/25" : "border-violet/25"}
          >
            <h3
              className={`text-xl font-semibold ${tone === "accent" ? "text-accent" : "text-violet"}`}
            >
              {data.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-chalk-dim">{data.description}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {data.items.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-white/12 bg-white/5 px-3 py-1 text-xs text-chalk"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </Section>
  );
}
