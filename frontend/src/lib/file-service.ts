const configuredFileServiceBaseUrl =
  process.env.NEXT_PUBLIC_FILE_SERVICE_BASE_URL?.replace(/\/$/, "") ??
  process.env.NEXT_PUBLIC_DIRECTUS_URL?.replace(/\/$/, "") ??
  "";

function shouldUseRelativeAssetPath(baseUrl: string): boolean {
  if (!baseUrl) {
    return true;
  }

  try {
    const { hostname } = new URL(baseUrl);
    return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "0.0.0.0";
  } catch {
    return false;
  }
}

export function directusAssetUrl(assetId: string): string {
  if (!shouldUseRelativeAssetPath(configuredFileServiceBaseUrl)) {
    return `${configuredFileServiceBaseUrl}/assets/${assetId}`;
  }

  return `/directus/assets/${assetId}`;
}
