import { SimpleContentPage } from "@/components/simple-content-page";
import type { Locale } from "@/lib/i18n";

export function RegulatoryPageContent({ locale }: { locale: Locale }) {
  const copy = {
    en: {
      eyebrow: "Regulatory",
      title: "Regulatory Information",
      intro: "Temporary auto insurance products are presented online, but policy issuance remains subject to review, approval, and regulatory obligations.",
      body: [
        "Eligibility checks, product conditions, and document issuance should comply with the insurer's regulatory framework.",
        "Customer-facing policy documents are only delivered after the internal review process is completed.",
        "This page can host distributor, intermediary, and supervisory authority disclosures as they are finalized for production.",
      ],
    },
    fr: {
      eyebrow: "Réglementation",
      title: "Informations réglementaires",
      intro: "Les produits d'assurance auto temporaire sont présentés en ligne, mais l'émission des polices reste soumise à la revue, à l'approbation et aux obligations réglementaires.",
      body: [
        "Les contrôles d'éligibilité, conditions produit et l'émission des documents doivent respecter le cadre réglementaire de l'assureur.",
        "Les documents de police destinés au client sont livrés uniquement après la fin du processus de revue interne.",
        "Cette page peut accueillir les informations distributeur, intermédiaire et autorité de supervision lors de leur finalisation.",
      ],
    },
    zh: {
      eyebrow: "监管",
      title: "监管信息",
      intro: "临时车险产品可在线展示，但保单签发仍需经过审核、批准并符合监管要求。",
      body: [
        "准入校验、产品条件和文件签发需符合保险公司的监管框架。",
        "面向客户的保单文件仅在内部审核完成后交付。",
        "随着生产合规信息完善，本页面可承载渠道方、中介方及监管机构相关披露。",
      ],
    },
  }[locale];

  return (
    <SimpleContentPage eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro}>
      {copy.body.map((item) => (
        <p key={item}>{item}</p>
      ))}
    </SimpleContentPage>
  );
}

export default function RegulatoryPage() {
  return <RegulatoryPageContent locale="en" />;
}
