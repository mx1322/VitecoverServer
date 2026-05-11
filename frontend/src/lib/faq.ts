import type { Locale } from "@/lib/i18n/config";

export type FaqTag = "home" | "quote" | "support";

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  tags: FaqTag[];
};

type FaqEntry = {
  id: string;
  tags: FaqTag[];
  translations: Record<Locale, { question: string; answer: string }>;
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
      fr: {
        question: "Qu'est-ce qu'une assurance auto temporaire ?",
        answer:
          "L'assurance auto temporaire couvre une courte duree, souvent de 1 a 90 jours. Elle sert pour une conduite ponctuelle, un transfert de vehicule, l'attente d'un contrat annuel ou un besoin legal urgent.",
      },
      zh: {
        question: "什么是临时汽车保险？",
        answer:
          "临时汽车保险是一种短期车辆保障，通常从 1 天到 90 天。常用于临时用车、车辆过户、等待年度保单生效或紧急合法上路。",
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
      fr: {
        question: "Que couvre generalement l'assurance temporaire ?",
        answer:
          "La garantie de base est generalement la responsabilite civile, qui couvre les dommages corporels ou materiels causes a des tiers. Certaines offres peuvent inclure une assistance juridique ou routiere.",
      },
      zh: {
        question: "临时汽车保险通常保障什么？",
        answer:
          "基础保障通常包括第三方责任险，用于赔付对他人造成的人身伤害或财产损失。部分方案也可能包含法律协助或道路救援。",
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
      fr: {
        question: "Qui peut souscrire ?",
        answer:
          "Les criteres habituels incluent un age minimum, un permis valide pour la categorie du vehicule et une anciennete de permis suffisante. L'eligibilite finale depend de la souscription.",
      },
      zh: {
        question: "谁可以申请？",
        answer:
          "常见要求包括达到最低年龄、持有对应车辆类别的有效驾照，并满足最低驾驶经验要求。最终资格取决于核保。",
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
      fr: {
        question: "Puis-je souscrire avec un permis etranger ?",
        answer:
          "Dans de nombreux cas, oui. Le permis doit etre valide, adapte a la categorie du vehicule assure et conforme aux regles documentaires locales.",
      },
      zh: {
        question: "可以使用外国驾照申请吗？",
        answer:
          "通常可以，但驾照必须有效、匹配车辆类别，并符合当地对翻译件或国际驾照的要求。",
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
      fr: {
        question: "Quels vehicules sont generalement acceptes ?",
        answer:
          "Les contrats temporaires standards visent surtout les voitures particulieres et certains vehicules legers. Les poids lourds, camping-cars, transports de personnes ou vehicules speciaux peuvent necessiter des produits dedies.",
      },
      zh: {
        question: "哪些车辆通常符合条件？",
        answer:
          "标准临时车险通常适用于私家乘用车和部分轻型车辆。重型车辆、房车、商业客运或特殊用途车辆通常需要专门产品。",
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
      fr: {
        question: "Quels documents preparer avant l'achat ?",
        answer:
          "Vous aurez generalement besoin des informations du permis, de la carte grise et d'un email valide pour la livraison numerique. Des justificatifs complementaires peuvent etre demandes lors de la revue manuelle.",
      },
      zh: {
        question: "下单前需要准备哪些文件？",
        answer:
          "通常需要驾驶证信息、车辆登记信息，以及可接收电子保单的邮箱。如触发人工审核，可能需要额外证明文件。",
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
      fr: {
        question: "Comment verifier la validite territoriale ?",
        answer:
          "Consultez toujours les conditions du contrat et les pays indiques sur l'attestation d'assurance. La zone de couverture et les exigences legales varient selon la destination.",
      },
      zh: {
        question: "如何确认保障在哪些地区有效？",
        answer:
          "请查看保单条款和保险凭证中列明的国家或地区。保障范围和文件要求可能因目的地而异，出行前应确认。",
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
      fr: {
        question: "Quand recevrai-je le contrat ?",
        answer:
          "Apres paiement et validation, les documents sont generalement emis rapidement par email. Le delai peut etre plus long si une verification manuelle est necessaire.",
      },
      zh: {
        question: "多久可以收到保单？",
        answer:
          "支付成功并完成资料验证后，电子保单通常会尽快通过邮件发送。如需人工核保，时间可能更长。",
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
      fr: {
        question: "Puis-je renouveler une assurance temporaire ?",
        answer:
          "Vous pouvez generalement demander une nouvelle periode courte, sous reserve des regles de souscription, de l'historique de sinistres, du profil du vehicule et des tarifs en vigueur.",
      },
      zh: {
        question: "临时车险到期后可以续保吗？",
        answer:
          "通常可以申请新的短期保障，但是否可续、期限和价格取决于核保规则、理赔历史和车辆信息。",
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
      fr: {
        question: "Puis-je annuler ou obtenir un remboursement ?",
        answer:
          "Les produits courts de responsabilite civile auto sont souvent non annulables une fois la couverture commencee. Si le dossier est encore en attente, un remboursement peut etre possible selon les regles de la plateforme.",
      },
      zh: {
        question: "可以取消或退款吗？",
        answer:
          "短期车辆责任险一旦生效通常不能自由取消。如果尚未生效且仍在审核中，可能可按平台规则扣除相关费用后退款。",
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
      fr: {
        question: "Que se passe-t-il si je conduis sans assurance ?",
        answer:
          "Conduire sans assurance peut entrainer de lourdes sanctions, l'immobilisation du vehicule, des sanctions sur le permis et une responsabilite personnelle importante.",
      },
      zh: {
        question: "无保险驾驶会怎样？",
        answer:
          "无保险驾驶可能导致严重法律处罚、车辆扣押、驾照处罚和重大民事责任。驾驶前务必确认保障已生效。",
      },
    },
  },
];

export function getFaqItems(locale: Locale = "en"): FaqItem[] {
  return faqEntries.map((entry) => ({
    id: entry.id,
    tags: entry.tags,
    question: entry.translations[locale].question,
    answer: entry.translations[locale].answer,
  }));
}

export function getFaqByTag(tag: FaqTag, locale: Locale = "en") {
  return getFaqItems(locale).filter((item) => item.tags.includes(tag));
}
