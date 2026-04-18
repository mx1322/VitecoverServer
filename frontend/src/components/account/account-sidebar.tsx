"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { label: "Overview", href: "/account" },
  { label: "My Policies", href: "/account/policies" },
  { label: "Drivers", href: "/account/drivers" },
  { label: "Vehicles", href: "/account/vehicles" },
  { label: "Documents", href: "/account/documents" },
  { label: "Account Settings", href: "/account/settings" },
];

export function AccountSidebar() {
  const pathname = usePathname();

  return (
    <aside className="rounded-[28px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.92)] p-5 shadow-[0_18px_50px_rgba(22,36,58,0.05)]">
      <div className="border-b border-[rgba(22,36,58,0.08)] pb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
          Account Center
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--ink)]">
          My Account
        </h1>
        <div className="mt-5 rounded-[22px] bg-[rgba(250,246,240,1)] px-4 py-4">
          <p className="text-sm text-[var(--muted)]">Welcome back</p>
          <p className="mt-1 text-sm font-medium text-[var(--ink)]">max@example.com</p>
        </div>
      </div>

      <nav className="mt-4 space-y-2">
        {menuItems.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                active
                  ? "flex w-full items-center rounded-full bg-[rgba(248,179,71,0.16)] px-4 py-3 text-sm font-semibold text-[var(--ink)]"
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
