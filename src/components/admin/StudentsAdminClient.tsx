"use client";

import { FormEvent, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";

type Level = { id: string; name: string };
type Stream = { id: string; name: string; levelId: string };
type Group = { id: string; name: string; levelId: string; streamId: string | null; active: boolean };
type Offer = { id: string; name: string; academicYearId: string | null; active: boolean };
type Subscription = {
  id: string;
  offerId: string;
  offerName: string;
  status: "PENDING" | "ACTIVE" | "EXPIRED" | "SUSPENDED";
  startsAt: string | null;
  endsAt: string | null;
};
type DeviceInfo = {
  studentProfileId: string;
  deviceBound: boolean;
  userAgent: string | null;
  firstSeenAt: string | null;
  lastSeenAt: string | null;
};
type Student = {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  status: "ACTIVE" | "DISABLED";
  preferredLanguage: "ar" | "fr";
  createdAt: string;
  lastLoginAt: string | null;
  studentCode: string;
  levelId: string;
  streamId: string | null;
  primaryGroupId: string | null;
  currentSubscription: Subscription | null;
  subscriptions: Subscription[];
  progress: { totalLessons: number; startedLessons: number; completedLessons: number; percent: number };
  device?: DeviceInfo;
};
type Snapshot = { students: Student[]; levels: Level[]; streams: Stream[]; groups: Group[]; offers: Offer[] };
type FormState = {
  fullName: string;
  phone: string;
  password: string;
  studentCode: string;
  levelId: string;
  streamId: string;
  primaryGroupId: string;
  preferredLanguage: "ar" | "fr";
  offerId: string;
  subscriptionStatus: "ACTIVE" | "PENDING";
};
type Credential = { fullName: string; phone: string; password: string };

const EMPTY: Snapshot = { students: [], levels: [], streams: [], groups: [], offers: [] };
const EMPTY_FORM: FormState = {
  fullName: "",
  phone: "",
  password: "",
  studentCode: "",
  levelId: "",
  streamId: "",
  primaryGroupId: "",
  preferredLanguage: "ar",
  offerId: "",
  subscriptionStatus: "ACTIVE",
};

const inputClass = "w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none transition focus:border-orange-400/70";
const secondaryButton = "rounded-xl border border-white/15 px-3 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/5 disabled:opacity-40";
const primaryButton = "rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-black text-white transition hover:bg-orange-400 disabled:opacity-40";
const dangerButton = "rounded-xl border border-red-400/25 bg-red-400/10 px-3 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-400/20 disabled:opacity-40";

async function api(url: string, init?: RequestInit) {
  const response = await fetch(url, { credentials: "include", ...init });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.error?.message ?? "Operation failed");
  return payload;
}

function escapeCsv(value: unknown) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function downloadCsv(filename: string, rows: string[][]) {
  const blob = new Blob(["\uFEFF" + rows.map((row) => row.map(escapeCsv).join(",")).join("\n")], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function parseCsv(source: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < source.length; i += 1) {
    const char = source[i];
    if (char === '"') {
      if (quoted && source[i + 1] === '"') {
        cell += '"';
        i += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === "," && !quoted) {
      row.push(cell.trim());
      cell = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && source[i + 1] === "\n") i += 1;
      row.push(cell.trim());
      cell = "";
      if (row.some(Boolean)) rows.push(row);
      row = [];
    } else {
      cell += char;
    }
  }
  row.push(cell.trim());
  if (row.some(Boolean)) rows.push(row);
  return rows;
}

function normalizeHeader(value: string) {
  return value.toLowerCase().replace(/^\ufeff/, "").replace(/[\s_.-]+/g, "");
}

function randomPassword() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const bytes = new Uint8Array(10);
  crypto.getRandomValues(bytes);
  return `H@${Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("")}`;
}

function sameDay(value: string | null, now: Date) {
  if (!value) return false;
  const date = new Date(value);
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate();
}

