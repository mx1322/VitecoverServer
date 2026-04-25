import { notFound } from "next/navigation";

import { PoliciesPageContent } from "@/app/policies/page";
import { isLocale } from "@/lib/i18n";

export default async function LocalizedPoliciesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  return <PoliciesPageContent locale={lang} />;
}
