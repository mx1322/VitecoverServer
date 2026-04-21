"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { LogoutButton } from "@/components/account/logout-button";
import type { AccountRole } from "@/lib/auth-session";

type SessionResponse = {
  authenticated: boolean;
  account?: {
    user?: {
      email?: string;
      role?: AccountRole;
    };
  } | null;
};

const customerMenuItems = [
  { label: "Overview", href: "/account" },
  { label: "Drivers", href: "/account/drivers" },
  { label: "Vehicles", href: "/account/vehicles" },
  { label: "Account Settings", href: "/account/settings" },
];

const managerMenuItems = [
  { label: "Overview", href: "/account" },
  { label: "用户资料审核", href: "/account/manager" },
  { label: "订单管理", href: "/account/manager/orders" },
  { label: "Drivers", href: "/account/drivers" },
  { label: "Vehicles", href: "/account/vehicles" },
  { label: "Account Settings", href: "/account/settings" },
];

export function AccountSidebar() {
  const pathname = usePathname();
  const [email, setEmail] = useState("max@example.com");
  const [role, setRole] = useState<AccountRole>("customer");

  useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      try {
        const response = await fetch("/api/auth/session", { cache: "no-store" });
        const payload = (await response.json()) as SessionResponse;
        if (cancelled || !payload.authenticated) {
          return;
        }

        const nextEmail = payload.account?.user?.email?.trim();
        const nextRole = payload.account?.user?.role;

        if (nextEmail) {
          setEmail(nextEmail);
        }

        if (nextRole) {
          setRole(nextRole);
        }
      } catch {
        // Keep default fallback for demo mode.
      }
    }

    loadSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const menuItems = useMemo(
    () => (role === "product_manager" || role === "admin" ? managerMenuItems : customerMenuItems),
    [role],
  );

  return (
    <aside className="rounded-[28px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.92)] p-5 shadow-[0_18px_50px_rgba(22,36,58,0.05)]">
      <div className="border-b border-[rgba(22,36,58,0.08)] pb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
          Account Center
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--ink)]">My Account</h1>
        <div className="mt-5 rounded-[22px] bg-[rgba(250,246,240,1)] px-4 py-4">
          <p className="text-sm text-[var(--muted)]">Welcome back</p>
          <p className="mt-1 text-sm font-medium text-[var(--ink)]">{email}</p>
          <p className="mt-1 text-xs font-medium text-[var(--muted)]">
            当前身份：{role === "product_manager" ? "产品经理" : role === "admin" ? "管理员" : "普通用户"}
          </p>
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
      <LogoutButton />
    </aside>
  );
}
