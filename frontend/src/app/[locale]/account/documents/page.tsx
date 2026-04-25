import { notFound } from "next/navigation";

import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale } from "@/lib/i18n/config";

const documents = [
  { name: "Driving Licence", status: "uploaded" },
  { name: "Vehicle Registration", status: "missing" },
  { name: "Proof of Address", status: "underReview" },
] as const;

export default async function DocumentsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dictionary = await getDictionary(locale);

  return (
    <div className="space-y-4">
      <button className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold">{dictionary.cta.uploadDocument}</button>
      {documents.map((document) => (
        <article key={document.name} className="rounded-2xl border bg-white/90 p-5 flex items-center justify-between gap-4">
          <p>{document.name}</p>
          <span className="rounded-full bg-[rgba(234,237,241,1)] px-3 py-1 text-xs font-semibold">{dictionary.account.statuses[document.status]}</span>
        </article>
      ))}
    </div>
  );
}
