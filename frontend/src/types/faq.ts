import type { Locale } from "@/lib/i18n/config";

export type LocalizedFaqItem = {
  id: number;
  slug: string;
  category: string | null;
  locale: Locale;
  question: string;
  answer: string;
  seoTitle: string | null;
  seoDescription: string | null;
};
