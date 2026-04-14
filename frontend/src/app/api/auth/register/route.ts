import { NextResponse } from "next/server";

import { registerDirectusAccount } from "@/lib/directus-auth";

function requireString(value: unknown, label: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Missing ${label}.`);
  }

  return value.trim();
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    await registerDirectusAccount({
      email: requireString(body.email, "email"),
      password: requireString(body.password, "password"),
      firstName: requireString(body.firstName, "firstName"),
      lastName: requireString(body.lastName, "lastName"),
    });

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create this account right now.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