function credentialMessage(credential: Credential, rtl: boolean) {
  return rtl
    ? `السلام عليكم ${credential.fullName}\nحسابك في PROF HARTI Academy تفعل بنجاح.\nالرابط: https://prof-harti.vercel.app/ar/login\nWhatsApp: ${credential.phone}\nكلمة السر: ${credential.password}\nملاحظة: أول جهاز تدخل منه غادي يتسجل كجهاز معتمد للحساب.`
    : `Bonjour ${credential.fullName},\nVotre compte PROF HARTI Academy est activé.\nLien : https://prof-harti.vercel.app/fr/login\nWhatsApp : ${credential.phone}\nMot de passe : ${credential.password}\nNote : le premier appareil utilisé sera enregistré comme appareil autorisé.`;
}

function userAgentLabel(userAgent: string | null) {
  if (!userAgent) return "—";
  if (/android/i.test(userAgent)) return "Android";
  if (/iphone|ipad|ios/i.test(userAgent)) return "iPhone / iPad";
  if (/windows/i.test(userAgent)) return "Windows";
  if (/macintosh|mac os/i.test(userAgent)) return "Mac";
  return "Browser";
}

export function StudentsAdminClient({ lang }: { lang: "ar" | "fr" }) {
  const rtl = lang === "ar";
  const [data, setData] = useState<Snapshot>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [subscriptionFilter, setSubscriptionFilter] = useState("");
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editing, setEditing] = useState<Student | null>(null);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [studentPayload, devicePayload] = await Promise.all([
        api("/api/v1/admin/students"),
        api("/api/v1/admin/student-devices"),
      ]);
      const snapshot = studentPayload.data as Snapshot;
      const devices = (devicePayload.data?.students ?? []) as DeviceInfo[];
      const deviceMap = new Map(devices.map((device) => [device.studentProfileId, device]));
      setData({
        ...snapshot,
        students: snapshot.students.map((student) => ({ ...student, device: deviceMap.get(student.id) })),
      });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const names = useMemo(() => ({
    level: new Map(data.levels.map((row) => [row.id, row.name])),
    stream: new Map(data.streams.map((row) => [row.id, row.name])),
    group: new Map(data.groups.map((row) => [row.id, row.name])),
  }), [data]);

  const visibleStreams = useMemo(
    () => data.streams.filter((row) => !form.levelId || row.levelId === form.levelId),
    [data.streams, form.levelId],
  );
  const visibleGroups = useMemo(
    () => data.groups.filter((row) => row.active && (!form.levelId || row.levelId === form.levelId) && (row.streamId === null || row.streamId === (form.streamId || null))),
    [data.groups, form.levelId, form.streamId],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return data.students.filter((student) => {
      const searchable = `${student.fullName} ${student.phone} ${student.studentCode}`.toLowerCase();
      if (needle && !searchable.includes(needle)) return false;
      if (levelFilter && student.levelId !== levelFilter) return false;
      if (statusFilter && student.status !== statusFilter) return false;
      const subscription = student.currentSubscription?.status ?? "NONE";
      if (subscriptionFilter && subscription !== subscriptionFilter) return false;
      return true;
    });
  }, [data.students, query, levelFilter, statusFilter, subscriptionFilter]);

  const now = new Date();
  const stats = {
    total: data.students.length,
    activeAccounts: data.students.filter((student) => student.status === "ACTIVE").length,
    activeSubscriptions: data.students.filter((student) => student.currentSubscription?.status === "ACTIVE").length,
    loggedToday: data.students.filter((student) => sameDay(student.lastLoginAt, now)).length,
    boundDevices: data.students.filter((student) => student.device?.deviceBound).length,
  };

  function resetForm() {
    setEditing(null);
    setForm(EMPTY_FORM);
  }

  function editStudent(student: Student) {
    setEditing(student);
    setForm({
      fullName: student.fullName,
      phone: student.phone,
      password: "",
      studentCode: student.studentCode,
      levelId: student.levelId,
      streamId: student.streamId ?? "",
      primaryGroupId: student.primaryGroupId ?? "",
      preferredLanguage: student.preferredLanguage,
      offerId: "",
      subscriptionStatus: "ACTIVE",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submitStudent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      if (editing) {
        await api(`/api/v1/admin/students/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: form.fullName,
            phone: form.phone,
            studentCode: form.studentCode,
            levelId: form.levelId,
            streamId: form.streamId || null,
            primaryGroupId: form.primaryGroupId || null,
            preferredLanguage: form.preferredLanguage,
          }),
        });
        setMessage(rtl ? "تم تحديث بيانات التلميذ." : "Élève mis à jour.");
      } else {
        await api("/api/v1/admin/students", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            streamId: form.streamId || null,
            primaryGroupId: form.primaryGroupId || null,
            offerId: form.offerId || null,
          }),
        });
        setCredentials((current) => [...current, { fullName: form.fullName, phone: form.phone, password: form.password }]);
        setMessage(rtl ? "تم إنشاء حساب التلميذ. بيانات الدخول جاهزة للإرسال." : "Compte élève créé. Les accès sont prêts à envoyer.");
      }
      resetForm();
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Operation failed");
    } finally {
      setBusy(false);
    }
  }

  async function toggleAccount(student: Student) {
    setBusy(true);
    setMessage("");
    try {
      await api(`/api/v1/admin/students/${student.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: student.status === "ACTIVE" ? "DISABLED" : "ACTIVE" }),
      });
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Operation failed");
    } finally {
      setBusy(false);
    }
  }

  async function resetPassword(student: Student) {
    const password = window.prompt(rtl ? `كلمة السر الجديدة لـ ${student.fullName}` : `Nouveau mot de passe pour ${student.fullName}`);
    if (!password) return;
    if (password.length < 8) {
      setMessage(rtl ? "كلمة السر خاصها تكون 8 أحرف على الأقل." : "Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      await api("/api/v1/admin/users/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: student.userId, newPassword: password }),
      });
      setCredentials((current) => [...current, { fullName: student.fullName, phone: student.phone, password }]);
      setMessage(rtl ? "تم تغيير كلمة السر وإغلاق الجلسات القديمة. بيانات الدخول الجديدة جاهزة للإرسال." : "Mot de passe modifié, sessions révoquées et nouveaux accès prêts à envoyer.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Operation failed");
    } finally {
      setBusy(false);
    }
  }

  async function toggleSubscription(student: Student) {
    setBusy(true);
    setMessage("");
    try {
      const current = student.currentSubscription;
      if (current) {
        const next = current.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
        await api(`/api/v1/admin/subscriptions/${current.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: next }),
        });
      } else {
        if (data.offers.length === 0) throw new Error(rtl ? "خاص إنشاء عرض نشط أولاً." : "Créez d’abord une offre active.");
        const defaultOffer = data.offers[0];
        let offer = defaultOffer;
        if (data.offers.length > 1) {
          const answer = window.prompt(
            rtl ? `اختار العرض بالاسم:\n${data.offers.map((item) => item.name).join("\n")}` : `Choisissez l’offre par nom :\n${data.offers.map((item) => item.name).join("\n")}`,
            defaultOffer.name,
          );
          if (!answer) return;
          offer = data.offers.find((item) => item.name.toLowerCase() === answer.trim().toLowerCase()) ?? defaultOffer;
        }
        await api("/api/v1/admin/subscriptions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentId: student.userId, offerId: offer.id, status: "ACTIVE" }),
        });
      }
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Operation failed");
    } finally {
      setBusy(false);
    }
  }

  async function resetDevice(student: Student) {
    const confirmed = window.confirm(
      rtl
        ? `واش متأكد بغيت تحيد الجهاز المسجل لـ ${student.fullName}؟ غادي يتسد الدخول الحالي، وأول جهاز يدخل من بعد غادي يتسجل.`
        : `Réinitialiser l’appareil de ${student.fullName} ? Les sessions actuelles seront fermées et le prochain appareil sera enregistré.`,
    );
    if (!confirmed) return;
    setBusy(true);
    setMessage("");
    try {
      await api(`/api/v1/admin/students/${student.id}/device`, { method: "DELETE" });
      setMessage(rtl ? "تم Reset للجهاز. التلميذ يقدر يسجل جهاز جديد في الدخول المقبل." : "Appareil réinitialisé. Le prochain appareil pourra être enregistré.");
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Device reset failed");
    } finally {
      setBusy(false);
    }
  }

  async function deleteStudent(student: Student) {
    const confirmed = window.confirm(
      rtl
        ? `حذف ${student.fullName} نهائياً؟ غادي يتحذف الحساب والاشتراكات والتقدم والجلسات والجهاز المرتبط به.`
        : `Supprimer définitivement ${student.fullName} ? Le compte et ses données liées seront supprimés.`,
    );
    if (!confirmed) return;
    const second = window.confirm(rtl ? "تأكيد أخير: هاد العملية نهائية." : "Dernière confirmation : cette action est définitive.");
    if (!second) return;
    setBusy(true);
    setMessage("");
    try {
      await api(`/api/v1/admin/students/${student.id}`, { method: "DELETE" });
      setCredentials((current) => current.filter((item) => item.phone !== student.phone));
      setMessage(rtl ? "تم حذف التلميذ نهائياً." : "Élève supprimé définitivement.");
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  async function copyCredential(credential: Credential) {
    try {
      await navigator.clipboard.writeText(credentialMessage(credential, rtl));
      setMessage(rtl ? `تم نسخ رسالة الدخول ديال ${credential.fullName}.` : `Message d’accès de ${credential.fullName} copié.`);
    } catch {
      setMessage(rtl ? "المتصفح منع النسخ التلقائي." : "Le navigateur a bloqué la copie automatique.");
    }
  }

  function openWhatsApp(credential: Credential) {
    const phone = credential.phone.replace(/\D/g, "");
    const text = encodeURIComponent(credentialMessage(credential, rtl));
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank", "noopener,noreferrer");
  }

  function exportStudents() {
    downloadCsv("prof-harti-eleves.csv", [
      ["fullName", "phone", "studentCode", "level", "stream", "group", "accountStatus", "subscriptionStatus", "deviceBound", "progressPercent", "lastLoginAt"],
      ...filtered.map((student) => [
        student.fullName,
        student.phone,
        student.studentCode,
        names.level.get(student.levelId) ?? "",
        student.streamId ? names.stream.get(student.streamId) ?? "" : "",
        student.primaryGroupId ? names.group.get(student.primaryGroupId) ?? "" : "",
        student.status,
        student.currentSubscription?.status ?? "NONE",
        student.device?.deviceBound ? "YES" : "NO",
        String(student.progress.percent),
        student.lastLoginAt ?? "",
      ]),
    ]);
  }

  function downloadTemplate() {
    downloadCsv("prof-harti-import-template.csv", [
      ["fullName", "phone", "level", "stream", "group", "password", "studentCode", "offer"],
      ["Nom Eleve", "0612345678", data.levels[0]?.name ?? "2BAC", data.streams[0]?.name ?? "PC", data.groups[0]?.name ?? "", "", "", data.offers[0]?.name ?? ""],
    ]);
  }

  function downloadCredentials() {
    downloadCsv("prof-harti-identifiants-eleves.csv", [
      ["fullName", "phone", "password"],
      ...credentials.map((row) => [row.fullName, row.phone, row.password]),
    ]);
  }

  async function importCsv(file: File) {
    setBusy(true);
    setMessage("");
    try {
      const rows = parseCsv(await file.text());
      if (rows.length < 2) throw new Error(rtl ? "الملف فارغ." : "Le fichier est vide.");
      const headers = rows[0].map(normalizeHeader);
      const indexOf = (...aliases: string[]) => aliases.map(normalizeHeader).map((alias) => headers.indexOf(alias)).find((index) => index >= 0) ?? -1;
      const indexes = {
        fullName: indexOf("fullName", "name", "nom"),
        phone: indexOf("phone", "telephone", "whatsapp"),
        level: indexOf("level", "niveau"),
        stream: indexOf("stream", "filiere", "filière"),
        group: indexOf("group", "groupe"),
        password: indexOf("password", "motdepasse"),
        studentCode: indexOf("studentCode", "code"),
        offer: indexOf("offer", "offre"),
      };
      if (indexes.fullName < 0 || indexes.phone < 0 || indexes.level < 0) {
        throw new Error(rtl ? "خاص الأعمدة: fullName, phone, level." : "Colonnes requises : fullName, phone, level.");
      }

      const created: Credential[] = [];
      const failures: string[] = [];
      for (const row of rows.slice(1)) {
        const value = (index: number) => index >= 0 ? (row[index] ?? "").trim() : "";
        const fullName = value(indexes.fullName);
        const phone = value(indexes.phone);
        const levelName = value(indexes.level);
        if (!fullName || !phone || !levelName) continue;
        const level = data.levels.find((item) => item.name.toLowerCase() === levelName.toLowerCase());
        if (!level) { failures.push(`${fullName}: level`); continue; }
        const streamName = value(indexes.stream);
        const stream = streamName ? data.streams.find((item) => item.levelId === level.id && item.name.toLowerCase() === streamName.toLowerCase()) : undefined;
        if (streamName && !stream) { failures.push(`${fullName}: stream`); continue; }
        const groupName = value(indexes.group);
        const group = groupName ? data.groups.find((item) => item.levelId === level.id && item.name.toLowerCase() === groupName.toLowerCase()) : undefined;
        if (groupName && !group) { failures.push(`${fullName}: group`); continue; }
        const offerName = value(indexes.offer);
        const offer = offerName ? data.offers.find((item) => item.name.toLowerCase() === offerName.toLowerCase()) : undefined;
        if (offerName && !offer) { failures.push(`${fullName}: offer`); continue; }
        const password = value(indexes.password) || randomPassword();
        try {
          await api("/api/v1/admin/students", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fullName,
              phone,
              password,
              studentCode: value(indexes.studentCode) || undefined,
              levelId: level.id,
              streamId: stream?.id ?? null,
              primaryGroupId: group?.id ?? null,
              offerId: offer?.id ?? null,
              subscriptionStatus: "ACTIVE",
              preferredLanguage: "ar",
            }),
          });
          created.push({ fullName, phone, password });
        } catch (error) {
          failures.push(`${fullName}: ${error instanceof Error ? error.message : "error"}`);
        }
      }
      setCredentials((current) => [...current, ...created]);
      setMessage(
        rtl
          ? `تم استيراد ${created.length} تلميذ${failures.length ? ` · فشل ${failures.length}` : ""}.`
          : `${created.length} élève(s) importé(s)${failures.length ? ` · ${failures.length} échec(s)` : ""}.`,
      );
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Import failed");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <main dir={rtl ? "rtl" : "ltr"} className="min-h-screen bg-[#071d23] px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-black uppercase tracking-[0.2em] text-orange-400">PROF HARTI · ADMIN</p>
            <h1 className="text-3xl font-black sm:text-4xl">{rtl ? "إدارة التلاميذ" : "Gestion des élèves"}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/60">
              {rtl ? "إضافة وتعديل التلاميذ، الاشتراكات، كلمات السر، الأجهزة، التقدم والاستيراد الجماعي من نفس الصفحة." : "Gérez les élèves, abonnements, mots de passe, appareils, progression et imports depuis une seule page."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => void refresh()} disabled={loading || busy} className={secondaryButton}>{rtl ? "تحديث" : "Actualiser"}</button>
            <button onClick={downloadTemplate} className={secondaryButton}>{rtl ? "نموذج CSV" : "Modèle CSV"}</button>
            <button onClick={exportStudents} className={secondaryButton}>{rtl ? "تصدير اللائحة" : "Exporter"}</button>
            <button onClick={() => fileRef.current?.click()} disabled={busy} className={primaryButton}>{rtl ? "استيراد CSV" : "Importer CSV"}</button>
            <input ref={fileRef} type="file" accept=".csv,text/csv" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void importCsv(file); }} />
          </div>
        </div>

        {message && <div className="mb-6 rounded-2xl border border-orange-400/25 bg-orange-400/10 px-4 py-3 text-sm text-orange-100">{message}</div>}

        {credentials.length > 0 && (
          <section className="mb-6 rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.07] p-4 sm:p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-black text-emerald-100">{rtl ? "بيانات الدخول الجاهزة للإرسال" : "Accès prêts à envoyer"}</h2>
                <p className="mt-1 text-xs text-white/55">{rtl ? "كلمات السر كتبان غير هنا مباشرة بعد الإنشاء أو Reset." : "Les mots de passe ne sont visibles ici qu’après création ou réinitialisation."}</p>
              </div>
              <button onClick={downloadCredentials} className={secondaryButton}>{rtl ? "تحميل CSV" : "Télécharger CSV"}</button>
            </div>
            <div className="grid gap-2 lg:grid-cols-2">
              {credentials.slice().reverse().map((credential, index) => (
                <div key={`${credential.phone}-${index}`} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/10 px-3 py-3">
                  <div><p className="font-bold">{credential.fullName}</p><p className="text-xs text-white/55">{credential.phone} · ••••••••</p></div>
                  <div className="flex gap-2">
                    <button onClick={() => void copyCredential(credential)} className={secondaryButton}>{rtl ? "نسخ الرسالة" : "Copier"}</button>
                    <button onClick={() => openWhatsApp(credential)} className={primaryButton}>WhatsApp</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <Stat label={rtl ? "مجموع التلاميذ" : "Total élèves"} value={stats.total} />
          <Stat label={rtl ? "الحسابات المفعلة" : "Comptes actifs"} value={stats.activeAccounts} />
          <Stat label={rtl ? "الاشتراكات النشطة" : "Abonnements actifs"} value={stats.activeSubscriptions} />
          <Stat label={rtl ? "الأجهزة المسجلة" : "Appareils liés"} value={stats.boundDevices} />
          <Stat label={rtl ? "دخلو اليوم" : "Connectés aujourd’hui"} value={stats.loggedToday} />
        </div>

        <section className="mb-6 rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-black">{editing ? (rtl ? "تعديل التلميذ" : "Modifier l’élève") : (rtl ? "إضافة تلميذ" : "Ajouter un élève")}</h2>
            {editing && <button onClick={resetForm} className={secondaryButton}>{rtl ? "إلغاء التعديل" : "Annuler"}</button>}
          </div>
          <form onSubmit={submitStudent} className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <Field label={rtl ? "الاسم الكامل" : "Nom complet"}><input required className={inputClass} value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></Field>
            <Field label="WhatsApp"><input required className={inputClass} placeholder="06XXXXXXXX" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
            {!editing && <Field label={rtl ? "كلمة السر" : "Mot de passe"}><input required minLength={8} type="password" className={inputClass} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></Field>}
            <Field label={rtl ? "كود التلميذ (اختياري)" : "Code élève (optionnel)"}><input className={inputClass} placeholder="Auto" value={form.studentCode} onChange={(e) => setForm({ ...form, studentCode: e.target.value })} /></Field>
            <Field label={rtl ? "المستوى" : "Niveau"}><select required className={inputClass} value={form.levelId} onChange={(e) => setForm({ ...form, levelId: e.target.value, streamId: "", primaryGroupId: "" })}><option value="">—</option>{data.levels.map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</select></Field>
            <Field label={rtl ? "الشعبة" : "Filière"}><select className={inputClass} value={form.streamId} onChange={(e) => setForm({ ...form, streamId: e.target.value, primaryGroupId: "" })}><option value="">{rtl ? "بدون شعبة" : "Sans filière"}</option>{visibleStreams.map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</select></Field>
            <Field label={rtl ? "المجموعة" : "Groupe"}><select className={inputClass} value={form.primaryGroupId} onChange={(e) => setForm({ ...form, primaryGroupId: e.target.value })}><option value="">{rtl ? "بدون مجموعة" : "Sans groupe"}</option>{visibleGroups.map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</select></Field>
            <Field label={rtl ? "لغة الحساب" : "Langue"}><select className={inputClass} value={form.preferredLanguage} onChange={(e) => setForm({ ...form, preferredLanguage: e.target.value === "fr" ? "fr" : "ar" })}><option value="ar">العربية</option><option value="fr">Français</option></select></Field>
            {!editing && <Field label={rtl ? "العرض / الاشتراك" : "Offre / abonnement"}><select className={inputClass} value={form.offerId} onChange={(e) => setForm({ ...form, offerId: e.target.value })}><option value="">{rtl ? "إنشاء الحساب بلا اشتراك" : "Créer sans abonnement"}</option>{data.offers.map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</select></Field>}
            <button disabled={busy} className={`${primaryButton} md:col-span-2 xl:col-span-4`}>{editing ? (rtl ? "حفظ التعديلات" : "Enregistrer") : (rtl ? "إنشاء حساب التلميذ" : "Créer le compte élève")}</button>
          </form>
          <p className="mt-3 text-xs text-white/40">{rtl ? "الاستيراد الجماعي كيدعم CSV المتوافق مع Excel. إلا كانت كلمة السر فارغة كيتم توليدها أوتوماتيكياً." : "L’import en masse utilise un CSV compatible Excel. Un mot de passe est généré si la cellule est vide."}</p>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">
          <div className="mb-4 grid gap-3 md:grid-cols-4">
            <input className={inputClass} placeholder={rtl ? "بحث بالاسم، الهاتف أو الكود…" : "Nom, téléphone ou code…"} value={query} onChange={(e) => setQuery(e.target.value)} />
            <select className={inputClass} value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}><option value="">{rtl ? "كل المستويات" : "Tous les niveaux"}</option>{data.levels.map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</select>
            <select className={inputClass} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}><option value="">{rtl ? "كل الحسابات" : "Tous les comptes"}</option><option value="ACTIVE">ACTIVE</option><option value="DISABLED">DISABLED</option></select>
            <select className={inputClass} value={subscriptionFilter} onChange={(e) => setSubscriptionFilter(e.target.value)}><option value="">{rtl ? "كل الاشتراكات" : "Tous les abonnements"}</option><option value="ACTIVE">ACTIVE</option><option value="PENDING">PENDING</option><option value="SUSPENDED">SUSPENDED</option><option value="EXPIRED">EXPIRED</option><option value="NONE">NONE</option></select>
          </div>

          {loading ? <div className="p-8 text-center text-white/50">{rtl ? "جاري تحميل التلاميذ…" : "Chargement…"}</div> : filtered.length === 0 ? <div className="p-8 text-center text-white/45">{rtl ? "ما كاين حتى تلميذ بهاد الفلتر." : "Aucun élève avec ces filtres."}</div> : (
            <div className="overflow-x-auto">
              <table className="min-w-[1450px] w-full text-sm">
                <thead className="text-xs uppercase tracking-wide text-white/45"><tr><th className="px-3 py-3 text-start">{rtl ? "التلميذ" : "Élève"}</th><th className="px-3 py-3 text-start">{rtl ? "المستوى" : "Niveau"}</th><th className="px-3 py-3 text-start">{rtl ? "الحساب" : "Compte"}</th><th className="px-3 py-3 text-start">{rtl ? "الاشتراك" : "Abonnement"}</th><th className="px-3 py-3 text-start">{rtl ? "الجهاز" : "Appareil"}</th><th className="px-3 py-3 text-start">{rtl ? "التقدم" : "Progression"}</th><th className="px-3 py-3 text-start">{rtl ? "آخر دخول" : "Dernière connexion"}</th><th className="px-3 py-3 text-start">{rtl ? "العمليات" : "Actions"}</th></tr></thead>
                <tbody>{filtered.map((student) => (
                  <tr key={student.id} className="border-t border-white/8 align-top">
                    <td className="px-3 py-4"><p className="font-black">{student.fullName}</p><p className="mt-1 text-xs text-white/50">{student.phone} · {student.studentCode}</p></td>
                    <td className="px-3 py-4"><p>{names.level.get(student.levelId)}</p><p className="text-xs text-white/45">{student.streamId ? names.stream.get(student.streamId) : "—"}{student.primaryGroupId ? ` · ${names.group.get(student.primaryGroupId)}` : ""}</p></td>
                    <td className="px-3 py-4"><Badge value={student.status} /></td>
                    <td className="px-3 py-4"><Badge value={student.currentSubscription?.status ?? "NONE"} /><p className="mt-1 max-w-40 truncate text-xs text-white/45">{student.currentSubscription?.offerName ?? "—"}</p></td>
                    <td className="px-3 py-4"><Badge value={student.device?.deviceBound ? "BOUND" : "UNBOUND"} /><p className="mt-1 text-xs text-white/45">{student.device?.deviceBound ? userAgentLabel(student.device.userAgent) : (rtl ? "لم يسجل جهاز بعد" : "Aucun appareil")}</p></td>
                    <td className="px-3 py-4"><div className="w-36"><div className="mb-1 flex justify-between text-xs"><span>{student.progress.completedLessons}/{student.progress.totalLessons}</span><strong>{student.progress.percent}%</strong></div><div className="h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-orange-500" style={{ width: `${Math.min(100, student.progress.percent)}%` }} /></div></div></td>
                    <td className="px-3 py-4 text-xs text-white/60">{student.lastLoginAt ? new Date(student.lastLoginAt).toLocaleString(lang === "fr" ? "fr-FR" : "ar-MA") : (rtl ? "لم يدخل بعد" : "Jamais")}</td>
                    <td className="px-3 py-4"><div className="flex max-w-[430px] flex-wrap gap-2">
                      <button disabled={busy} onClick={() => editStudent(student)} className={secondaryButton}>{rtl ? "تعديل" : "Modifier"}</button>
                      <button disabled={busy} onClick={() => void toggleAccount(student)} className={secondaryButton}>{student.status === "ACTIVE" ? (rtl ? "توقيف الحساب" : "Désactiver") : (rtl ? "تفعيل الحساب" : "Activer")}</button>
                      <button disabled={busy} onClick={() => void toggleSubscription(student)} className={secondaryButton}>{student.currentSubscription?.status === "ACTIVE" ? (rtl ? "توقيف الاشتراك" : "Suspendre") : (rtl ? "تفعيل الاشتراك" : "Activer abonnement")}</button>
                      <button disabled={busy} onClick={() => void resetPassword(student)} className={secondaryButton}>{rtl ? "كلمة السر" : "Mot de passe"}</button>
                      <button disabled={busy || !student.device?.deviceBound} onClick={() => void resetDevice(student)} className={secondaryButton}>{rtl ? "Reset الجهاز" : "Reset appareil"}</button>
                      <button disabled={busy} onClick={() => void deleteStudent(student)} className={dangerButton}>{rtl ? "حذف" : "Supprimer"}</button>
                    </div></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-white/50">{label}</span>{children}</label>;
}

function Stat({ label, value }: { label: string; value: number }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"><p className="text-xs font-bold uppercase tracking-[0.12em] text-white/45">{label}</p><p className="mt-1 text-3xl font-black">{value}</p></div>;
}

function Badge({ value }: { value: string }) {
  const active = value === "ACTIVE" || value === "BOUND";
  const warn = value === "PENDING" || value === "SUSPENDED";
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-black ${active ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200" : warn ? "border-orange-400/30 bg-orange-400/10 text-orange-200" : "border-white/15 bg-white/5 text-white/55"}`}>{value}</span>;
}
