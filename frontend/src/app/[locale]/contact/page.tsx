import { notFound } from "next/navigation";

import { ContactPageContent } from "@/app/contact/page";
import { isLocale } from "@/lib/i18n";

export default async function LocalizedContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return <ContactPageContent locale={locale} />;
}
