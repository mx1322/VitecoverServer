import { SimpleContentPage } from "@/components/simple-content-page";

export default function RegulatoryPage() {
  return (
    <SimpleContentPage
      eyebrow="Regulatory"
      title="Regulatory Information"
      intro="Temporary auto insurance products are presented online, but policy issuance remains subject to review, approval, and regulatory obligations."
    >
      <p>Eligibility checks, product conditions, and document issuance should comply with the insurer's regulatory framework.</p>
      <p>Customer-facing policy documents are only delivered after the internal review process is completed.</p>
      <p>This page can host distributor, intermediary, and supervisory authority disclosures as they are finalized for production.</p>
    </SimpleContentPage>
  );
}
