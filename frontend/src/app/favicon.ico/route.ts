import { NextResponse } from "next/server";

import { siteConfig } from "@/lib/site";

export function GET(request: Request): NextResponse {
  const url = new URL(`/api/assets/${siteConfig.logoAssetId}?width=64&height=64&fit=contain&format=png`, request.url);
  return NextResponse.rewrite(url);
}
