import type { Metadata } from "next";
import { cookies } from "next/headers";
import { SiteHeader } from "@/components/site-header";
import { defaultLanguage, languageCookieName } from "@/lib/language";
import { siteConfig } from "@/lib/site";

import "./globals.css";

export const metadata: Metadata = {
  title: `${siteConfig.name} | Temporary Motor Insurance`,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const language = cookies().get(languageCookieName)?.value ?? defaultLanguage;

  return (
    <html lang={language}>
      <body>
        <div className="page-shell">
          <SiteHeader />
          {children}
        </div>
      </body>
    </html>
  );
}
