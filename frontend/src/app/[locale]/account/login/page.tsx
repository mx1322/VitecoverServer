import { notFound, redirect } from "next/navigation";

import { isLocale } from "@/lib/i18n/config";

export default async function LocalizedAccountLoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const query = await searchParams;
  const fallbackReturnTo = `/${locale}/account`;
  const returnTo = encodeURIComponent(query.returnTo || fallbackReturnTo);
  redirect(`/${locale}/auth?returnTo=${returnTo}`);
}
