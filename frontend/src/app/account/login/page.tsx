import { redirect } from "next/navigation";

export default async function LegacyAccountLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const params = await searchParams;
  const returnTo = encodeURIComponent(params.returnTo || "/account");
  redirect(`/auth?returnTo=${returnTo}`);
}
