const fileServiceBaseUrl =
  process.env.NEXT_PUBLIC_FILE_SERVICE_BASE_URL?.replace(/\/$/, "") ??
  process.env.NEXT_PUBLIC_DIRECTUS_URL?.replace(/\/$/, "") ??
  "";

function isLoopbackHost(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
}

function shouldUseRelativeDirectusPath(baseUrl: string): boolean {
  if (!baseUrl || typeof window === "undefined") {
    return false;
  }

  try {
    const parsedBaseUrl = new URL(baseUrl);
    const currentHostname = window.location.hostname;

    return isLoopbackHost(parsedBaseUrl.hostname) && !isLoopbackHost(currentHostname);
  } catch {
    return false;
  }
}

export function directusAssetUrl(assetId: string): string {
  if (shouldUseRelativeDirectusPath(fileServiceBaseUrl)) {
    return `/directus/assets/${assetId}`;
  }

  if (fileServiceBaseUrl) {
    return `${fileServiceBaseUrl}/assets/${assetId}`;
  }

  return `/directus/assets/${assetId}`;
}
