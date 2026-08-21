"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

type Row = { id: string; name?: string; title?: string; status?: string; courseId?: string; chapterId?: string; subjectId?: string; academicYearId?: string; levelId?: string; streamId?: string | null; description?: string | null; slug?: string; summary?: string | null; videoUrl?: string | null; pdfUrl?: string | null; position?: number };
type Data = {
  academicYears: Row[];
  levels: Row[];
  streams: Row[];
  subjects: Row[];
  courses: Row[];
  chapters: Row[];
  lessons: Row[];
};

const emptyData: Data = { academicYears: [], levels: [], streams: [], subjects: [], courses: [], chapters: [], lessons: [] };

export function ContentStudio({ lang }: { lang: "ar" | "fr" }) {
  const ar = lang === "ar";
  const [data, setData] = useState<Data>(emptyData);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedChapterId, setSelectedChapterId] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const response = await fetch("/api/v1/admin/content", { cache: "no-store" });
    const json = await response.json();
    if (response.ok) {
      setData(json.data as Data);
      setSelectedCourseId((current) => current || json.data.courses?.[0]?.id || "");
    } else {
      setMessage(json.error?.message || "Unable to load content.");
    }
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const selectedCourse = data.courses.find((course) => course.id === selectedCourseId);
  const courseChapters = useMemo(
    () => data.chapters.filter((chapter) => chapter.courseId === selectedCourseId),
    [data.chapters, selectedCourseId],
  );
  const visibleChapterId = selectedChapterId || courseChapters[0]?.id || "";
  const chapterLessons = data.lessons.filter((lesson) => lesson.chapterId === visibleChapterId);

  async function mutate(payload: Record<string, unknown>, successMessage: string) {
    setBusy(true);
    setMessage("");
    const response = await fetch("/api/v1/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await response.json();
    setBusy(false);
    if (!response.ok) {
      setMessage(json.error?.message || "Operation failed.");
      return false;
    }
    setMessage(successMessage);
    await load();
    return true;
  }

  async function createCourse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const ok = await mutate({
      operation: "course.create",
      title: form.get("title"),
      slug: form.get("slug"),
      description: form.get("description"),
      subjectId: form.get("subjectId"),
      academicYearId: form.get("academicYearId"),
      levelId: form.get("levelId"),
      streamId: form.get("streamId"),
    }, ar ? "تم إنشاء الكورس." : "Cours créé.");
    if (ok) event.currentTarget.reset();
  }

  async function createChapter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const ok = await mutate({
      operation: "chapter.create",
      courseId: selectedCourseId,
      title: form.get("title"),
      position: form.get("position"),
    }, ar ? "تمت إضافة الفصل." : "Chapitre ajouté.");
    if (ok) event.currentTarget.reset();
  }

  async function createLesson(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const ok = await mutate({
      operation: "lesson.create",
      chapterId: visibleChapterId,
      title: form.get("title"),
      summary: form.get("summary"),
      videoUrl: form.get("videoUrl"),
      pdfUrl: form.get("pdfUrl"),
      position: form.get("position"),
    }, ar ? "تمت إضافة الدرس." : "Leçon ajoutée.");
    if (ok) event.currentTarget.reset();
  }

  async function setStatus(entity: "course" | "chapter" | "lesson", id: string, status: "DRAFT" | "PUBLISHED" | "ARCHIVED") {
    await mutate({ operation: "status.set", entity, id, status }, ar ? "تم تحديث حالة المحتوى." : "Statut mis à jour.");
  }

  if (loading) {
    return <main className="min-h-screen bg-board-900 px-6 py-12 text-chalk">{ar ? "جاري تحميل الاستوديو..." : "Chargement du studio..."}</main>;
  }

  return (
    <main className="min-h-screen bg-board-900 text-chalk" dir={ar ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.22em] text-accent">PROF HARTI · CONTENT STUDIO</span>
            <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{ar ? "إدارة المحتوى" : "Gestion du contenu"}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-chalk-dim">{ar ? "أنشئ الكورس، قسمه إلى فصول ودروس، ثم انشره للتلاميذ عندما يصبح جاهزاً." : "Créez un cours, organisez ses chapitres et leçons, puis publiez-le quand il est prêt."}</p>
          </div>
          <a href={`/${lang}/dashboard`} className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold hover:border-accent/60">{ar ? "معاينة فضاء التلميذ" : "Voir l’espace élève"}</a>
        </header>

        {message ? <div className="mb-6 rounded-2xl border border-accent/20 bg-accent/10 px-4 py-3 text-sm text-accent">{message}</div> : null}

        <section className="grid gap-5 xl:grid-cols-[.9fr_1.1fr]">
          <form onSubmit={createCourse} className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6">
            <p className="text-xs font-black text-accent">01 · COURSE</p>
            <h2 className="mt-2 text-xl font-bold">{ar ? "إنشاء كورس" : "Créer un cours"}</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Field name="title" placeholder={ar ? "مثال: الفيزياء 2BAC" : "Ex: Physique 2BAC"} required />
              <Field name="slug" placeholder="physique-2bac" required ltr />
              <Select name="subjectId" label={ar ? "المادة" : "Matière"} rows={data.subjects} required />
              <Select name="academicYearId" label={ar ? "السنة الدراسية" : "Année"} rows={data.academicYears} required />
              <Select name="levelId" label={ar ? "المستوى" : "Niveau"} rows={data.levels} required />
              <Select name="streamId" label={ar ? "الشعبة (اختياري)" : "Filière (optionnel)"} rows={data.streams} />
            </div>
            <textarea name="description" placeholder={ar ? "وصف مختصر للكورس" : "Description du cours"} className="mt-3 min-h-24 w-full rounded-2xl border border-white/10 bg-board-800 px-4 py-3 text-sm outline-none focus:border-accent/60" />
            <button disabled={busy} className="mt-4 rounded-full bg-accent px-5 py-2.5 text-sm font-black text-board-900 disabled:opacity-50">{ar ? "إنشاء الكورس" : "Créer le cours"}</button>
          </form>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black text-violet">CONTENT TREE</p>
                <h2 className="mt-2 text-xl font-bold">{ar ? "المحتوى الحالي" : "Contenu actuel"}</h2>
              </div>
              <select value={selectedCourseId} onChange={(e) => { setSelectedCourseId(e.target.value); setSelectedChapterId(""); }} className="rounded-full border border-white/10 bg-board-800 px-4 py-2 text-sm">
                <option value="">{ar ? "اختر كورس" : "Choisir un cours"}</option>
                {data.courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
              </select>
            </div>

            {selectedCourse ? (
              <div className="mt-5 rounded-3xl border border-white/10 bg-board-800/60 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div><h3 className="text-lg font-bold">{selectedCourse.title}</h3><p className="mt-1 text-xs text-chalk-dim">/{selectedCourse.slug}</p></div>
                  <StatusBadge status={selectedCourse.status || "DRAFT"} />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <StatusButtons busy={busy} onSet={(next) => setStatus("course", selectedCourse.id, next)} lang={lang} />
                </div>
              </div>
            ) : <p className="mt-6 text-sm text-chalk-dim">{ar ? "أنشئ أول كورس للبدء." : "Créez votre premier cours."}</p>}
          </div>
        </section>

        {selectedCourse ? (
          <section className="mt-5 grid gap-5 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6">
              <p className="text-xs font-black text-accent">02 · CHAPTER</p>
              <h2 className="mt-2 text-xl font-bold">{ar ? "الفصول" : "Chapitres"}</h2>
              <form onSubmit={createChapter} className="mt-4 flex gap-2">
                <Field name="title" placeholder={ar ? "عنوان الفصل" : "Titre du chapitre"} required grow />
                <input name="position" type="number" min="0" defaultValue="0" className="w-20 rounded-2xl border border-white/10 bg-board-800 px-3 text-sm" />
                <button disabled={busy} className="rounded-2xl bg-accent px-4 text-sm font-black text-board-900">+</button>
              </form>
              <div className="mt-5 space-y-2">
                {courseChapters.map((chapter) => (
                  <button key={chapter.id} onClick={() => setSelectedChapterId(chapter.id)} className={`w-full rounded-2xl border p-4 text-start ${visibleChapterId === chapter.id ? "border-accent/50 bg-accent/10" : "border-white/10 bg-board-800/50"}`}>
                    <div className="flex items-center justify-between gap-3"><span className="font-semibold">{chapter.title}</span><StatusBadge status={chapter.status || "DRAFT"} /></div>
                  </button>
                ))}
              </div>
              {visibleChapterId ? <div className="mt-4"><StatusButtons busy={busy} onSet={(next) => setStatus("chapter", visibleChapterId, next)} lang={lang} /></div> : null}
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6">
              <p className="text-xs font-black text-violet">03 · LESSON</p>
              <h2 className="mt-2 text-xl font-bold">{ar ? "الدروس" : "Leçons"}</h2>
              {visibleChapterId ? (
                <>
                  <form onSubmit={createLesson} className="mt-4 space-y-3">
                    <Field name="title" placeholder={ar ? "عنوان الدرس" : "Titre de la leçon"} required />
                    <textarea name="summary" placeholder={ar ? "ملخص قصير" : "Résumé"} className="min-h-20 w-full rounded-2xl border border-white/10 bg-board-800 px-4 py-3 text-sm outline-none focus:border-accent/60" />
                    <div className="grid gap-3 sm:grid-cols-2"><Field name="videoUrl" placeholder="https://... video" ltr /><Field name="pdfUrl" placeholder="https://... PDF" ltr /></div>
                    <div className="flex gap-2"><input name="position" type="number" min="0" defaultValue="0" className="w-24 rounded-2xl border border-white/10 bg-board-800 px-3 text-sm" /><button disabled={busy} className="rounded-full bg-violet px-5 py-2.5 text-sm font-bold text-white">{ar ? "إضافة الدرس" : "Ajouter"}</button></div>
                  </form>
                  <div className="mt-6 space-y-3">
                    {chapterLessons.map((lesson) => (
                      <article key={lesson.id} className="rounded-2xl border border-white/10 bg-board-800/50 p-4">
                        <div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold">{lesson.title}</h3><p className="mt-1 text-xs text-chalk-dim">{lesson.videoUrl ? "Video · " : ""}{lesson.pdfUrl ? "PDF" : ""}</p></div><StatusBadge status={lesson.status || "DRAFT"} /></div>
                        <div className="mt-3"><StatusButtons busy={busy} onSet={(next) => setStatus("lesson", lesson.id, next)} lang={lang} /></div>
                      </article>
                    ))}
                  </div>
                </>
              ) : <p className="mt-5 text-sm text-chalk-dim">{ar ? "أضف فصلاً أولاً." : "Ajoutez d’abord un chapitre."}</p>}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}

function Field({ name, placeholder, required, ltr, grow }: { name: string; placeholder: string; required?: boolean; ltr?: boolean; grow?: boolean }) {
  return <input name={name} placeholder={placeholder} required={required} dir={ltr ? "ltr" : undefined} className={`${grow ? "min-w-0 flex-1" : "w-full"} rounded-2xl border border-white/10 bg-board-800 px-4 py-3 text-sm outline-none focus:border-accent/60`} />;
}

function Select({ name, label, rows, required }: { name: string; label: string; rows: Row[]; required?: boolean }) {
  return <select name={name} required={required} className="w-full rounded-2xl border border-white/10 bg-board-800 px-4 py-3 text-sm"><option value="">{label}</option>{rows.map((row) => <option key={row.id} value={row.id}>{row.name || row.title}</option>)}</select>;
}

function StatusBadge({ status }: { status: string }) {
  return <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] font-bold text-chalk-dim">{status}</span>;
}

function StatusButtons({ busy, onSet, lang }: { busy: boolean; onSet: (status: "DRAFT" | "PUBLISHED" | "ARCHIVED") => void; lang: "ar" | "fr" }) {
  const ar = lang === "ar";
  return <div className="flex flex-wrap gap-2"><button type="button" disabled={busy} onClick={() => onSet("DRAFT")} className="rounded-full border border-white/10 px-3 py-1.5 text-xs">Draft</button><button type="button" disabled={busy} onClick={() => onSet("PUBLISHED")} className="rounded-full bg-accent px-3 py-1.5 text-xs font-bold text-board-900">{ar ? "نشر" : "Publier"}</button><button type="button" disabled={busy} onClick={() => onSet("ARCHIVED")} className="rounded-full border border-white/10 px-3 py-1.5 text-xs">Archive</button></div>;
}
