import type { Locale } from "@/lib/i18n/config";

export type LocalizedPageSection = {
  id: number;
  pageKey: string;
  sectionKey: string;
  sortOrder: number;
  locale: Locale;
  eyebrow: string | null;
  title: string | null;
  subtitle: string | null;
  body: string | null;
  ctaPrimaryLabel: string | null;
  ctaSecondaryLabel: string | null;
};
