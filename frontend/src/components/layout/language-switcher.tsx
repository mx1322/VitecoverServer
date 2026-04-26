"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { locales, normalizeLocale, replacePathLocale } from "@/lib/i18n/locales";

export function LanguageSwitcher() {
  const pathname = usePathname() ?? "/";
  const searchParams = useSearchParams();
  const currentLocale = normalizeLocale(pathname.split("/").filter(Boolean)[0]);

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-[rgba(22,36,58,0.12)] bg-white/80 p-1">
      {locales.map((locale) => {
        const nextPath = replacePathLocale(pathname, locale);
        const query = searchParams.toString();
        const href = query ? `${nextPath}?${query}` : nextPath;
        const isActive = locale === currentLocale;

        return (
          <Link
            key={locale}
            href={href}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              isActive
                ? "bg-[var(--accent)] text-[var(--ink)]"
                : "text-[var(--muted)] hover:bg-[rgba(22,36,58,0.06)] hover:text-[var(--ink)]"
            }`}
          >
            {locale.toUpperCase()}
          </Link>
        );
      })}
    </div>
  );
}
