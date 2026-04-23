import { NextResponse } from "next/server";

import { listWorkspaceReviewItems, setWorkspaceItemVerification } from "@/lib/directus-admin";
import { getAuthenticatedAccount } from "@/lib/directus-auth";

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

async function ensureManagerAccess() {
  const account = await getAuthenticatedAccount();
  if (account?.user.role === "product_manager" || account?.user.role === "admin") {
    return;
  }

  throw new Error("Manager access denied.");
}

export async function GET() {
  try {
    await ensureManagerAccess();
    const items = await listWorkspaceReviewItems();

    return NextResponse.json({ items });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load review items.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    await ensureManagerAccess();

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

export async function DELETE() {
  return NextResponse.json(
    { error: "Managers cannot delete workspace items from the review queue." },
    { status: 403 },
  );
}
