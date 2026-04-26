import { homeContent as enHome } from "@/content/en/home";
import { productsContent as enProducts } from "@/content/en/products";
import { faqContent as enFaq } from "@/content/en/faq";
import { legalContent as enLegal } from "@/content/en/legal";
import { homeContent as frHome } from "@/content/fr/home";
import { productsContent as frProducts } from "@/content/fr/products";
import { faqContent as frFaq } from "@/content/fr/faq";
import { legalContent as frLegal } from "@/content/fr/legal";
import { homeContent as zhHome } from "@/content/zh/home";
import { productsContent as zhProducts } from "@/content/zh/products";
import { faqContent as zhFaq } from "@/content/zh/faq";
import { legalContent as zhLegal } from "@/content/zh/legal";
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

const byLocale = {
  fr: { home: frHome, products: frProducts, faq: frFaq, legal: frLegal },
  en: { home: enHome, products: enProducts, faq: enFaq, legal: enLegal },
  zh: { home: zhHome, products: zhProducts, faq: zhFaq, legal: zhLegal },
} as const;

function contentFor(locale: Locale) {
  return byLocale[locale] ?? byLocale[defaultLocale];
}

function fallbackLog(kind: string, key: string, locale: Locale) {
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[content] Missing ${kind} for key "${key}" in locale "${locale}", fallback to "${defaultLocale}".`);
  }
}

export function getHomeContent(locale: Locale): HomeContent {
  return contentFor(locale).home;
}

export function getProductsContent(locale: Locale): ProductsContent {
  return contentFor(locale).products;
}

export function getProductContent(locale: Locale, code: string): ProductContentItem | null {
  const localItem = contentFor(locale).products[code];
  if (localItem) {
    return localItem;
  }

  const fallbackItem = contentFor(defaultLocale).products[code];
  if (fallbackItem) {
    fallbackLog("product content", code, locale);
    return fallbackItem;
  }

  return null;
}

export function getFaqContent(locale: Locale): FaqContent {
  return contentFor(locale).faq;
}

export function getFaqItemContent(locale: Locale, slug: string): FaqContentItem | null {
  const localItem = contentFor(locale).faq[slug];
  if (localItem) {
    return localItem;
  }

  const fallbackItem = contentFor(defaultLocale).faq[slug];
  if (fallbackItem) {
    fallbackLog("faq content", slug, locale);
    return fallbackItem;
  }

  return null;
}

export function getLegalContent(locale: Locale): LegalContent {
  return contentFor(locale).legal;
}

export function getLegalPageContent(locale: Locale, key: keyof LegalContent): LegalPageContent | null {
  const localItem = contentFor(locale).legal[key] ?? null;
  if (localItem) {
    return localItem;
  }

  const fallbackItem = contentFor(defaultLocale).legal[key] ?? null;
  if (fallbackItem) {
    fallbackLog("legal content", String(key), locale);
    return fallbackItem;
  }

  return null;
}
