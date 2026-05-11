import { SimpleContentPage } from "@/components/simple-content-page";
import { getRequestLocale } from "@/lib/i18n/server";
import { t } from "@/lib/i18n/translations";

export default async function RegulatoryPage() {
  const locale = await getRequestLocale();

  return (
    <SimpleContentPage
      eyebrow={t(locale, "Regulatory")}
      title={t(locale, "Regulatory Information")}
      intro={t(locale, "Temporary auto insurance products are presented online, but policy issuance remains subject to review, approval, and regulatory obligations.")}
    >
      <p>Eligibility checks, product conditions, and document issuance should comply with the insurer's regulatory framework.</p>
      <p>Customer-facing policy documents are only delivered after the internal review process is completed.</p>
      <p>This page can host distributor, intermediary, and supervisory authority disclosures as they are finalized for production.</p>
    </SimpleContentPage>
  );
}
