import { NextRequest } from "next/server";

const directusInternalUrl =
  process.env.DIRECTUS_INTERNAL_URL?.replace(/\/$/, "") ??
  process.env.NEXT_PUBLIC_DIRECTUS_URL?.replace(/\/$/, "") ??
  "http://localhost:8088/directus";

const directusStaticToken = process.env.DIRECTUS_TOKEN ?? process.env.ADMIN_TOKEN;
const directusAdminEmail = process.env.DIRECTUS_ADMIN_EMAIL;
const directusAdminPassword = process.env.DIRECTUS_ADMIN_PASSWORD;

async function directusLogin(): Promise<string> {
  if (directusStaticToken) {
    return directusStaticToken;
  }

  if (!directusAdminEmail || !directusAdminPassword) {
    throw new Error("Missing Directus admin credentials in frontend runtime env.");
  }

  const response = await fetch(`${directusInternalUrl}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: directusAdminEmail,
      password: directusAdminPassword,
    }),
    cache: "no-store",
  });

  const payload = (await response.json()) as {
    data?: {
      access_token?: string;
    };
    errors?: Array<{ message?: string }>;
  };

  if (!response.ok || !payload.data?.access_token) {
    const message = payload.errors?.[0]?.message ?? "Unable to authenticate with Directus.";
    throw new Error(message);
  }

  return payload.data.access_token;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ assetId: string }> },
): Promise<Response> {
  const { assetId } = await context.params;
  const token = await directusLogin();
  const assetUrl = new URL(`${directusInternalUrl}/assets/${assetId}`);

  request.nextUrl.searchParams.forEach((value, key) => {
    assetUrl.searchParams.append(key, value);
  });

  const upstream = await fetch(assetUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const headers = new Headers();
  const contentType = upstream.headers.get("content-type");
  const contentLength = upstream.headers.get("content-length");
  const cacheControl = upstream.headers.get("cache-control");
  const etag = upstream.headers.get("etag");

  if (contentType) {
    headers.set("content-type", contentType);
  }
  if (contentLength) {
    headers.set("content-length", contentLength);
  }
  if (cacheControl) {
    headers.set("cache-control", cacheControl);
  }
  if (etag) {
    headers.set("etag", etag);
  }

  return new Response(upstream.body, {
    status: upstream.status,
    headers,
  });
}
