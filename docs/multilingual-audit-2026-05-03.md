# Multilingual UI Audit (Lang branch) — 2026-05-09 update

## Conclusion

The rendered locale-routed pages now keep user-facing copy under frontend-controlled locale resources for French, English, and Chinese.

## Translation-control model

- Short UI labels, buttons, validation messages, empty states, and auth/account copy live in `frontend/src/messages/{fr,en,zh}.json`.
- Long-form marketing, product, FAQ, and legal wording lives in `frontend/src/content/{fr,en,zh}`.
- Directus remains limited to structured/default-language operational data such as product codes, slugs, prices, order/customer records, and status metadata.

## Areas verified as locale-controlled

- Header/navigation and language-switcher accessibility labels.
- Homepage hero, trust blocks, process steps, and homepage section copy.
- Product listing and product detail copy, including localized SEO fallbacks.
- FAQ page titles, empty states, structured FAQ wording, and FAQ JSON-LD text.
- Legal hub, privacy, terms, and regulatory page titles/body/SEO fallbacks.
- Quote overview page labels and step copy.
- Account sidebar, summary labels, status labels, document labels, settings labels, and action labels.
- Auth gateway, reset-password, and verify-email screens, including form labels, tabs, headings, success notices, and local validation/error fallbacks.

## Guardrail added

`npm run check:i18n` verifies that `messages/fr.json`, `messages/en.json`, and `messages/zh.json` expose the same key structure so new UI text cannot be added to one language without matching keys in the others.

## Notes

- Brand tokens such as `Vitecover` and `VC` are now dictionary values as well, even though they are currently intentionally identical across locales.
- Demo operational data such as sample policy numbers, vehicle registration numbers, customer names, phone numbers, and email addresses is treated as structured sample data rather than translation copy.
- `frontend/src/components/quote-form.tsx` contains an older, currently unused quote-flow implementation with hardcoded English copy. It is not imported by the locale-routed quote page; if it is revived later, it should be converted to the same dictionary/content pattern before being rendered to users.
