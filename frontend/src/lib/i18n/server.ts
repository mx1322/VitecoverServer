import { headers } from "next/headers";

import { defaultLocale } from "@/lib/i18n/config";
import { normalizeLocale } from "@/lib/i18n/routing";

export async function getRequestLocale() {
  const headersList = await headers();
  return normalizeLocale(headersList.get("x-vitecover-locale") ?? defaultLocale);
}

