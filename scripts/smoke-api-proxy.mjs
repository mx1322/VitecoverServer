#!/usr/bin/env node
const baseUrl = (process.env.SMOKE_BASE_URL || "http://127.0.0.1").replace(/\/$/, "");
const email = process.env.SMOKE_AUTH_EMAIL || process.env.DIRECTUS_ADMIN_EMAIL;
const password = process.env.SMOKE_AUTH_PASSWORD || process.env.DIRECTUS_ADMIN_PASSWORD;
const timeoutMs = Number(process.env.SMOKE_TIMEOUT_MS || 10000);
const cookieJar = new Map();
let createdVehicleId = null;
let createdDriverId = null;

if (!email || !password) {
  console.error("Missing smoke auth credentials: set SMOKE_AUTH_EMAIL/PASSWORD or DIRECTUS_ADMIN_EMAIL/PASSWORD.");
  process.exit(1);
}

function urlFor(path) {
  return new URL(path, baseUrl).toString();
}

function saveCookies(response) {
  const setCookie = response.headers.getSetCookie?.() ?? [];

  for (const cookie of setCookie) {
    const [pair] = cookie.split(";");
    const [name, value] = pair.split("=");
    if (name && value) {
      cookieJar.set(name.trim(), value.trim());
    }
  }
}

function cookieHeader() {
  return [...cookieJar.entries()].map(([name, value]) => `${name}=${value}`).join("; ");
}

async function request(path, init = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const headers = {
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(cookieJar.size ? { Cookie: cookieHeader() } : {}),
      ...(init.headers ?? {}),
    };
    const response = await fetch(urlFor(path), {
      ...init,
      headers,
      redirect: "manual",
      signal: controller.signal,
    });
    saveCookies(response);

    const contentType = response.headers.get("content-type") || "";
    const rawBody = contentType.includes("application/json")
      ? await response.json()
      : await response.text();
    const body = typeof rawBody === "string" && rawBody.trim().startsWith("{")
      ? JSON.parse(rawBody)
      : rawBody;

    if (!response.ok) {
      throw new Error(`${path} returned ${response.status}: ${JSON.stringify(body).slice(0, 400)}`);
    }

    return body;
  } finally {
    clearTimeout(timeout);
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

try {
  const directusHealth = await request("/directus/server/health");
  assert(
    directusHealth?.status === "ok" || directusHealth?.status === "healthy",
    `/directus/server/health did not return a healthy JSON status: ${JSON.stringify(directusHealth)}`,
  );
  console.log("OK /directus/server/health healthy");

  const login = await request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  assert(login?.ok === true, `/api/auth/login did not return ok=true: ${JSON.stringify(login)}`);
  assert(cookieJar.has("vitecover-auth-session"), "/api/auth/login did not set vitecover-auth-session cookie.");
  console.log("OK /api/auth/login cookie set");

  const identity = await request("/api/auth/session?scope=identity");
  assert(identity?.authenticated === true, "/api/auth/session?scope=identity is not authenticated.");
  assert(identity?.account?.user?.email, "identity session is missing user email.");
  assert(identity?.account?.user?.role, "identity session is missing user role.");
  console.log(`OK /api/auth/session?scope=identity role=${identity.account.user.role}`);

  const account = await request("/api/auth/session");
  assert(account?.authenticated === true, "/api/auth/session is not authenticated.");
  assert(account?.account?.customer?.email, "account session is missing customer email.");
  assert(Array.isArray(account?.account?.vehicles), "account session is missing vehicles array.");
  assert(Array.isArray(account?.account?.drivers), "account session is missing drivers array.");
  console.log("OK /api/auth/session workspace loaded");

  const uniqueSuffix = `${Date.now()}`;
  const registrationNumber = `SMK${uniqueSuffix.slice(-6)}`;
  const driverFirstName = `Smoke${uniqueSuffix.slice(-4)}`;
  const driverLastName = "Driver";

  const createdVehicle = await request("/api/auth/workspace-item", {
    method: "POST",
    body: JSON.stringify({
      kind: "vehicle",
      registrationNumber,
      manufacturer: "Smoke",
      model: "Queue Check",
      fiscalPower: 6,
    }),
  });
  const createdVehicleRecord = createdVehicle?.workspace?.vehicles?.find(
    (vehicle) => vehicle.registrationNumber === registrationNumber,
  );
  assert(createdVehicleRecord?.id, "Created vehicle was not returned in workspace.");
  createdVehicleId = createdVehicleRecord.id;
  console.log(`OK /api/auth/workspace-item vehicle=${registrationNumber}`);

  const createdDriver = await request("/api/auth/workspace-item", {
    method: "POST",
    body: JSON.stringify({
      kind: "driver",
      firstName: driverFirstName,
      lastName: driverLastName,
      birthday: "1990-01-01",
      driverEmail: account.account.customer.email,
      phone: account.account.customer.phone || "",
      licenseNumber: `LIC-${uniqueSuffix.slice(-6)}`,
      licenseCountryCode: "FR",
    }),
  });
  const createdDriverRecord = createdDriver?.workspace?.drivers?.find(
    (driver) => driver.firstName === driverFirstName && driver.lastName === driverLastName,
  );
  assert(createdDriverRecord?.id, "Created driver was not returned in workspace.");
  createdDriverId = createdDriverRecord.id;
  console.log(`OK /api/auth/workspace-item driver=${driverFirstName} ${driverLastName}`);

  const preview = await request("/api/checkout/preview", {
    method: "POST",
    body: JSON.stringify({
      productCode: "AUTOMOBILE",
      durationDays: 1,
      coverageStartAt: new Date(Date.now() + 36 * 60 * 60 * 1000).toISOString(),
      fiscalPower: 6,
    }),
  });
  assert(preview?.productCode === "AUTOMOBILE", "/api/checkout/preview returned wrong product.");
  assert(Number(preview?.totalPremium) > 0, "/api/checkout/preview returned invalid premium.");
  console.log(`OK /api/checkout/preview premium=${preview.totalPremium}`);

  if (identity.account.user.role === "product_manager" || identity.account.user.role === "admin") {
    const review = await request("/api/admin/workspace-review");
    assert(Array.isArray(review?.items), "/api/admin/workspace-review is missing items array.");
    assert(
      review.items.some((item) => item.kind === "vehicle" && item.title === registrationNumber),
      "Created vehicle is missing from manager review queue.",
    );
    assert(
      review.items.some((item) => item.kind === "driver" && item.title.includes(driverFirstName)),
      "Created driver is missing from manager review queue.",
    );
    console.log(`OK /api/admin/workspace-review items=${review.items.length} includes new records`);
  }

  console.log(`Smoke API proxy passed at ${baseUrl}.`);
} catch (error) {
  console.error(`FAIL ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
} finally {
  try {
    if (createdVehicleId) {
      await request("/api/auth/workspace-item", {
        method: "DELETE",
        body: JSON.stringify({ kind: "vehicle", id: createdVehicleId }),
      });
    }

    if (createdDriverId) {
      await request("/api/auth/workspace-item", {
        method: "DELETE",
        body: JSON.stringify({ kind: "driver", id: createdDriverId }),
      });
    }

    if (createdVehicleId || createdDriverId) {
      console.log("OK cleanup workspace review records");
    }
  } catch (cleanupError) {
    console.error(`FAIL cleanup ${cleanupError instanceof Error ? cleanupError.message : String(cleanupError)}`);
    process.exit(1);
  }
}
