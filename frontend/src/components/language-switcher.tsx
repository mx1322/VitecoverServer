"use client";

import { usePathname, useSearchParams } from "next/navigation";

import { locales } from "@/lib/i18n/config";
import { getLocaleLabel, normalizeLocale, replacePathLocale } from "@/lib/i18n/routing";

export function LanguageSwitcher({ label }: { label: string }) {
  const pathname = usePathname() ?? "/";
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const currentLocale = normalizeLocale(pathname.split("/").filter(Boolean)[0]);
  const currentLabel = getLocaleLabel(currentLocale);

  return (
    <details className="relative shrink-0">
      <summary
        aria-label={label}
        className="flex cursor-pointer list-none items-center gap-2 rounded-full border border-[rgba(22,36,58,0.12)] bg-white/80 px-3 py-1.5 text-xs font-semibold text-[var(--ink)] marker:content-none"
      >
        <span>{currentLabel}</span>
        <span aria-hidden="true" className="text-[10px] text-[var(--muted)]">▼</span>
      </summary>

      <div className="absolute right-0 z-20 mt-2 min-w-full overflow-hidden rounded-2xl border border-[rgba(22,36,58,0.12)] bg-white shadow-[0_20px_56px_rgba(22,36,58,0.12)]">
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
              className={`block px-3 py-2 text-xs font-semibold transition ${
                isActive ? "bg-[var(--accent)] text-[var(--ink)]" : "text-[var(--muted)] hover:bg-[rgba(22,36,58,0.06)] hover:text-[var(--ink)]"
              }`}
            >
              {getLocaleLabel(locale)}
            </a>
          );
        })}
      </div>
    </details>
  );
}
