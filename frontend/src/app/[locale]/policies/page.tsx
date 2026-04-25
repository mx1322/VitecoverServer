import { notFound } from "next/navigation";

import { PoliciesPageContent } from "@/app/policies/page";
import { isLocale } from "@/lib/i18n";

export default async function LocalizedPoliciesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return <PoliciesPageContent locale={locale} />;
}
