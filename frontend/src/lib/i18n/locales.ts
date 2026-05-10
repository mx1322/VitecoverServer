import { defaultLocale, isLocale, locales, type Locale } from "@/lib/i18n/config";

export function normalizeLocale(value?: string | null): Locale {
  if (!value) {
    return defaultLocale;
  }

  const normalized = value.toLowerCase();
  return isLocale(normalized) ? normalized : defaultLocale;
}

export function getLocaleLabel(locale: Locale): string {
  return {
    fr: "Français",
    en: "English",
    zh: "中文",
  }[locale];
}

export function replacePathLocale(pathname: string, nextLocale: Locale): string {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return `/${nextLocale}`;
  }

  const [first, ...rest] = segments;

  if (isLocale(first)) {
    return `/${[nextLocale, ...rest].join("/")}`;
  }

  return `/${[nextLocale, ...segments].join("/")}`;
}

export { locales, defaultLocale };
export type { Locale };
