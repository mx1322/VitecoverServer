type AccountSummaryCardProps = {
  label: string;
  value: string;
};

export function AccountSummaryCard({ label, value }: AccountSummaryCardProps) {
  return (
    <article className="rounded-[24px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.92)] p-5 shadow-[0_14px_36px_rgba(22,36,58,0.04)]">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
        {label}
      </p>
      <p className="mt-4 text-4xl font-semibold tracking-tight text-[var(--ink)]">{value}</p>
    </article>
  );
}
