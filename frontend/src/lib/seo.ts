import type { Metadata } from "next";

import { defaultLocale, locales, type Locale } from "@/lib/i18n/config";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.vitecover.com";

function joinUrl(path: string): string {
  return new URL(path, siteUrl).toString();
}

export function withLocale(path: string, locale: Locale): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return normalized === "/" ? `/${locale}` : `/${locale}${normalized}`;
}

export function buildLocaleMetadata(path: string, locale: Locale, metadata: Pick<Metadata, "title" | "description">): Metadata {
  const canonicalPath = withLocale(path, locale);
  const languageAlternates = Object.fromEntries(locales.map((item) => [item, joinUrl(withLocale(path, item))]));

  return {
    ...metadata,
    alternates: {
      canonical: joinUrl(canonicalPath),
      languages: {
        ...languageAlternates,
        "x-default": joinUrl(withLocale(path, defaultLocale)),
      },
    },
  };
}
