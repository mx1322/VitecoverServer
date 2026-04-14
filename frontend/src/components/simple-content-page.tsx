import type { ReactNode } from "react";

export function SimpleContentPage({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <main className="section-wrap py-16 md:py-24">
      <div className="max-w-3xl rounded-[36px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.9)] p-8 shadow-[0_24px_70px_rgba(22,36,58,0.08)] md:p-10">
        <p className="eyebrow">{eyebrow}</p>
        <h1
          className="mt-5 text-4xl font-semibold tracking-tight text-[var(--ink)] md:text-5xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </h1>
        <p className="mt-5 text-lg leading-8 text-[var(--muted)]">{intro}</p>
        <div className="mt-8 space-y-5 text-sm leading-7 text-[var(--muted)]">{children}</div>
      </div>
    </main>
  );
}
