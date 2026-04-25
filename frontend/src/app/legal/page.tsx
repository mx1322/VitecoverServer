import { SimpleContentPage } from "@/components/simple-content-page";
import type { Locale } from "@/lib/i18n";

export function LegalPageContent({ locale }: { locale: Locale }) {
  const copy = {
    en: {
      eyebrow: "Legal",
      title: "Legal Notice",
      intro: "This page provides the basic legal and publishing information for the Vitecover website and its online temporary insurance activity.",
      body: [
        "Vitecover is presented as an online insurance platform focused on temporary auto insurance products.",
        "Operational, underwriting, and document-delivery steps remain subject to internal review and insurer-side validation.",
        "Further company and regulatory disclosures can be provided here as the production legal structure is finalized.",
      ],
    },
    fr: {
      eyebrow: "Mentions",
      title: "Mentions légales",
      intro: "Cette page présente les informations juridiques et éditoriales de base du site Vitecover et de son activité d'assurance auto temporaire.",
      body: [
        "Vitecover est présenté comme une plateforme d'assurance en ligne dédiée aux produits auto temporaires.",
        "Les étapes opérationnelles, de souscription et de livraison des documents restent soumises à la revue interne et à la validation assureur.",
        "Des informations complémentaires juridiques et réglementaires pourront être ajoutées à mesure de la finalisation du cadre de production.",
      ],
    },
    zh: {
      eyebrow: "法律信息",
      title: "法律声明",
      intro: "本页面提供 Vitecover 网站及其临时车险在线业务的基础法律与发布信息。",
      body: [
        "Vitecover 被定位为专注临时汽车保险产品的在线保险平台。",
        "运营、核保与文件交付环节仍需经过内部审核及保险方校验。",
        "随着正式法律架构完善，本页可继续补充公司与监管披露信息。",
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

export default function LegalPage() {
  return <LegalPageContent locale="en" />;
}
