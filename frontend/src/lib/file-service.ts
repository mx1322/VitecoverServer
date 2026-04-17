const fileServiceBaseUrl =
  process.env.NEXT_PUBLIC_FILE_SERVICE_BASE_URL?.replace(/\/$/, "") ??
  process.env.NEXT_PUBLIC_DIRECTUS_URL?.replace(/\/$/, "") ??
  "";

export function directusAssetUrl(assetId: string): string {
  if (fileServiceBaseUrl) {
    return `${fileServiceBaseUrl}/assets/${assetId}`;
  }

  return `/directus/assets/${assetId}`;
}
