import Link from "next/link";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getAuthenticatedSession, SESSION_COOKIE_NAME } from "@/lib/auth/session";
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

    return (
      <>
        <StudentDashboard locale={lang} studentName={session.user.fullName} />
        <Link
          href={`/${lang}/courses`}
          className="fixed bottom-5 end-5 z-50 rounded-full bg-accent px-5 py-3 text-sm font-black text-board-900 shadow-xl shadow-black/25"
        >
          {lang === "ar" ? "دروسي" : "Mes cours"}
        </Link>
      </>
    );
  } catch {
    redirect(`/${lang}/login`);
  }
}
