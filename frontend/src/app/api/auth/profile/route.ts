import { NextResponse } from "next/server";

import { updateAuthenticatedProfile } from "@/lib/directus-auth";

function requireString(value: unknown, label: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Missing ${label}.`);
  }

  return value.trim();
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const account = await updateAuthenticatedProfile({
      email: requireString(body.email, "email"),
      firstName: requireString(body.firstName, "firstName"),
      lastName: requireString(body.lastName, "lastName"),
      phone: typeof body.phone === "string" ? body.phone.trim() : "",
      customerType: typeof body.customerType === "string" ? body.customerType.trim() : "individual",
      preferredLanguage:
        typeof body.preferredLanguage === "string" ? body.preferredLanguage.trim() : "fr-FR",
    });

    return NextResponse.json({
      account,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update the profile.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
