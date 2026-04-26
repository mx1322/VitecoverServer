import { notFound } from "next/navigation";

import { isLocale } from "@/lib/i18n/config";

import { VerifyEmailClient } from "@/app/auth/verify-email/verify-email-client";

export default async function LocalizedVerifyEmailPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const query = await searchParams;
  return <VerifyEmailClient token={query.token || ""} />;
}
