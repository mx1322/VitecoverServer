import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SimpleContentPage } from "@/components/simple-content-page";
import { getLegalContent, getLegalPageContent } from "@/lib/content/get-content";
import { isLocale } from "@/lib/i18n/config";
import { buildLocaleMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const page = getLegalPageContent(locale, "regulatory");
  return buildLocaleMetadata("/regulatory", locale, {
    title: page?.seoTitle ?? page?.title ?? "Regulatory information | Vitecover",
    description: page?.seoDescription ?? page?.body ?? "Regulatory information.",
  });
}

export default async function RegulatoryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const legal = getLegalContent(locale);
  const page = getLegalPageContent(locale, "regulatory");
  if (!page) notFound();

  return (
    <SimpleContentPage eyebrow={legal.hub?.title ?? "Legal"} title={page.title} intro={page.seoDescription ?? ""}>
      <p>{page.body}</p>
    </SimpleContentPage>
  );
}
