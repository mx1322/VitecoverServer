import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SectionCard } from "@/components/ui/section-card";
import { getPageSections } from "@/lib/directus/page-sections";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { buildLocaleMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) {
    return {};
  }

  const dictionary = await getDictionary(locale);
  return buildLocaleMetadata("/", locale, {
    title: dictionary.home.title,
    description: dictionary.home.body,
  });
}

export default async function LocaleHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [dictionary, sections] = await Promise.all([
    getDictionary(locale),
    getPageSections("home", locale as Locale),
  ]);

  const hero = sections.find((section) => section.sectionKey === "hero");

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <section className="rounded-[32px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] p-8 shadow-[0_18px_50px_rgba(22,36,58,0.05)]">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">{hero?.eyebrow ?? dictionary.home.eyebrow}</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[var(--ink)]">{hero?.title ?? dictionary.home.title}</h1>
        <p className="mt-3 text-lg text-[var(--muted)]">{hero?.subtitle ?? dictionary.home.subtitle}</p>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-[var(--muted)]">{hero?.body ?? dictionary.home.body}</p>
        <div className="mt-6">
          <Link href={`/${locale}/quote`} className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--ink)]">{hero?.ctaPrimaryLabel ?? dictionary.cta.getQuote}</Link>
        </div>
      </section>

      {sections.filter((section) => section.sectionKey !== "hero").length > 0 ? (
        <section className="mt-8 grid gap-4 md:grid-cols-2">
          {sections.filter((section) => section.sectionKey !== "hero").map((section) => (
            <SectionCard key={section.id}>
              <h2 className="text-xl font-semibold text-[var(--ink)]">{section.title}</h2>
              <p className="mt-2 text-sm text-[var(--muted)]">{section.body}</p>
            </SectionCard>
          ))}
        </section>
      ) : null}
    </main>
  );
}
