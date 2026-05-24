import { NextResponse, type NextRequest } from "next/server";

import { defaultLocale, isLocale } from "@/lib/i18n/config";

const PUBLIC_FILE = /\.[^/]+$/;

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith("/api") || pathname.startsWith("/_next") || PUBLIC_FILE.test(pathname)) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  if (!isLocale(firstSegment)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
    redirectUrl.search = search;
    return NextResponse.redirect(redirectUrl);
  }

  const locale = firstSegment;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-vitecover-locale", locale);

  const rewriteUrl = request.nextUrl.clone();
  rewriteUrl.pathname = `/${segments.slice(1).join("/")}` || "/";

  return NextResponse.rewrite(rewriteUrl, {
    request: { headers: requestHeaders },
  });
}
