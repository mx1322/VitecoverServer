import { NextResponse } from "next/server";

import { logoutDirectusAccount } from "@/lib/directus-auth";

export async function POST() {
  await logoutDirectusAccount();
  return NextResponse.json({
    ok: true,
  });
}
