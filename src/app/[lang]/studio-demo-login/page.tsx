"use client";

import { FormEvent, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const DEMO_USER = "prof.berrada";
const DEMO_PASSWORD = "Berrada2026";

export default function StudioDemoLoginPage() {
  const params = useParams<{ lang: string }>();
  const router = useRouter();
  const lang = params.lang === "fr" ? "fr" : "ar";
  const ar = lang === "ar";
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (user.trim().toLowerCase() === DEMO_USER && password === DEMO_PASSWORD) {
      setError(false);
      router.push(`/${lang}/studio-demo`);
      return;
    }
    setError(true);
  }

  return (
    <main className="min-h-screen bg-[#07182d] px-4 py-12 text-white" dir={ar ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto grid size-16 place-items-center rounded-3xl border border-[#d5aa38]/40 bg-[#d5aa38]/10 text-xl font-black text-[#f0c85a]">MB</div>
          <p className="mt-4 text-sm font-bold uppercase tracking-[0.18em] text-[#f0c85a]">PROF BERRADA</p>
          <h1 className="mt-2 text-3xl font-black">{ar ? "الدخول إلى Studio الأستاذ" : "Accès au Studio professeur"}</h1>
          <p className="mt-3 text-sm leading-7 text-white/65">
            {ar ? "نسخة تجريبية آمنة لواجهة إدارة الأكاديمية." : "Démo sécurisée de l’interface de gestion de l’académie."}
          </p>
        </div>

        <form onSubmit={submit} className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 shadow-2xl shadow-black/30">
          <label className="block text-sm font-bold">{ar ? "اسم المستخدم" : "Identifiant"}</label>
          <input
            value={user}
            onChange={(e) => setUser(e.target.value)}
            autoComplete="username"
            className="mt-2 w-full rounded-2xl border border-white/15 bg-black/15 px-4 py-3 text-white outline-none focus:border-[#d5aa38]/70"
            placeholder="prof.berrada"
            required
          />

          <label className="mt-5 block text-sm font-bold">{ar ? "كلمة المرور" : "Mot de passe"}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="mt-2 w-full rounded-2xl border border-white/15 bg-black/15 px-4 py-3 text-white outline-none focus:border-[#d5aa38]/70"
            required
          />

          {error ? (
            <p className="mt-4 rounded-2xl border border-red-300/20 bg-red-400/10 px-4 py-3 text-sm text-red-100">
              {ar ? "اسم المستخدم أو كلمة المرور غير صحيحة." : "Identifiant ou mot de passe incorrect."}
            </p>
          ) : null}

          <button type="submit" className="mt-6 w-full rounded-full bg-[#d5aa38] px-5 py-3 font-black text-[#07182d] hover:opacity-90">
            {ar ? "فتح Studio التجريبي" : "Ouvrir le Studio démo"}
          </button>

          <p className="mt-5 text-center text-xs leading-6 text-white/55">
            {ar ? "الدخول خاص بالعرض فقط ولا يفتح بيانات حقيقية." : "Accès de démonstration uniquement, sans données réelles."}
          </p>
        </form>
      </div>
    </main>
  );
}
