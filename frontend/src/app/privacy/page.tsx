import { SimpleContentPage } from "@/components/simple-content-page";

export default function PrivacyPage() {
  return (
    <SimpleContentPage
      eyebrow="Privacy"
      title="Privacy Policy"
      intro="Vitecover uses customer, driver, and vehicle data to prepare temporary insurance quotes, process purchases, and deliver approved policy documents."
    >
      <p>Information provided in the quote flow is used for insurance operations, payment processing, and policy communication.</p>
      <p>Only the data required for product selection, review, and policy administration should be collected and retained.</p>
      <p>Policy documents and transactional communications are delivered digitally through the platform and by email.</p>
    </SimpleContentPage>
  );
}
