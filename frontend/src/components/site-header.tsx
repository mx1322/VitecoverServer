import Link from "next/link";

import { LanguageSwitcher } from "@/components/language-switcher";
import { readAuthSession } from "@/lib/auth-session";
import type { Locale } from "@/lib/i18n/config";
import { localizePath } from "@/lib/i18n/routing";
import { t } from "@/lib/i18n/translations";
import { siteConfig } from "@/lib/site";

export async function SiteHeader({ locale }: { locale: Locale }) {
  const session = await readAuthSession();
  const accountHref = localizePath(session ? "/account" : "/auth", locale);

  return (
    <header className="sticky top-0 z-20 border-b border-[rgba(22,36,58,0.08)] bg-[rgba(255,252,247,0.94)] backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6 md:gap-6 md:py-5">
        <Link href={localizePath("/", locale)} className="flex min-w-0 items-center gap-3 text-[var(--ink)] sm:gap-4">
          <img
            src={`/api/assets/${siteConfig.logoAssetId}?width=128&height=128&fit=contain&format=webp`}
            alt={siteConfig.name}
            className="h-11 w-11 shrink-0 object-contain sm:h-[3.25rem] sm:w-[3.25rem] md:h-16 md:w-16"
          />
          <span className="min-w-0">
            <span className="block truncate text-lg font-semibold tracking-tight sm:text-xl md:text-[1.75rem]">
              {siteConfig.name}
            </span>
            <span className="block truncate text-[9px] font-medium uppercase tracking-[0.16em] text-[rgba(102,117,138,0.86)] sm:text-[10px] sm:tracking-[0.28em] md:text-[11px] md:tracking-[0.34em]">
              {t(locale, "Temporary Auto Insurance")}
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-4 md:gap-8">
          <nav className="hidden items-center gap-8 text-sm font-medium text-[var(--muted)] md:flex">
            {siteConfig.navigation.map((item) => (
              <Link
                key={item.label}
                href={item.label === "Account" ? accountHref : localizePath(item.href, locale)}
                className="transition hover:text-[var(--ink)]"
              >
                {t(locale, item.label)}
              </Link>
            ))}
          </nav>

          <LanguageSwitcher label={t(locale, "Language")} />
        </div>
      </div>
    </header>
  );
}
