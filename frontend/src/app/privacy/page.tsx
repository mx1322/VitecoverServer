import { SimpleContentPage } from "@/components/simple-content-page";
import type { Locale } from "@/lib/i18n";

export function PrivacyPageContent({ locale }: { locale: Locale }) {
  const copy = {
    en: {
      eyebrow: "Privacy",
      title: "Privacy Policy",
      intro: "Vitecover uses customer, driver, and vehicle data to prepare temporary insurance quotes, process purchases, and deliver approved policy documents.",
      body: [
        "Information provided in the quote flow is used for insurance operations, payment processing, and policy communication.",
        "Only the data required for product selection, review, and policy administration should be collected and retained.",
        "Policy documents and transactional communications are delivered digitally through the platform and by email.",
      ],
    },
    fr: {
      eyebrow: "Confidentialité",
      title: "Politique de confidentialité",
      intro: "Vitecover utilise les données client, conducteur et véhicule pour établir les devis, traiter les achats et livrer les polices approuvées.",
      body: [
        "Les informations saisies dans le parcours devis servent aux opérations d'assurance, au paiement et aux communications de police.",
        "Seules les données nécessaires à la sélection produit, à la revue et à l'administration de police doivent être collectées et conservées.",
        "Les documents de police et communications transactionnelles sont livrés numériquement via la plateforme et par e-mail.",
      ],
    },
    zh: {
      eyebrow: "隐私",
      title: "隐私政策",
      intro: "Vitecover 会使用客户、驾驶员和车辆数据来生成临时保险报价、处理购买并交付已批准的保单文件。",
      body: [
        "报价流程中提供的信息将用于保险运营、支付处理和保单沟通。",
        "仅应收集并保留产品选择、审核与保单管理所需的数据。",
        "保单文件和交易通知将通过平台及电子邮件进行数字化交付。",
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

export default function PrivacyPage() {
  return <PrivacyPageContent locale="en" />;
}
