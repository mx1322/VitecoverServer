import { redirect } from "next/navigation";

import { defaultLocale } from "@/lib/i18n/config";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  const token = params.token ? `?token=${encodeURIComponent(params.token)}` : "";
  redirect(`/${defaultLocale}/auth/verify-email${token}`);
}
