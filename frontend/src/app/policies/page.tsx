import { InfoCard } from "@/components/info-card";

export default function PoliciesPage() {
  return (
    <main className="section-wrap py-16">
      <p className="eyebrow">Policy delivery</p>
      <h1 className="mt-4 text-4xl font-semibold text-[var(--ink)]">PDF policy handling</h1>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <InfoCard eyebrow="Delivery" title="Email is a distribution channel">
          Sending the PDF by email is a good customer experience and should absolutely be part
          of the product.
        </InfoCard>

        <InfoCard eyebrow="Storage" title="Private storage is still recommended">
          Even if the customer receives the PDF by email, the platform should keep a private
          stored copy for re-download, support, audit trail, and future document recovery.
        </InfoCard>

        <InfoCard eyebrow="Development" title="Local-first now">
          During local development, Directus file storage can remain local. The frontend only
          needs a stable policy access pattern.
        </InfoCard>

        <InfoCard eyebrow="Production" title="AWS path later">
          In production, a private S3 bucket is still the cleanest long-term option. The
          customer portal can expose files through authenticated backend-controlled access.
        </InfoCard>
      </div>
    </main>
  );
}
