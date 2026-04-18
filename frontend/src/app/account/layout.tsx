import { redirect } from "next/navigation";

import { AccountSidebar } from "@/components/account/account-sidebar";
import { accountNavItems } from "@/lib/account/mock-data";
import { readAuthSession } from "@/lib/auth-session";

export default async function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await readAuthSession();
  if (!session) {
    redirect("/auth?returnTo=%2Faccount");
  }

  return (
    <main className="section-wrap py-10 md:py-12">
      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <AccountSidebar items={accountNavItems} accountEmail={session.email} />
        <section className="space-y-6">{children}</section>
      </div>
    </main>
  );
}
