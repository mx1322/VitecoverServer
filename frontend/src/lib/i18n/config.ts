export const locales = ["fr", "en", "zh"] as const;

export const defaultLocale = "fr" as const;

export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
