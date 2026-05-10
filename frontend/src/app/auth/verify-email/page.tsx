import { redirect } from "next/navigation";

import { defaultLocale } from "@/lib/i18n/config";

function serializeSearchParams(searchParams: Record<string, string | string[] | undefined>): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (Array.isArray(value)) {
      value.forEach((entry) => params.append(key, entry));
    } else if (value !== undefined) {
      params.set(key, value);
    }
  }

  const query = params.toString();
  return query ? `?${query}` : "";
}

export default async function LegacyVerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = serializeSearchParams(await searchParams);
  redirect(`/${defaultLocale}/auth/verify-email${query}`);
}
