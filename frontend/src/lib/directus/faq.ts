import { directusList } from "@/lib/directus/client";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import type { LocalizedFaqItem } from "@/types/faq";

type FaqRow = {
  id: number;
  slug: string;
  category: string | null;
  translations?: Array<{
    locale: Locale;
    question: string;
    answer: string;
    seo_title: string | null;
    seo_description: string | null;
  }>;
};

export async function getFaqItems(locale: Locale): Promise<LocalizedFaqItem[]> {
  const rows = await directusList<FaqRow>("faq_items", {
    "filter[is_published][_eq]": "true",
    fields: "id,slug,category,translations.locale,translations.question,translations.answer,translations.seo_title,translations.seo_description",
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
        slug: row.slug,
        category: row.category,
        locale: translation.locale,
        question: translation.question,
        answer: translation.answer,
        seoTitle: translation.seo_title,
        seoDescription: translation.seo_description,
      };
    })
    .filter((row): row is LocalizedFaqItem => Boolean(row));
}
