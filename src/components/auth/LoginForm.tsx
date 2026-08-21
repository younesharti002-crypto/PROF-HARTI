"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export function LoginForm({ locale }: { locale: "ar" | "fr" }) {
  const ar = locale === "ar";
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });

      if (!response.ok) {
        setError(ar ? "رقم الهاتف أو كلمة المرور غير صحيحة." : "Téléphone ou mot de passe incorrect.");
        return;
      }

      window.location.href = `/${locale}/dashboard`;
    } catch {
      setError(ar ? "تعذر تسجيل الدخول حالياً. حاول مرة أخرى." : "Connexion indisponible. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-board-800/75 p-6 shadow-2xl shadow-black/20 sm:p-8">
      <div className="mb-7">
        <span className="inline-flex rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
          Subscriber Access
        </span>
        <h1 className="mt-4 text-3xl font-bold">{ar ? "الدخول إلى مساحتي" : "Accéder à mon espace"}</h1>
        <p className="mt-2 text-sm leading-6 text-chalk-dim">
          {ar ? "استعمل رقم WhatsApp وكلمة المرور التي توصلت بها من الإدارة." : "Utilisez votre numéro WhatsApp et le mot de passe fourni par l'administration."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-xs font-semibold text-chalk-dim">{ar ? "رقم WhatsApp" : "Numéro WhatsApp"}</span>
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            inputMode="tel"
            autoComplete="tel"
            placeholder="06XXXXXXXX"
            required
            className="w-full rounded-2xl border border-white/10 bg-board-900/70 px-4 py-3.5 text-sm text-chalk outline-none transition focus:border-accent/60"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-semibold text-chalk-dim">{ar ? "كلمة المرور" : "Mot de passe"}</span>
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            autoComplete="current-password"
            required
            className="w-full rounded-2xl border border-white/10 bg-board-900/70 px-4 py-3.5 text-sm text-chalk outline-none transition focus:border-accent/60"
          />
        </label>

        {error ? <p className="rounded-2xl border border-red-300/20 bg-red-400/10 px-4 py-3 text-xs text-red-100">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-accent px-5 py-3.5 text-sm font-bold text-board-900 transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
        >
          {loading ? (ar ? "جاري الدخول..." : "Connexion...") : ar ? "دخول" : "Se connecter"}
        </button>
      </form>

      <div className="mt-6 border-t border-white/10 pt-5">
        <p className="text-center text-xs leading-5 text-chalk-dim">
          {ar ? "للعرض فقط يمكن فتح النسخة التجريبية بدون حساب." : "Pour la présentation, vous pouvez ouvrir la démo sans compte."}
        </p>
        <Link
          href={`/${locale}/demo`}
          className="mt-3 block rounded-2xl border border-violet/30 bg-violet/10 px-4 py-3 text-center text-sm font-semibold text-violet transition hover:bg-violet/15"
        >
          {ar ? "فتح النسخة التجريبية" : "Ouvrir la démo"}
        </Link>
      </div>
    </div>
  );
}
