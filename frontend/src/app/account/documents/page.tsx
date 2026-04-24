const documents = [
  {
    name: "Proof of Address",
    status: "Pending upload",
    note: "Upload a utility bill from the last 3 months.",
  },
  {
    name: "Driver Licence - Alex Martin",
    status: "Verified",
    note: "Validated on Apr 11, 2026.",
  },
  {
    name: "Vehicle Registration - AB-123-CD",
    status: "Under review",
    note: "Expected decision within 24 hours.",
  },
];

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] p-6 shadow-[0_18px_50px_rgba(22,36,58,0.05)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
          Documents
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)]">Documents</h2>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          Track verification status and upload any requested files.
        </p>
      </section>

      <section className="space-y-4">
        {documents.map((document) => (
          <article
            key={document.name}
            className="rounded-[22px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] px-5 py-5 shadow-[0_14px_36px_rgba(22,36,58,0.04)]"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold text-[var(--ink)]">{document.name}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{document.note}</p>
              </div>
              <span className="rounded-full bg-[rgba(234,237,241,1)] px-3 py-1.5 text-xs font-semibold text-[var(--ink)]">
                {document.status}
              </span>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
