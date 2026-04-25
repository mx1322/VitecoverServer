import { notFound } from "next/navigation";

import { QuotePageContent } from "@/app/quote/page";
import { isLocale } from "@/lib/i18n";

export default async function LocalizedQuotePage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ product?: string }>;
}) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  return <QuotePageContent locale={lang} searchParams={searchParams} />;
}
