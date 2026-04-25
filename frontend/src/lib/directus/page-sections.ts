import { directusList } from "@/lib/directus/client";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import type { LocalizedPageSection } from "@/types/page-section";

type SectionRow = {
  id: number;
  page_key: string;
  section_key: string;
  sort_order: number;
  translations?: Array<{
    locale: Locale;
    eyebrow: string | null;
    title: string | null;
    subtitle: string | null;
    body: string | null;
    cta_primary_label: string | null;
    cta_secondary_label: string | null;
  }>;
};

export async function getPageSections(pageKey: string, locale: Locale): Promise<LocalizedPageSection[]> {
  const rows = await directusList<SectionRow>("page_sections", {
    "filter[page_key][_eq]": pageKey,
    "filter[is_active][_eq]": "true",
    fields:
      "id,page_key,section_key,sort_order,translations.locale,translations.eyebrow,translations.title,translations.subtitle,translations.body,translations.cta_primary_label,translations.cta_secondary_label",
    sort: "sort_order",
  });

  return rows
    .map((row) => {
      const translation = row.translations?.find((item) => item.locale === locale)
        ?? row.translations?.find((item) => item.locale === defaultLocale);
      if (!translation) {
        return null;
      }
      return {
        id: row.id,
        pageKey: row.page_key,
        sectionKey: row.section_key,
        sortOrder: row.sort_order,
        locale: translation.locale,
        eyebrow: translation.eyebrow,
        title: translation.title,
        subtitle: translation.subtitle,
        body: translation.body,
        ctaPrimaryLabel: translation.cta_primary_label,
        ctaSecondaryLabel: translation.cta_secondary_label,
      };
    })
    .filter((row): row is LocalizedPageSection => Boolean(row));
}
