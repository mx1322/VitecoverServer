import { InfoCard } from "@/components/info-card";

export default function AccountPage() {
  return (
    <main className="section-wrap py-16">
      <p className="eyebrow">Account area</p>
      <h1 className="mt-4 text-4xl font-semibold text-white">Customer account workspace</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <InfoCard eyebrow="Identity" title="Authentication">
          Google login and native sign-in should both map to Directus users and then link to
          business customer records.
        </InfoCard>
        <InfoCard eyebrow="Data" title="Reusable records">
          Vehicles and drivers should be editable in the account area so returning customers
          do not have to re-enter all information every time.
        </InfoCard>
        <InfoCard eyebrow="Visibility" title="Policy access">
          Customers should be able to review recent quotes, active orders, policy PDFs, and
          refund status from one place.
        </InfoCard>
      </div>
    </main>
  );
}
