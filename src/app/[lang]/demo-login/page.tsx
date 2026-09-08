"use client";

import { FormEvent, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const DEMO_USER = "prof.berrada";
const DEMO_PASSWORD = "Berrada2026";

export default function DemoLoginPage() {
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
      router.push(`/${lang}/demo`);
      return;
    }
    setError(true);
  }

  return (
    <main className="min-h-screen bg-board-900 px-4 py-12 text-chalk" dir={ar ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto grid size-16 place-items-center rounded-3xl border border-accent/30 bg-accent/10 text-xl font-black text-accent">MB</div>
          <p className="mt-4 text-sm font-bold uppercase tracking-[0.18em] text-accent">PROF BERRADA</p>
          <h1 className="mt-2 text-3xl font-black">{ar ? "الدخول إلى النسخة التجريبية" : "Accès à la démo"}</h1>
          <p className="mt-3 text-sm leading-7 text-chalk-dim">
            {ar ? "نسخة عرض آمنة للأكاديمية الرقمية — Mathématiques • Collège" : "Démo sécurisée de l’académie numérique — Mathématiques • Collège"}
          </p>
        </div>

        <form onSubmit={submit} className="rounded-[2rem] border border-white/10 bg-board-800/80 p-6 shadow-2xl shadow-black/30">
          <label className="block text-sm font-bold">{ar ? "اسم المستخدم" : "Identifiant"}</label>
          <input
            value={user}
            onChange={(e) => setUser(e.target.value)}
            autoComplete="username"
            className="mt-2 w-full rounded-2xl border border-white/15 bg-board-900/80 px-4 py-3 outline-none focus:border-accent/70"
            placeholder="prof.berrada"
            required
          />

          <label className="mt-5 block text-sm font-bold">{ar ? "كلمة المرور" : "Mot de passe"}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="mt-2 w-full rounded-2xl border border-white/15 bg-board-900/80 px-4 py-3 outline-none focus:border-accent/70"
            required
          />

          {error ? (
            <p className="mt-4 rounded-2xl border border-red-300/20 bg-red-400/10 px-4 py-3 text-sm text-red-100">
              {ar ? "اسم المستخدم أو كلمة المرور غير صحيحة." : "Identifiant ou mot de passe incorrect."}
            </p>
          ) : null}

          <button type="submit" className="mt-6 w-full rounded-full bg-accent px-5 py-3 font-black text-board-900 hover:opacity-90">
            {ar ? "فتح المنصة التجريبية" : "Ouvrir la démo"}
          </button>

          <p className="mt-5 text-center text-xs leading-6 text-chalk-dim">
            {ar ? "هذا الدخول خاص بالعرض فقط ولا يفتح أي بيانات حقيقية للتلاميذ." : "Cet accès est réservé à la démonstration et ne donne accès à aucune donnée réelle d’élève."}
          </p>
        </form>
      </div>
    </main>
  );
}
