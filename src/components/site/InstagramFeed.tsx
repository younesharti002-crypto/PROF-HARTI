import type { Dictionary } from "@/i18n/dictionaries";
import { INSTAGRAM_URL, Section } from "@/components/ui/Section";

function InstagramGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.8 3.8 0 0 1-1.38-.9 3.8 3.8 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2Zm0 1.8c-3.14 0-3.5.01-4.74.07-.9.04-1.39.19-1.72.32-.43.17-.74.37-1.06.69-.32.32-.52.63-.69 1.06-.13.33-.28.82-.32 1.72C3.41 9.1 3.4 9.46 3.4 12.6s.01 3.5.07 4.74c.04.9.19 1.39.32 1.72.17.43.37.74.69 1.06.32.32.63.52 1.06.69.33.13.82.28 1.72.32 1.24.06 1.6.07 4.74.07s3.5-.01 4.74-.07c.9-.04 1.39-.19 1.72-.32.43-.17.74-.37 1.06-.69.32-.32.52-.63.69-1.06.13-.33.28-.82.32-1.72.06-1.24.07-1.6.07-4.74s-.01-3.5-.07-4.74c-.04-.9-.19-1.39-.32-1.72a2.9 2.9 0 0 0-.69-1.06 2.9 2.9 0 0 0-1.06-.69c-.33-.13-.82-.28-1.72-.32C15.5 4.01 15.14 4 12 4Z" />
      <path d="M12 7.15a4.85 4.85 0 1 0 0 9.7 4.85 4.85 0 0 0 0-9.7Zm0 8a3.15 3.15 0 1 1 0-6.3 3.15 3.15 0 0 1 0 6.3Z" />
      <circle cx="17.05" cy="6.95" r="1.13" />
    </svg>
  );
}

export function InstagramFeed({ dict }: { dict: Dictionary }) {
  const { instagram } = dict;

  return (
    <Section id="instagram" className="border-y border-white/10 bg-board-900/45">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            {instagram.eyebrow}
          </p>
          <h2 className="mt-3 text-2xl font-semibold leading-tight text-chalk sm:text-3xl md:text-4xl">
            {instagram.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-chalk-dim">{instagram.description}</p>
        </div>

        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex w-fit items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-board-900 transition-opacity hover:opacity-90"
        >
          <InstagramGlyph className="size-4" />
          {instagram.cta}
        </a>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {instagram.posts.map((post, index) => (
          <a
            key={post.title}
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="group relative flex aspect-[4/3] flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-board-800/60 p-5 transition-colors hover:border-accent/40"
          >
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute -bottom-16 -end-10 size-44 rounded-full blur-2xl transition-opacity group-hover:opacity-90 ${
                index % 2 === 0 ? "bg-accent/15" : "bg-violet/15"
              }`}
            />

            <span className="relative flex items-center justify-between gap-2">
              <span
                className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                  index % 2 === 0 ? "bg-accent/15 text-accent" : "bg-violet/15 text-violet"
                }`}
              >
                {post.tag}
              </span>
              <span className="text-[11px] uppercase tracking-[0.16em] text-chalk-dim">
                {post.kind}
              </span>
            </span>

            <span className="relative">
              <span className="block text-base font-semibold leading-snug text-chalk">
                {post.title}
              </span>
              <span className="mt-2 inline-flex items-center gap-1.5 text-xs text-chalk-dim">
                <InstagramGlyph className="size-3.5" />
                {instagram.handle}
              </span>
            </span>
          </a>
        ))}
      </div>
    </Section>
  );
}
