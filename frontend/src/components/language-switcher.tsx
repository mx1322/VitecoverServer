"use client";

import { usePathname, useSearchParams } from "next/navigation";

import { locales } from "@/lib/i18n/config";
import { getLocaleLabel, normalizeLocale, replacePathLocale } from "@/lib/i18n/routing";

export function LanguageSwitcher({ label }: { label: string }) {
  const pathname = usePathname() ?? "/";
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const currentLocale = normalizeLocale(pathname.split("/").filter(Boolean)[0]);

  return (
    <div aria-label={label} className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[rgba(22,36,58,0.12)] bg-white/80 p-1">
      {locales.map((locale) => {
        const nextPath = replacePathLocale(pathname, locale);
        const href = query ? `${nextPath}?${query}` : nextPath;
        const isActive = locale === currentLocale;

        return (
          <a
            key={locale}
            href={href}
            title={getLocaleLabel(locale)}
            aria-current={isActive ? "page" : undefined}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              isActive ? "bg-[var(--accent)] text-[var(--ink)]" : "text-[var(--muted)] hover:bg-[rgba(22,36,58,0.06)] hover:text-[var(--ink)]"
            }`}
          >
            {locale.toUpperCase()}
          </a>
        );
      })}
    </div>
  );
}
