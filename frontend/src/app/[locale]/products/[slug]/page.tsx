import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getProductContent } from "@/lib/content/get-content";
import { getProductBySlug } from "@/lib/directus/products";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { buildLocaleMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) {
    return {};
  }

  const product = await getProductBySlug(slug);
  const localized = product ? getProductContent(locale, product.code) : null;

  return buildLocaleMetadata(`/products/${slug}`, locale, {
    title: localized?.seoTitle ?? localized?.title ?? "Product | Vitecover",
    description: localized?.seoDescription ?? localized?.shortDescription ?? "Localized product details",
  });
}

export default async function ProductDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const [dictionary, product] = await Promise.all([getDictionary(locale), getProductBySlug(slug)]);

  if (!product) {
    notFound();
  }

  const localized = getProductContent(locale, product.code);
  if (!localized) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-4xl font-semibold">{localized.title}</h1>
      <p className="mt-3 text-lg text-[var(--muted)]">{localized.shortDescription}</p>
      <p className="mt-6 whitespace-pre-line text-sm leading-7 text-[var(--muted)]">{localized.longDescription}</p>
      {localized.highlights?.length ? (
        <ul className="mt-6 list-inside list-disc space-y-1 text-sm text-[var(--muted)]">
          {localized.highlights.map((item) => <li key={item}>{item}</li>)}
        </ul>
      ) : null}
      <p className="mt-6 text-sm font-medium">{dictionary.products.from} {product.basePriceFrom ? `${product.basePriceFrom} €` : "—"}</p>
      <Link href={`/${locale}/quote`} className="mt-8 inline-block rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--ink)]">{dictionary.cta.getQuote}</Link>
    </main>
  );
}
