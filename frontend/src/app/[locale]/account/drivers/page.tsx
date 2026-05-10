import { notFound } from "next/navigation";

import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale } from "@/lib/i18n/config";

const drivers = ["Camille Martin", "Louis Bernard", "Emma Robert"];

export default async function DriversPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dictionary = await getDictionary(locale);

  return (
    <div className="space-y-4">
      <button className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold">{dictionary.cta.addDriver}</button>
      {drivers.map((driver) => (
        <article key={driver} className="rounded-2xl border bg-white/90 p-5 flex items-center justify-between">
          <p>{driver}</p>
          <button className="rounded-full border px-4 py-2 text-sm">{dictionary.cta.edit}</button>
        </article>
      ))}
    </div>
  );
}
