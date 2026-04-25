import { notFound } from "next/navigation";

import { TermsPageContent } from "@/app/terms/page";
import { isLocale } from "@/lib/i18n";

export default async function LocalizedTermsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  return <TermsPageContent locale={lang} />;
}
