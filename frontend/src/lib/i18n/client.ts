"use client";

import { usePathname } from "next/navigation";

import { normalizeLocale } from "@/lib/i18n/routing";

export function useCurrentLocale() {
  const pathname = usePathname() ?? "/";
  return normalizeLocale(pathname.split("/").filter(Boolean)[0]);
}
