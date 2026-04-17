import { NextResponse } from "next/server";

import { updateCustomerProfile } from "@/lib/directus-admin";

function requireString(value: unknown, label: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Missing ${label}.`);
  }

  return value.trim();
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const workspace = await updateCustomerProfile({
      email: requireString(body.email, "email"),
      firstName: requireString(body.firstName, "firstName"),
      lastName: requireString(body.lastName, "lastName"),
      phone: typeof body.phone === "string" ? body.phone.trim() : "",
    });

    return NextResponse.json({
      workspace,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update this profile.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
