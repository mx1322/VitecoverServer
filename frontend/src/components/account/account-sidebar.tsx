"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { AccountNavItem } from "@/lib/account/mock-data";

type AccountSidebarProps = {
  items: AccountNavItem[];
  accountEmail: string;
};

export function AccountSidebar({ items, accountEmail }: AccountSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="rounded-[28px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.92)] p-5 shadow-[0_18px_50px_rgba(22,36,58,0.05)]">
      <div className="border-b border-[rgba(22,36,58,0.08)] pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
          Account Center
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--ink)]">
          My Account
        </h1>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{accountEmail}</p>
      </div>

      <nav className="mt-4 space-y-2">
        {items.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== "/account" && pathname.startsWith(`${item.href}/`));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                isActive
                  ? "flex w-full items-center rounded-full bg-[rgba(255,179,71,0.16)] px-4 py-3 text-sm font-semibold text-[var(--ink)]"
                  : "flex w-full items-center rounded-full px-4 py-3 text-sm font-medium text-[var(--muted)] transition hover:bg-[rgba(22,36,58,0.04)] hover:text-[var(--ink)]"
              }
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
