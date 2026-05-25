import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { getRequestLocale } from "@/lib/i18n/server";
import { siteConfig } from "@/lib/site";

import "./globals.css";

export const metadata: Metadata = {
  title: `${siteConfig.name} | Temporary Motor Insurance`,
  description: siteConfig.description,
  icons: {
    icon: `/api/assets/${siteConfig.logoAssetId}?width=64&height=64&fit=contain&format=png`,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getRequestLocale();

  return (
    <html lang={locale}>
      <body>
        <div className="page-shell">
          <SiteHeader locale={locale} />
          {children}
        </div>
      </body>
    </html>
  );
}
