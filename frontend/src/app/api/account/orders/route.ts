import { NextResponse } from "next/server";

import {
  generateMissingPolicyPdfsForCustomer,
  getOrderHistoryByCustomerId,
} from "@/lib/directus-admin";
import { getAuthenticatedAccount } from "@/lib/directus-auth";

export async function GET() {
  try {
    const account = await getAuthenticatedAccount();
    if (!account) {
      return NextResponse.json({ error: "You must sign in first." }, { status: 401 });
    }

    const orders = await getOrderHistoryByCustomerId(account.customer.id);
    return NextResponse.json({ orders });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load order history.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function POST() {
  try {
    const account = await getAuthenticatedAccount();
    if (!account) {
      return NextResponse.json({ error: "You must sign in first." }, { status: 401 });
    }

    const result = await generateMissingPolicyPdfsForCustomer(account.customer.id);
    const orders = await getOrderHistoryByCustomerId(account.customer.id);

    return NextResponse.json({
      ...result,
      orders,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to generate policy PDFs.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
