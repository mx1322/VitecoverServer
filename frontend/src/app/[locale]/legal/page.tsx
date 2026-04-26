import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getLegalContent } from "@/lib/content/get-content";
import { isLocale } from "@/lib/i18n/config";
import { buildLocaleMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) {
    return {};
  }

  return buildLocaleMetadata("/legal", locale, {
    title: "Legal information | Vitecover",
    description: "Legal and regulatory information.",
  });
}

export default async function LegalHubPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const legal = getLegalContent(locale);

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-semibold">Legal</h1>
      <div className="mt-6 space-y-3">
        {legal.privacy ? <Link className="block underline" href={`/${locale}/privacy`}>{legal.privacy.title}</Link> : null}
        {legal.terms ? <Link className="block underline" href={`/${locale}/terms`}>{legal.terms.title}</Link> : null}
        {legal.regulatory ? <Link className="block underline" href={`/${locale}/regulatory`}>{legal.regulatory.title}</Link> : null}
      </div>
    </main>
  );
}
