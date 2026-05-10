const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
const directusToken = process.env.DIRECTUS_TOKEN;

function hasDirectusConfig() {
  return Boolean(directusUrl);
}

export async function directusList<T>(collection: string, query: Record<string, string> = {}): Promise<T[]> {
  if (!hasDirectusConfig()) {
    return [];
  }

  const url = new URL(`/items/${collection}`, directusUrl);
  Object.entries(query).forEach(([key, value]) => url.searchParams.set(key, value));

  const response = await fetch(url.toString(), {
    next: { revalidate: 120 },
    headers: directusToken ? { Authorization: `Bearer ${directusToken}` } : undefined,
  });

  if (!response.ok) {
    return [];
  }

  const payload = (await response.json()) as { data?: T[] };
  return payload.data ?? [];
}
