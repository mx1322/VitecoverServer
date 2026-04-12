import { QuoteForm } from "@/components/quote-form";
import type { QuoteProductOption } from "@/lib/directus-admin";

const initialProducts: QuoteProductOption[] = [
  {
    code: "AUTOMOBILE",
    name: "Assurance automobile temporaire",
    description: "Produit temporaire pour automobile.",
    minDurationDays: 1,
    maxDurationDays: 90,
  },
];

export default function QuotePage() {
  return (
    <main className="section-wrap py-16">
      <p className="eyebrow">Temporary auto checkout</p>
      <h1 className="mt-4 text-4xl font-semibold text-[var(--ink)]">
        Confirm the cover, the customer, the vehicle, and the driver one step at a time.
      </h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--muted)]">
        The flow stays focused on one decision per screen. We start by confirming the temporary
        cover window and the premium, then move through the account, vehicle, driver, payment,
        and final order success state.
      </p>

      <div className="mt-10">
        <QuoteForm products={initialProducts} />
      </div>
    </main>
  );
}
