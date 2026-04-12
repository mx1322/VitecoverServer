import Link from "next/link";

import { InfoCard } from "@/components/info-card";
import { getActiveInsuranceProducts } from "@/lib/directus";

export default async function HomePage() {
  const products = await getActiveInsuranceProducts();

  return (
    <main className="pb-20">
      <section className="section-wrap grid gap-10 px-6 py-16 md:grid-cols-[1.15fr_0.85fr] md:py-24">
        <div className="relative z-10">
          <p className="eyebrow">France and cross-border transport</p>
          <h1
            className="mt-5 max-w-3xl text-5xl font-semibold leading-[1.02] tracking-tight text-white md:text-7xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Temporary vehicle insurance built for speed, review, and policy delivery.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
            This frontend foundation is designed to be validated locally first, then
            deployed with the same configuration path to AWS, with room for professional
            transport customers, overseas pricing, and future VTC or taxi products.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/quote"
              className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--ink)] transition hover:translate-y-[-1px]"
            >
              Start Quote Flow
            </Link>
            <Link
              href="/policies"
              className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/35"
            >
              View Policy Area
            </Link>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Product Scope", value: "Temporary Motor" },
              { label: "Primary Audience", value: "Professional + Retail" },
              { label: "Document Delivery", value: "Email + Customer Portal" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-[22px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-5"
              >
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
                  {stat.label}
                </p>
                <p className="mt-2 text-lg font-semibold text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-5">
          <InfoCard eyebrow="Phase 1" title="What this frontend already assumes">
            <ul className="space-y-2">
              <li>Quote flow begins with product, vehicle, driver, and effective time.</li>
              <li>Payment success is followed by manual admin review.</li>
              <li>Customers receive a PDF policy and can later access it again.</li>
            </ul>
          </InfoCard>

          <InfoCard eyebrow="PDF strategy" title="Email delivery is useful, but not the only layer">
            <p>
              The recommended model is to email the policy PDF to the customer and also
              keep a private stored copy for the customer portal, support workflows, and
              future re-download.
            </p>
          </InfoCard>
        </div>
      </section>

      <section className="section-wrap grid gap-6 py-8 md:grid-cols-3">
        <InfoCard eyebrow="Customer flow" title="Quote to policy">
          Product selection, account sign-in, vehicle capture, driver capture, payment,
          review, and final policy issuance.
        </InfoCard>
        <InfoCard eyebrow="Admin flow" title="Manual validation">
          Orders stay visible for review before a final policy is considered complete and
          delivered.
        </InfoCard>
        <InfoCard eyebrow="Storage" title="Private documents">
          PDF policies should stay in private storage even if they are also delivered by
          email.
        </InfoCard>
      </section>

      <section className="section-wrap py-12">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Directus-ready</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Product data hook</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-[var(--muted)]">
            The page already includes a Directus SDK helper. Once product records are seeded
            with an `active` status, they can be listed here without changing the overall
            app structure.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {products.length > 0 ? (
            products.map((product) => (
              <InfoCard key={product.id} eyebrow={product.product_family} title={product.name}>
                <p>{product.description || "No product description provided yet."}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                  Segment: {product.customer_segment}
                </p>
              </InfoCard>
            ))
          ) : (
            <InfoCard eyebrow="Seed data pending" title="No active products returned yet">
              Once `insurance_products` is populated in Directus, this section can become a
              live product teaser block on the homepage.
            </InfoCard>
          )}
        </div>
      </section>
    </main>
  );
}
