import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

export function GET(): Response {
  return new Response(null, {
    status: 307,
    headers: {
      "Cache-Control": "no-store",
      Location: `/api/assets/${siteConfig.logoAssetId}?width=64&height=64&fit=contain&format=png`,
    },
  });
}
