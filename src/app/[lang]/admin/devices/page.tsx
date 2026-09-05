import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { StudentDevicesAdminClient } from "@/components/admin/StudentDevicesAdminClient";
import { getAuthenticatedSession, SESSION_COOKIE_NAME } from "@/lib/auth/session";

export default async function AdminDevicesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang === "fr" ? "fr" : "ar";
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await getAuthenticatedSession(token) : null;

  if (!session || session.user.role !== "ADMIN") {
    redirect(`/${locale}/login`);
  }

  return (
    <div className="relative">
      <div className="fixed right-4 top-4 z-50 hidden gap-2 lg:flex" dir={locale === "ar" ? "rtl" : "ltr"}>
        <Link
          href={`/${locale}/admin/students`}
          className="rounded-full border border-white/15 bg-board-900/90 px-4 py-2 text-sm font-semibold text-chalk shadow-lg backdrop-blur transition hover:bg-white/10"
        >
          {locale === "ar" ? "إدارة التلاميذ" : "Gestion des élèves"}
        </Link>
        <Link
          href={`/${locale}/admin/academic`}
          className="rounded-full border border-white/15 bg-board-900/90 px-4 py-2 text-sm font-semibold text-chalk shadow-lg backdrop-blur transition hover:bg-white/10"
        >
          {locale === "ar" ? "الإدارة الأكاديمية" : "Administration académique"}
        </Link>
      </div>
      <StudentDevicesAdminClient lang={locale} />
    </div>
  );
}
