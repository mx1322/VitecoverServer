import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getFaqContent, getFaqItemContent } from "@/lib/content/get-content";
import { getFaqItems } from "@/lib/directus/faq";
import { isLocale, type Locale } from "@/lib/i18n/config";
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

  const [dictionary, items] = await Promise.all([getDictionary(locale), getFaqItems()]);

  const renderedItems = items
    .map((item) => ({ id: item.id, slug: item.slug, content: getFaqItemContent(locale as Locale, item.slug) }))
    .filter((item): item is { id: number; slug: string; content: NonNullable<ReturnType<typeof getFaqItemContent>> } => Boolean(item.content));

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: renderedItems.map((item) => ({
      "@type": "Question",
      name: item.content.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.content.answer,
      },
    })),
  };

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }} />

      <h1 className="text-3xl font-semibold">{dictionary.faq.title}</h1>
      <p className="mt-3 text-[var(--muted)]">{dictionary.faq.intro}</p>

      {renderedItems.length === 0 ? (
        <div className="mt-8 rounded-2xl border bg-white/90 p-6 text-sm text-[var(--muted)]">{dictionary.faq.empty}</div>
      ) : (
        <div className="mt-8 space-y-4">
          {renderedItems.map((item) => (
            <article key={item.id} className="rounded-2xl border bg-white/90 p-5">
              <h2 className="text-lg font-semibold">{item.content.question}</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[var(--muted)]">{item.content.answer}</p>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
