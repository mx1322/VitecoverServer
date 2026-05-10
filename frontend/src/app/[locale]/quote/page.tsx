import { notFound } from "next/navigation";

import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default async function QuotePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dictionary = await getDictionary(locale);

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-semibold">{dictionary.quote.title}</h1>
      <p className="mt-3 text-[var(--muted)]">{dictionary.quote.intro}</p>
      <ol className="mt-8 grid gap-4 md:grid-cols-2">
        {dictionary.quote.steps.map((step, index) => (
          <li key={step} className="rounded-2xl border bg-white/90 p-5">
            <p className="text-xs uppercase text-[var(--muted)]">{dictionary.common.stepLabel} {index + 1}</p>
            <p className="mt-2 font-medium">{step}</p>
          </li>
        ))}
      </ol>
    </main>
  );
}
