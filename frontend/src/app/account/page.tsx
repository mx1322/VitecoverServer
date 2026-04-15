import { redirect } from "next/navigation";

import { readAuthSession } from "@/lib/auth-session";

import { AccountControlClient } from "./account-control-client";

export default async function AccountPage() {
  const session = await readAuthSession();
  if (!session) {
    redirect("/auth?returnTo=%2Faccount");
  }

  return <AccountControlClient />;
}
