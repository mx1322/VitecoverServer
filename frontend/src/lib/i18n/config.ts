export const locales = ["en", "fr", "zh"] as const;

export const defaultLocale = "en" as const;

export type Locale = (typeof locales)[number];

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

