# AGENT.md — Vitecover Frontend Multilingual Architecture Guide

## Purpose

This document defines the **target multilingual frontend architecture** for the `Lang` branch.

It exists to prevent overengineering and to keep the multilingual implementation aligned with the real business need:

- France-first insurance website
- Three important languages: **French, English, Chinese**
- One shared business logic layer
- One shared frontend codebase
- Frontend owns multilingual presentation
- Directus stays focused on structured/default-language business data

This document is the source of truth for how multilingual code should be implemented.

---

## Non-goals

Do **not** do the following:

- Do not build three separate codebases
- Do not maintain separate long-lived branches per language
- Do not move all translation responsibility into Directus
- Do not duplicate page logic for `fr`, `en`, and `zh`
- Do not use multilingual work as an excuse to rewrite unrelated business logic
- Do not deeply polish wording during architecture tasks
- Do not touch `main`
- Do not touch `dev`

---

## Branch policy

Work only on:

- `Lang`

Do not modify:

- `main` → production
- `dev` → CI/CD, metadata backup, deployment-side work

The `Lang` branch is the **integration branch for multilingual architecture only**.

---

## Core architecture rule

The multilingual architecture must follow this rule:

### Frontend owns multilingual presentation
The frontend repo is the source of truth for:
- UI text
- product descriptions
- FAQ wording
- hero copy
- legal text shown to users
- locale routing
- language switching

### Directus owns structured business data
Directus is the source of truth for:
- product identifiers
- slugs
- codes
- categories
- icons
- prices
- sort order
- publish status
- account/business records
- order/customer data
- operational metadata

### Why this rule exists
Because this project is:
- single-developer
- translation-sensitive
- insurance-specific
- operationally pragmatic

Using Directus as the main multilingual text source would add unnecessary CMS complexity.
The frontend should stay in control of the exact wording of French, English, and Chinese.

---

## Supported locales

Supported locales:

- `fr`
- `en`
- `zh`

Default locale:

- `fr`

Rules:
- `/` should redirect to `/fr`
- every public user-facing route should live under `/[locale]/...`
- invalid locales should fail consistently (404 or route rejection)

---

## Route architecture

Target route structure:

