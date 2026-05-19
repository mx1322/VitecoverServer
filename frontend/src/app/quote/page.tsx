import { CheckoutQuotePage } from "@/modules/checkout";

export default function Page({ searchParams }: { searchParams: Promise<{ product?: string }> }) {
  return <CheckoutQuotePage searchParams={searchParams} />;
}
