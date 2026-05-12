import { InfoCard } from "@/components/info-card";
import { getRequestLocale } from "@/lib/i18n/server";
import { t } from "@/lib/i18n/translations";

export default async function PoliciesPage() {
  const locale = await getRequestLocale();

  return (
    <main className="section-wrap py-16">
      <p className="eyebrow">{t(locale, "Policy delivery")}</p>
      <h1 className="mt-4 text-4xl font-semibold text-[var(--ink)]">{t(locale, "PDF policy handling")}</h1>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <InfoCard eyebrow={t(locale, "Delivery")} title={t(locale, "Email is a distribution channel")}>
          Sending the PDF by email is a good customer experience and should absolutely be part
          of the product.
        </InfoCard>

        <InfoCard eyebrow={t(locale, "Storage")} title={t(locale, "Private storage is still recommended")}>
          Even if the customer receives the PDF by email, the platform should keep a private
          stored copy for re-download, support, audit trail, and future document recovery.
        </InfoCard>

        <InfoCard eyebrow={t(locale, "Development")} title={t(locale, "Local-first now")}>
          During local development, Directus file storage can remain local. The frontend only
          needs a stable policy access pattern.
        </InfoCard>

        <InfoCard eyebrow={t(locale, "Production")} title={t(locale, "AWS path later")}>
          In production, a private S3 bucket is still the cleanest long-term option. The
          customer portal can expose files through authenticated backend-controlled access.
        </InfoCard>
      </div>
    </main>
  );
}
