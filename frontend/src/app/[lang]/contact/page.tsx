import { notFound } from "next/navigation";

import { ContactPageContent } from "@/app/contact/page";
import { isLocale } from "@/lib/i18n";

export default async function LocalizedContactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  return <ContactPageContent locale={lang} />;
}
