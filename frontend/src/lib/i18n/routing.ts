import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config";

export function getLocaleLabel(locale: Locale): string {
  return {
    en: "English",
    fr: "Francais",
    zh: "中文",
  }[locale];
}

export function normalizeLocale(value?: string | null): Locale {
  const normalized = value?.toLowerCase();
  return isLocale(normalized) ? normalized : defaultLocale;
}

export function stripLocalePrefix(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && isLocale(segments[0])) {
    return `/${segments.slice(1).join("/")}`.replace(/\/$/, "") || "/";
  }
  return pathname || "/";
}

export function localizePath(pathname: string, locale: Locale): string {
  const cleanPath = stripLocalePrefix(pathname);
  return locale === defaultLocale ? cleanPath : `/${locale}${cleanPath === "/" ? "" : cleanPath}`;
}

export function replacePathLocale(pathname: string, locale: Locale): string {
  return localizePath(stripLocalePrefix(pathname), locale);
}

