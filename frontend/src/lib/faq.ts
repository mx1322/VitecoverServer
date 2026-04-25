export type FaqTag = "home" | "quote" | "support";

export type FaqLocale = "en" | "fr" | "zh-CN";

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  tags: FaqTag[];
};

type FaqEntry = {
  id: string;
  tags: FaqTag[];
  translations: Record<"en" | "zh-CN", { question: string; answer: string }> & Partial<Record<"fr", { question: string; answer: string }>>;
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
        question: "What is temporary car insurance?",
        answer:
          "Temporary car insurance is short-term motor coverage, typically available from 1 day to 90 days. It is commonly used for temporary vehicle use, ownership transfer, waiting for an annual policy to start, or urgent legal road use.",
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
        question: "What does temporary car insurance usually cover?",
        answer:
          "Basic coverage usually includes third-party liability (RC/au tiers), which covers bodily injury and property damage caused to others. Some plans may also include legal assistance or roadside support.",
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
        question: "Who can apply?",
        answer:
          "Common requirements include reaching the minimum age (often 21 or older), holding a valid license for the relevant vehicle type, and meeting minimum driving experience requirements (often 2 years or more). Final eligibility depends on underwriting.",
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
        question: "Can I apply with a foreign driving license?",
        answer:
          "Usually yes, but the license must be valid, match the vehicle category, and comply with local rules regarding translations or international driving permits.",
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
        question: "Which vehicles are usually eligible?",
        answer:
          "Standard temporary car insurance usually applies to private passenger cars and some light vehicles. Heavy vehicles, motorhomes, commercial passenger transport, or special-use vehicles usually require dedicated products.",
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
        question: "What documents should I prepare before ordering?",
        answer:
          "You will usually need driving license details, vehicle registration details, and an email address that can receive the electronic policy. Additional supporting documents may be required if manual review is triggered.",
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
        question: "How do I confirm where the coverage is valid?",
        answer:
          "Please refer to the countries or regions listed in the policy terms and insurance certificate. Coverage scope and document requirements may vary by destination, so check before traveling.",
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
        question: "How quickly will I receive the policy?",
        answer:
          "After payment succeeds and your documents are validated, the electronic policy is usually issued by email as soon as possible. If manual underwriting is required, the timing may be longer.",
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
        question: "Can I renew temporary car insurance after it expires?",
        answer:
          "You can usually apply for a new short-term policy, but renewal availability, duration, and pricing depend on underwriting rules, claims history, and vehicle details.",
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
        question: "Can I cancel or get a refund?",
        answer:
          "Short-term motor liability insurance usually cannot be freely canceled once it becomes active. If it has not started yet and is still under review, a refund may be possible according to platform rules after applicable fees.",
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
        question: "What happens if I drive without insurance?",
        answer:
          "Driving without insurance may lead to serious legal penalties, vehicle impoundment, license sanctions, and major civil liability risk. Always make sure coverage is active before driving.",
      },
    },
  },
];

export function getFaqItems(locale: FaqLocale = "en"): FaqItem[] {
  return faqEntries.map((entry) => ({
    id: entry.id,
    tags: entry.tags,
    question: (entry.translations[locale] ?? entry.translations.en).question,
    answer: (entry.translations[locale] ?? entry.translations.en).answer,
  }));
}

export const faqItems: FaqItem[] = getFaqItems("en");

export function getFaqByTag(tag: FaqTag, locale: FaqLocale = "en") {
  return getFaqItems(locale).filter((item) => item.tags.includes(tag));
}
