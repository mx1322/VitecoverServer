import { Suspense } from "react";

import Link from "next/link";

import { LanguageSwitcher } from "@/components/layout/language-switcher";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/types/i18n";

export function SiteHeader({ locale, dictionary }: { locale: Locale; dictionary: Dictionary }) {
  return (
    <header className="sticky top-0 z-20 border-b border-[rgba(22,36,58,0.08)] bg-[rgba(255,252,247,0.94)] backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4 md:py-5">
        <Link href={`/${locale}`} className="flex items-center gap-4 text-[var(--ink)]">
          <span className="inline-flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-full bg-[var(--accent)] text-base font-semibold">VC</span>
          <span>
            <span className="block text-xl font-semibold tracking-tight md:text-[1.75rem]">Vitecover</span>
            <span className="block text-[10px] font-medium uppercase tracking-[0.34em] text-[rgba(102,117,138,0.86)] md:text-[11px]">{dictionary.brandTagline}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-[var(--muted)] lg:flex">
          <Link href={`/${locale}`}>{dictionary.nav.home}</Link>
          <Link href={`/${locale}/products`}>{dictionary.nav.products}</Link>
          <Link href={`/${locale}/quote`}>{dictionary.nav.quote}</Link>
          <Link href={`/${locale}/faq`}>{dictionary.nav.faq}</Link>
          <Link href={`/${locale}/account`}>{dictionary.nav.account}</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Suspense fallback={null}><LanguageSwitcher /></Suspense>
          <Link className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--ink)]" href={`/${locale}/quote`}>
            {dictionary.cta.getQuote}
          </Link>
        </div>
      </div>
    </header>
  );
}
