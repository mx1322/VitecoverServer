import { NextResponse } from "next/server";

import { getAuthenticatedAccount } from "@/lib/directus-auth";

export async function GET() {
  try {
    const account = await getAuthenticatedAccount();
    return NextResponse.json({
      authenticated: Boolean(account),
      account,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to load the current account session.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
