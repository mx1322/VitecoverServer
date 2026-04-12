import type { PropsWithChildren } from "react";

interface InfoCardProps extends PropsWithChildren {
  eyebrow: string;
  title: string;
}

export function InfoCard({ eyebrow, title, children }: InfoCardProps) {
  return (
    <article className="rounded-[28px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.86)] p-6 shadow-[0_18px_50px_rgba(22,36,58,0.08)] backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--accent-2)]">
        {eyebrow}
      </p>
      <h3 className="mt-3 text-xl font-semibold text-[var(--ink)]">{title}</h3>
      <div className="mt-4 text-sm leading-6 text-[var(--muted)]">{children}</div>
    </article>
  );
}
