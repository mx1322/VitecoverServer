import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SectionCard } from "@/components/ui/section-card";
import { getHomeContent } from "@/lib/content/get-content";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { buildLocaleMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) {
    return {};
  }

  const [home, dictionary] = await Promise.all([
    getHomeContent(locale),
    getDictionary(locale),
  ]);
  return buildLocaleMetadata("/", locale, {
    title: home.hero.title,
    description: home.hero.subtitle,
  });
}

export default async function LocaleHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [home, dictionary] = await Promise.all([
    getHomeContent(locale),
    getDictionary(locale),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <section className="rounded-[32px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] p-8 shadow-[0_18px_50px_rgba(22,36,58,0.05)]">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">{home.hero.badge}</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[var(--ink)]">{home.hero.title}</h1>
        <p className="mt-3 text-lg text-[var(--muted)]">{home.hero.subtitle}</p>
        <div className="mt-6 flex gap-3">
          <Link href={`/${locale}/quote`} className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--ink)]">
            {home.hero.primaryCtaLabel}
          </Link>
          <Link href={`/${locale}/products`} className="rounded-full border border-[rgba(22,36,58,0.12)] px-5 py-3 text-sm font-semibold text-[var(--ink)]">
            {home.hero.secondaryCtaLabel}
          </Link>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        {home.trustHighlights.map((section) => (
          <SectionCard key={section.key}>
            <h2 className="text-xl font-semibold text-[var(--ink)]">{section.title}</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">{section.description}</p>
          </SectionCard>
        ))}
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-[var(--ink)]">{home.sections?.productsIntro?.title}</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">{home.sections?.productsIntro?.subtitle}</p>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        {home.processSteps.map((step, index) => (
          <SectionCard key={step.key}>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">{dictionary.common.stepLabel} {index + 1}</p>
            <h3 className="mt-2 text-lg font-semibold text-[var(--ink)]">{step.title}</h3>
            {step.description ? <p className="mt-2 text-sm text-[var(--muted)]">{step.description}</p> : null}
          </SectionCard>
        ))}
      </section>
    </main>
  );
}
