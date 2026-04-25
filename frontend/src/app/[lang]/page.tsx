import { notFound } from "next/navigation";

import { HomePageContent } from "@/components/home-page-content";
import { isLocale } from "@/lib/i18n";

export default async function LocalizedHomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  return <HomePageContent locale={lang} />;
}
