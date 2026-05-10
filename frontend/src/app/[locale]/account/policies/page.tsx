import { notFound } from "next/navigation";

import { getOrderHistoryByCustomerId, type CustomerWorkspaceOrder } from "@/lib/directus-admin";
import { getAuthenticatedAccount } from "@/lib/directus-auth";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale } from "@/lib/i18n/config";

function getStatusLabel(order: CustomerWorkspaceOrder, labels: Awaited<ReturnType<typeof getDictionary>>["account"]["statuses"]): string {
  if (["paid", "approved", "issued"].includes(order.status)) return labels.active;
  if (["expired", "cancelled", "canceled", "refunded"].includes(order.status)) return labels.expired;
  return labels.pending;
}

export default async function PoliciesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dictionary = await getDictionary(locale);
  const account = await getAuthenticatedAccount();
  const policies = account ? await getOrderHistoryByCustomerId(account.customer.id) : [];

  const labels = dictionary.account.statuses;
  return (
    <div className="space-y-4">
      {policies.map((policy) => (
        <article key={policy.id} className="rounded-2xl border bg-white/90 p-5">
          <div className="flex items-center justify-between gap-4">
            <p className="font-semibold">{policy.orderNumber}</p>
            <span className="rounded-full bg-[rgba(248,179,71,0.16)] px-3 py-1 text-xs font-semibold">{getStatusLabel(policy, labels)}</span>
          </div>
          <p className="mt-2 text-sm text-[var(--muted)]">
            {policy.coverageStartAt} - {policy.coverageEndAt}
          </p>
          <a className="mt-4 inline-block rounded-full border px-4 py-2 text-sm" href={`/api/account/orders/${policy.id}/pdf`}>
            {dictionary.cta.downloadPdf}
          </a>
        </article>
      ))}
    </div>
  );
}
