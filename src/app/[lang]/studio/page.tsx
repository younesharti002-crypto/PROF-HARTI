import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ContentStudio } from "@/components/content/ContentStudio";
import { getAuthenticatedSession, SESSION_COOKIE_NAME } from "@/lib/auth/session";

export default async function StudioPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = lang === "fr" ? "fr" : "ar";
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await getAuthenticatedSession(token) : null;

  if (!session || !["ADMIN", "TEACHER"].includes(session.user.role)) {
    redirect(`/${locale}/login`);
  }

  return (
    <>
      <ContentStudio lang={locale} />
      <Link
        href={`/${locale}/studio/live`}
        className="fixed bottom-5 start-5 z-50 rounded-full bg-violet px-5 py-3 text-sm font-black text-white shadow-xl shadow-black/25"
      >
        {locale === "ar" ? "الحصص المباشرة والتسجيلات" : "Lives & replays"}
      </Link>
    </>
  );
}
