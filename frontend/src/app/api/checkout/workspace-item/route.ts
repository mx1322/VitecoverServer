import { NextResponse } from "next/server";

import {
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
