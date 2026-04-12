import { createDirectus, readItems, rest } from "@directus/sdk";

import type { DirectusSchema, InsuranceProduct } from "@/types/directus-schema";

const directusUrl =
  process.env.NEXT_PUBLIC_DIRECTUS_URL ?? "http://localhost:8055";

export const directus = createDirectus<DirectusSchema>(directusUrl).with(rest());

export async function getActiveInsuranceProducts(): Promise<InsuranceProduct[]> {
  try {
    return await directus.request(
      readItems("insurance_products", {
        fields: [
          "id",
          "code",
          "name",
          "description",
          "customer_segment",
          "product_family",
          "status",
        ],
        filter: {
          status: {
            _eq: "active",
          },
        },
        sort: ["name"],
      })
    );
  } catch {
    return [];
  }
}
