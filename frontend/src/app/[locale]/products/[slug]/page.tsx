import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getProductContent } from "@/lib/content/get-content";
import { getProductBySlug } from "@/lib/directus/products";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { buildLocaleMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) {
    return {};
  }

  const product = await getProductBySlug(slug);
  const content = product ? getProductContent(locale as Locale, product.code) : null;

  if (!product || !content) {
    return buildLocaleMetadata(`/products/${slug}`, locale, {
      title: "Product | Vitecover",
      description: "Localized product details",
    });
  }

  return buildLocaleMetadata(`/products/${slug}`, locale, {
    title: content.seoTitle ?? content.title,
    description: content.seoDescription ?? content.shortDescription,
  });
}

export default async function ProductDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const [dictionary, product] = await Promise.all([getDictionary(locale), getProductBySlug(slug)]);

  if (!product) {
    notFound();
  }

  const content = getProductContent(locale as Locale, product.code) ?? getProductContent(locale as Locale, product.slug);

  if (!content) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-4xl font-semibold">{content.title}</h1>
      <p className="mt-3 text-lg text-[var(--muted)]">{content.shortDescription}</p>
      <p className="mt-6 whitespace-pre-line text-sm leading-7 text-[var(--muted)]">{content.longDescription}</p>
      <p className="mt-6 text-sm font-medium">{dictionary.products.from} {product.basePriceFrom ? `${product.basePriceFrom} €` : "—"}</p>
      <Link href={`/${locale}/quote`} className="mt-8 inline-block rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--ink)]">{dictionary.cta.getQuote}</Link>
    </main>
  );
}
