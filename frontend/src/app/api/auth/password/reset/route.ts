import { NextResponse } from "next/server";

import { resetPassword } from "@/lib/directus-auth";

function requireString(value: unknown, label: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Missing ${label}.`);
  }

  return value.trim();
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    await resetPassword(
      requireString(body.token, "token"),
      requireString(body.password, "password"),
    );

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to reset the password.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
