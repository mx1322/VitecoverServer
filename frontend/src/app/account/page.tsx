import { AccountSummaryCard } from "@/components/account/account-summary-card";
import {
  accountSummary,
  mockPolicies,
  quickActions,
} from "@/lib/account/mock-data";

function getStatusBadgeClass(status: string): string {
  if (status === "Active") {
    return "rounded-full bg-[rgba(255,179,71,0.16)] px-3 py-1.5 text-xs font-semibold text-[var(--ink)]";
  }

  if (status === "Pending review") {
    return "rounded-full bg-[rgba(31,183,166,0.12)] px-3 py-1.5 text-xs font-semibold text-[var(--accent-2)]";
  }

  return "rounded-full bg-[rgba(22,36,58,0.08)] px-3 py-1.5 text-xs font-semibold text-[var(--muted)]";
}

export default function AccountOverviewPage() {
  return (
    <>
      <div className="rounded-[28px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] p-6 shadow-[0_18px_50px_rgba(22,36,58,0.05)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
          Overview
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)]">
          Welcome back
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
          View your recent policies, manage saved drivers and vehicles, and keep your documents
          ready for faster checkout.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {accountSummary.map((item) => (
          <AccountSummaryCard key={item.label} label={item.label} value={item.value} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.9fr)]">
        <div className="rounded-[28px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] p-6 shadow-[0_18px_50px_rgba(22,36,58,0.05)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
            Recent Policies
          </p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--ink)]">
            Latest activity
          </h3>

          <div className="mt-6 space-y-4">
            {mockPolicies.map((policy) => (
              <div
                key={policy.id}
                className="flex items-center justify-between gap-4 rounded-[22px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.82)] px-4 py-4"
              >
                <div>
                  <p className="font-semibold text-[var(--ink)]">{policy.product}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">Starts {policy.startDate}</p>
                </div>
                <span className={getStatusBadgeClass(policy.status)}>{policy.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] p-6 shadow-[0_18px_50px_rgba(22,36,58,0.05)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
            Quick Actions
          </p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--ink)]">
            Manage faster
          </h3>

          <div className="mt-6 space-y-3">
            {quickActions.map((action) => (
              <button
                key={action}
                type="button"
                className="flex w-full items-center justify-between rounded-[22px] border border-[rgba(22,36,58,0.08)] px-4 py-4 text-left text-sm font-medium text-[var(--ink)] transition hover:bg-[rgba(22,36,58,0.03)]"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
