# CONTENT_SCHEMA.md — Frontend Multilingual Content Schema

## Purpose

This document defines the schema for the frontend multilingual content layer.

It applies to:

```text
frontend/src/content/
  fr/
    home.ts
    products.ts
    faq.ts
    legal.ts
  en/
    home.ts
    products.ts
    faq.ts
    legal.ts
  zh/
    home.ts
    products.ts
    faq.ts
    legal.ts

This schema exists so that:

all locales follow the same structure
long-form multilingual content is predictable and typed
the frontend can merge Directus structured data with localized frontend content reliably
Codex can implement content loading without guessing field names
Global rule

Each locale folder (fr, en, zh) must expose the same content shape.

That means:

same file names
same exported object names
same keys
same required fields

The wording changes by locale.
The structure does not.

1. File overview
home.ts

Owns homepage long-form content.

Use for:

hero copy
trust/highlight cards
process steps
section intros
home-page content blocks

Do not use for:

generic button labels
navigation labels
account menu labels

Those belong in messages/*.json.

products.ts

Owns localized product presentation content.

Use for:

product title
short description
long description
SEO title
SEO description
bullet highlights
optional eligibility/coverage info

Do not use for:

product id
slug
code
icon
category
price
publish state

Those belong in Directus.

faq.ts

Owns localized FAQ wording.

Use for:

question
answer
optional SEO title/description
optional short summary if needed

Do not use for:

FAQ ordering
publish state
category IDs if that is managed structurally in Directus
legal.ts

Owns localized legal / informational static content.

Use for:

privacy page body
terms page body
regulatory information page body
optional page-level SEO copy
2. Shared principles
2.1 Stable keys are mandatory

Each content item must be keyed by a stable identifier.

Examples:

products → keyed by product code (preferred) or stable slug
FAQ → keyed by FAQ slug
legal pages → keyed by page id like privacy, terms, regulatory
home sections → keyed by section name like hero, trustHighlights, steps
2.2 No locale-specific field drift

Do not allow:

one locale to have extra fields not present elsewhere
one locale to rename keys
one locale to omit required sections
2.3 Keep content plain and explicit

Prefer explicit content objects over overengineered CMS-like abstractions.

This layer is repo-owned content, not a mini CMS.

3. home.ts schema
Required export

Each locale home.ts must export:

export const homeContent = { ... }
Type shape
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
Example structure
export const homeContent = {
  hero: {
    badge: "Temporary Auto Insurance",
    title: "Get temporary auto insurance in minutes.",
    subtitle: "Choose your cover online and receive your policy by email after review.",
    primaryCtaLabel: "Start Quote",
    secondaryCtaLabel: "Browse Products",
  },
  trustHighlights: [
    {
      key: "online",
      title: "100% online process",
      description: "Complete the process online from product selection to payment.",
    },
    {
      key: "fast",
      title: "Fast policy delivery",
      description: "Receive your policy by email after review.",
    },
  ],
  processSteps: [
    {
      key: "choose",
      title: "Choose a product",
      description: "Select the right temporary insurance product for your vehicle.",
    },
    {
      key: "details",
      title: "Enter your details",
      description: "Provide vehicle and driver information.",
    },
    {
      key: "pay",
      title: "Pay online",
      description: "Confirm your order securely online.",
    },
    {
      key: "receive",
      title: "Receive your policy",
      description: "Get your policy documents by email after review.",
    },
  ],
  sections: {
    productsIntro: {
      title: "Choose your cover",
      subtitle: "Temporary insurance products for different vehicle types.",
    },
    faqIntro: {
      title: "Frequently Asked Questions",
      subtitle: "Answers to common questions about temporary insurance.",
    },
  },
};
Rules
hero is required
trustHighlights is required, but may be an empty array if not used yet
processSteps is required
sections is optional
4. products.ts schema
Required export

Each locale products.ts must export:

export const productsContent = { ... }
Keying rule

This object must be keyed by stable product code.

Preferred key

Use code from Directus products.

Example:

PASSENGER_CAR
LIGHT_COMMERCIAL_VAN
HEAVY_GOODS_VEHICLE
COACH_BUS
MOTORHOME
TRAILER

If stable code is not available yet, temporarily use stable slug, but the target is product code.

Type shape
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
Example structure
export const productsContent = {
  PASSENGER_CAR: {
    title: "Passenger Car",
    shortDescription: "Temporary insurance for private passenger cars.",
    longDescription:
      "This product is designed for temporary motor insurance needs for private passenger vehicles. It is suitable for short-term cover when you need fast online purchase and policy delivery after review.",
    seoTitle: "Temporary Passenger Car Insurance | Vitecover",
    seoDescription:
      "Buy temporary passenger car insurance online. Fast quote, payment and policy delivery after review.",
    highlights: [
      "Short-term cover",
      "Online purchase flow",
      "Policy sent by email after review"
    ],
    eligibility: [
      "Valid driver information required",
      "Vehicle details required"
    ],
    coverageNotes: [
      "Availability depends on underwriting review"
    ]
  }
};
Rules
title, shortDescription, longDescription are required
seoTitle and seoDescription are optional but strongly recommended
highlights, eligibility, coverageNotes are optional
every active product in Directus should have a corresponding entry here
Rendering rule

Frontend pages should:

fetch structured product data from Directus
read product.code
resolve productsContent[product.code]
render merged data
5. faq.ts schema
Required export

Each locale faq.ts must export:

export const faqContent = { ... }
Keying rule

FAQ entries must be keyed by stable FAQ slug.

Type shape
export type FaqContentItem = {
  question: string;
  answer: string;
  seoTitle?: string;
  seoDescription?: string;
  summary?: string;
};

export type FaqContent = Record<string, FaqContentItem>;
Example structure
export const faqContent = {
  "what-is-temporary-auto-insurance": {
    question: "What is temporary auto insurance?",
    answer:
      "Temporary auto insurance is short-term motor cover designed for limited periods. It can be useful when you need fast cover for a specific short duration.",
    seoTitle: "What is Temporary Auto Insurance? | Vitecover",
    seoDescription:
      "Learn what temporary auto insurance is and how it works.",
    summary: "Short-term motor cover for limited periods."
  },
  "how-do-i-receive-my-policy": {
    question: "How do I receive my policy?",
    answer:
      "After payment and review, the policy is sent by email.",
  }
};
Rules
question and answer are required
key must match the stable FAQ slug
if Directus controls FAQ ordering/publish status, frontend should filter/render only those items that are valid/published
frontend wording remains in repo content
6. legal.ts schema
Required export

Each locale legal.ts must export:

export const legalContent = { ... }
Keying rule

Legal page keys should be stable and explicit.

Recommended keys:

privacy
terms
regulatory
legalNotice
Type shape
export type LegalPageContent = {
  title: string;
  body: string;
  seoTitle?: string;
  seoDescription?: string;
};

export type LegalContent = {
  privacy?: LegalPageContent;
  terms?: LegalPageContent;
  regulatory?: LegalPageContent;
  legalNotice?: LegalPageContent;
};
Example structure
export const legalContent = {
  privacy: {
    title: "Privacy Policy",
    body: "This page explains how personal data is processed...",
    seoTitle: "Privacy Policy | Vitecover",
    seoDescription: "Read the Vitecover privacy policy."
  },
  terms: {
    title: "Terms and Conditions",
    body: "These terms govern the use of the site and purchase process..."
  }
};
Rules
title and body are required for any legal page that exists
body can be plain text or later evolve to markdown-compatible content if needed
keep legal structure identical across locales even if wording evolves
7. lib/content/get-content.ts contract

This module should be the single access layer for frontend long-form localized content.

Recommended exports
export function getHomeContent(locale: Locale): HomeContent;
export function getProductsContent(locale: Locale): ProductsContent;
export function getProductContent(locale: Locale, code: string): ProductContentItem | null;
export function getFaqContent(locale: Locale): FaqContent;
export function getFaqItemContent(locale: Locale, slug: string): FaqContentItem | null;
export function getLegalContent(locale: Locale): LegalContent;
export function getLegalPageContent(locale: Locale, key: keyof LegalContent): LegalPageContent | null;
Rules
must return locale-specific content
should fall back to default locale (fr) only if appropriate and explicit
should not silently hide missing content errors during development
8. Type definitions

Suggested type organization:

types/
  content.ts
  product.ts
  faq.ts
Recommended types/content.ts
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
  privacy?: LegalPageContent;
  terms?: LegalPageContent;
  regulatory?: LegalPageContent;
  legalNotice?: LegalPageContent;
};
9. Validation rules

These content files should be easy to validate.

Required validation checks
all locales export the same top-level object names
all locales contain the same product keys
all locales contain the same FAQ slugs
all locales contain the same legal page keys
all required product fields exist
all required FAQ fields exist
all required homepage sections exist

If a key exists in fr, it should normally exist in en and zh too.

10. KPI / success criteria

This content schema is correctly implemented when:

Homepage KPI
each locale has a complete homeContent
homepage renders locale-specific hero/blocks from frontend content
Product KPI
each active product can be resolved from Directus structure to localized frontend content
product detail pages render locale-specific long descriptions
FAQ KPI
each FAQ slug resolves to localized question/answer content
FAQ wording is frontend-owned and consistent
Legal KPI
legal pages can render locale-specific content from legal.ts
Consistency KPI
all locale files share the same structure
no locale-specific drift breaks rendering
11. Testing plan
Manual tests
render homepage in fr, en, zh
render products list in fr, en, zh
render one product detail page in fr, en, zh
render FAQ page in fr, en, zh
Content mapping tests
confirm Directus product code maps to a productsContent entry
confirm FAQ slug maps to a faqContent entry
Failure mode tests
missing content key should fail clearly in development
build should still succeed when content is complete
no locale should silently render wrong product text due to inconsistent keys
12. What Codex should do with this schema

Codex should:

create or normalize the content/{locale} files to match this schema
create matching TypeScript types
create lib/content/get-content.ts
wire pages to use these content sources
keep Directus for structured/default-language business data only

Codex should not:

invent a different schema per locale
move long-form multilingual wording back into Directus
use arbitrary field names that differ from this document
mix long-form page text into messages/*.json
13. Final rule

If there is a conflict between:

frontend dictionaries
frontend long-form content files
Directus structured data

Use this priority:

Directus for structure and business data
frontend content files for long-form locale text
frontend dictionaries for short UI text

That is the target architecture.
