import { NextResponse } from "next/server";

import {
  continueCustomerWorkspace,
  getCustomerWorkspaceByEmail,
} from "@/lib/directus-admin";

function requireString(value: unknown, label: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Missing ${label}.`);
  }

  return value.trim();
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const email = requireString(body.email, "email");
    const createIfMissing = Boolean(body.createIfMissing);

    if (!createIfMissing) {
      const workspace = await getCustomerWorkspaceByEmail(email);
      return NextResponse.json({
        found: Boolean(workspace),
        workspace,
      });
    }

    const workspace = await continueCustomerWorkspace({
      email,
      firstName: typeof body.firstName === "string" ? body.firstName.trim() : "",
      lastName: typeof body.lastName === "string" ? body.lastName.trim() : "",
      phone: typeof body.phone === "string" ? body.phone.trim() : "",
    });

    return NextResponse.json({
      found: true,
      workspace,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to continue with this local account.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
