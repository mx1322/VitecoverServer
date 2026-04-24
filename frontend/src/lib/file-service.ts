const configuredFileServiceBaseUrl =
  process.env.NEXT_PUBLIC_FILE_SERVICE_BASE_URL?.replace(/\/$/, "") ??
  process.env.NEXT_PUBLIC_DIRECTUS_URL?.replace(/\/$/, "") ??
  "";

function isLoopbackHost(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1" || hostname === "0.0.0.0";
}

function shouldUseRelativeAssetPath(baseUrl: string): boolean {
  if (!baseUrl) {
    return true;
  }

  try {
    const parsedBaseUrl = new URL(baseUrl);

    if (typeof window === "undefined") {
      return isLoopbackHost(parsedBaseUrl.hostname);
    }

    const currentHostname = window.location.hostname;
    return isLoopbackHost(parsedBaseUrl.hostname) && !isLoopbackHost(currentHostname);
  } catch {
    return true;
  }
}

export function directusAssetUrl(assetId: string): string {
  if (!shouldUseRelativeAssetPath(configuredFileServiceBaseUrl)) {
    return `${configuredFileServiceBaseUrl}/assets/${assetId}`;
  }

  return `/api/assets/${assetId}`;
}
