import Link from "next/link";

import { AccountSummaryCard } from "@/components/account/account-summary-card";

const summaryCards = [
  { label: "Active Policies", value: 2 },
  { label: "Saved Drivers", value: 3 },
  { label: "Saved Vehicles", value: 4 },
  { label: "Pending Documents", value: 1 },
];

const recentActivity = [
  {
    title: "Policy renewed",
    detail: "Passenger Car · Policy #PC-2049",
    date: "Apr 18, 2026",
  },
  {
    title: "Driver approved",
    detail: "Alex Martin is now approved",
    date: "Apr 16, 2026",
  },
  {
    title: "Document requested",
    detail: "Proof of address is required",
    date: "Apr 14, 2026",
  },
];

const quickActions = [
  { label: "View Policies", href: "/account/policies" },
  { label: "Manage Drivers", href: "/account/drivers" },
  { label: "Manage Vehicles", href: "/account/vehicles" },
  { label: "Upload Documents", href: "/account/documents" },
];

export default function AccountOverviewPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] p-6 shadow-[0_18px_50px_rgba(22,36,58,0.05)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
          Overview
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)] md:text-4xl">
          Welcome back
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
          Here&apos;s a quick snapshot of your account. Use the sidebar to open full details for
          policies, drivers, vehicles, documents, and settings.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <AccountSummaryCard key={card.label} label={card.label} value={card.value} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <article className="rounded-[28px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] p-6 shadow-[0_18px_50px_rgba(22,36,58,0.05)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
            Recent Activity
          </p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--ink)]">
            Latest updates
          </h3>
          <div className="mt-5 space-y-3">
            {recentActivity.map((activity) => (
              <div
                key={`${activity.title}-${activity.date}`}
                className="rounded-[20px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.82)] px-4 py-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-[var(--ink)]">{activity.title}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">{activity.detail}</p>
                  </div>
                  <span className="text-xs font-medium text-[var(--muted)]">{activity.date}</span>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[28px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] p-6 shadow-[0_18px_50px_rgba(22,36,58,0.05)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
            Quick Actions
          </p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--ink)]">Shortcuts</h3>
          <div className="mt-5 space-y-2">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex w-full items-center justify-between rounded-full border border-[rgba(22,36,58,0.08)] px-4 py-3 text-sm font-medium text-[var(--ink)] transition hover:bg-[rgba(22,36,58,0.03)]"
              >
                <span>{action.label}</span>
                <span aria-hidden>→</span>
              </Link>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
