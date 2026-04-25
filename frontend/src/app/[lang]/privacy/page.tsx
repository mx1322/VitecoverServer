import { notFound } from "next/navigation";

import { PrivacyPageContent } from "@/app/privacy/page";
import { isLocale } from "@/lib/i18n";

export default async function LocalizedPrivacyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  return <PrivacyPageContent locale={lang} />;
}
