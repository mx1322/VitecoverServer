import { AccountSummaryCard } from "@/components/account/account-summary-card";
import { notFound } from "next/navigation";

import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale } from "@/lib/i18n/config";

export default async function AccountOverviewPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dictionary = await getDictionary(locale);

  return (
    <div className="space-y-6">
      <section className="rounded-[24px] border bg-white/90 p-6">
        <h1 className="text-3xl font-semibold">{dictionary.account.welcome}</h1>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AccountSummaryCard label={dictionary.account.summary.activePolicies} value={2} />
        <AccountSummaryCard label={dictionary.account.summary.savedDrivers} value={3} />
        <AccountSummaryCard label={dictionary.account.summary.savedVehicles} value={3} />
        <AccountSummaryCard label={dictionary.account.summary.pendingDocuments} value={1} />
      </section>
      <section className="rounded-[24px] border bg-white/90 p-6">
        <h2 className="text-xl font-semibold">{dictionary.account.recentPolicies}</h2>
        <ul className="mt-3 list-disc pl-5 text-sm text-[var(--muted)]">
          <li>VT-2026-0812 · Peugeot 3008</li>
          <li>VT-2026-0818 · Renault Trafic</li>
        </ul>
      </section>
      <section className="rounded-[24px] border bg-white/90 p-6">
        <h2 className="text-xl font-semibold">{dictionary.account.quickActions}</h2>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full border px-4 py-2">{dictionary.cta.getQuote}</span>
          <span className="rounded-full border px-4 py-2">{dictionary.cta.addDriver}</span>
          <span className="rounded-full border px-4 py-2">{dictionary.cta.addVehicle}</span>
          <span className="rounded-full border px-4 py-2">{dictionary.cta.uploadDocument}</span>
        </div>
      </section>
    </div>
  );
}
