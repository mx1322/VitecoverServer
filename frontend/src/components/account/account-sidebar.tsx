"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/types/i18n";

function active(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AccountSidebar({ locale, dictionary }: { locale: Locale; dictionary: Dictionary }) {
  const pathname = usePathname() ?? `/${locale}/account`;
  const links = [
    { href: `/${locale}/account`, label: dictionary.account.sidebar.overview },
    { href: `/${locale}/account/policies`, label: dictionary.account.sidebar.policies },
    { href: `/${locale}/account/drivers`, label: dictionary.account.sidebar.drivers },
    { href: `/${locale}/account/vehicles`, label: dictionary.account.sidebar.vehicles },
    { href: `/${locale}/account/documents`, label: dictionary.account.sidebar.documents },
    { href: `/${locale}/account/settings`, label: dictionary.account.sidebar.settings },
  ];

  return (
    <aside className="rounded-[24px] border border-[rgba(22,36,58,0.08)] bg-white/90 p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">{dictionary.account.title}</p>
      <nav className="mt-4 space-y-2">
        {links.map((item) => (
          <Link key={item.href} href={item.href} className={active(pathname, item.href) ? "flex rounded-full bg-[rgba(248,179,71,0.16)] px-4 py-3 text-sm font-semibold" : "flex rounded-full px-4 py-3 text-sm text-[var(--muted)] hover:bg-[rgba(22,36,58,0.04)]"}>
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
