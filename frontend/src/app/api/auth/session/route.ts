import { NextResponse } from "next/server";

import { getAuthenticatedAccount, getAuthenticatedIdentity } from "@/lib/directus-auth";

export async function GET(request: Request) {
  try {
    const scope = new URL(request.url).searchParams.get("scope");

    if (scope === "identity") {
      const identity = await getAuthenticatedIdentity();
      return NextResponse.json({
        authenticated: Boolean(identity),
        account: identity,
      });
    }

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
