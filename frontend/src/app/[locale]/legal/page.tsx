import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getLegalContent } from "@/lib/content/get-content";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { buildLocaleMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) {
    return {};
  }

  const [legal, dictionary] = await Promise.all([getLegalContent(locale), getDictionary(locale)]);
  const hub = legal.hub;

  return buildLocaleMetadata("/legal", locale, {
    title: hub?.seoTitle ?? hub?.title ?? dictionary.legal.hubSeoTitle,
    description: hub?.seoDescription ?? hub?.body ?? dictionary.legal.hubSeoDescription,
  });
}

export default async function LegalHubPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [legal, dictionary] = await Promise.all([getLegalContent(locale), getDictionary(locale)]);
  const hub = legal.hub;

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-semibold">{hub?.title ?? dictionary.legal.hubTitle}</h1>
      {hub?.body ? <p className="mt-3 text-sm text-[var(--muted)]">{hub.body}</p> : null}
      <div className="mt-6 space-y-3">
        {legal.privacy ? <Link className="block underline" href={`/${locale}/privacy`}>{legal.privacy.title}</Link> : null}
        {legal.terms ? <Link className="block underline" href={`/${locale}/terms`}>{legal.terms.title}</Link> : null}
        {legal.regulatory ? <Link className="block underline" href={`/${locale}/regulatory`}>{legal.regulatory.title}</Link> : null}
      </div>
    </main>
  );
}
