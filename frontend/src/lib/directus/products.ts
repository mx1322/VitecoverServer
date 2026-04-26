import { directusList } from "@/lib/directus/client";
import type { StructuredProduct } from "@/types/product";

type ProductRow = {
  id: number;
  slug: string;
  code: string;
  category: string | null;
  icon: string | null;
  base_price_from: number | null;
};

function mapProduct(row: ProductRow): StructuredProduct {
  return {
    id: row.id,
    slug: row.slug,
    code: row.code,
    category: row.category,
    icon: row.icon,
    basePriceFrom: row.base_price_from,
  };
}

export async function getProducts(): Promise<StructuredProduct[]> {
  const rows = await directusList<ProductRow>("products", {
    "filter[is_active][_eq]": "true",
    fields: "id,slug,code,category,icon,base_price_from",
    sort: "sort_order",
  });

  return rows.map((row) => mapProduct(row));
}

export async function getProductBySlug(slug: string): Promise<StructuredProduct | null> {
  const rows = await directusList<ProductRow>("products", {
    "filter[slug][_eq]": slug,
    "filter[is_active][_eq]": "true",
    fields: "id,slug,code,category,icon,base_price_from",
    limit: "1",
  });

  if (!rows[0]) {
    return null;
  }

  return mapProduct(rows[0]);
}
