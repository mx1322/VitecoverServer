import { notFound } from "next/navigation";

import { LegalPageContent } from "@/app/legal/page";
import { isLocale } from "@/lib/i18n";

export default async function LocalizedLegalPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  return <LegalPageContent locale={lang} />;
}
