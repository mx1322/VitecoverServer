import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { AccountShell } from "@/components/account/account-shell";
import { getAuthenticatedIdentity } from "@/lib/directus-auth";
import { localizePath } from "@/lib/i18n/routing";
import { getRequestLocale } from "@/lib/i18n/server";

export default async function AccountLayout({
  children,
}: {
  children: ReactNode;
}) {
  const identity = await getAuthenticatedIdentity();
  const locale = await getRequestLocale();

  if (!identity) {
    redirect(`${localizePath("/auth", locale)}?returnTo=${encodeURIComponent(localizePath("/account", locale))}`);
  }

  return <AccountShell>{children}</AccountShell>;
}
