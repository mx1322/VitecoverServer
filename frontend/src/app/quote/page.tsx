import { InfoCard } from "@/components/info-card";

const quoteSteps = [
  "Choose the short-term product",
  "Sign in with Google or native account",
  "Select or create a vehicle",
  "Select or create a driver",
  "Set coverage start and end time",
  "Review pricing and continue to payment",
];

export default function QuotePage() {
  return (
    <main className="section-wrap py-16">
      <p className="eyebrow">Quote flow foundation</p>
      <h1 className="mt-4 text-4xl font-semibold text-[var(--ink)]">Quote flow skeleton</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--muted)]">
        This route is the placeholder for the main insurance journey. The first production
        version should split this flow into smaller steps while keeping the same overall
        order.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {quoteSteps.map((step, index) => (
          <InfoCard
            key={step}
            eyebrow={`Step ${index + 1}`}
            title={step}
          >
            This block will later become a dedicated form step or section connected to
            Directus-backed customer, driver, vehicle, and quote data.
          </InfoCard>
        ))}
      </div>
    </main>
  );
}
