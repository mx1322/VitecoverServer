import { notFound } from "next/navigation";

import { RegulatoryPageContent } from "@/app/regulatory/page";
import { isLocale } from "@/lib/i18n";

export default async function LocalizedRegulatoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return <RegulatoryPageContent locale={locale} />;
}
