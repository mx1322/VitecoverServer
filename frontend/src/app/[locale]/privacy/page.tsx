import { notFound } from "next/navigation";

import { PrivacyPageContent } from "@/app/privacy/page";
import { isLocale } from "@/lib/i18n";

export default async function LocalizedPrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return <PrivacyPageContent locale={locale} />;
}
