import { notFound } from "next/navigation";

import { getFaqItems } from "@/lib/directus/faq";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [dictionary, items] = await Promise.all([getDictionary(locale), getFaqItems(locale as Locale)]);

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-semibold">{dictionary.faq.title}</h1>
      <p className="mt-3 text-[var(--muted)]">{dictionary.faq.intro}</p>

      {items.length === 0 ? (
        <div className="mt-8 rounded-2xl border bg-white/90 p-6 text-sm text-[var(--muted)]">{dictionary.faq.empty}</div>
      ) : (
        <div className="mt-8 space-y-4">
          {items.map((item) => (
            <article key={item.id} className="rounded-2xl border bg-white/90 p-5">
              <h2 className="text-lg font-semibold">{item.question}</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[var(--muted)]">{item.answer}</p>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
