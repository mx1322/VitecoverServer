import { notFound } from "next/navigation";

import { AuthGatewayClient } from "@/app/auth/auth-gateway-client";
import { isLocale } from "@/lib/i18n/config";

export default async function LocalizedAuthPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const query = await searchParams;
  const returnTo = query.returnTo || `/${locale}/account`;

  return <AuthGatewayClient returnTo={returnTo} />;
}
