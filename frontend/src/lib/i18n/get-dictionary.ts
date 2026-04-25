import "server-only";

import type { Dictionary } from "@/types/i18n";
import { type Locale } from "@/lib/i18n/config";

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  fr: async () => (await import("@/messages/fr.json")).default as Dictionary,
  en: async () => (await import("@/messages/en.json")).default as Dictionary,
  zh: async () => (await import("@/messages/zh.json")).default as Dictionary,
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
