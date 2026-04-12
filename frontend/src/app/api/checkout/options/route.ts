import { NextResponse } from "next/server";

import { getProductPricingOptions } from "@/lib/directus-admin";

function requireString(value: unknown, label: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Missing ${label}.`);
  }

  return value.trim();
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const options = await getProductPricingOptions(requireString(body.productCode, "product"));
    return NextResponse.json(options);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load pricing options.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
