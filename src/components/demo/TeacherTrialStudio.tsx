"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

type Locale = "ar" | "fr";
type Tab = "dashboard" | "lessons" | "lives" | "exercises" | "students";
type Lesson = { id: string; title: string; published: boolean };
type Live = { id: string; title: string; date: string };
type Exercise = { id: string; title: string; questions: number };
type Student = { id: string; name: string; active: boolean; progress: number };
type TrialData = { lessons: Lesson[]; lives: Live[]; exercises: Exercise[]; students: Student[] };

const STORAGE_KEY = "prof-berrada-trial-studio-v1";

const seed: TrialData = {
  lessons: [
    { id: "l1", title: "الأعداد النسبية — Révision", published: true },
    { id: "l2", title: "المعادلات من الدرجة الأولى", published: true },
    { id: "l3", title: "الهندسة: المثلثات", published: false },
  ],
  lives: [
    { id: "v1", title: "Live — حل تمارين المعادلات", date: "2026-09-10 19:00" },
    { id: "v2", title: "Live — مراجعة شاملة", date: "2026-09-14 18:30" },
  ],
  exercises: [
    { id: "e1", title: "Quiz المعادلات", questions: 10 },
    { id: "e2", title: "تمارين الهندسة", questions: 8 },
  ],
  students: [
    { id: "s1", name: "Yassine Demo", active: true, progress: 74 },
    { id: "s2", name: "Salma Demo", active: true, progress: 61 },
    { id: "s3", name: "Adam Demo", active: false, progress: 42 },
  ],
};

