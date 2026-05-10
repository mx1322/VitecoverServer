# TASKS.md — Lang Branch Multilingual Rewrite Execution Plan

## Scope

This task list applies **only** to the `Lang` branch.

Do **not** modify:
- `main`
- `dev`

This plan is for **frontend multilingual architecture cleanup and implementation** only.

---

# 0. Goal

Refactor the frontend multilingual implementation into a simpler and more maintainable model:

- one shared codebase
- one shared business logic layer
- locale-based routing
- frontend-owned multilingual presentation
- Directus used only for structured/default-language business data

This task is **not** about perfect translation wording.
This task is about getting the architecture right first.

---

# 1. High-level target

## Must keep
- locale-based routing: `/fr`, `/en`, `/zh`
- default locale: `fr`
- one shared set of pages and components
- language switcher
- dictionary-based UI labels

## Must change
- reduce Directus multilingual complexity
- move long-form multilingual text into frontend content files
- keep Directus for structured business data only
- fix route consistency
- fix language switching behavior
- fix HTML language handling
- make multilingual SEO structure correct
- ensure build stability

---

# 2. Target directory structure

Codex should move the code toward this structure:

```text
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
3. Content ownership rules

These rules must be enforced during implementation.

3.1 Frontend dictionaries

Files:

messages/fr.json
messages/en.json
messages/zh.json

Use for:

nav labels
buttons
account sidebar labels
quote step labels
validation text
status labels
short helper text
fallback UI text

Do not put long paragraphs here.

3.2 Frontend long-form localized content

Files:

content/fr/home.ts
content/fr/products.ts
content/fr/faq.ts
content/fr/legal.ts
same for en and zh

Use for:

homepage hero text
homepage content blocks
product titles
product short descriptions
product long descriptions
FAQ questions
FAQ answers
legal page text
long-form marketing/insurance content
3.3 Directus structured data

Use Directus only for:

product records
slugs
codes
categories
icons
price-related structured data
sort order
published flags
account/business records
FAQ publish status / order if still needed structurally

Do not depend on Directus translation tables as the main multilingual presentation system.

4. Execution phases
Phase 1 — Audit and simplify the current multilingual architecture
Tasks
 Review current Lang branch multilingual files
 Identify legacy leftovers from old multilingual approach
 Remove obsolete lang-based logic if any remains
 Standardize on locale naming everywhere
 Remove duplicate wrappers/helpers if obsolete
 Keep only one active multilingual architecture
Completion criteria
 no mixed lang / locale system remains
 no duplicate multilingual route layer remains
 codebase has one clear multilingual structure
Output
cleaned route/util layer
no stale multilingual helper layer
Phase 2 — Stabilize locale routing
Tasks
 Keep public routes under app/[locale]/...
 Keep / redirecting to /fr
 Ensure invalid locale handling is consistent
 Ensure all internal links preserve active locale
 Ensure account subroutes are nested under /[locale]/account/...
 Ensure product pages live under /[locale]/products/...
Completion criteria
 /fr, /en, /zh route trees work consistently
 no accidental non-localized public route remains
 no broken locale-aware internal navigation
Output
stable locale routing model
Phase 3 — Implement the frontend content layer
Tasks
 Add frontend/src/content/fr
 Add frontend/src/content/en
 Add frontend/src/content/zh
 Add home.ts for each locale
 Add products.ts for each locale
 Add faq.ts for each locale
 Add legal.ts for each locale
 Add lib/content/get-content.ts
Expected implementation approach

get-content.ts should expose simple helpers such as:

getHomeContent(locale)
getProductContent(locale)
getFaqContent(locale)
getLegalContent(locale)
Completion criteria
 frontend long-form text can be loaded per locale
 homepage/product/faq/legal can use frontend-owned text
 no need to rely on Directus translation tables for presentation text
Output
locale-specific long-form content layer in the repo
Phase 4 — Keep dictionaries lightweight and consistent
Tasks
 Audit messages/fr.json
 Audit messages/en.json
 Audit messages/zh.json
 Remove long-form content from dictionaries if it does not belong there
 Keep only short UI/system text in dictionaries
 Ensure major shared UI labels are dictionary-driven
Areas that must use dictionary text
 header
 navigation
 quote CTA
 account sidebar
 quote step labels
 account page labels
 short fallback text
 status labels where practical
Completion criteria
 dictionaries are focused and maintainable
 shared UI strings are not scattered through components
Output
clean messages/*.json
Phase 5 — Rework homepage to use frontend locale content
Tasks
 Make homepage use content/{locale}/home.ts
 Use locale-specific hero text from frontend content
 Keep current visual style
 Do not depend on Directus translations for hero copy
 If structured product snippets are shown, use Directus only for structure/data, not wording
Completion criteria
 homepage renders correct locale-specific long-form content
 homepage does not depend on CMS translation tables for wording
Output
localized homepage based on frontend content files
Phase 6 — Rework products architecture
Tasks
 Keep Directus products fetch for structured data
 Ensure product records expose stable code or slug
 Map Directus product record to frontend localized content
 Rework products list page to combine:
Directus structure
frontend localized text
 Rework product detail page to combine:
Directus structure
frontend localized long-form content
Required behavior
Fetch product from Directus by slug
Read stable code or slug
Load corresponding localized content from content/{locale}/products.ts
Render merged result
Completion criteria
 products list page renders localized titles/descriptions
 product detail page renders localized long-form content
 product detail no longer depends on Directus translation tables for wording
Output
stable merged product model:
Directus structure
frontend localized content
Phase 7 — Rework FAQ architecture
Tasks
 Keep FAQ slugs/categories structurally if needed
 Use frontend locale FAQ content as the source of displayed question/answer text
 Key FAQ content by stable slug
 Make FAQ page read locale-specific Q&A from frontend content
Completion criteria
 FAQ wording is frontend-controlled
 FAQ architecture is simple and consistent
 missing content degrades gracefully
Output
localized FAQ page driven by repo content files
Phase 8 — Keep quote and account multilingual, but simple
Quote tasks
 Keep one shared quote page/flow
 Use dictionaries for labels and steps
 Do not introduce separate logic per language
 Do not move quote wording to Directus unless truly necessary
Account tasks
 Keep one shared account layout/logic
 Keep locale-aware account routes
 Use dictionaries for sidebar and page labels
 Preserve account subroute structure
Completion criteria
 quote remains shared-logic, locale-aware UI
 account remains shared-logic, locale-aware UI
Output
multilingual quote and account shell without architecture sprawl
Phase 9 — Fix language switcher behavior
Tasks
 Ensure language switcher preserves pathname
 Ensure language switcher also preserves query parameters
 Ensure current locale is correctly highlighted
 Ensure switching on nested pages works correctly
 Ensure switching from product detail stays on equivalent product detail if possible
Completion criteria
 locale switching is predictable
 query params are not lost
 route switching feels stable
Output
production-ready language switcher behavior
Phase 10 — Fix HTML language and metadata structure
Tasks
 Ensure active locale controls page language semantics
 Remove any architecture that leaves <html lang> fixed to French on all pages
 Make metadata locale-aware on:
homepage
products page
product detail page
FAQ page
 Add canonical handling per locale
 Add alternates / hreflang-ready metadata structure
Completion criteria
 locale pages expose correct language metadata
 multilingual SEO structure is technically sound
Output
multilingual SEO-ready metadata architecture
Phase 11 — Build stability hardening
Tasks
 Audit current font loading
 Remove build-time fragile remote font fetching if present
 Ensure the build is stable in CI / self-hosted environments
 Run typecheck
 Run production build
Completion criteria
 typecheck passes
 build passes
 no multilingual architecture issue blocks the build
Output
build-stable multilingual branch
5. Implementation details per module
lib/i18n/config.ts

Must define:

locales
defaultLocale
Locale type
validation helper
lib/i18n/locales.ts

Should provide:

locale normalization
label mapping
path locale replacement
helpers for preserving locale in routes
lib/i18n/get-dictionary.ts

Loads dictionary from messages/{locale}.json

lib/content/get-content.ts

Central frontend long-form content loader.

Suggested exports:

getHomeContent(locale)
getProductsContent(locale)
getFaqContent(locale)
getLegalContent(locale)
lib/directus/client.ts

Keep generic Directus fetch for structured data only.

lib/directus/products.ts

Should fetch structured product records only.
If some current translation logic exists, simplify it toward structured-data-only usage.

lib/directus/faq.ts

Should only provide structured FAQ record information if needed.
Frontend content files should own the displayed wording.

6. KPI / success criteria

Codex should use these as the definition of done.

Routing KPI
 /fr, /en, /zh all work
 / redirects to /fr
 locale-aware navigation works
Content ownership KPI
 short UI text is dictionary-based
 long-form text is repo-content-based
 Directus is no longer the primary multilingual wording layer
Product KPI
 product list renders localized content
 product detail renders localized content merged with Directus data
FAQ KPI
 FAQ renders locale-specific questions/answers
 FAQ content keyed by stable slug
Account KPI
 account route structure is locale-aware
 account labels are dictionary-driven
Switching KPI
 switcher preserves path
 switcher preserves query params
SEO KPI
 locale-aware metadata is in place
 html lang matches locale
 canonical/alternates structure exists
Stability KPI
 typecheck passes
 build passes
 no major stale multilingual architecture remains
7. Testing checklist
Route tests
 /fr
 /en
 /zh
 /fr/products
 /en/products
 /zh/products
 /fr/products/[slug]
 /fr/quote
 /fr/faq
 /fr/account
Switcher tests
 home page
 products list
 product detail
 quote page
 account page
 query params preserved when switching
Product tests
 Directus structured product fetch works
 localized frontend content mapping works
 missing localized content fails gracefully
FAQ tests
 slug mapping works
 locale-specific Q&A renders
 missing FAQ content fails gracefully
SEO tests
 metadata differs by locale
 html lang differs by locale
 canonical/alternates are coherent
Build tests
 npm --prefix frontend run typecheck
 npm --prefix frontend run build
8. What Codex should NOT do
 Do not touch main
 Do not touch dev
 Do not redesign business workflows
 Do not over-polish translation wording
 Do not reintroduce heavy Directus translation-table complexity
 Do not duplicate logic per language
 Do not create separate long-lived language branches
9. Final deliverable

Codex should finish with:

a clean locale-based route architecture
frontend-owned multilingual presentation
frontend long-form content files for fr, en, zh
simplified Directus integration focused on structured data
locale-preserving navigation and switching
correct html language behavior
multilingual SEO-ready metadata structure
a successful typecheck and build

After this task, later work should mostly be:

translation refinement
terminology correction
product copy improvement
FAQ wording improvement

—not architectural rewrites.
