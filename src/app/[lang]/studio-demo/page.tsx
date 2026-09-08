import { TeacherTrialStudio } from "@/components/demo/TeacherTrialStudio";

export default async function StudioDemoPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = lang === "fr" ? "fr" : "ar";

  return <TeacherTrialStudio locale={locale} />;
}
