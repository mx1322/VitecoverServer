export const languageCookieName = "vitecover-lang";
export const defaultLanguage = "en";
export const supportedLanguages = ["en", "zh"] as const;

export type SupportedLanguage = (typeof supportedLanguages)[number];

export function isSupportedLanguage(value: string): value is SupportedLanguage {
  return (supportedLanguages as readonly string[]).includes(value);
}
