export const locales = ["en", "fr", "zh"] as const;

export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export const languageLabels: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  zh: "中文",
};

export function localePath(locale: Locale, path: string): string {
  if (!path.startsWith("/")) {
    return path;
  }

  if (locale === "en") {
    return path;
  }

  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

export function localeToFaqLocale(locale: Locale): "en" | "fr" | "zh-CN" {
  if (locale === "zh") {
    return "zh-CN";
  }

  return locale;
}

export interface HomeCopy {
  heroTitle: string;
  productsIntro: string;
  howItWorksTitle: string;
  howItWorksIntro: string;
  steps: string[];
  stepPrefix: string;
  faqTitle: string;
  faqIntro: string;
  whyTitle: string;
  whyItems: string[];
}

export interface GenericPageCopy {
  eyebrow: string;
  title: string;
  intro: string;
}

export const homeCopy: Record<Locale, HomeCopy> = {
  en: {
    heroTitle: "Get temporary auto insurance in minutes.",
    productsIntro: "Choose your temporary insurance products according to vehicle types.",
    howItWorksTitle: "How it works",
    howItWorksIntro: "A simple online flow from product selection to policy delivery.",
    steps: [
      "Choose a product",
      "Enter driver and vehicle details",
      "Pay online",
      "Receive your policy by email after review",
    ],
    stepPrefix: "Step",
    faqTitle: "Common questions before you order",
    faqIntro:
      "To reduce friction, we keep key answers short and link directly to the right FAQ entries.",
    whyTitle: "Why choose Vitecover",
    whyItems: [
      "100% online process",
      "Short-term insurance products",
      "Policy documents delivered digitally",
    ],
  },
  fr: {
    heroTitle: "Obtenez votre assurance auto temporaire en quelques minutes.",
    productsIntro:
      "Choisissez vos produits d'assurance temporaire selon le type de véhicule.",
    howItWorksTitle: "Comment ça marche",
    howItWorksIntro:
      "Un parcours en ligne simple, du choix du produit à la réception de la police.",
    steps: [
      "Choisissez un produit",
      "Saisissez les informations du conducteur et du véhicule",
      "Payez en ligne",
      "Recevez votre police par e-mail après vérification",
    ],
    stepPrefix: "Étape",
    faqTitle: "Questions fréquentes avant de commander",
    faqIntro:
      "Pour réduire les frictions, nous gardons les réponses essentielles courtes et liées aux bonnes FAQ.",
    whyTitle: "Pourquoi choisir Vitecover",
    whyItems: [
      "Processus 100% en ligne",
      "Produits d'assurance courte durée",
      "Documents de police livrés en version numérique",
    ],
  },
  zh: {
    heroTitle: "几分钟内即可获得临时汽车保险。",
    productsIntro: "可根据车辆类型选择对应的临时保险产品。",
    howItWorksTitle: "流程说明",
    howItWorksIntro: "从选择产品到保单送达，整个流程在线完成且非常简洁。",
    steps: ["选择保险产品", "填写驾驶员和车辆信息", "在线支付", "审核后通过邮件接收保单"],
    stepPrefix: "步骤",
    faqTitle: "下单前常见问题",
    faqIntro: "为减少中断，我们将关键答案精简展示，并直达相关 FAQ 条目。",
    whyTitle: "为什么选择 Vitecover",
    whyItems: ["100% 在线流程", "短期保险产品", "保单文件数字化交付"],
  },
};

export const contactCopy: Record<Locale, GenericPageCopy> = {
  en: {
    eyebrow: "Contact",
    title: "Contact",
    intro: "For policy questions, operational support, or document delivery issues, contact the Vitecover support team.",
  },
  fr: {
    eyebrow: "Contact",
    title: "Contact",
    intro: "Pour toute question sur la police, le support opérationnel ou la livraison des documents, contactez l'équipe Vitecover.",
  },
  zh: {
    eyebrow: "联系我们",
    title: "联系我们",
    intro: "如有保单问题、运营支持或文件送达问题，请联系 Vitecover 支持团队。",
  },
};

export const faqPageCopy: Record<Locale, GenericPageCopy> = {
  en: {
    eyebrow: "Knowledge Base",
    title: "Frequently Asked Questions",
    intro: "Quick answers for customers and for search engines: cover, order steps, documents, policy delivery, and support.",
  },
  fr: {
    eyebrow: "Base de connaissances",
    title: "Questions fréquentes",
    intro: "Réponses rapides sur la couverture, les étapes de commande, les documents, la livraison de police et le support.",
  },
  zh: {
    eyebrow: "知识库",
    title: "常见问题",
    intro: "为客户和搜索引擎提供快速答案：保障范围、下单流程、所需文件、保单交付与支持。",
  },
};

export const quotePageCopy: Record<Locale, { eyebrow: string; title: string; intro: string; faqTitle: string; faqIntro: string }> = {
  en: {
    eyebrow: "Temporary auto checkout",
    title: "Get insured in 4 simple steps.",
    intro: "Choose product and duration, fill in vehicle and driver details, confirm payment, then receive your policy by email after review.",
    faqTitle: "Need help before payment?",
    faqIntro: "Use these quick answers to avoid drop-off during checkout and find full details when needed.",
  },
  fr: {
    eyebrow: "Parcours d'achat temporaire",
    title: "Assurez-vous en 4 étapes simples.",
    intro: "Choisissez le produit et la durée, saisissez les informations véhicule et conducteur, validez le paiement puis recevez la police par e-mail après vérification.",
    faqTitle: "Besoin d'aide avant le paiement ?",
    faqIntro: "Utilisez ces réponses rapides pour éviter les abandons et accéder aux détails utiles.",
  },
  zh: {
    eyebrow: "临时保险结算",
    title: "4 个简单步骤即可完成投保。",
    intro: "选择产品与保障时长，填写车辆和驾驶员信息，确认支付，审核后通过邮件接收保单。",
    faqTitle: "支付前需要帮助吗？",
    faqIntro: "先看这些快速答案，降低中途退出并快速找到完整说明。",
  },
};
