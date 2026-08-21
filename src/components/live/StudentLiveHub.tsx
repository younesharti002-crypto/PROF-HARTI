"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

type LiveSession = {
  id: string;
  courseId: string;
  courseTitle: string;
  subjectName: string;
  title: string;
  description: string | null;
  scheduledAt: string;
  durationMinutes: number;
  joinUrl: string | null;
  replayUrl: string | null;
  replayPdfUrl: string | null;
  status: "SCHEDULED" | "LIVE" | "COMPLETED";
};
type Data = { subscriptionState: "ACTIVE"; sessions: LiveSession[] };

function embedUrl(url: string | null) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (host === "youtube.com" || host === "m.youtube.com") {
      const id = parsed.searchParams.get("v") || parsed.pathname.match(/^\/shorts\/([^/]+)/)?.[1] || parsed.pathname.match(/^\/embed\/([^/]+)/)?.[1];
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (host === "vimeo.com" || host === "player.vimeo.com") {
      const id = parsed.pathname.split("/").filter(Boolean).find((part) => /^\d+$/.test(part));
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
  } catch {
    return null;
  }
  return null;
}

export function StudentLiveHub({ lang }: { lang: "ar" | "fr" }) {
  const ar = lang === "ar";
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedReplayId, setSelectedReplayId] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const response = await fetch("/api/v1/student/live", { cache: "no-store" });
    const json = await response.json();
    if (!response.ok) {
      setError(json.error?.message || "Unable to load live classes.");
      setLoading(false);
      return;
    }
    const next = json.data as Data;
    setData(next);
    const firstReplay = next.sessions.find((session) => session.status === "COMPLETED" && session.replayUrl);
    setSelectedReplayId((current) => current || firstReplay?.id || "");
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const upcoming = useMemo(() => data?.sessions.filter((session) => session.status === "LIVE" || session.status === "SCHEDULED") ?? [], [data]);
  const replays = useMemo(() => data?.sessions.filter((session) => session.status === "COMPLETED" && session.replayUrl) ?? [], [data]);
  const selectedReplay = replays.find((session) => session.id === selectedReplayId) || null;
  const selectedEmbed = embedUrl(selectedReplay?.replayUrl || null);

  const formatDate = (value: string) => new Intl.DateTimeFormat(ar ? "ar-MA" : "fr-MA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

  if (loading) {
    return <main className="min-h-screen bg-board-900 px-6 py-12 text-chalk">{ar ? "جاري تحميل الحصص..." : "Chargement des lives..."}</main>;
  }

  return (
    <main className="min-h-screen bg-board-900 text-chalk" dir={ar ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.22em] text-accent">PROF HARTI ACADEMY</span>
            <h1 className="mt-2 text-3xl font-bold">{ar ? "الحصص المباشرة والتسجيلات" : "Lives & replays"}</h1>
            <p className="mt-2 text-sm text-chalk-dim">{ar ? "الحصص المبرمجة لك والتسجيلات المنشورة حسب اشتراكك." : "Vos lives programmés et les replays disponibles selon votre abonnement."}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={`/${lang}/courses`} className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold hover:border-accent/60">{ar ? "دروسي" : "Mes cours"}</Link>
            <Link href={`/${lang}/dashboard`} className="rounded-full bg-accent px-4 py-2 text-sm font-black text-board-900">{ar ? "الرئيسية" : "Dashboard"}</Link>
          </div>
        </header>

        {error ? (
          <section className="rounded-[2rem] border border-violet/30 bg-violet/10 p-8 text-center">
            <h2 className="text-xl font-bold">{ar ? "الحصص غير متاحة حالياً" : "Lives indisponibles"}</h2>
            <p className="mt-3 text-sm text-chalk-dim">{error}</p>
            <Link href={`/${lang}/courses`} className="mt-5 inline-flex rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold">{ar ? "العودة لدروسي" : "Retour aux cours"}</Link>
          </section>
        ) : (
          <>
            <section>
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-accent">LIVE CLASSES</p>
                  <h2 className="mt-2 text-2xl font-bold">{ar ? "الحصص القادمة" : "Prochains lives"}</h2>
                </div>
                <span className="text-xs text-chalk-dim">{upcoming.length} {ar ? "حصة" : "sessions"}</span>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                {upcoming.map((session) => (
                  <article key={session.id} className={`rounded-[2rem] border p-6 ${session.status === "LIVE" ? "border-red-400/30 bg-red-400/[0.06]" : "border-white/10 bg-white/[0.035]"}`}>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <span className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-black tracking-[0.15em] ${session.status === "LIVE" ? "border-red-400/30 bg-red-400/10 text-red-300" : "border-accent/30 bg-accent/10 text-accent"}`}>
                          {session.status === "LIVE" ? "● LIVE NOW" : "SCHEDULED"}
                        </span>
                        <p className="mt-3 text-xs font-black uppercase tracking-[0.14em] text-violet">{session.subjectName}</p>
                        <h3 className="mt-2 text-xl font-bold">{session.title}</h3>
                        <p className="mt-1 text-xs text-chalk-dim">{session.courseTitle}</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-board-900/60 px-4 py-3 text-center">
                        <p className="text-sm font-bold">{formatDate(session.scheduledAt)}</p>
                        <p className="mt-1 text-[10px] text-chalk-dim">{session.durationMinutes} min</p>
                      </div>
                    </div>
                    {session.description ? <p className="mt-4 text-sm leading-7 text-chalk-dim">{session.description}</p> : null}
                    <div className="mt-5">
                      {session.status === "LIVE" && session.joinUrl ? (
                        <a href={session.joinUrl} target="_blank" rel="noreferrer" className="inline-flex rounded-full bg-accent px-5 py-2.5 text-sm font-black text-board-900">{ar ? "دخول الحصة الآن" : "Rejoindre maintenant"}</a>
                      ) : (
                        <span className="inline-flex rounded-full border border-white/10 px-4 py-2 text-xs text-chalk-dim">{ar ? "رابط الدخول يظهر عند بدء الحصة" : "Le lien apparaît au démarrage"}</span>
                      )}
                    </div>
                  </article>
                ))}
                {upcoming.length === 0 ? <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-8 text-center text-sm text-chalk-dim lg:col-span-2">{ar ? "لا توجد حصة قادمة منشورة حالياً." : "Aucun live à venir pour le moment."}</div> : null}
              </div>
            </section>

            <section className="mt-10">
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-violet">REPLAYS</p>
                  <h2 className="mt-2 text-2xl font-bold">{ar ? "التسجيلات" : "Replays"}</h2>
                </div>
                <span className="text-xs text-chalk-dim">{replays.length} {ar ? "تسجيل" : "replays"}</span>
              </div>

              {selectedReplay ? (
                <div className="mb-5 grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
                  <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-black/30">
                    <div className="aspect-video bg-black/60">
                      {selectedEmbed ? (
                        <iframe src={selectedEmbed} title={selectedReplay.title} className="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
                      ) : (
                        <div className="grid h-full place-items-center p-8 text-center">
                          <div>
                            <div className="mx-auto grid size-16 place-items-center rounded-full border border-violet/30 bg-violet/10 text-2xl">▶</div>
                            <h3 className="mt-4 text-xl font-bold">{selectedReplay.title}</h3>
                            <a href={selectedReplay.replayUrl || "#"} target="_blank" rel="noreferrer" className="mt-5 inline-flex rounded-full bg-violet px-5 py-2.5 text-sm font-black text-white">{ar ? "فتح التسجيل" : "Ouvrir le replay"}</a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <aside className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6">
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-violet">{selectedReplay.subjectName}</p>
                    <h3 className="mt-3 text-xl font-bold">{selectedReplay.title}</h3>
                    <p className="mt-2 text-xs text-chalk-dim">{formatDate(selectedReplay.scheduledAt)} · {selectedReplay.durationMinutes} min</p>
                    {selectedReplay.description ? <p className="mt-4 text-sm leading-7 text-chalk-dim">{selectedReplay.description}</p> : null}
                    {selectedReplay.replayPdfUrl ? <a href={selectedReplay.replayPdfUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex rounded-full border border-white/15 px-4 py-2 text-xs font-bold hover:border-accent/60">{ar ? "تحميل ملخص الحصة PDF" : "Document PDF"}</a> : null}
                  </aside>
                </div>
              ) : null}

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {replays.map((session) => (
                  <button key={session.id} type="button" onClick={() => setSelectedReplayId(session.id)} className={`rounded-3xl border p-5 text-start transition ${selectedReplayId === session.id ? "border-violet/50 bg-violet/10" : "border-white/10 bg-white/[0.035] hover:border-white/20"}`}>
                    <span className="text-[10px] font-black uppercase tracking-[0.14em] text-violet">{session.subjectName}</span>
                    <h3 className="mt-2 font-bold">{session.title}</h3>
                    <p className="mt-2 text-xs text-chalk-dim">{formatDate(session.scheduledAt)}</p>
                  </button>
                ))}
                {replays.length === 0 ? <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-8 text-center text-sm text-chalk-dim md:col-span-2 xl:col-span-3">{ar ? "مازال ما تنشر حتى Replay." : "Aucun replay publié pour le moment."}</div> : null}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
