import { NextResponse } from "next/server";

import { verifyRegistrationEmail } from "@/lib/directus-auth";

function requireString(value: unknown, label: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Missing ${label}.`);
  }

  return value.trim();
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    await verifyRegistrationEmail(requireString(body.token, "token"));

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to verify this email.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
