"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { languageLabels, locales, type Locale } from "@/lib/i18n";

function detectLocale(pathname: string): Locale {
  for (const locale of locales) {
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
      return locale;
    }
  }

  return "en";
}

function stripLocale(pathname: string): string {
  for (const locale of locales) {
    if (pathname === `/${locale}`) {
      return "/";
    }

    if (pathname.startsWith(`/${locale}/`)) {
      return pathname.slice(locale.length + 1);
    }
  }

  return pathname;
}

export function LanguageSwitcher() {
  const pathname = usePathname() || "/";
  const currentLocale = detectLocale(pathname);
  const basePath = stripLocale(pathname);

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-[rgba(22,36,58,0.12)] bg-white/80 p-1">
      {locales.map((locale) => {
        const href = locale === "en" ? basePath : `/${locale}${basePath === "/" ? "" : basePath}`;
        const isActive = currentLocale === locale;

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
            {languageLabels[locale]}
          </Link>
        );
      })}
    </div>
  );
}
