import { directusList } from "@/lib/directus/client";
import type { Locale } from "@/lib/i18n/config";
import type { LocalizedProduct } from "@/types/product";

type ProductRow = {
  id: number;
  slug: string;
  code: string;
  category: string | null;
  icon: string | null;
  base_price_from: number | null;
  translations?: Array<{
    locale: Locale;
    title: string;
    short_description: string | null;
    long_description: string | null;
    seo_title: string | null;
    seo_description: string | null;
  }>;
};

function mapProduct(row: ProductRow, locale: Locale): LocalizedProduct | null {
  const translation = row.translations?.find((item) => item.locale === locale);
  if (!translation) {
    return null;
  }

  return {
    id: row.id,
    slug: row.slug,
    code: row.code,
    category: row.category,
    icon: row.icon,
    basePriceFrom: row.base_price_from,
    locale,
    title: translation.title,
    shortDescription: translation.short_description ?? "",
    longDescription: translation.long_description ?? "",
    seoTitle: translation.seo_title,
    seoDescription: translation.seo_description,
  };
}

export async function getProducts(locale: Locale): Promise<LocalizedProduct[]> {
  const rows = await directusList<ProductRow>("products", {
    "filter[is_active][_eq]": "true",
    fields: "id,slug,code,category,icon,base_price_from,translations.locale,translations.title,translations.short_description,translations.long_description,translations.seo_title,translations.seo_description",
    sort: "sort_order",
  });

  return rows.map((row) => mapProduct(row, locale)).filter((row): row is LocalizedProduct => Boolean(row));
}

export async function getProductBySlug(slug: string, locale: Locale): Promise<LocalizedProduct | null> {
  const rows = await directusList<ProductRow>("products", {
    "filter[slug][_eq]": slug,
    "filter[is_active][_eq]": "true",
    fields: "id,slug,code,category,icon,base_price_from,translations.locale,translations.title,translations.short_description,translations.long_description,translations.seo_title,translations.seo_description",
    limit: "1",
  });

  if (!rows[0]) {
    return null;
  }

  return mapProduct(rows[0], locale);
}
