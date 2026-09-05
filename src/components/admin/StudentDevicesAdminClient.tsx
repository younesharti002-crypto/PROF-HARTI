"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type DeviceStudent = {
  studentProfileId: string;
  userId: string;
  fullName: string;
  phone: string;
  studentCode: string;
  accountStatus: "ACTIVE" | "DISABLED";
  deviceBound: boolean;
  userAgent: string | null;
  firstSeenAt: string | null;
  lastSeenAt: string | null;
};

async function api(url: string, init?: RequestInit) {
  const response = await fetch(url, { credentials: "include", ...init });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.error?.message ?? "Operation failed");
  return payload;
}

function formatDate(value: string | null, locale: "ar" | "fr") {
  if (!value) return "—";
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-MA" : "fr-MA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function deviceLabel(userAgent: string | null) {
  if (!userAgent) return "—";
  if (/android/i.test(userAgent)) return "Android";
  if (/iphone|ipad/i.test(userAgent)) return "iPhone / iPad";
  if (/windows/i.test(userAgent)) return "Windows";
  if (/macintosh|mac os/i.test(userAgent)) return "Mac";
  return "Navigateur";
}

export function StudentDevicesAdminClient({ lang }: { lang: "ar" | "fr" }) {
  const rtl = lang === "ar";
  const [students, setStudents] = useState<DeviceStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const payload = await api("/api/v1/admin/student-devices");
      setStudents(payload.data.students as DeviceStudent[]);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return students;
    return students.filter((student) =>
      `${student.fullName} ${student.phone} ${student.studentCode}`.toLowerCase().includes(needle),
    );
  }, [students, query]);

  async function resetDevice(student: DeviceStudent) {
    const confirmed = window.confirm(
      rtl
        ? `إعادة تعيين جهاز ${student.fullName}؟ سيتم إغلاق الجلسات الحالية وسيُسجَّل الجهاز التالي عند أول دخول.`
        : `Réinitialiser l’appareil de ${student.fullName} ? Les sessions actuelles seront fermées et le prochain appareil sera enregistré au prochain login.`,
    );
    if (!confirmed) return;

    setBusyId(student.studentProfileId);
    setMessage("");
    try {
      await api(`/api/v1/admin/students/${student.studentProfileId}/device`, { method: "DELETE" });
      setMessage(rtl ? "تمت إعادة تعيين الجهاز بنجاح." : "Appareil réinitialisé.");
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Reset failed");
    } finally {
      setBusyId(null);
    }
  }

  const boundCount = students.filter((student) => student.deviceBound).length;

  return (
    <main dir={rtl ? "rtl" : "ltr"} className="min-h-screen bg-[#071d23] px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-orange-400">PROF HARTI · ADMIN</p>
          <h1 className="text-3xl font-black sm:text-4xl">{rtl ? "أجهزة التلاميذ" : "Appareils des élèves"}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/60">
            {rtl
              ? "أول جهاز يدخل به التلميذ يتسجل تلقائياً. أي جهاز آخر يتمنع حتى يدير الأستاذ إعادة تعيين للجهاز."
              : "Le premier appareil utilisé par l’élève est enregistré automatiquement. Tout autre appareil est bloqué jusqu’à une réinitialisation par l’administration."}
          </p>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-xs text-white/50">{rtl ? "إجمالي التلاميذ" : "Élèves"}</p><p className="mt-1 text-2xl font-black">{students.length}</p></div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-xs text-white/50">{rtl ? "أجهزة مسجلة" : "Appareils enregistrés"}</p><p className="mt-1 text-2xl font-black text-orange-400">{boundCount}</p></div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-xs text-white/50">{rtl ? "بدون جهاز" : "Sans appareil"}</p><p className="mt-1 text-2xl font-black">{students.length - boundCount}</p></div>
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={rtl ? "بحث بالاسم أو الهاتف أو الكود" : "Rechercher par nom, téléphone ou code"}
            className="min-w-[260px] flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-orange-400/70"
          />
          <button onClick={() => void refresh()} className="rounded-xl border border-white/15 px-4 py-3 text-sm font-bold hover:bg-white/5">
            {rtl ? "تحديث" : "Actualiser"}
          </button>
        </div>

        {message && <div className="mb-5 rounded-2xl border border-orange-400/25 bg-orange-400/10 px-4 py-3 text-sm text-orange-100">{message}</div>}

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-white/60">{rtl ? "جاري التحميل…" : "Chargement…"}</div>
        ) : (
          <div className="space-y-3">
            {filtered.map((student) => (
              <div key={student.studentProfileId} className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 md:grid-cols-[1.2fr_.8fr_.8fr_auto] md:items-center">
                <div>
                  <p className="font-black">{student.fullName}</p>
                  <p className="mt-1 text-xs text-white/45">{student.phone} · {student.studentCode}</p>
                </div>
                <div>
                  <p className="text-xs text-white/45">{rtl ? "الجهاز" : "Appareil"}</p>
                  <p className={`mt-1 text-sm font-bold ${student.deviceBound ? "text-emerald-300" : "text-white/50"}`}>
                    {student.deviceBound ? `✓ ${deviceLabel(student.userAgent)}` : (rtl ? "غير مسجل" : "Non enregistré")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-white/45">{rtl ? "آخر استعمال" : "Dernière utilisation"}</p>
                  <p className="mt-1 text-sm text-white/80">{formatDate(student.lastSeenAt, lang)}</p>
                </div>
                <button
                  disabled={!student.deviceBound || busyId === student.studentProfileId}
                  onClick={() => void resetDevice(student)}
                  className="rounded-xl border border-orange-400/40 px-4 py-2.5 text-sm font-bold text-orange-200 transition hover:bg-orange-400/10 disabled:cursor-not-allowed disabled:opacity-35"
                >
                  {busyId === student.studentProfileId ? (rtl ? "جاري…" : "En cours…") : (rtl ? "Reset Device" : "Réinitialiser")}
                </button>
              </div>
            ))}
            {filtered.length === 0 && <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white/50">{rtl ? "لا توجد نتائج." : "Aucun résultat."}</div>}
          </div>
        )}
      </div>
    </main>
  );
}
