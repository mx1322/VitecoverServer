import { NextResponse } from "next/server";

import { getQuotePreview } from "@/lib/directus-admin";

function requireString(value: unknown, label: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Missing ${label}.`);
  }

  return value.trim();
}

function requirePositiveInteger(value: unknown, label: string): number {
  const parsed =
    typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Invalid ${label}.`);
  }

  return parsed;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    const preview = await getQuotePreview({
      productCode: requireString(body.productCode, "product"),
      durationDays: requirePositiveInteger(body.durationDays, "duration"),
      coverageStartAt: requireString(body.coverageStartAt, "coverage start"),
      fiscalPower: requirePositiveInteger(body.fiscalPower, "fiscal power"),
    });

    return NextResponse.json(preview);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to calculate the price.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
