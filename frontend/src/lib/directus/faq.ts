import { directusList } from "@/lib/directus/client";
import type { StructuredFaqItem } from "@/types/faq";

type FaqRow = {
  id: number;
  slug: string;
  category: string | null;
};

export async function getFaqItems(): Promise<StructuredFaqItem[]> {
  const rows = await directusList<FaqRow>("faq_items", {
    "filter[is_published][_eq]": "true",
    fields: "id,slug,category",
    sort: "sort_order",
  });

  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    category: row.category,
  }));
}
