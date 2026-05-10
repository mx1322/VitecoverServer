export type HomeContent = {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    primaryCtaLabel?: string;
    secondaryCtaLabel?: string;
  };
  trustHighlights: Array<{
    key: string;
    title: string;
    description: string;
  }>;
  processSteps: Array<{
    key: string;
    title: string;
    description?: string;
  }>;
  sections?: {
    productsIntro?: {
      title: string;
      subtitle?: string;
    };
    faqIntro?: {
      title: string;
      subtitle?: string;
    };
  };
};

export type ProductContentItem = {
  title: string;
  shortDescription: string;
  longDescription: string;
  seoTitle?: string;
  seoDescription?: string;
  highlights?: string[];
  eligibility?: string[];
  coverageNotes?: string[];
};

export type ProductsContent = Record<string, ProductContentItem>;

export type FaqContentItem = {
  question: string;
  answer: string;
  seoTitle?: string;
  seoDescription?: string;
  summary?: string;
};

export type FaqContent = Record<string, FaqContentItem>;

export type LegalPageContent = {
  title: string;
  body: string;
  seoTitle?: string;
  seoDescription?: string;
};

export type LegalContent = {
  hub?: LegalPageContent;
  privacy?: LegalPageContent;
  terms?: LegalPageContent;
  regulatory?: LegalPageContent;
  legalNotice?: LegalPageContent;
};
