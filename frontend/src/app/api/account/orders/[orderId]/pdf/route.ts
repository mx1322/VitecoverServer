import { NextResponse } from "next/server";

import {
  fetchDirectusAssetFile,
  getPolicyPdfAssetIdForCustomerOrder,
} from "@/lib/directus-admin";
import { getAuthenticatedAccount } from "@/lib/directus-auth";

function parseOrderId(value: string): number {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error("Invalid order id.");
  }

  return parsed;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ orderId: string }> },
) {
  try {
    const account = await getAuthenticatedAccount();
    if (!account) {
      return NextResponse.json({ error: "You must sign in first." }, { status: 401 });
    }

    const params = await context.params;
    const orderId = parseOrderId(params.orderId);

    const fileId = await getPolicyPdfAssetIdForCustomerOrder(account.customer.id, orderId);
    if (!fileId) {
      return NextResponse.json({ error: "Policy PDF not found for this order." }, { status: 404 });
    }

    const asset = await fetchDirectusAssetFile(fileId);

    return new NextResponse(asset.bytes, {
      status: 200,
      headers: {
        "Content-Type": asset.contentType,
        "Content-Disposition": `attachment; filename=\"${asset.filename}\"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to download policy PDF.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
