import type { Dictionary } from "@/i18n/dictionaries";
import { Card, Section } from "@/components/ui/Section";

export function Offers({ dict }: { dict: Dictionary }) {
  return (
    <>
      {dict.offers.map((offer, index) => (
        <Section
          key={offer.id}
          id={offer.id}
          className={index % 2 === 1 ? "border-y border-white/10 bg-board-900/40" : ""}
        >
          <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                {offer.eyebrow}
              </p>
              <h2 className="mt-3 text-2xl font-semibold leading-tight text-chalk sm:text-3xl">
                {offer.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-chalk-dim">{offer.description}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {offer.items.map((item, itemIndex) => (
                <Card key={item} className="p-4">
                  <span className="text-xs font-semibold text-violet">
                    {String(itemIndex + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-2 text-sm leading-relaxed text-chalk">{item}</p>
                </Card>
              ))}
            </div>
          </div>
        </Section>
      ))}
    </>
  );
}
