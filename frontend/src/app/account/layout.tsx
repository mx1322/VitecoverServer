import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { AccountShell } from "@/components/account/account-shell";
import { getAuthenticatedIdentity } from "@/lib/directus-auth";

export default async function AccountLayout({
  children,
}: {
  children: ReactNode;
}) {
  const identity = await getAuthenticatedIdentity();

  if (!identity) {
    redirect("/auth?returnTo=%2Faccount");
  }

  return <AccountShell>{children}</AccountShell>;
}
