export type FaqTag = "home" | "quote" | "support";

export type FaqLocale = "en" | "zh-CN";

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  tags: FaqTag[];
};

type FaqEntry = {
  id: string;
  tags: FaqTag[];
  translations: Record<FaqLocale, { question: string; answer: string }>;
};

const faqEntries: FaqEntry[] = [
  {
    id: "what-is-temporary-insurance",
    tags: ["home", "quote"],
    translations: {
      en: {
        question: "What is temporary car insurance?",
        answer:
          "Temporary car insurance is short-duration cover, usually from 1 day up to 90 days. It is often used for occasional driving, vehicle transfer, waiting for an annual policy, or urgent legal road use.",
      },
      "zh-CN": {
        question: "什么是临时车险？",
        answer:
          "临时车险是按短周期生效的机动车保险，常见期限为 1 天到 90 天。常用于临时用车、车辆过户、等待年度保单生效或紧急合法上路。",
      },
    },
  },
  {
    id: "coverage-scope",
    tags: ["home", "quote", "support"],
    translations: {
      en: {
        question: "What does temporary cover usually include?",
        answer:
          "Core cover is generally third-party liability (RC/au tiers), which pays for bodily injury or property damage caused to others. Some plans may include legal assistance or roadside support options.",
      },
      "zh-CN": {
        question: "临时车险通常保障什么？",
        answer:
          "基础保障通常为第三者责任险（RC/au tiers），用于赔付对第三方造成的人身与财产损失。部分方案可附加法律援助或道路救援。",
      },
    },
  },
  {
    id: "eligible-drivers",
    tags: ["quote"],
    translations: {
      en: {
        question: "Who is eligible to apply?",
        answer:
          "Typical requirements include minimum age (often 21+), a valid licence for the vehicle category, and a minimum driving history (commonly 2 years or more). Final eligibility depends on underwriting.",
      },
      "zh-CN": {
        question: "谁可以投保？",
        answer:
          "常见要求包括：达到最低年龄（市场上多见 21 岁起）、持有对应车型且在有效期内的驾照、并满足一定驾龄（常见为 2 年及以上）。最终以核保结果为准。",
      },
    },
  },
  {
    id: "foreign-license",
    tags: ["quote", "support"],
    translations: {
      en: {
        question: "Can I apply with a foreign driving licence?",
        answer:
          "In many cases, yes. The licence must be valid, suitable for the insured vehicle class, and compliant with local documentation rules (for example translation or international permit requirements).",
      },
      "zh-CN": {
        question: "持外国驾照可以投保吗？",
        answer:
          "多数情况下可以，但驾照必须有效、与车辆类别匹配，并满足当地法规对翻译件或国际驾照等文件要求。",
      },
    },
  },
  {
    id: "eligible-vehicles",
    tags: ["home", "quote"],
    translations: {
      en: {
        question: "Which vehicles are usually accepted?",
        answer:
          "Most standard temporary policies focus on private passenger cars and some light vehicles. Heavy trucks, motorhomes, commercial passenger transport, or special-use vehicles may need dedicated products.",
      },
      "zh-CN": {
        question: "哪些车辆通常可以投保？",
        answer:
          "标准临时车险多适用于私家乘用车和部分轻型车辆。重型车辆、房车、营运客运或特种用途车辆通常需要专属产品。",
      },
    },
  },
  {
    id: "documents-needed",
    tags: ["quote", "support"],
    translations: {
      en: {
        question: "What documents should I prepare before purchase?",
        answer:
          "You usually need driver licence details, vehicle registration details, and a valid contact email for digital policy delivery. Additional proof may be requested during manual review.",
      },
      "zh-CN": {
        question: "下单前需要准备哪些资料？",
        answer:
          "通常需要驾驶证信息、车辆登记信息，以及可接收电子保单的邮箱。若触发人工审核，可能需要补充证明材料。",
      },
    },
  },
  {
    id: "coverage-region",
    tags: ["home", "support"],
    translations: {
      en: {
        question: "How do I confirm territorial validity?",
        answer:
          "Always check the policy wording and the countries listed on your insurance certificate. Coverage area and legal requirements can vary by destination and travel purpose.",
      },
      "zh-CN": {
        question: "如何确认保障地域是否有效？",
        answer:
          "请以保单条款和保险凭证列明国家/地区为准。不同目的地对保障范围和文件要求可能不同，出行前请先核对。",
      },
    },
  },
  {
    id: "policy-delivery",
    tags: ["quote", "support"],
    translations: {
      en: {
        question: "How quickly will I receive the policy?",
        answer:
          "After payment and successful validation, policy documents are generally issued by email quickly. Timing can be longer when manual underwriting checks are required.",
      },
      "zh-CN": {
        question: "保单多久可以收到？",
        answer:
          "支付成功且资料校验通过后，通常会尽快通过邮件签发电子保单；若需人工核保，时效会相应延长。",
      },
    },
  },
  {
    id: "renewal",
    tags: ["quote", "support"],
    translations: {
      en: {
        question: "Can I renew when a temporary policy expires?",
        answer:
          "You can usually apply for a new short-term period, subject to underwriting rules, claims history, vehicle profile, and current pricing policy.",
      },
      "zh-CN": {
        question: "临时车险到期后可以续保吗？",
        answer:
          "通常可以重新申请新的短期保障，但是否可续、可续时长及费率取决于核保规则、出险记录和车辆情况。",
      },
    },
  },
  {
    id: "cancellation-refund",
    tags: ["support"],
    translations: {
      en: {
        question: "Can I cancel or get a refund?",
        answer:
          "Short-term motor liability products are often non-cancellable once cover starts. If still pending and not yet effective, refunds may be possible under platform rules and applicable fees.",
      },
      "zh-CN": {
        question: "可以撤销或退款吗？",
        answer:
          "短期机动车责任险在生效后通常不支持随意撤销。若尚未生效且处于审核阶段，可能按平台规则扣费后退款。",
      },
    },
  },
  {
    id: "no-insurance-risk",
    tags: ["home", "support"],
    translations: {
      en: {
        question: "What happens if I drive without insurance?",
        answer:
          "Driving uninsured can lead to major legal penalties, vehicle impoundment, licence sanctions, and significant personal liability. Always ensure cover is active before driving.",
      },
      "zh-CN": {
        question: "无保险上路会有什么后果？",
        answer:
          "无保险上路可能导致严重法律处罚、车辆扣留、驾照处罚和高额民事赔偿风险。请务必在上路前确认保障已生效。",
      },
    },
  },
];

export function getFaqItems(locale: FaqLocale = "en"): FaqItem[] {
  return faqEntries.map((entry) => ({
    id: entry.id,
    tags: entry.tags,
    question: entry.translations[locale].question,
    answer: entry.translations[locale].answer,
  }));
}

export const faqItems: FaqItem[] = getFaqItems("en");

export function getFaqByTag(tag: FaqTag, locale: FaqLocale = "en") {
  return getFaqItems(locale).filter((item) => item.tags.includes(tag));
}
