import { NextResponse } from "next/server";

import {
  archiveWorkspaceItem,
  setWorkspaceItemVerification,
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

function requireBoolean(value: unknown, label: string): boolean {
  if (typeof value !== "boolean") {
    throw new Error(`Invalid ${label}.`);
  }

  return value;
}

function ensureAdminAccess(request: Request) {
  const configuredKey = process.env.ADMIN_REVIEW_API_KEY;
  const requestKey = request.headers.get("x-admin-review-key") ?? "";

  if (!configuredKey) {
    throw new Error("ADMIN_REVIEW_API_KEY is not configured.");
  }

  if (requestKey !== configuredKey) {
    throw new Error("Admin access denied.");
  }
}

export async function PATCH(request: Request) {
  try {
    ensureAdminAccess(request);

    const body = (await request.json()) as Record<string, unknown>;
    const kind = requireString(body.kind, "kind");
    const id = requirePositiveInteger(body.id, "id");
    const isVerified = requireBoolean(body.isVerified, "isVerified");

    if (kind !== "vehicle" && kind !== "driver") {
      throw new Error("Unsupported workspace item type.");
    }

    await setWorkspaceItemVerification(kind, id, isVerified);

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to update the review state.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    ensureAdminAccess(request);

    const body = (await request.json()) as Record<string, unknown>;
    const kind = requireString(body.kind, "kind");
    const id = requirePositiveInteger(body.id, "id");

    if (kind !== "vehicle" && kind !== "driver") {
      throw new Error("Unsupported workspace item type.");
    }

    await archiveWorkspaceItem(kind, id);

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to archive this workspace item.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
