import Link from "next/link";

import { readAuthSession } from "@/lib/auth-session";
import { siteConfig } from "@/lib/site";

export async function SiteHeader() {
  const session = await readAuthSession();
  const accountHref = session ? "/account" : "/auth";

  return (
    <header className="sticky top-0 z-20 border-b border-[rgba(22,36,58,0.08)] bg-[rgba(255,252,247,0.94)] backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4 md:py-5">
        <Link href="/" className="flex items-center gap-4 text-[var(--ink)]">
          <span className="inline-flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-full bg-[var(--accent)] text-base font-semibold text-[var(--ink)] shadow-[0_10px_24px_rgba(255,179,71,0.2)] md:h-16 md:w-16 md:text-lg">
            VC
          </span>
          <span>
            <span className="block text-xl font-semibold tracking-tight md:text-[1.75rem]">
              {siteConfig.name}
            </span>
            <span className="block text-[10px] font-medium uppercase tracking-[0.34em] text-[rgba(102,117,138,0.86)] md:text-[11px]">
              Temporary Auto Insurance
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-[var(--muted)] md:flex">
          {siteConfig.navigation.map((item) => (
            <Link
              key={item.label}
              href={item.label === "Account" ? accountHref : item.href}
              className="transition hover:text-[var(--ink)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/quote"
            className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--ink)] shadow-[0_12px_28px_rgba(255,179,71,0.2)] transition hover:translate-y-[-1px] hover:shadow-[0_16px_34px_rgba(255,179,71,0.28)]"
          >
            Start Quote
          </Link>
        </div>
      </div>
    </header>
  );
}
