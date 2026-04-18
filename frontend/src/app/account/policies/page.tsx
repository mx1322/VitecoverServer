import { mockPolicies } from "@/lib/account/mock-data";

function getStatusClass(status: string): string {
  if (status === "Active") {
    return "rounded-full bg-[rgba(255,179,71,0.16)] px-3 py-1.5 text-xs font-semibold text-[var(--ink)]";
  }

  if (status === "Pending review") {
    return "rounded-full bg-[rgba(31,183,166,0.12)] px-3 py-1.5 text-xs font-semibold text-[var(--accent-2)]";
  }

  return "rounded-full bg-[rgba(22,36,58,0.08)] px-3 py-1.5 text-xs font-semibold text-[var(--muted)]";
}

export default function AccountPoliciesPage() {
  return (
    <>
      <div className="rounded-[28px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] p-6 shadow-[0_18px_50px_rgba(22,36,58,0.05)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
          My Policies
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)]">
          Policy portfolio
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
          Review your current cover, pending applications, and previous short-term policies.
        </p>
      </div>

      <div className="rounded-[28px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] p-3 shadow-[0_18px_50px_rgba(22,36,58,0.05)] md:p-4">
        <div className="hidden grid-cols-[1.4fr_1fr_0.9fr_0.9fr_0.8fr] gap-4 rounded-[22px] bg-[rgba(22,36,58,0.03)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)] md:grid">
          <span>Policy</span>
          <span>Vehicle</span>
          <span>Period</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        <div className="space-y-3 md:mt-3">
          {mockPolicies.map((policy) => (
            <article
              key={policy.id}
              className="grid gap-4 rounded-[22px] border border-[rgba(22,36,58,0.08)] bg-white px-4 py-4 md:grid-cols-[1.4fr_1fr_0.9fr_0.9fr_0.8fr] md:items-center"
            >
              <div>
                <p className="font-semibold text-[var(--ink)]">{policy.product}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{policy.policyNumber}</p>
              </div>
              <p className="text-sm text-[var(--ink)]">{policy.vehicle}</p>
              <p className="text-sm text-[var(--muted)]">
                {policy.startDate} to {policy.endDate}
              </p>
              <div>
                <span className={getStatusClass(policy.status)}>{policy.status}</span>
              </div>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full border border-[rgba(22,36,58,0.12)] bg-[rgba(255,255,255,0.9)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink)] transition hover:bg-[rgba(22,36,58,0.03)]"
              >
                Download PDF
              </button>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
