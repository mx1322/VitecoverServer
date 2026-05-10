import type { ReactNode } from "react";

import { AccountSidebar } from "@/components/account/account-sidebar";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/types/i18n";

export function AccountShell({ children, locale, dictionary }: { children: ReactNode; locale: Locale; dictionary: Dictionary }) {
  return (
    <main className="section-wrap py-10 md:py-12">
      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <AccountSidebar locale={locale} dictionary={dictionary} />
        <section className="min-w-0">{children}</section>
      </div>
    </main>
  );
}
