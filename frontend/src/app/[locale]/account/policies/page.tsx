import { notFound } from "next/navigation";

import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale } from "@/lib/i18n/config";

const policies = [
  { id: "VT-2026-0812", vehicle: "AB-123-CD", status: "active" },
  { id: "VT-2026-0818", vehicle: "GH-457-JK", status: "pending" },
  { id: "VT-2026-0702", vehicle: "LM-908-NP", status: "expired" },
] as const;

export default async function PoliciesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dictionary = await getDictionary(locale);

  const labels = dictionary.account.statuses;
  return (
    <div className="space-y-4">
      {policies.map((policy) => (
        <article key={policy.id} className="rounded-2xl border bg-white/90 p-5">
          <div className="flex items-center justify-between gap-4">
            <p className="font-semibold">{policy.id} · {policy.vehicle}</p>
            <span className="rounded-full bg-[rgba(248,179,71,0.16)] px-3 py-1 text-xs font-semibold">{policy.status === "active" ? labels.active : policy.status === "pending" ? labels.pending : labels.expired}</span>
          </div>
          <button className="mt-4 rounded-full border px-4 py-2 text-sm">{dictionary.cta.downloadPdf}</button>
        </article>
      ))}
    </div>
  );
}
