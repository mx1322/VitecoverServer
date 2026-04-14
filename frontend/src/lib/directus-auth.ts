import {
  clearAuthSession,
  readAuthSession,
  writeAuthSession,
  type AuthSession,
} from "@/lib/auth-session";
import {
  ensureCustomerWorkspaceForDirectusUser,
  closeCustomerAccount as closeCustomerWorkspaceAccount,
  updateCustomerProfile,
  type CustomerWorkspace,
  type ContinueCustomerInput,
} from "@/lib/directus-admin";

interface DirectusAuthPayload {
  access_token: string;
  refresh_token: string;
  expires: number;
}

interface DirectusUserRecord {
  id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  status?: string | null;
}

export interface AuthenticatedAccount {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    status: string;
    isEmailVerified: boolean;
  };
  customer: CustomerWorkspace["customer"];
  vehicles: CustomerWorkspace["vehicles"];
  drivers: CustomerWorkspace["drivers"];
  recentOrders: CustomerWorkspace["recentOrders"];
}

const directusInternalUrl =
  process.env.DIRECTUS_INTERNAL_URL?.replace(/\/$/, "") ??
  process.env.NEXT_PUBLIC_DIRECTUS_URL?.replace(/\/$/, "") ??
  "http://localhost:8088/directus";
const directusStaticToken = process.env.DIRECTUS_TOKEN ?? process.env.ADMIN_TOKEN;
const directusAdminEmail = process.env.DIRECTUS_ADMIN_EMAIL;
const directusAdminPassword = process.env.DIRECTUS_ADMIN_PASSWORD;

function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    process.env.SITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000"
  );
}

function normalizeText(value?: string | null): string {
  return value?.trim() ?? "";
}

async function directusPublicRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${directusInternalUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  const payload = (await response.json()) as T & {
    errors?: Array<{ message?: string }>;
  };

  if (!response.ok) {
    const message =
      payload.errors?.[0]?.message ?? `Directus request failed with status ${response.status}.`;
    throw new Error(message);
  }

  return payload;
}

function assertAdminConfig(): void {
  if (!directusStaticToken && (!directusAdminEmail || !directusAdminPassword)) {
    throw new Error("Missing Directus admin credentials in frontend runtime env.");
  }
}

async function loginDirectusAdmin(): Promise<string> {
  assertAdminConfig();
  if (directusStaticToken) {
    return directusStaticToken;
  }

  const payload = await directusPublicRequest<{ data: { access_token: string } }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: directusAdminEmail,
      password: directusAdminPassword,
    }),
  });

  return payload.data.access_token;
}

async function directusAuthedRequest<T>(
  path: string,
  accessToken: string,
  init?: RequestInit,
): Promise<T> {
  return directusPublicRequest<T>(path, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(init?.headers ?? {}),
    },
  });
}

async function directusAdminRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await loginDirectusAdmin();
  return directusAuthedRequest<T>(path, token, init);
}

function mapSession(payload: DirectusAuthPayload, email: string): AuthSession {
  return {
    accessToken: payload.access_token,
    refreshToken: payload.refresh_token,
    expiresAt: Date.now() + payload.expires,
    email,
  };
}

export async function registerDirectusAccount(input: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}): Promise<void> {
  await directusPublicRequest("/users/register", {
    method: "POST",
    body: JSON.stringify({
      email: input.email.trim().toLowerCase(),
      password: input.password,
      first_name: input.firstName.trim(),
      last_name: input.lastName.trim(),
      verification_url: `${getSiteUrl()}/auth/verify-email`,
    }),
  });
}

export async function loginDirectusAccount(email: string, password: string): Promise<void> {
  const payload = await directusPublicRequest<{ data: DirectusAuthPayload }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      password,
      mode: "json",
    }),
  });

  await writeAuthSession(mapSession(payload.data, email));
}

async function refreshDirectusSession(session: AuthSession): Promise<AuthSession | null> {
  try {
    const payload = await directusPublicRequest<{ data: DirectusAuthPayload }>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({
        refresh_token: session.refreshToken,
        mode: "json",
      }),
    });

    const refreshed = mapSession(payload.data, session.email);
    await writeAuthSession(refreshed);
    return refreshed;
  } catch {
    await clearAuthSession();
    return null;
  }
}

export async function getValidAuthSession(): Promise<AuthSession | null> {
  const session = await readAuthSession();
  if (!session) {
    return null;
  }

  if (session.expiresAt > Date.now() + 30_000) {
    return session;
  }

  return refreshDirectusSession(session);
}

