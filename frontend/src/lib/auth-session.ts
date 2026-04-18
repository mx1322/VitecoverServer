import { createHmac, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  email: string;
}

const sessionCookieName = "vitecover-auth-session";
const sessionLifetimeSeconds = 60 * 60 * 24 * 14;

function getSessionSecret(): string {
  return process.env.AUTH_SESSION_SECRET ?? process.env.SECRET ?? "vitecover-dev-session-secret";
}

function shouldUseSecureCookies(): boolean {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? "";

  if (!siteUrl) {
    return false;
  }

  try {
    return new URL(siteUrl).protocol === "https:";
  } catch {
    return false;
  }
}

function sign(value: string): string {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

function encodeSession(session: AuthSession): string {
  const payload = Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function decodeSession(value: string): AuthSession | null {
  const [payload, signature] = value.split(".");
  if (!payload || !signature) {
    return null;
  }

  const expected = sign(payload);
  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(signature);
  if (expectedBuffer.length !== actualBuffer.length) {
    return null;
  }

  if (!timingSafeEqual(expectedBuffer, actualBuffer)) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as AuthSession;
  } catch {
    return null;
  }
}

export async function readAuthSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(sessionCookieName)?.value;
  if (!raw) {
    return null;
  }

  return decodeSession(raw);
}

export async function writeAuthSession(session: AuthSession): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(sessionCookieName, encodeSession(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: shouldUseSecureCookies(),
    path: "/",
    maxAge: sessionLifetimeSeconds,
  });
}

export async function clearAuthSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(sessionCookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: shouldUseSecureCookies(),
    path: "/",
    maxAge: 0,
  });
}
