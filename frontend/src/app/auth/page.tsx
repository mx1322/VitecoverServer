import { redirect } from "next/navigation";

import { defaultLocale } from "@/lib/i18n/config";

export default async function AuthRedirectPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const params = await searchParams;
  const returnTo = params.returnTo ? `?returnTo=${encodeURIComponent(params.returnTo)}` : "";
  redirect(`/${defaultLocale}/auth${returnTo}`);
}