const id = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export function TeacherTrialStudio({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  const [tab, setTab] = useState<Tab>("dashboard");
  const [data, setData] = useState<TrialData>(seed);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setData(JSON.parse(saved) as TrialData);
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data, ready]);

  const avgProgress = useMemo(() => {
    if (!data.students.length) return 0;
    return Math.round(data.students.reduce((sum, s) => sum + s.progress, 0) / data.students.length);
  }, [data.students]);

  const nav: Array<{ id: Tab; label: string; icon: string }> = [
    { id: "dashboard", label: ar ? "لوحة التحكم" : "Tableau de bord", icon: "⌂" },
    { id: "lessons", label: ar ? "الدروس" : "Cours", icon: "▣" },
    { id: "lives", label: ar ? "البث المباشر" : "Lives", icon: "▶" },
    { id: "exercises", label: ar ? "التمارين" : "Exercices", icon: "✎" },
    { id: "students", label: ar ? "التلاميذ" : "Élèves", icon: "♙" },
  ];

  function resetTrial() {
    setData(seed);
    setTab("dashboard");
    localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <main className="min-h-screen bg-[#f4f6fb] text-[#0b1830]" dir={ar ? "rtl" : "ltr"}>
      <div className="mx-auto grid min-h-screen max-w-[1500px] lg:grid-cols-[270px_minmax(0,1fr)]">
        <aside className="hidden bg-[#07182d] px-5 py-7 text-white lg:flex lg:flex-col">
          <Link href={`/${locale}`} className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-2xl border border-[#d5aa38]/40 bg-[#d5aa38]/10 text-lg font-black text-[#f0c85a]">MB</span>
            <span>
              <span className="block text-sm font-black tracking-[0.08em]">PROF BERRADA</span>
              <span className="block text-[9px] font-bold uppercase tracking-[0.28em] text-[#f0c85a]">TRIAL STUDIO</span>
            </span>
          </Link>

          <nav className="mt-10 space-y-2 text-sm font-bold">
            {nav.map((item) => (
              <button key={item.id} type="button" onClick={() => setTab(item.id)} className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-start transition ${tab === item.id ? "bg-[#d5aa38] text-[#07182d]" : "text-white/70 hover:bg-white/5 hover:text-white"}`}>
                <span>{item.icon}</span><span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-auto space-y-3">
            <div className="rounded-3xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-xs leading-6 text-emerald-100">
              {ar ? "نسخة تجريبية وظيفية: التغييرات محفوظة داخل هذا المتصفح فقط ولا تمس أي بيانات حقيقية." : "Version d'essai fonctionnelle : les modifications restent dans ce navigateur."}
            </div>
            <button type="button" onClick={resetTrial} className="w-full rounded-2xl border border-white/15 px-4 py-3 text-xs font-black text-white/80 hover:bg-white/5">
              {ar ? "إعادة ضبط التجربة" : "Réinitialiser l'essai"}
            </button>
          </div>
        </aside>

        <section className="min-w-0">
          <header className="sticky top-0 z-20 border-b border-black/5 bg-white/95 px-5 py-4 backdrop-blur sm:px-8">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-[#07182d] text-xs font-black text-[#f0c85a] lg:hidden">MB</span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a47813]">PROF BERRADA</p>
                <h1 className="text-lg font-black">{ar ? "Studio الأستاذ — تجربة فعلية" : "Studio professeur — Essai fonctionnel"}</h1>
              </div>
              <span className="ms-auto rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700">TRIAL</span>
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto lg:hidden">
              {nav.map((item) => (
                <button key={item.id} onClick={() => setTab(item.id)} className={`whitespace-nowrap rounded-full px-3 py-2 text-xs font-bold ${tab === item.id ? "bg-[#07182d] text-white" : "bg-[#edf1f7] text-[#46607d]"}`}>{item.label}</button>
              ))}
            </div>
          </header>

          <div className="space-y-6 p-5 sm:p-8">
            {tab === "dashboard" && <Dashboard ar={ar} data={data} avgProgress={avgProgress} open={setTab} />}
            {tab === "lessons" && <LessonsPanel ar={ar} items={data.lessons} update={(lessons) => setData((d) => ({ ...d, lessons }))} />}
            {tab === "lives" && <LivesPanel ar={ar} items={data.lives} update={(lives) => setData((d) => ({ ...d, lives }))} />}
            {tab === "exercises" && <ExercisesPanel ar={ar} items={data.exercises} update={(exercises) => setData((d) => ({ ...d, exercises }))} />}
            {tab === "students" && <StudentsPanel ar={ar} items={data.students} update={(students) => setData((d) => ({ ...d, students }))} />}
          </div>
        </section>
      </div>
    </main>
  );
}

function Dashboard({ ar, data, avgProgress, open }: { ar: boolean; data: TrialData; avgProgress: number; open: (tab: Tab) => void }) {
  const cards = [
    [ar ? "التلاميذ" : "Élèves", String(data.students.length), "students" as Tab],
    [ar ? "الدروس" : "Cours", String(data.lessons.length), "lessons" as Tab],
    [ar ? "الحصص المباشرة" : "Lives", String(data.lives.length), "lives" as Tab],
    [ar ? "متوسط التقدم" : "Progression moyenne", `${avgProgress}%`, "students" as Tab],
  ];
  return <>
    <section>
      <p className="text-sm text-[#6b7890]">{ar ? "مرحبا أستاذ Berrada" : "Bienvenue Prof Berrada"}</p>
      <h2 className="mt-1 text-3xl font-black tracking-tight">{ar ? "جرب إدارة الأكاديمية بيدك" : "Testez la gestion de votre académie"}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-[#6b7890]">{ar ? "كل الأزرار اللي تحت خدامين فعلياً داخل النسخة التجريبية." : "Tous les boutons ci-dessous fonctionnent réellement dans cette version d'essai."}</p>
    </section>
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(([label, value, target]) => <button key={label} onClick={() => open(target as Tab)} className="rounded-3xl border border-[#e2e7ef] bg-white p-5 text-start shadow-[0_12px_30px_rgba(15,30,55,0.05)] hover:-translate-y-0.5">
        <p className="text-xs font-bold text-[#7b879b]">{label}</p><p className="mt-2 text-3xl font-black">{value}</p><p className="mt-2 text-xs font-bold text-[#a47813]">{ar ? "فتح الإدارة" : "Ouvrir"}</p>
      </button>)}
    </section>
    <section className="rounded-[2rem] bg-[#07182d] p-6 text-white sm:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#f0c85a]">GROWTH PARTNER TRIAL</p>
      <h3 className="mt-2 text-2xl font-black">{ar ? "زيد درس أو تلميذ وشوف النتيجة مباشرة" : "Ajoutez un cours ou un élève et voyez le résultat immédiatement"}</h3>
      <div className="mt-5 flex flex-wrap gap-3">
        <button onClick={() => open("lessons")} className="rounded-full bg-[#d5aa38] px-5 py-3 text-sm font-black text-[#07182d]">{ar ? "جرب إضافة درس" : "Ajouter un cours"}</button>
        <button onClick={() => open("students")} className="rounded-full border border-white/20 px-5 py-3 text-sm font-black">{ar ? "جرب إضافة تلميذ" : "Ajouter un élève"}</button>
      </div>
    </section>
  </>;
}

function PanelShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return <section className="space-y-5"><div><h2 className="text-3xl font-black">{title}</h2><p className="mt-2 text-sm text-[#6b7890]">{subtitle}</p></div>{children}</section>;
}

function LessonsPanel({ ar, items, update }: { ar: boolean; items: Lesson[]; update: (items: Lesson[]) => void }) {
  const [title, setTitle] = useState("");
  function add(e: FormEvent) { e.preventDefault(); if (!title.trim()) return; update([{ id: id("l"), title: title.trim(), published: false }, ...items]); setTitle(""); }
  return <PanelShell title={ar ? "الدروس والمحتوى" : "Cours & contenu"} subtitle={ar ? "أضف درساً، انشره أو رجعه لمسودة." : "Ajoutez, publiez ou remettez un cours en brouillon."}>
    <form onSubmit={add} className="flex flex-col gap-3 rounded-3xl bg-white p-5 sm:flex-row"><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={ar ? "عنوان الدرس" : "Titre du cours"} className="min-w-0 flex-1 rounded-2xl border border-[#dbe3ef] px-4 py-3 outline-none focus:border-[#d5aa38]"/><button className="rounded-2xl bg-[#07182d] px-5 py-3 font-black text-white">{ar ? "إضافة درس" : "Ajouter"}</button></form>
    <div className="space-y-3">{items.map((item) => <article key={item.id} className="flex flex-col gap-3 rounded-3xl border border-[#e2e7ef] bg-white p-5 sm:flex-row sm:items-center"><div className="min-w-0 flex-1"><h3 className="font-black">{item.title}</h3><p className={`mt-1 text-xs font-bold ${item.published ? "text-emerald-600" : "text-amber-600"}`}>{item.published ? (ar ? "منشور" : "Publié") : (ar ? "مسودة" : "Brouillon")}</p></div><div className="flex gap-2"><button onClick={() => update(items.map((x) => x.id === item.id ? { ...x, published: !x.published } : x))} className="rounded-xl bg-[#edf1f7] px-3 py-2 text-xs font-black">{item.published ? (ar ? "إرجاع لمسودة" : "Dépublier") : (ar ? "نشر" : "Publier")}</button><button onClick={() => update(items.filter((x) => x.id !== item.id))} className="rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-600">{ar ? "حذف" : "Supprimer"}</button></div></article>)}</div>
  </PanelShell>;
}

function LivesPanel({ ar, items, update }: { ar: boolean; items: Live[]; update: (items: Live[]) => void }) {
  const [title, setTitle] = useState(""); const [date, setDate] = useState("");
  function add(e: FormEvent) { e.preventDefault(); if (!title.trim() || !date.trim()) return; update([{ id: id("v"), title: title.trim(), date: date.trim() }, ...items]); setTitle(""); setDate(""); }
  return <PanelShell title={ar ? "البث المباشر" : "Lives"} subtitle={ar ? "برمج حصة مباشرة جديدة." : "Planifiez une nouvelle séance en direct."}>
    <form onSubmit={add} className="grid gap-3 rounded-3xl bg-white p-5 sm:grid-cols-[1fr_220px_auto]"><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={ar ? "عنوان الحصة" : "Titre du live"} className="rounded-2xl border border-[#dbe3ef] px-4 py-3"/><input value={date} onChange={(e) => setDate(e.target.value)} placeholder="2026-09-15 19:00" className="rounded-2xl border border-[#dbe3ef] px-4 py-3"/><button className="rounded-2xl bg-[#07182d] px-5 py-3 font-black text-white">{ar ? "برمجة" : "Planifier"}</button></form>
    <div className="space-y-3">{items.map((item) => <article key={item.id} className="flex items-center gap-4 rounded-3xl border border-[#e2e7ef] bg-white p-5"><div className="grid size-11 place-items-center rounded-2xl bg-[#07182d] text-[#f0c85a]">▶</div><div className="min-w-0 flex-1"><h3 className="font-black">{item.title}</h3><p className="mt-1 text-xs text-[#6b7890]">{item.date}</p></div><button onClick={() => update(items.filter((x) => x.id !== item.id))} className="rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-600">{ar ? "حذف" : "Supprimer"}</button></article>)}</div>
  </PanelShell>;
}

function ExercisesPanel({ ar, items, update }: { ar: boolean; items: Exercise[]; update: (items: Exercise[]) => void }) {
  const [title, setTitle] = useState(""); const [questions, setQuestions] = useState("10");
  function add(e: FormEvent) { e.preventDefault(); if (!title.trim()) return; update([{ id: id("e"), title: title.trim(), questions: Math.max(1, Number(questions) || 1) }, ...items]); setTitle(""); }
  return <PanelShell title={ar ? "التمارين والاختبارات" : "Exercices & quiz"} subtitle={ar ? "أنشئ تمريناً تجريبياً وحدد عدد الأسئلة." : "Créez un exercice et choisissez le nombre de questions."}>
    <form onSubmit={add} className="grid gap-3 rounded-3xl bg-white p-5 sm:grid-cols-[1fr_140px_auto]"><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={ar ? "عنوان التمرين" : "Titre de l'exercice"} className="rounded-2xl border border-[#dbe3ef] px-4 py-3"/><input type="number" min="1" value={questions} onChange={(e) => setQuestions(e.target.value)} className="rounded-2xl border border-[#dbe3ef] px-4 py-3"/><button className="rounded-2xl bg-[#07182d] px-5 py-3 font-black text-white">{ar ? "إنشاء" : "Créer"}</button></form>
    <div className="grid gap-3 md:grid-cols-2">{items.map((item) => <article key={item.id} className="rounded-3xl border border-[#e2e7ef] bg-white p-5"><h3 className="font-black">{item.title}</h3><p className="mt-2 text-sm text-[#6b7890]">{item.questions} {ar ? "أسئلة" : "questions"}</p><button onClick={() => update(items.filter((x) => x.id !== item.id))} className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-600">{ar ? "حذف" : "Supprimer"}</button></article>)}</div>
  </PanelShell>;
}

function StudentsPanel({ ar, items, update }: { ar: boolean; items: Student[]; update: (items: Student[]) => void }) {
  const [name, setName] = useState("");
  function add(e: FormEvent) { e.preventDefault(); if (!name.trim()) return; update([{ id: id("s"), name: name.trim(), active: true, progress: 0 }, ...items]); setName(""); }
  return <PanelShell title={ar ? "إدارة التلاميذ" : "Gestion des élèves"} subtitle={ar ? "أضف تلميذاً، فعّله أو أوقفه وجرب مسار الإدارة." : "Ajoutez un élève, activez-le ou suspendez-le."}>
    <form onSubmit={add} className="flex flex-col gap-3 rounded-3xl bg-white p-5 sm:flex-row"><input value={name} onChange={(e) => setName(e.target.value)} placeholder={ar ? "اسم التلميذ" : "Nom de l'élève"} className="min-w-0 flex-1 rounded-2xl border border-[#dbe3ef] px-4 py-3"/><button className="rounded-2xl bg-[#07182d] px-5 py-3 font-black text-white">{ar ? "إضافة تلميذ" : "Ajouter"}</button></form>
    <div className="space-y-3">{items.map((item) => <article key={item.id} className="grid gap-3 rounded-3xl border border-[#e2e7ef] bg-white p-5 sm:grid-cols-[1fr_140px_auto] sm:items-center"><div><h3 className="font-black">{item.name}</h3><p className={`mt-1 text-xs font-bold ${item.active ? "text-emerald-600" : "text-red-500"}`}>{item.active ? (ar ? "حساب مفعل" : "Compte actif") : (ar ? "حساب موقوف" : "Compte suspendu")}</p></div><div><p className="text-xs text-[#6b7890]">{ar ? "التقدم" : "Progression"}</p><div className="mt-1 h-2 rounded-full bg-[#edf1f7]"><div className="h-2 rounded-full bg-[#d5aa38]" style={{ width: `${item.progress}%` }} /></div><p className="mt-1 text-xs font-bold">{item.progress}%</p></div><div className="flex gap-2"><button onClick={() => update(items.map((x) => x.id === item.id ? { ...x, active: !x.active } : x))} className="rounded-xl bg-[#edf1f7] px-3 py-2 text-xs font-black">{item.active ? (ar ? "إيقاف" : "Suspendre") : (ar ? "تفعيل" : "Activer")}</button><button onClick={() => update(items.filter((x) => x.id !== item.id))} className="rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-600">{ar ? "حذف" : "Supprimer"}</button></div></article>)}</div>
  </PanelShell>;
}
