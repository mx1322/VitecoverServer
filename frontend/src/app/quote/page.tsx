import { FaqLinkPanel } from "@/components/faq-link-panel";
import { QuoteForm } from "@/components/quote-form";
import { getFaqByTag } from "@/lib/faq";
import type { QuoteProductOption } from "@/lib/directus-admin";

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
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const params = await searchParams;
  const requestedProduct = params.product?.trim().toUpperCase();
  const initialProductCode = initialProducts.some((item) => item.code === requestedProduct)
    ? requestedProduct
    : initialProducts[0]?.code;

  return (
    <main className="section-wrap py-16">
      <p className="eyebrow">Temporary auto checkout</p>
      <h1 className="mt-4 text-4xl font-semibold text-[var(--ink)]">Get insured in 4 simple steps.</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--muted)]">
        Choose product and duration, fill in vehicle and driver details, confirm payment, then
        receive your policy by email after review.
      </p>

      <div className="mt-10">
        <QuoteForm products={initialProducts} initialProductCode={initialProductCode} />
      </div>

      <div className="mt-10">
        <FaqLinkPanel
          title="Need help before payment?"
          intro="Use these quick answers to avoid drop-off during checkout and find full details when needed."
          items={getFaqByTag("quote").slice(0, 3)}
        />
      </div>
    </main>
  );
}
