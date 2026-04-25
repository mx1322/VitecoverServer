import Link from "next/link";

import { SimpleContentPage } from "@/components/simple-content-page";
import { getFaqByTag } from "@/lib/faq";
import { contactCopy, localePath, localeToFaqLocale, type Locale } from "@/lib/i18n";

export function ContactPageContent({ locale }: { locale: Locale }) {
  const copy = contactCopy[locale];
  const supportFaq = getFaqByTag("support", localeToFaqLocale(locale)).slice(0, 3);

  return (
    <SimpleContentPage eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro}>
      <p>Email: support@vitecover.example</p>
      <p>
        {locale === "fr"
          ? "Merci d'indiquer la référence devis ou police quand elle est disponible."
          : locale === "zh"
            ? "如有报价单或保单编号，请在支持请求中一并提供。"
            : "Support requests should include the quote or policy reference when available."}
      </p>
      <p>
        {locale === "fr"
          ? "Les questions de livraison de police et d'accès compte peuvent être traitées via le portail client et la boîte support."
          : locale === "zh"
            ? "关于电子保单送达与账户访问的问题，可通过客户门户和支持邮箱处理。"
            : "Digital policy delivery and account access questions can be handled through the customer portal and support mailbox."}
      </p>

      <div className="mt-6 rounded-[22px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.86)] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
          {locale === "fr" ? "Raccourcis FAQ" : locale === "zh" ? "FAQ 快速入口" : "FAQ shortcuts"}
        </p>
        <div className="mt-3 space-y-2">
          {supportFaq.map((item) => (
            <Link
              key={item.id}
              href={`${localePath(locale, "/faq")}#${item.id}`}
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

export default function ContactPage() {
  return <ContactPageContent locale="en" />;
}
