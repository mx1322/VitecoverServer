import { notFound } from "next/navigation";

import { LegalPageContent } from "@/app/legal/page";
import { isLocale } from "@/lib/i18n";

export default async function LocalizedLegalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return <LegalPageContent locale={locale} />;
}
