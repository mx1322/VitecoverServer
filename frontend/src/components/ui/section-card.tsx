import type { ReactNode } from "react";

export function SectionCard({ children }: { children: ReactNode }) {
  return (
    <article className="rounded-[24px] border border-[rgba(22,36,58,0.08)] bg-white/90 p-6 shadow-[0_14px_36px_rgba(22,36,58,0.04)]">
      {children}
    </article>
  );
}
