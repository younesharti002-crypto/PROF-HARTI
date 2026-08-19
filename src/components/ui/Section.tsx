import type { ReactNode } from "react";

export const INSTAGRAM_URL = "https://instagram.com/prof_harti";

/**
 * Portrait of Prof Harti used in the Hero and About sections.
 * Replace this single file to swap the official photo — no code changes needed.
 */
export const PORTRAIT_SRC = "/images/prof-harti-portrait.jpeg";

export function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`scroll-mt-20 px-5 py-14 sm:px-8 md:py-20 ${className}`}>
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  return (
    <header className="max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">{eyebrow}</p>
      <h2 className="mt-3 text-2xl font-semibold leading-tight text-chalk sm:text-3xl md:text-4xl">
        {title}
      </h2>
      {lead ? <p className="mt-4 text-base leading-relaxed text-chalk-dim">{lead}</p> : null}
    </header>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-board-800/60 p-6 shadow-[0_18px_40px_rgba(0,0,0,0.25)] backdrop-blur-[2px] ${className}`}
    >
      {children}
    </div>
  );
}
