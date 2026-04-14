import { SimpleContentPage } from "@/components/simple-content-page";

export default function ContactPage() {
  return (
    <SimpleContentPage
      eyebrow="Contact"
      title="Contact"
      intro="For policy questions, operational support, or document delivery issues, contact the Vitecover support team."
    >
      <p>Email: support@vitecover.example</p>
      <p>Support requests should include the quote or policy reference when available.</p>
      <p>Digital policy delivery and account access questions can be handled through the customer portal and support mailbox.</p>
    </SimpleContentPage>
  );
}
