import type { Metadata } from "next";

import { faqItems } from "@/lib/faq";

export const metadata: Metadata = {
  title: "FAQ | Vitecover",
  description:
    "Answers about temporary auto insurance, quote steps, policy delivery, and support.",
};

export default function FaqPage() {
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <main className="section-wrap py-16 md:py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }} />

      <section className="rounded-[32px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.92)] p-7 shadow-[0_20px_56px_rgba(22,36,58,0.08)] md:p-10">
        <p className="eyebrow">Knowledge Base</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--ink)] md:text-5xl">
          Frequently Asked Questions
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--muted)]">
          Quick answers for customers and for search engines: cover, order steps, documents,
          policy delivery, and support.
        </p>

        <div className="mt-8 space-y-4">
          {faqItems.map((item) => (
            <article
              key={item.id}
              id={item.id}
              className="scroll-mt-28 rounded-[22px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.88)] px-5 py-5"
            >
              <h2 className="text-lg font-semibold leading-7 text-[var(--ink)]">{item.question}</h2>
              <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
