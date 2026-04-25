import { SimpleContentPage } from "@/components/simple-content-page";
import type { Locale } from "@/lib/i18n";

export function TermsPageContent({ locale }: { locale: Locale }) {
  const copy = {
    en: {
      eyebrow: "Terms",
      title: "Terms & Conditions",
      intro: "These terms outline how Vitecover presents temporary auto insurance products online and how customers use the quote and purchase flow.",
      body: [
        "Quotes are subject to product eligibility, vehicle details, driver details, and internal review.",
        "Submitting payment does not replace underwriting or operational checks required before policy delivery.",
        "Policy documentation is delivered digitally after approval and remains subject to the insurer's final validation.",
      ],
    },
    fr: {
      eyebrow: "Conditions",
      title: "Conditions générales",
      intro: "Ces conditions décrivent la présentation des produits d'assurance auto temporaire sur Vitecover et l'usage du parcours devis/achat.",
      body: [
        "Les devis restent soumis à l'éligibilité produit, aux informations véhicule et conducteur, ainsi qu'à la revue interne.",
        "Le paiement ne remplace pas les contrôles de souscription et d'exploitation requis avant la livraison de la police.",
        "La documentation de police est livrée numériquement après approbation et reste soumise à la validation finale de l'assureur.",
      ],
    },
    zh: {
      eyebrow: "条款",
      title: "条款与条件",
      intro: "本条款说明 Vitecover 如何在线展示临时汽车保险产品，以及客户如何使用报价与购买流程。",
      body: [
        "报价需满足产品准入条件，并通过车辆、驾驶员信息及内部审核。",
        "提交支付并不替代保单签发前所需的核保与运营检查。",
        "保单文件在审批通过后以电子方式交付，并以保险公司最终校验结果为准。",
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

export default function TermsPage() {
  return <TermsPageContent locale="en" />;
}
