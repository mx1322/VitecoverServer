import { SimpleContentPage } from "@/components/simple-content-page";
import { getRequestLocale } from "@/lib/i18n/server";
import { t } from "@/lib/i18n/translations";

export default async function LegalPage() {
  const locale = await getRequestLocale();

  return (
    <SimpleContentPage
      eyebrow={t(locale, "Legal")}
      title={t(locale, "Legal Notice")}
      intro={t(locale, "This page provides the basic legal and publishing information for the Vitecover website and its online temporary insurance activity.")}
    >
      <p>{t(locale, "Vitecover is presented as an online insurance platform focused on temporary auto insurance products.")}</p>
      <p>{t(locale, "Operational, underwriting, and document-delivery steps remain subject to internal review and insurer-side validation.")}</p>
      <p>{t(locale, "Further company and regulatory disclosures can be provided here as the production legal structure is finalized.")}</p>
    </SimpleContentPage>
  );
}
