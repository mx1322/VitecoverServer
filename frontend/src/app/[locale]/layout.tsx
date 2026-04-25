import { notFound } from "next/navigation";

import { SiteHeader } from "@/components/layout/site-header";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = await getDictionary(locale as Locale);

  return (
    <div className="page-shell">
      <SiteHeader locale={locale as Locale} dictionary={dictionary} />
      {children}
    </div>
  );
}
