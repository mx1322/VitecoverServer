import { notFound } from "next/navigation";

import { QuoteForm } from "@/components/quote-form";
import type { QuoteProductOption } from "@/lib/directus-admin";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

const initialProducts: QuoteProductOption[] = [
  {
    code: "AUTOMOBILE",
    name: "Assurance automobile temporaire",
    description: "Produit temporaire pour automobile.",
    minDurationDays: 1,
    maxDurationDays: 90,
  },
  {
    code: "UTILITAIRE",
    name: "Assurance vehicule utilitaire temporaire",
    description: "Produit temporaire pour vehicule utilitaire de 3.5 tonnes ou moins.",
    minDurationDays: 1,
    maxDurationDays: 15,
  },
  {
    code: "POIDS_LOURDS",
    name: "Assurance poids lourds temporaire",
    description: "Produit temporaire pour poids lourds.",
    minDurationDays: 1,
    maxDurationDays: 15,
  },
  {
    code: "AUTOCAR_BUS",
    name: "Assurance autocar / bus temporaire",
    description: "Produit temporaire pour autocar et bus.",
    minDurationDays: 1,
    maxDurationDays: 15,
  },
  {
    code: "CAMPING_CAR",
    name: "Assurance camping-car temporaire",
    description: "Produit temporaire pour camping-car.",
    minDurationDays: 1,
    maxDurationDays: 90,
  },
];

export default async function QuotePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ product?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [dictionary, query] = await Promise.all([getDictionary(locale), searchParams]);
  const requestedProduct = query.product?.trim().toUpperCase();
  const initialProductCode = initialProducts.some((item) => item.code === requestedProduct)
    ? requestedProduct
    : initialProducts[0]?.code;

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-semibold">{dictionary.quote.title}</h1>
      <p className="mt-3 text-[var(--muted)]">{dictionary.quote.intro}</p>
      <ol className="mt-8 grid gap-4 md:grid-cols-2">
        {dictionary.quote.steps.map((step, index) => (
          <li key={step} className="rounded-2xl border bg-white/90 p-5">
            <p className="text-xs uppercase text-[var(--muted)]">{dictionary.common.stepLabel} {index + 1}</p>
            <p className="mt-2 font-medium">{step}</p>
          </li>
        ))}
      </ol>
      <div className="mt-10">
        <QuoteForm products={initialProducts} initialProductCode={initialProductCode} />
      </div>
    </main>
  );
}
