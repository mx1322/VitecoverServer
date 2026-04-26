import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config";
import { replacePathLocale } from "@/lib/i18n/locales";

export function getLocaleFromPathname(pathname: string): Locale {
  const firstSegment = pathname.split("/").filter(Boolean)[0];
  return isLocale(firstSegment ?? "") ? (firstSegment as Locale) : defaultLocale;
}

export function buildLocalizedPath(pathname: string, locale: Locale): string {
  return replacePathLocale(pathname, locale);
}
