import { NextResponse } from "next/server";

import { deleteAuthenticatedAccount } from "@/lib/directus-auth";

export async function DELETE() {
  try {
    await deleteAuthenticatedAccount();

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to close this account.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
