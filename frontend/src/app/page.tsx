import Link from "next/link";

import { InfoCard } from "@/components/info-card";

export default async function HomePage() {
  return (
    <main className="pb-20">
      <section className="section-wrap grid gap-10 px-6 py-16 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-24">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-3 rounded-full border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.72)] px-4 py-2 text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
            <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
            Temporary auto insurance
          </div>

          <h1
            className="mt-6 max-w-4xl text-5xl font-semibold leading-[0.98] tracking-tight text-[var(--ink)] md:text-7xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Get insured online in minutes, for exactly the period you need.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
            One product, one clear journey, and no unnecessary detours. This site is built
            to help drivers buy temporary car insurance quickly and move straight to policy
            delivery.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/quote"
              className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--ink)] transition hover:translate-y-[-1px]"
            >
              Get insured
            </Link>
            <Link
              href="/policies"
              className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/35"
            >
              Access my policy
            </Link>
          </div>

          <div className="mt-10 grid gap-3 text-sm text-[var(--muted)] md:grid-cols-3">
            <div className="rounded-2xl border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.86)] px-4 py-4 shadow-[0_14px_30px_rgba(22,36,58,0.06)]">
              100% online subscription
            </div>
            <div className="rounded-2xl border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.86)] px-4 py-4 shadow-[0_14px_30px_rgba(22,36,58,0.06)]">
              Coverage from 1 to 90 days
            </div>
            <div className="rounded-2xl border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.86)] px-4 py-4 shadow-[0_14px_30px_rgba(22,36,58,0.06)]">
              Policy documents available after purchase
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-[rgba(22,36,58,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(255,244,229,0.9))] p-6 shadow-[0_28px_70px_rgba(22,36,58,0.1)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
            Order flow
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-[var(--ink)]">Three quick steps</h2>
          <div className="mt-6 space-y-4">
            {[
              {
                step: "01",
                title: "Enter your coverage dates",
                body: "Choose the exact start and end time for the temporary insurance period.",
              },
              {
                step: "02",
                title: "Add the vehicle and driver",
                body: "Fill in the core information needed to evaluate and issue the policy.",
              },
              {
                step: "03",
                title: "Review and confirm",
                body: "Check the quote, continue to payment, and retrieve the policy documents.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-[24px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.88)] p-5"
              >
                <div className="flex items-start gap-4">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-semibold text-[var(--ink)]">
                    {item.step}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--ink)]">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-wrap grid gap-6 py-8 md:grid-cols-3">
        <InfoCard eyebrow="Why us" title="Focused product">
          No catalogue of unrelated products. The whole experience is designed around
          temporary car insurance only.
        </InfoCard>
        <InfoCard eyebrow="Simple" title="Low-friction purchase">
          Clear calls to action, fewer choices, and a quote-first flow make ordering faster
          for first-time visitors.
        </InfoCard>
        <InfoCard eyebrow="Support" title="Policy access after checkout">
          Customers can come back later to retrieve policy documents instead of depending on
          email alone.
        </InfoCard>
      </section>

      <section className="section-wrap py-10">
        <div className="flex flex-col gap-4 rounded-[28px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.88)] px-6 py-6 shadow-[0_18px_50px_rgba(22,36,58,0.08)] md:flex-row md:items-center md:justify-between">
          <div>
            <p className="eyebrow">Ready to order</p>
            <h2 className="mt-3 text-2xl font-semibold text-[var(--ink)]">
              Start the temporary auto insurance flow now.
            </h2>
          </div>
          <Link
            href="/quote"
            className="inline-flex w-full items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--ink)] transition hover:translate-y-[-1px] md:w-auto"
          >
            Continue to quote
          </Link>
        </div>
      </section>
    </main>
  );
}
