import { notFound, redirect } from "next/navigation";

import { isLocale } from "@/lib/i18n/config";

export default async function LocalizedResetPasswordRedirect({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ token?: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const query = await searchParams;
  const token = query.token ? `?token=${encodeURIComponent(query.token)}` : "";
  redirect(`/auth/reset-password${token}`);
}
