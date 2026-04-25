import Link from "next/link";
import { notFound } from "next/navigation";

import { getProducts } from "@/lib/directus/products";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [dictionary, products] = await Promise.all([getDictionary(locale), getProducts(locale as Locale)]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-semibold">{dictionary.products.title}</h1>
      <p className="mt-2 text-[var(--muted)]">{dictionary.products.intro}</p>

      {products.length === 0 ? <p className="mt-8 rounded-2xl border p-6 text-sm text-[var(--muted)]">{dictionary.products.noData}</p> : (
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <article key={product.id} className="rounded-2xl border bg-white/90 p-5">
              <h2 className="text-xl font-semibold">{product.title}</h2>
              <p className="mt-2 text-sm text-[var(--muted)]">{product.shortDescription}</p>
              <p className="mt-3 text-sm font-medium">{dictionary.products.from} {product.basePriceFrom ? `${product.basePriceFrom} €` : "—"}</p>
              <Link className="mt-4 inline-block text-sm font-semibold text-[var(--ink)] underline" href={`/${locale}/products/${product.slug}`}>{dictionary.products.viewDetail}</Link>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
