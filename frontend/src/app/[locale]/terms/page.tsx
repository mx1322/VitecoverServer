import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SimpleContentPage } from "@/components/simple-content-page";
import { getLegalContent, getLegalPageContent } from "@/lib/content/get-content";
import { isLocale } from "@/lib/i18n/config";
import { buildLocaleMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const page = getLegalPageContent(locale, "terms");
  return buildLocaleMetadata("/terms", locale, {
    title: page?.seoTitle ?? page?.title ?? "Terms and conditions | Vitecover",
    description: page?.seoDescription ?? page?.body ?? "Terms and conditions.",
  });
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const legal = getLegalContent(locale);
  const page = getLegalPageContent(locale, "terms");
  if (!page) notFound();

  return (
    <SimpleContentPage eyebrow={legal.hub?.title ?? "Legal"} title={page.title} intro={page.seoDescription ?? ""}>
      <p>{page.body}</p>
    </SimpleContentPage>
  );
}
