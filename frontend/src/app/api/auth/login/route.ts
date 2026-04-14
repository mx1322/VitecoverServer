import { NextResponse } from "next/server";

import { loginDirectusAccount } from "@/lib/directus-auth";

function requireString(value: unknown, label: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Missing ${label}.`);
  }

  return value.trim();
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    await loginDirectusAccount(
      requireString(body.email, "email"),
      requireString(body.password, "password"),
    );

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to sign in right now.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
