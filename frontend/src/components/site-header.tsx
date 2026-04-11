import Link from "next/link";

import { siteConfig } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="border-b border-white/10 bg-[rgba(9,16,22,0.75)] backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3 text-white">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-semibold text-[var(--ink)]">
            VC
          </span>
          <span>
            <span className="block text-lg font-semibold tracking-tight">
              {siteConfig.name}
            </span>
            <span className="block text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
              Temporary Motor Insurance
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-[var(--muted)] md:flex">
          {siteConfig.navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
