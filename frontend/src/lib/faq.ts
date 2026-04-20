export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  tags: Array<"home" | "quote" | "support">;
};

export const faqItems: FaqItem[] = [
  {
    id: "what-is-temporary-insurance",
    question: "What is temporary auto insurance?",
    answer:
      "Temporary auto insurance gives short-term cover from 1 day up to product limits. It is useful for urgent or occasional driving needs.",
    tags: ["home", "quote"],
  },
  {
    id: "which-documents-needed",
    question: "Which documents do I need before ordering?",
    answer:
      "Prepare driver licence details, vehicle registration details, and a valid contact email. Some orders may require extra proof during manual review.",
    tags: ["quote", "support"],
  },
  {
    id: "how-fast-policy-arrives",
    question: "How quickly will I receive my policy?",
    answer:
      "After payment and review, the policy is sent to your email. Review time depends on risk checks and document status.",
    tags: ["home", "quote", "support"],
  },
  {
    id: "can-i-edit-quote",
    question: "Can I edit my quote before payment?",
    answer:
      "Yes. You can update product, duration, vehicle, and driver details before final confirmation.",
    tags: ["quote"],
  },
  {
    id: "how-to-contact-support",
    question: "How can I contact support?",
    answer:
      "Use support@vitecover.example and include your quote or policy reference so the team can help faster.",
    tags: ["support"],
  },
];

export function getFaqByTag(tag: FaqItem["tags"][number]) {
  return faqItems.filter((item) => item.tags.includes(tag));
}
