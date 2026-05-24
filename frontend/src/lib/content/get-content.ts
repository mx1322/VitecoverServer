import type { Locale } from "@/lib/i18n/config";
import { homeContent as enHomeContent } from "@/content/en/home";
import { homeContent as frHomeContent } from "@/content/fr/home";
import { homeContent as zhHomeContent } from "@/content/zh/home";

export function getHomeContent(locale: Locale) {
  if (locale === "fr") return frHomeContent;
  if (locale === "zh") return zhHomeContent;
  return enHomeContent;
}
