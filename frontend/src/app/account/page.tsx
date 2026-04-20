import { AccountSummaryCard } from "@/components/account/account-summary-card";

const summaryCards = [
  { label: "Active Orders", value: "2" },
  { label: "Saved Drivers", value: "3" },
  { label: "Saved Vehicles", value: "4" },
];

const recentOrders = [
  {
    product: "Passenger Car",
    status: "Active",
    meta: "Starts 12 Aug 2026",
  },
  {
    product: "Light Commercial Van",
    status: "Pending review",
    meta: "Starts 18 Aug 2026",
  },
  {
    product: "Motorhome",
    status: "Expired",
    meta: "Ended 02 Jul 2026",
  },
];

const quickActions = [
  "Start new quote",
  "Add a new driver",
  "Add a new vehicle",
];

function StatusBadge({ status }: { status: string }) {
  const expired = status === "Expired";

  return (
    <span
      className={
        expired
          ? "rounded-full bg-[rgba(234,237,241,1)] px-3 py-1.5 text-xs font-semibold text-[var(--ink)]"
          : "rounded-full bg-[rgba(248,179,71,0.16)] px-3 py-1.5 text-xs font-semibold text-[var(--ink)]"
      }
    >
      {status}
    </span>
  );
}

export default function AccountOverviewPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] p-6 shadow-[0_18px_50px_rgba(22,36,58,0.05)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
          Overview
        </p>
        <div className="mt-3 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight text-[var(--ink)] md:text-4xl">
              Welcome back
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Manage orders, drivers, vehicles and account settings from one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {quickActions.slice(0, 3).map((action) => (
              <button
                key={action}
                className="rounded-full border border-[rgba(22,36,58,0.08)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--ink)] transition hover:bg-[rgba(22,36,58,0.03)]"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <AccountSummaryCard key={card.label} label={card.label} value={card.value} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)]">
        <article className="rounded-[28px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] p-6 shadow-[0_18px_50px_rgba(22,36,58,0.05)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
            Recent Orders
          </p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--ink)]">
            Latest activity
          </h3>
          <div className="mt-6 space-y-4">
            {recentOrders.map((item) => (
              <div
                key={`${item.product}-${item.status}`}
                className="flex flex-col gap-3 rounded-[22px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.82)] px-4 py-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-semibold text-[var(--ink)]">{item.product}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{item.meta}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={item.status} />
                  <button className="rounded-full border border-[rgba(22,36,58,0.08)] px-3 py-1.5 text-xs font-medium text-[var(--ink)] transition hover:bg-[rgba(22,36,58,0.03)]">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[28px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] p-6 shadow-[0_18px_50px_rgba(22,36,58,0.05)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
            Quick Actions
          </p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--ink)]">
            Manage faster
          </h3>
          <div className="mt-6 space-y-3">
            {quickActions.map((action) => (
              <button
                key={action}
                className="flex w-full items-center justify-between rounded-[18px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.82)] px-4 py-4 text-left text-sm font-medium text-[var(--ink)] transition hover:bg-[rgba(22,36,58,0.03)]"
              >
                <span>{action}</span>
                <span className="text-lg text-[var(--muted)]">›</span>
              </button>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
