import { notFound } from "next/navigation";

import { SimpleContentPage } from "@/components/simple-content-page";
import { getLegalPageContent } from "@/lib/content/get-content";
import { isLocale } from "@/lib/i18n/config";

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const page = getLegalPageContent(locale, "terms");
  if (!page) notFound();

  return (
    <SimpleContentPage eyebrow="Legal" title={page.title} intro="">
      <p>{page.body}</p>
    </SimpleContentPage>
  );
}
