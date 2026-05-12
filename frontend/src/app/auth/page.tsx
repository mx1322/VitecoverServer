import { AuthGatewayClient } from "./auth-gateway-client";
import { localizePath } from "@/lib/i18n/routing";
import { getRequestLocale } from "@/lib/i18n/server";

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const locale = await getRequestLocale();
  const params = await searchParams;
  return (
    <AuthGatewayClient
      returnTo={params.returnTo || localizePath("/account", locale)}
      locale={locale}
    />
  );
}
