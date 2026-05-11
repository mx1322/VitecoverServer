"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { Locale } from "@/lib/i18n/config";
import { localizePath } from "@/lib/i18n/routing";
import { t } from "@/lib/i18n/translations";

export function LogoutButton({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleLogout() {
    setPending(true);
    await fetch("/api/auth/logout", {
      method: "POST",
      cache: "no-store",
    });
    router.replace(localizePath("/auth", locale));
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={pending}
      className="mt-4 flex w-full items-center rounded-full border border-[rgba(22,36,58,0.08)] px-4 py-3 text-sm font-medium text-[var(--muted)] transition hover:bg-[rgba(22,36,58,0.04)] hover:text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? t(locale, "Signing out...") : t(locale, "Sign out")}
    </button>
  );
}
