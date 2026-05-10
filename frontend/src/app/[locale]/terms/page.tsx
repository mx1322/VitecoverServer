import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SimpleContentPage } from "@/components/simple-content-page";
import { getLegalContent, getLegalPageContent } from "@/lib/content/get-content";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { buildLocaleMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const [page, dictionary] = await Promise.all([getLegalPageContent(locale, "terms"), getDictionary(locale)]);
  return buildLocaleMetadata("/terms", locale, {
    title: page?.seoTitle ?? page?.title ?? dictionary.legal.termsSeoTitle,
    description: page?.seoDescription ?? page?.body ?? dictionary.legal.termsSeoDescription,
  });
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [legal, page, dictionary] = await Promise.all([
    getLegalContent(locale),
    getLegalPageContent(locale, "terms"),
    getDictionary(locale),
  ]);
  if (!page) notFound();

  return (
    <SimpleContentPage eyebrow={legal.hub?.title ?? dictionary.legal.hubTitle} title={page.title} intro={page.seoDescription ?? ""}>
      <p>{page.body}</p>
    </SimpleContentPage>
  );
}
