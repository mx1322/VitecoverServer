import { readFile } from "node:fs/promises";
import { join } from "node:path";

const locales = ["fr", "en", "zh"];

function flattenKeys(value, prefix = "") {
  if (Array.isArray(value)) {
    return [`${prefix}[]`];
  }

  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, child]) => flattenKeys(child, prefix ? `${prefix}.${key}` : key));
  }

  return [prefix];
}

async function readDictionary(locale) {
  const raw = await readFile(join("src", "messages", `${locale}.json`), "utf8");
  return JSON.parse(raw);
}

const dictionaries = Object.fromEntries(await Promise.all(locales.map(async (locale) => [locale, await readDictionary(locale)])));
const referenceLocale = "fr";
const referenceKeys = flattenKeys(dictionaries[referenceLocale]).sort();
let failed = false;

for (const locale of locales) {
  const keys = flattenKeys(dictionaries[locale]).sort();
  const missing = referenceKeys.filter((key) => !keys.includes(key));
  const extra = keys.filter((key) => !referenceKeys.includes(key));

  if (missing.length || extra.length) {
    failed = true;
    console.error(`[i18n] ${locale} dictionary is not aligned with ${referenceLocale}.`);
    if (missing.length) console.error(`  missing: ${missing.join(", ")}`);
    if (extra.length) console.error(`  extra: ${extra.join(", ")}`);
  }
}

if (failed) {
  process.exit(1);
}

console.log(`[i18n] ${locales.join(", ")} dictionaries have matching key coverage.`);
