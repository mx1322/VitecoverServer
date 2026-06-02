import { FaqLinkPanel } from "@/components/faq-link-panel";
import { QuoteForm } from "@/components/quote-form";
import { listOrderableProducts, type QuoteProductOption } from "@/lib/directus-admin";
import { getFaqByTag } from "@/lib/faq";
import { getRequestLocale } from "@/lib/i18n/server";
import { t } from "@/lib/i18n/translations";

const initialProducts: QuoteProductOption[] = [
  { code: "AUTOMOBILE", name: "Assurance automobile temporaire", description: "Produit temporaire pour automobile.", minDurationDays: 1, maxDurationDays: 90 },
  { code: "UTILITAIRE", name: "Assurance vehicule utilitaire temporaire", description: "Produit temporaire pour vehicule utilitaire de 3.5 tonnes ou moins.", minDurationDays: 1, maxDurationDays: 15 },
  { code: "POIDS_LOURDS", name: "Assurance poids lourds temporaire", description: "Produit temporaire pour poids lourds.", minDurationDays: 1, maxDurationDays: 15 },
  { code: "AUTOCAR_BUS", name: "Assurance autocar / bus temporaire", description: "Produit temporaire pour autocar et bus.", minDurationDays: 1, maxDurationDays: 15 },
  { code: "CAMPING_CAR", name: "Assurance camping-car temporaire", description: "Produit temporaire pour camping-car.", minDurationDays: 1, maxDurationDays: 90 },
];

function getInitialCoverageStartAt(date = new Date()): string {
  const startAt = new Date(date);
  startAt.setDate(startAt.getDate() + 1);
  startAt.setMinutes(0, 0, 0);
  startAt.setHours(startAt.getHours() + 1);

  const year = startAt.getFullYear();
  const month = String(startAt.getMonth() + 1).padStart(2, "0");
  const day = String(startAt.getDate()).padStart(2, "0");
  const hour = String(startAt.getHours()).padStart(2, "0");
  return `${year}-${month}-${day}T${hour}:00`;
}

export async function CheckoutQuotePage({ searchParams }: { searchParams: Promise<{ product?: string }> }) {
  const locale = await getRequestLocale();
  const params = await searchParams;
  const backendProducts = await listOrderableProducts().catch(() => []);
  const products = backendProducts.length > 0 ? backendProducts : initialProducts;
  const requestedProduct = params.product?.trim().toUpperCase();
  const initialProductCode = products.some((item) => item.code === requestedProduct) ? requestedProduct : products[0]?.code;
  const initialCoverageStartAt = getInitialCoverageStartAt();

  return (
    <main className="section-wrap py-16">
      <p className="eyebrow">{t(locale, "Temporary auto checkout")}</p>
      <h1 className="mt-4 text-4xl font-semibold text-[var(--ink)]">{t(locale, "Get insured in 4 simple steps.")}</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--muted)]">{t(locale, "Choose product and duration, fill in vehicle and driver details, confirm payment, then receive your policy by email after review.")}</p>
      <div className="mt-10"><QuoteForm products={products} initialProductCode={initialProductCode} initialCoverageStartAt={initialCoverageStartAt} locale={locale} /></div>
      <div className="mt-10"><FaqLinkPanel title={t(locale, "Need help before payment?")} intro={t(locale, "Use these quick answers to avoid drop-off during checkout and find full details when needed.")} items={getFaqByTag("quote", locale).slice(0, 3)} locale={locale} /></div>
    </main>
  );
}
