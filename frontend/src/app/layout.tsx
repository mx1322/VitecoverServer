import type { Metadata } from "next";
import { headers } from "next/headers";

import { defaultLocale, isLocale } from "@/lib/i18n/config";

import "./globals.css";

export const metadata: Metadata = {
  title: "Vitecover",
  description: "Vitecover",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const requestHeaders = await headers();
  const localeHeader = requestHeaders.get("x-vitecover-locale");
  const htmlLang = localeHeader && isLocale(localeHeader) ? localeHeader : defaultLocale;

  return (
    <html lang={htmlLang} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
