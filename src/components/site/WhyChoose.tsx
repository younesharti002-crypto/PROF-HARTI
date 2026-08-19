import type { Dictionary } from "@/i18n/dictionaries";
import { Card, Section, SectionHeading } from "@/components/ui/Section";

export function WhyChoose({ dict }: { dict: Dictionary }) {
  const { why } = dict;

  return (
    <Section id="why">
      <SectionHeading eyebrow={why.eyebrow} title={why.title} />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {why.items.map((item, index) => (
          <Card key={item.title} className="flex flex-col gap-3 p-5">
            <span
              className={`grid size-9 place-items-center rounded-xl text-sm font-bold ${
                index % 2 === 0
                  ? "bg-accent/15 text-accent ring-1 ring-accent/30"
                  : "bg-violet/15 text-violet ring-1 ring-violet/30"
              }`}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="text-base font-semibold text-chalk">{item.title}</h3>
            <p className="text-sm leading-relaxed text-chalk-dim">{item.description}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}
