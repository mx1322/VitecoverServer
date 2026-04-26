import { defaultLocale, type Locale } from "@/lib/i18n/config";
import type {
  FaqContent,
  FaqContentItem,
  HomeContent,
  LegalContent,
  LegalPageContent,
  ProductContentItem,
  ProductsContent,
} from "@/types/content";

import { homeContent as frHome } from "@/content/fr/home";
import { productsContent as frProducts } from "@/content/fr/products";
import { faqContent as frFaq } from "@/content/fr/faq";
import { legalContent as frLegal } from "@/content/fr/legal";

import { homeContent as enHome } from "@/content/en/home";
import { productsContent as enProducts } from "@/content/en/products";
import { faqContent as enFaq } from "@/content/en/faq";
import { legalContent as enLegal } from "@/content/en/legal";

import { homeContent as zhHome } from "@/content/zh/home";
import { productsContent as zhProducts } from "@/content/zh/products";
import { faqContent as zhFaq } from "@/content/zh/faq";
import { legalContent as zhLegal } from "@/content/zh/legal";

const contentByLocale: Record<Locale, { home: HomeContent; products: ProductsContent; faq: FaqContent; legal: LegalContent }> = {
  fr: { home: frHome, products: frProducts, faq: frFaq, legal: frLegal },
  en: { home: enHome, products: enProducts, faq: enFaq, legal: enLegal },
  zh: { home: zhHome, products: zhProducts, faq: zhFaq, legal: zhLegal },
};

function withFallback<T>(value: T | undefined, fallback: T | undefined): T | null {
  return value ?? fallback ?? null;
}

export function getHomeContent(locale: Locale): HomeContent {
  return contentByLocale[locale].home;
}

export function getProductsContent(locale: Locale): ProductsContent {
  return contentByLocale[locale].products;
}

export function getProductContent(locale: Locale, code: string): ProductContentItem | null {
  const localeProducts = getProductsContent(locale);
  const fallbackProducts = getProductsContent(defaultLocale);
  return withFallback(localeProducts[code], fallbackProducts[code]);
}

export function getFaqContent(locale: Locale): FaqContent {
  return contentByLocale[locale].faq;
}

export function getFaqItemContent(locale: Locale, slug: string): FaqContentItem | null {
  const localeFaq = getFaqContent(locale);
  const fallbackFaq = getFaqContent(defaultLocale);
  return withFallback(localeFaq[slug], fallbackFaq[slug]);
}

export function getLegalContent(locale: Locale): LegalContent {
  return contentByLocale[locale].legal;
}

export function getLegalPageContent(locale: Locale, key: keyof LegalContent): LegalPageContent | null {
  const localeLegal = getLegalContent(locale);
  const fallbackLegal = getLegalContent(defaultLocale);
  return withFallback(localeLegal[key], fallbackLegal[key]);
}
