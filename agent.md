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

```text```
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

=====================================================================
Target front structure:
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
