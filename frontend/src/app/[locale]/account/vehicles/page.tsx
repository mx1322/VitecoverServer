import { notFound } from "next/navigation";

import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale } from "@/lib/i18n/config";

const vehicles = ["AB-123-CD · Peugeot 3008", "GH-457-JK · Renault Trafic"];

export default async function VehiclesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dictionary = await getDictionary(locale);

  return (
    <div className="space-y-4">
      <button className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold">{dictionary.cta.addVehicle}</button>
      {vehicles.map((vehicle) => (
        <article key={vehicle} className="rounded-2xl border bg-white/90 p-5 flex items-center justify-between">
          <p>{vehicle}</p>
          <button className="rounded-full border px-4 py-2 text-sm">{dictionary.cta.edit}</button>
        </article>
      ))}
    </div>
  );
}