async function getDirectusUser(accessToken: string): Promise<DirectusUserRecord> {
  const payload = await directusAuthedRequest<{ data: DirectusUserRecord }>(
    "/users/me?fields=id,email,first_name,last_name,status",
    accessToken,
  );

  return payload.data;
}

function mapAuthenticatedAccount(
  user: DirectusUserRecord,
  workspace: CustomerWorkspace,
): AuthenticatedAccount {
  const status = normalizeText(user.status) || "draft";
  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: normalizeText(user.first_name),
      lastName: normalizeText(user.last_name),
      status,
      isEmailVerified: status === "active",
    },
    customer: workspace.customer,
    vehicles: workspace.vehicles,
    drivers: workspace.drivers,
    recentOrders: workspace.recentOrders,
  };
}

export async function getAuthenticatedAccount(): Promise<AuthenticatedAccount | null> {
  const session = await getValidAuthSession();
  if (!session) {
    return null;
  }

  const user = await getDirectusUser(session.accessToken);
  const workspace = await ensureCustomerWorkspaceForDirectusUser({
    directusUserId: user.id,
    email: user.email,
    firstName: normalizeText(user.first_name),
    lastName: normalizeText(user.last_name),
  });

  return mapAuthenticatedAccount(user, workspace);
}

export async function logoutDirectusAccount(): Promise<void> {
  const session = await readAuthSession();
  if (session) {
    try {
      await directusPublicRequest("/auth/logout", {
        method: "POST",
        body: JSON.stringify({
          refresh_token: session.refreshToken,
        }),
      });
    } catch {
      // Ignore logout transport errors and clear local session anyway.
    }
  }

  await clearAuthSession();
}

export async function deleteAuthenticatedAccount(): Promise<void> {
  const session = await getValidAuthSession();
  if (!session) {
    throw new Error("You must be signed in to delete the account.");
  }

  const user = await getDirectusUser(session.accessToken);
  await directusAdminRequest(`/users/${user.id}`, {
    method: "PATCH",
    body: JSON.stringify({
      status: "suspended",
    }),
  });
  await closeCustomerWorkspaceAccount(user.email);
  await logoutDirectusAccount();
}

export async function requestPasswordReset(email: string): Promise<void> {
  await directusPublicRequest("/auth/password/request", {
    method: "POST",
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      reset_url: `${getSiteUrl()}/auth/reset-password`,
    }),
  });
}

export async function resetPassword(token: string, password: string): Promise<void> {
  await directusPublicRequest("/auth/password/reset", {
    method: "POST",
    body: JSON.stringify({
      token,
      password,
    }),
  });
}

export async function verifyRegistrationEmail(token: string): Promise<void> {
  await directusPublicRequest("/users/register/verify-email", {
    method: "POST",
    body: JSON.stringify({
      token,
    }),
  });
}

export async function changeCurrentPassword(password: string): Promise<void> {
  const session = await getValidAuthSession();
  if (!session) {
    throw new Error("You must be signed in to change the password.");
  }

  await directusAuthedRequest("/users/me", session.accessToken, {
    method: "PATCH",
    body: JSON.stringify({
      password,
    }),
  });
}

export async function updateAuthenticatedProfile(
  input: ContinueCustomerInput,
): Promise<AuthenticatedAccount> {
  const session = await getValidAuthSession();
  if (!session) {
    throw new Error("You must be signed in to update the profile.");
  }

  const currentUser = await getDirectusUser(session.accessToken);
  await directusAuthedRequest("/users/me", session.accessToken, {
    method: "PATCH",
    body: JSON.stringify({
      first_name: normalizeText(input.firstName),
      last_name: normalizeText(input.lastName),
    }),
  });

  const workspace = await updateCustomerProfile({
    email: currentUser.email,
    firstName: normalizeText(input.firstName) || normalizeText(currentUser.first_name),
    lastName: normalizeText(input.lastName) || normalizeText(currentUser.last_name),
    phone: normalizeText(input.phone),
    customerType: normalizeText(input.customerType) || "individual",
    preferredLanguage: normalizeText(input.preferredLanguage) || "fr-FR",
    directusUserId: currentUser.id,
  });

  return mapAuthenticatedAccount(
    {
      ...currentUser,
      first_name: normalizeText(input.firstName) || currentUser.first_name,
      last_name: normalizeText(input.lastName) || currentUser.last_name,
    },
    workspace,
  );
}
