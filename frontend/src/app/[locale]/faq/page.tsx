import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getFaqItemContent } from "@/lib/content/get-content";
import { getFaqItems } from "@/lib/directus/faq";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { buildLocaleMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) {
    return {};
  }

  const dictionary = await getDictionary(locale);
  return buildLocaleMetadata("/faq", locale, {
    title: dictionary.faq.title,
    description: dictionary.faq.intro,
  });
}

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [dictionary, structuredItems] = await Promise.all([getDictionary(locale), getFaqItems()]);

  const items = structuredItems
    .map((item) => {
      const localized = getFaqItemContent(locale, item.slug);
      if (!localized) {
        return null;
      }

      return {
        id: item.id,
        slug: item.slug,
        question: localized.question,
        answer: localized.answer,
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }} />

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
