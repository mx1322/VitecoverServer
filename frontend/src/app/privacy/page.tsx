import { SimpleContentPage } from "@/components/simple-content-page";
import { getRequestLocale } from "@/lib/i18n/server";
import { t } from "@/lib/i18n/translations";

export default async function PrivacyPage() {
  const locale = await getRequestLocale();

  return (
    <SimpleContentPage
      eyebrow={t(locale, "Privacy")}
      title={t(locale, "Privacy Policy")}
      intro={t(locale, "Vitecover uses customer, driver, and vehicle data to prepare temporary insurance quotes, process purchases, and deliver approved policy documents.")}
    >
      <p>Information provided in the quote flow is used for insurance operations, payment processing, and policy communication.</p>
      <p>Only the data required for product selection, review, and policy administration should be collected and retained.</p>
      <p>Policy documents and transactional communications are delivered digitally through the platform and by email.</p>
    </SimpleContentPage>
  );
}
