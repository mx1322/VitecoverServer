import type { PropsWithChildren } from "react";

interface InfoCardProps extends PropsWithChildren {
  eyebrow: string;
  title: string;
}

export function InfoCard({ eyebrow, title, children }: InfoCardProps) {
  return (
    <article className="rounded-[28px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.18)]">
      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--accent-2)]">
        {eyebrow}
      </p>
      <h3 className="mt-3 text-xl font-semibold text-white">{title}</h3>
      <div className="mt-4 text-sm leading-6 text-[var(--muted)]">{children}</div>
    </article>
  );
}
