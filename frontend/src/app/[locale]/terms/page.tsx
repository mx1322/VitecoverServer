import { notFound } from "next/navigation";

import { TermsPageContent } from "@/app/terms/page";
import { isLocale } from "@/lib/i18n";

export default async function LocalizedTermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return <TermsPageContent locale={locale} />;
}
