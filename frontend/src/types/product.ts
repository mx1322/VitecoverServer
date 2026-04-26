export type ProductRecord = {
  id: number;
  slug: string;
  code: string;
  category: string | null;
  icon: string | null;
  basePriceFrom: number | null;
};
