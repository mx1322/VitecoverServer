import type { Locale } from "@/lib/i18n/config";

export type LocalizedProduct = {
  id: number;
  slug: string;
  code: string;
  category: string | null;
  icon: string | null;
  basePriceFrom: number | null;
  locale: Locale;
  title: string;
  shortDescription: string;
  longDescription: string;
  seoTitle: string | null;
  seoDescription: string | null;
};
