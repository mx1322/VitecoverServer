import Link from "next/link";

import { InfoCard } from "@/components/info-card";

export default async function HomePage() {
  return (
    <main className="pb-20">
      <section className="section-wrap px-6 py-16 md:py-24">
        <div className="relative z-10">
          <p className="eyebrow">Temporary car insurance</p>
          <h1
            className="mt-5 max-w-4xl text-5xl font-semibold leading-[1.02] tracking-tight text-white md:text-7xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            One simple flow for temporary vehicle insurance.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
            Built for one product only: assurance auto temporaire. The homepage stays
            focused on getting people into the quote flow quickly.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/quote"
              className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--ink)] transition hover:translate-y-[-1px]"
            >
              Start a Quote
            </Link>
            <Link
              href="/policies"
              className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/35"
            >
              View Policies
            </Link>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              { label: "Product", value: "Temporary auto insurance" },
              { label: "Flow", value: "Vehicle, driver, dates, quote" },
              { label: "Delivery", value: "Policy PDF + portal access" },
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
      </section>

      <section className="section-wrap grid gap-6 py-8 md:grid-cols-3">
        <InfoCard eyebrow="Step 1" title="Choose the dates">
          Pick the temporary coverage start and end time before anything else.
        </InfoCard>
        <InfoCard eyebrow="Step 2" title="Add the vehicle and driver">
          Capture the minimum information needed to price a temporary auto policy.
        </InfoCard>
        <InfoCard eyebrow="Step 3" title="Get the quote">
          Review the premium, confirm the details, and move toward policy issuance.
        </InfoCard>
      </section>
    </main>
  );
}
