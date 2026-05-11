"use client";

import type { ChangeEvent } from "react";
import { useRouter } from "next/navigation";

import {
  defaultLanguage,
  isSupportedLanguage,
  languageCookieName,
  supportedLanguages,
  type SupportedLanguage,
} from "@/lib/language";

function readLanguagePreference(): SupportedLanguage {
  if (typeof document === "undefined") {
    return defaultLanguage;
  }

  const match = document.cookie.match(
    new RegExp(`(?:^|; )${languageCookieName}=([^;]*)`),
  );
  const value = match ? decodeURIComponent(match[1]) : defaultLanguage;

  return isSupportedLanguage(value) ? value : defaultLanguage;
}

export function LanguageSwitcher() {
  const router = useRouter();

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextLanguage = isSupportedLanguage(event.target.value)
      ? event.target.value
      : defaultLanguage;

    document.cookie = `${languageCookieName}=${encodeURIComponent(nextLanguage)}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.lang = nextLanguage;
    router.refresh();
  };

  return (
    <label className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)]">
      <span className="hidden sm:inline">Language</span>
      <select
        aria-label="Language"
        className="rounded-full border border-[rgba(22,36,58,0.12)] bg-white px-3 py-2 text-sm font-medium text-[var(--ink)] shadow-[0_8px_20px_rgba(22,36,58,0.05)] outline-none transition focus:border-[rgba(31,183,166,0.45)]"
        defaultValue={readLanguagePreference()}
        onChange={handleChange}
      >
        {supportedLanguages.map((language) => (
          <option key={language} value={language}>
            {language.toUpperCase()}
          </option>
        ))}
      </select>
    </label>
  );
}
