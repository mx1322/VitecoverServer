import { notFound } from "next/navigation";

import { isLocale } from "@/lib/i18n/config";

import { ResetPasswordClient } from "@/app/auth/reset-password/reset-password-client";

export default async function LocalizedResetPasswordPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const query = await searchParams;
  return <ResetPasswordClient token={query.token || ""} />;
}
