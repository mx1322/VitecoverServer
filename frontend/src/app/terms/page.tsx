import { SimpleContentPage } from "@/components/simple-content-page";
import { getRequestLocale } from "@/lib/i18n/server";
import { t } from "@/lib/i18n/translations";

export default async function TermsPage() {
  const locale = await getRequestLocale();

  return (
    <SimpleContentPage
      eyebrow={t(locale, "Terms")}
      title={t(locale, "Terms & Conditions")}
      intro={t(locale, "These terms outline how Vitecover presents temporary auto insurance products online and how customers use the quote and purchase flow.")}
    >
      <p>Quotes are subject to product eligibility, vehicle details, driver details, and internal review.</p>
      <p>Submitting payment does not replace underwriting or operational checks required before policy delivery.</p>
      <p>Policy documentation is delivered digitally after approval and remains subject to the insurer's final validation.</p>
    </SimpleContentPage>
  );
}
