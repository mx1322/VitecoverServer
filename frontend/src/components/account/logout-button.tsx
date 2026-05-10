"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/types/i18n";

export function LogoutButton({ locale, dictionary }: { locale: Locale; dictionary: Pick<Dictionary, "cta"> }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleLogout() {
    setPending(true);
    await fetch("/api/auth/logout", {
      method: "POST",
      cache: "no-store",
    });
    router.replace(`/${locale}/auth`);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={pending}
      className="mt-4 flex w-full items-center rounded-full border border-[rgba(22,36,58,0.08)] px-4 py-3 text-sm font-medium text-[var(--muted)] transition hover:bg-[rgba(22,36,58,0.04)] hover:text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? dictionary.cta.signingOut : dictionary.cta.signOut}
    </button>
  );
}
