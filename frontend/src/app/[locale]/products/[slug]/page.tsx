import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getProductBySlug } from "@/lib/directus/products";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) {
    return {};
  }

  const product = await getProductBySlug(slug, locale as Locale);
  if (!product) {
    return {};
  }

  const title = product.seoTitle ?? product.title;
  const description = product.seoDescription ?? product.shortDescription;

  return {
    title,
    description,
    alternates: {
      languages: Object.fromEntries(locales.map((item) => [item, `/${item}/products/${slug}`])),
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const [dictionary, product] = await Promise.all([getDictionary(locale), getProductBySlug(slug, locale as Locale)]);

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-4xl font-semibold">{product.title}</h1>
      <p className="mt-3 text-lg text-[var(--muted)]">{product.shortDescription}</p>
      <p className="mt-6 text-sm leading-7 text-[var(--muted)] whitespace-pre-line">{product.longDescription}</p>
      <p className="mt-6 text-sm font-medium">{dictionary.products.from} {product.basePriceFrom ? `${product.basePriceFrom} €` : "—"}</p>
      <Link href={`/${locale}/quote`} className="mt-8 inline-block rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--ink)]">{dictionary.cta.getQuote}</Link>
    </main>
  );
}
