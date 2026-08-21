import Link from "next/link";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getAuthenticatedSession, SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { getStudentProgressSummary } from "@/lib/progress/student-progress";
import { getStudentSubscriptionAccess } from "@/lib/subscriptions/student-access";
import { StudentDashboard } from "@/components/dashboard/StudentDashboard";

export default async function DashboardPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    redirect(`/${lang}/login`);
  }

  try {
    const session = await getAuthenticatedSession(token);
    if (!session) redirect(`/${lang}/login`);

    if (session.user.role === "TEACHER") redirect(`/${lang}/studio`);
    if (session.user.role === "ADMIN") redirect(`/${lang}/admin/academic`);
    if (session.user.role !== "STUDENT") redirect(`/${lang}/login`);

    const access = await getStudentSubscriptionAccess(session.user.id);
    const active = access.state === "ACTIVE";
    const progress = active
      ? await getStudentProgressSummary(session.user.id)
      : { totalLessons: 0, startedLessons: 0, completedLessons: 0, percent: 0 };

    const statusLabel = lang === "ar"
      ? active
        ? "اشتراكك مفعل"
        : access.state === "PENDING"
          ? "الاشتراك في انتظار التفعيل"
          : access.state === "SUSPENDED"
            ? "الاشتراك موقوف"
            : access.state === "EXPIRED"
              ? "انتهى الاشتراك"
              : "لا يوجد اشتراك مفعل"
      : active
        ? "Abonnement actif"
        : access.state === "PENDING"
          ? "Activation en attente"
          : access.state === "SUSPENDED"
            ? "Abonnement suspendu"
            : access.state === "EXPIRED"
              ? "Abonnement expiré"
              : "Aucun abonnement actif";

    return (
      <>
        <StudentDashboard
          locale={lang}
          studentName={session.user.fullName}
          progressPercent={progress.percent}
          progressCompleted={progress.completedLessons}
          progressTotal={progress.totalLessons}
        />

        <div
          className={`fixed end-5 top-5 z-50 rounded-full border px-4 py-2 text-xs font-black shadow-xl shadow-black/20 backdrop-blur ${
            active
              ? "border-emerald-300/25 bg-emerald-400/10 text-emerald-300"
              : "border-violet/30 bg-board-900/90 text-violet"
          }`}
        >
          {active ? "● " : "◌ "}{statusLabel}
        </div>

        <Link
          href={`/${lang}/courses`}
          className={`fixed bottom-5 end-5 z-50 rounded-full px-5 py-3 text-sm font-black shadow-xl shadow-black/25 ${
            active
              ? "bg-accent text-board-900"
              : "border border-violet/30 bg-board-800 text-chalk"
          }`}
        >
          {active
            ? lang === "ar" ? "دروسي" : "Mes cours"
            : lang === "ar" ? "حالة الاشتراك" : "État de l’abonnement"}
        </Link>
      </>
    );
  } catch {
    redirect(`/${lang}/login`);
  }
}
