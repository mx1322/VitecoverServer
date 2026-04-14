import { AuthGatewayClient } from "./auth-gateway-client";

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const params = await searchParams;
  return <AuthGatewayClient returnTo={params.returnTo || "/account"} />;
}
