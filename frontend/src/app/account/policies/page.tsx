const policies = [
  {
    id: "PC-2049",
    product: "Passenger Car",
    status: "Active",
    renewal: "Renews on Aug 12, 2026",
  },
  {
    id: "LCV-8831",
    product: "Light Commercial Van",
    status: "Pending",
    renewal: "Starts on May 03, 2026",
  },
];

export default function PoliciesPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] p-6 shadow-[0_18px_50px_rgba(22,36,58,0.05)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
          My Policies
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)]">Policies</h2>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          Review your active and pending policy details.
        </p>
      </section>

      <section className="space-y-4">
        {policies.map((policy) => (
          <article
            key={policy.id}
            className="rounded-[22px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] px-5 py-5 shadow-[0_14px_36px_rgba(22,36,58,0.04)]"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold text-[var(--ink)]">
                  {policy.product} · {policy.id}
                </p>
                <p className="mt-1 text-sm text-[var(--muted)]">{policy.renewal}</p>
              </div>
              <span className="rounded-full bg-[rgba(248,179,71,0.16)] px-3 py-1.5 text-xs font-semibold text-[var(--ink)]">
                {policy.status}
              </span>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
