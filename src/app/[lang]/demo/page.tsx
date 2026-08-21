import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { StudentDashboard } from "@/components/dashboard/StudentDashboard";

export default async function DemoPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return <StudentDashboard locale={lang} studentName={lang === "ar" ? "محمد" : "Mohamed"} demo />;
}
