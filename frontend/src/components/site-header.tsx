import Link from "next/link";

import { siteConfig } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-[rgba(22,36,58,0.08)] bg-[rgba(255,250,242,0.84)] backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="flex items-center gap-3 text-[var(--ink)]">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-semibold text-[var(--ink)]">
            VC
          </span>
          <span>
            <span className="block text-lg font-semibold tracking-tight">
              {siteConfig.name}
            </span>
            <span className="block text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
              Temporary Auto Insurance
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-[var(--muted)] md:flex">
          {siteConfig.navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-[var(--ink)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <span className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
            100% online
          </span>
          <Link
            href="/quote"
            className="rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-[var(--ink)] transition hover:translate-y-[-1px]"
          >
            Start now
          </Link>
        </div>
      </div>
    </header>
  );
}
