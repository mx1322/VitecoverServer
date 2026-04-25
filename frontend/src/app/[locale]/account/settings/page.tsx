import { notFound } from "next/navigation";

import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale } from "@/lib/i18n/config";

export default async function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dictionary = await getDictionary(locale);

  return (
    <div className="space-y-4">
      {[
        ["Email", "client@example.com"],
        ["Password", "••••••••"],
        ["Contact", "+33 6 00 00 00 00"],
      ].map(([label, value]) => (
        <article key={label} className="rounded-2xl border bg-white/90 p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--muted)]">{label}</p>
            <p className="font-semibold">{value}</p>
          </div>
          <button className="rounded-full border px-4 py-2 text-sm">{dictionary.cta.edit}</button>
        </article>
      ))}
    </div>
  );
}