```text
app/
  page.tsx                      -> redirect to /fr
  layout.tsx                    -> root layout only

  [locale]/
    layout.tsx
    page.tsx

    products/
      page.tsx
      [slug]/
        page.tsx

    quote/
      page.tsx

    faq/
      page.tsx

    account/
      layout.tsx
      page.tsx
      policies/
        page.tsx
      drivers/
        page.tsx
      vehicles/
        page.tsx
      documents/
        page.tsx
      settings/
        page.tsx
Route responsibilities
app/page.tsx
only redirect to /fr
app/layout.tsx
root shell only
must not hardcode the language of the entire site
app/[locale]/layout.tsx
validate locale
provide locale-specific header/navigation
load dictionary
set locale-aware metadata/context
ensure language switcher is available
app/[locale]/page.tsx
homepage for that locale
uses localized frontend content
app/[locale]/products/page.tsx
localized products listing page
app/[locale]/products/[slug]/page.tsx
localized product detail page
app/[locale]/quote/page.tsx
shared quote flow page with locale-aware UI text
app/[locale]/faq/page.tsx
localized FAQ page
app/[locale]/account/...
locale-aware account center structure
shared logic, localized presentation
Folder structure

Target structure:

frontend/src/
  app/
    page.tsx
    layout.tsx
    [locale]/
      layout.tsx
      page.tsx
      products/
        page.tsx
        [slug]/
          page.tsx
      quote/
        page.tsx
      faq/
        page.tsx
      account/
        layout.tsx
        page.tsx
        policies/
          page.tsx
        drivers/
          page.tsx
        vehicles/
          page.tsx
        documents/
          page.tsx
        settings/
          page.tsx

  components/
    layout/
      site-header.tsx
      language-switcher.tsx
    account/
      account-sidebar.tsx
      account-summary-card.tsx
    ui/
      section-card.tsx

  lib/
    i18n/
      config.ts
      locales.ts
      get-dictionary.ts
      routing.ts
    content/
      get-content.ts
    directus/
      client.ts
      products.ts
      faq.ts

  messages/
    fr.json
    en.json
    zh.json

  content/
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

  types/
    i18n.ts
    product.ts
    faq.ts
Content architecture

There are three content layers.

Layer 1 — frontend dictionaries (messages/*.json)

Use for short UI text only.

Examples:

navigation labels
button labels
account sidebar labels
status labels
quote step labels
short helper text
validation messages
empty-state text

Do not put large paragraphs here.

Example keys
nav.home
nav.products
cta.getQuote
account.overview
quote.step1
Layer 2 — frontend long-form localized content (content/{locale}/*.ts)

Use for all user-facing long-form content.

Examples:

homepage hero copy
homepage trust blocks
product titles
product short descriptions
product long descriptions
FAQ questions and answers
legal content
marketing text

This layer is preferred over Directus translation tables.

Example files
content/fr/home.ts
content/en/products.ts
content/zh/faq.ts
Layer 3 — Directus structured/default-language data

Use Directus for:

product records
slugs
codes
prices
categories
icons
publish flags
sort order
FAQ item records
account/business records

Directus should not be the primary source for multilingual wording.

Product content model
Directus product record

Directus products collection should provide:

id
slug
code
category
icon
base_price_from
is_active
sort_order
Frontend localized product content

Frontend content files should map product code (preferred) or slug to localized content.

Example conceptual shape:

export const productContent = {
  PASSENGER_CAR: {
    title: "...",
    shortDescription: "...",
    longDescription: "...",
    seoTitle: "...",
    seoDescription: "..."
  }
}
Rendering rule
Fetch structured product from Directus
Read code
Load localized product content from content/{locale}/products.ts
Merge structured data + localized display content
FAQ content model
Directus FAQ record

Directus can store:

id
slug
category
sort_order
is_published
Frontend localized FAQ content

Use slug as the stable key in:

content/fr/faq.ts
content/en/faq.ts
content/zh/faq.ts

Each locale file provides:

question
answer
optional SEO title/description
Rendering rule
Optionally fetch FAQ records from Directus for ordering/filtering/publish state
Use slug to resolve localized question/answer from frontend content
Render locale-specific FAQ text
Homepage content model

The homepage should not depend on Directus translation tables.

Use:

content/{locale}/home.ts

Suggested structure:

hero
trustHighlights
processSteps
section copy
CTA labels if not already in dictionaries

Directus may still provide structured product references used on the homepage.

Quote and account architecture
Quote flow

Quote flow should keep:

one shared business logic layer
one shared routing structure
one shared validation strategy

Only the presentation layer changes by locale.

Use dictionaries for:

step labels
field labels
buttons
short validation/help text

Do not build separate quote logic for each language.

Account flow

Same rule:

one shared account logic layer
localized menu labels
localized page headings
localized helper text

Account pages should not rely on Directus translations.

i18n implementation details
lib/i18n/config.ts

Must define:

supported locales
default locale
Locale type
validation helper
lib/i18n/get-dictionary.ts

Loads dictionaries from:

messages/fr.json
messages/en.json
messages/zh.json
lib/i18n/locales.ts

Should provide:

locale normalization
locale label helper
route locale replacement helper
lib/content/get-content.ts

This module should load locale-specific long-form content from:

content/fr/...
content/en/...
content/zh/...

This is the main long-form multilingual content access layer.

Language switcher requirements

The language switcher must:

be available in the header
preserve the current route
preserve query parameters
highlight the current locale
never break locale-aware navigation
Example expected behavior

If the user is on:

/fr/products/passenger-car?source=home

and switches to English, the result should be:

/en/products/passenger-car?source=home

If preserving the exact route is impossible, fall back to the equivalent localized parent route.

Metadata and SEO requirements

Multilingual architecture must be SEO-ready.

Required
locale-aware page URLs
canonical per locale page
alternates / hreflang-ready metadata structure
localized metadata on:
homepage
products page
product detail page
FAQ page
Important

<html lang> must reflect the active locale.
It must not stay hardcoded to fr for all pages.

Build stability requirements

The multilingual architecture must build reliably in CI/self-hosted environments.

Required
avoid build-time fragile Google font fetching
prefer stable font loading strategy
avoid architecture that passes locally but breaks on runner/network-restricted build environments
KPI / success criteria

This task is successful when the frontend multilingual architecture meets these KPIs:

Routing KPI
fr, en, and zh routes all resolve correctly
/ consistently redirects to /fr
invalid locales do not silently break
Navigation KPI
all header links remain locale-aware
language switching preserves route and query
no accidental fallback to non-localized public routes
Content architecture KPI
short UI text comes from messages/*.json
long-form text comes from content/{locale}/*.ts
Directus is only used for structured/default-language business data
Product KPI
products list page renders localized titles/descriptions
product detail page merges Directus structure + frontend localized content correctly
FAQ KPI
FAQ page renders locale-specific FAQ wording
FAQ content is keyed by stable slug
Account KPI
account layout and subroutes are locale-aware
account menu labels are dictionary-driven
account logic stays shared
SEO KPI
locale-aware metadata exists
canonical/alternates structure is ready
html lang reflects active locale
Stability KPI
project builds successfully
no major architecture leftovers from previous multilingual attempts
Testing plan
1. Route tests

Manual or automated:

/fr
/en
/zh
/fr/products
/en/products
/zh/products
/fr/quote
/fr/faq
/fr/account

Confirm:

page loads
locale header is correct
links keep locale
2. Language switcher tests

Test on:

homepage
product list
product detail
quote page
account page

Confirm:

route is preserved
query params are preserved
3. Product rendering tests

Confirm:

Directus returns structured product
frontend content resolves by code or slug
localized title/description show correctly
4. FAQ tests

Confirm:

slug mapping works
localized question/answer display correctly
missing content degrades gracefully
5. Account tests

Confirm:

locale-aware sidebar links
locale-aware overview
locale-aware subpages
no locale is lost when navigating inside account
6. SEO tests

Confirm:

metadata changes by locale
html lang changes by locale
canonical/alternates are correct
7. Build tests

Run:

typecheck
production build

Confirm:

no font-related build failure
no locale routing build errors
Implementation order
Phase 1 — simplify architecture
keep app/[locale]
keep dictionaries
add content/{locale}
stop depending on Directus translation tables as the main presentation model
Phase 2 — convert pages
homepage → frontend content
products → Directus structure + frontend content
product detail → Directus structure + frontend content
FAQ → slug-based frontend localized content
quote/account → dictionary-based UI
Phase 3 — harden technical details
dynamic html lang
language switcher preserves query params
canonical + alternates
build-stable fonts
Phase 4 — validate
route testing
locale testing
SEO testing
build testing
Explicit implementation guidance for Codex

When modifying this architecture:

Do
simplify
centralize multilingual presentation in frontend
preserve shared business logic
keep Directus focused on structure/data
prefer stable, explicit mappings
Do not
reintroduce Directus translation complexity
duplicate page logic across languages
rewrite unrelated business modules
over-polish translation copy in architecture tasks
modify main or dev
Final expected state

After the multilingual rewrite is complete, the frontend should behave like this:

one codebase
one logic layer
three locale routes
frontend-controlled multilingual wording
Directus-controlled structured/default-language business data
stable, maintainable, single-developer-friendly architecture

This is the target architecture for the Lang branch.
