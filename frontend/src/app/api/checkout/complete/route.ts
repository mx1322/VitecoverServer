import { NextResponse } from "next/server";

import { completeCheckoutFlow } from "@/lib/directus-admin";

function requireString(value: unknown, label: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Missing ${label}.`);
  }

  return value.trim();
}

function optionalString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function optionalPositiveInteger(value: unknown): number | undefined {
  const parsed =
    typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;

  return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
}

function requirePositiveInteger(value: unknown, label: string): number {
  const parsed = optionalPositiveInteger(value);

  if (!parsed) {
    throw new Error(`Invalid ${label}.`);
  }

  return parsed;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const customer = (body.customer ?? {}) as Record<string, unknown>;
    const vehicle = (body.vehicle ?? {}) as Record<string, unknown>;
    const driver = (body.driver ?? {}) as Record<string, unknown>;

    const result = await completeCheckoutFlow({
      customer: {
        email: requireString(customer.email, "customer email"),
        firstName: optionalString(customer.firstName),
        lastName: optionalString(customer.lastName),
        phone: optionalString(customer.phone),
      },
      productCode: requireString(body.productCode, "product"),
      durationDays: requirePositiveInteger(body.durationDays, "duration"),
      coverageStartAt: requireString(body.coverageStartAt, "coverage start"),
      vehicle: {
        vehicleId: optionalPositiveInteger(vehicle.vehicleId),
        registrationNumber: optionalString(vehicle.registrationNumber),
        manufacturer: optionalString(vehicle.manufacturer),
        model: optionalString(vehicle.model),
        fiscalPower: optionalPositiveInteger(vehicle.fiscalPower),
      },
      driver: {
        driverId: optionalPositiveInteger(driver.driverId),
        firstName: optionalString(driver.firstName),
        lastName: optionalString(driver.lastName),
        email: optionalString(driver.email),
        phone: optionalString(driver.phone),
        licenseCountryCode: optionalString(driver.licenseCountryCode),
      },
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to complete the checkout flow.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
