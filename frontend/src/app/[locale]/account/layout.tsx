import { notFound, redirect } from "next/navigation";

import { AccountSidebar } from "@/components/account/account-sidebar";
import { getAuthenticatedIdentity } from "@/lib/directus-auth";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default async function AccountLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const identity = await getAuthenticatedIdentity();

  if (!identity) {
    redirect(`/${locale}/auth?returnTo=${encodeURIComponent(`/${locale}/account`)}`);
  }

  const dictionary = await getDictionary(locale);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <AccountSidebar locale={locale} dictionary={dictionary} />
        <div>{children}</div>
      </div>
    </main>
  );
}
