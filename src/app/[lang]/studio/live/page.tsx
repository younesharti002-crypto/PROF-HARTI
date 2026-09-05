import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LiveStudio } from "@/components/live/LiveStudio";
import { getAuthenticatedSession, SESSION_COOKIE_NAME } from "@/lib/auth/session";

export default async function LiveStudioPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = lang === "fr" ? "fr" : "ar";
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await getAuthenticatedSession(token) : null;

  if (!session || !["ADMIN", "TEACHER"].includes(session.user.role)) {
    redirect(`/${locale}/login`);
  }

  return (
    <div className="relative">
      <Link
        href={`/${locale}/admin/students`}
        className="fixed bottom-5 right-5 z-[70] rounded-full border border-accent/30 bg-accent px-5 py-3 text-sm font-black text-board-900 shadow-2xl transition hover:scale-[1.02]"
      >
        {locale === "ar" ? "إدارة التلاميذ" : "Gestion des élèves"}
      </Link>
      <LiveStudio lang={locale} />
    </div>
  );
}
