import { notFound } from "next/navigation";

import { FaqPageContent } from "@/app/faq/page";
import { isLocale } from "@/lib/i18n";

export default async function LocalizedFaqPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  return <FaqPageContent locale={lang} />;
}
