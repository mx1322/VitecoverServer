import { notFound } from "next/navigation";

import { RegulatoryPageContent } from "@/app/regulatory/page";
import { isLocale } from "@/lib/i18n";

export default async function LocalizedRegulatoryPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  return <RegulatoryPageContent locale={lang} />;
}
