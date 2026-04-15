import { NextResponse } from "next/server";

import {
  createWorkspaceDriver,
  createWorkspaceVehicle,
  deleteWorkspaceDriver,
  deleteWorkspaceVehicle,
} from "@/lib/directus-admin";

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
    const email = requireString(body.email, "email");
    const kind = requireString(body.kind, "kind");

    const workspace =
      kind === "vehicle"
        ? await createWorkspaceVehicle(email, {
            registrationNumber: requireString(body.registrationNumber, "registrationNumber"),
            manufacturer: typeof body.manufacturer === "string" ? body.manufacturer.trim() : "",
            model: typeof body.model === "string" ? body.model.trim() : "",
            fiscalPower: requirePositiveInteger(body.fiscalPower, "fiscalPower"),
          })
        : kind === "driver"
          ? await createWorkspaceDriver(email, {
              firstName: requireString(body.firstName, "firstName"),
              lastName: requireString(body.lastName, "lastName"),
              birthday: typeof body.birthday === "string" ? body.birthday.trim() : "",
              email: typeof body.driverEmail === "string" ? body.driverEmail.trim() : "",
              phone: typeof body.phone === "string" ? body.phone.trim() : "",
              licenseNumber:
                typeof body.licenseNumber === "string" ? body.licenseNumber.trim() : "",
              licenseCountryCode:
                typeof body.licenseCountryCode === "string"
                  ? body.licenseCountryCode.trim()
                  : "",
            })
          : null;

    if (!workspace) {
      throw new Error("Unsupported workspace item type.");
    }

    return NextResponse.json({
      workspace,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create this workspace item.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const email = requireString(body.email, "email");
    const kind = requireString(body.kind, "kind");
    const id = requirePositiveInteger(body.id, "id");

    const workspace =
      kind === "vehicle"
        ? await deleteWorkspaceVehicle(email, id)
        : kind === "driver"
          ? await deleteWorkspaceDriver(email, id)
          : null;

    if (!workspace) {
      throw new Error("Unsupported workspace item type.");
    }

    return NextResponse.json({
      workspace,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to delete this workspace item.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
