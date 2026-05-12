import Link from "next/link";

import { SimpleContentPage } from "@/components/simple-content-page";
import { getFaqByTag } from "@/lib/faq";
import { getRequestLocale } from "@/lib/i18n/server";
import { localizePath } from "@/lib/i18n/routing";
import { t } from "@/lib/i18n/translations";

export default async function ContactPage() {
  const locale = await getRequestLocale();
  const supportFaq = getFaqByTag("support", locale).slice(0, 3);

  return (
    <SimpleContentPage
      eyebrow={t(locale, "Contact")}
      title={t(locale, "Contact")}
      intro={t(locale, "For policy questions, operational support, or document delivery issues, contact the Vitecover support team.")}
    >
      <p>{t(locale, "Email")}: support@vitecover.example</p>
      <p>{t(locale, "Support requests should include the quote or policy reference when available.")}</p>
      <p>
        {t(locale, "Digital policy delivery and account access questions can be handled through the customer portal and support mailbox.")}
      </p>

      <div className="mt-6 rounded-[22px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.86)] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">{t(locale, "FAQ shortcuts")}</p>
        <div className="mt-3 space-y-2">
          {supportFaq.map((item) => (
            <Link
              key={item.id}
              href={`${localizePath("/faq", locale)}#${item.id}`}
              className="block rounded-xl border border-[rgba(22,36,58,0.08)] px-3 py-2 text-sm text-[var(--ink)] hover:bg-[rgba(22,36,58,0.03)]"
            >
              {item.question}
            </Link>
          ))}
        </div>
      </div>
    </SimpleContentPage>
  );
}
