import type { ReactNode } from "react";

import { AccountSidebar } from "@/components/account/account-sidebar";
import frDictionary from "@/messages/fr.json";

export function AccountShell({ children }: { children: ReactNode }) {
  return (
    <main className="section-wrap py-10 md:py-12">
      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <AccountSidebar locale="fr" dictionary={frDictionary} />
        <section className="min-w-0">{children}</section>
      </div>
    </main>
  );
}
