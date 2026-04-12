import { NextResponse } from "next/server";

import { createOrderFromInput } from "@/lib/directus-admin";

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

    const payload = {
      productCode: requireString(body.productCode, "product"),
      customerFirstName: requireString(body.customerFirstName, "first name"),
      customerLastName: requireString(body.customerLastName, "last name"),
      email: requireString(body.email, "email"),
      phone: typeof body.phone === "string" ? body.phone.trim() : "",
      registrationNumber: requireString(body.registrationNumber, "registration number"),
      fiscalPower: requirePositiveInteger(body.fiscalPower, "fiscal power"),
      manufacturer: typeof body.manufacturer === "string" ? body.manufacturer.trim() : "",
      model: typeof body.model === "string" ? body.model.trim() : "",
      coverageStartAt: requireString(body.coverageStartAt, "coverage start"),
      durationDays: requirePositiveInteger(body.durationDays, "duration"),
    };

    const summary = await createOrderFromInput(payload);

    return NextResponse.json(summary, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create the order.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
