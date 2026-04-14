import { SimpleContentPage } from "@/components/simple-content-page";

export default function TermsPage() {
  return (
    <SimpleContentPage
      eyebrow="Terms"
      title="Terms & Conditions"
      intro="These terms outline how Vitecover presents temporary auto insurance products online and how customers use the quote and purchase flow."
    >
      <p>Quotes are subject to product eligibility, vehicle details, driver details, and internal review.</p>
      <p>Submitting payment does not replace underwriting or operational checks required before policy delivery.</p>
      <p>Policy documentation is delivered digitally after approval and remains subject to the insurer's final validation.</p>
    </SimpleContentPage>
  );
}
