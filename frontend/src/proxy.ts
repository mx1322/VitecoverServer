import { NextResponse, type NextRequest } from "next/server";

import { defaultLocale, isLocale } from "@/lib/i18n/config";

const PUBLIC_FILE = /\.[^/]+$/;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api") || pathname.startsWith("/_next") || PUBLIC_FILE.test(pathname)) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  const locale = isLocale(segments[0]) ? segments[0] : defaultLocale;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-vitecover-locale", locale);

  if (!isLocale(segments[0])) {
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  const rewriteUrl = request.nextUrl.clone();
  rewriteUrl.pathname = `/${segments.slice(1).join("/")}` || "/";

  return NextResponse.rewrite(rewriteUrl, {
    request: { headers: requestHeaders },
  });
}

