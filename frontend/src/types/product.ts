export type StructuredProduct = {
  id: number;
  slug: string;
  code: string;
  category: string | null;
  icon: string | null;
  basePriceFrom: number | null;
};

export type MergedLocalizedProduct = StructuredProduct & {
  title: string;
  shortDescription: string;
  longDescription: string;
  seoTitle?: string;
  seoDescription?: string;
  highlights?: string[];
  eligibility?: string[];
  coverageNotes?: string[];
};
