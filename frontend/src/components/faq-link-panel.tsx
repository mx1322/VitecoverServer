import Link from "next/link";

import type { FaqItem } from "@/lib/faq";
import type { Locale } from "@/lib/i18n/config";
import { localizePath } from "@/lib/i18n/routing";
import { t } from "@/lib/i18n/translations";

export function FaqLinkPanel({
  title,
  intro,
  items,
  locale,
}: {
  title: string;
  intro: string;
  items: FaqItem[];
  locale: Locale;
}) {
  return (
    <section className="rounded-[28px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.92)] p-6 shadow-[0_18px_50px_rgba(22,36,58,0.05)] md:p-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">{t(locale, "FAQ")}</p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--ink)] md:text-3xl">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">{intro}</p>

      <div className="mt-5 space-y-2">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`${localizePath("/faq", locale)}#${item.id}`}
            className="block rounded-2xl border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.88)] px-4 py-3 text-sm font-medium text-[var(--ink)] transition hover:bg-[rgba(22,36,58,0.03)]"
          >
            {item.question}
          </Link>
        ))}
      </div>

      <Link
        href={localizePath("/faq", locale)}
        className="mt-5 inline-flex items-center rounded-full border border-[rgba(22,36,58,0.12)] px-4 py-2 text-sm font-semibold text-[var(--ink)] transition hover:bg-[rgba(22,36,58,0.03)]"
      >
        {t(locale, "View all FAQs")}
      </Link>
    </section>
  );
}
