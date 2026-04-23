#!/usr/bin/env node
import { chromium } from "playwright";

const baseUrl = (process.env.SMOKE_BASE_URL || "http://127.0.0.1").replace(/\/$/, "");
const email = process.env.SMOKE_AUTH_EMAIL || process.env.DIRECTUS_ADMIN_EMAIL;
const password = process.env.SMOKE_AUTH_PASSWORD || process.env.DIRECTUS_ADMIN_PASSWORD;
const timeoutMs = Number(process.env.SMOKE_AUTH_TIMEOUT_MS || 30000);

if (!email || !password) {
  console.error("Missing smoke auth credentials: set SMOKE_AUTH_EMAIL/PASSWORD or DIRECTUS_ADMIN_EMAIL/PASSWORD.");
  process.exit(1);
}

function urlFor(path) {
  return new URL(path, baseUrl).toString();
}

function fail(message) {
  console.error(`FAIL ${message}`);
  process.exitCode = 1;
}

async function waitForAppIdle(page) {
  await page.waitForLoadState("domcontentloaded", { timeout: timeoutMs });
  await page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => {});
}

async function assertNotOnAuth(page, label) {
  const currentUrl = new URL(page.url());

  if (currentUrl.pathname === "/auth") {
    throw new Error(`${label} is still on /auth (${page.url()}).`);
  }
}

async function login(page, returnTo) {
  await page.goto(urlFor(`/auth?returnTo=${encodeURIComponent(returnTo)}`), {
    waitUntil: "domcontentloaded",
    timeout: timeoutMs,
  });

  if (new URL(page.url()).pathname !== "/auth") {
    return;
  }

  await page.getByLabel("Email").fill(email, { timeout: timeoutMs });
  await page.getByLabel("Password").fill(password, { timeout: timeoutMs });
  await page.getByRole("button", { name: "Sign in" }).last().click({ timeout: timeoutMs });
  await page.waitForURL((url) => url.pathname !== "/auth", { timeout: timeoutMs });
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();
const runtimeErrors = [];

page.on("pageerror", (error) => {
  runtimeErrors.push(error.message);
});

try {
  await login(page, "/account");
  await waitForAppIdle(page);
  await assertNotOnAuth(page, "account login");
  await page.getByText("Account Center").waitFor({ timeout: timeoutMs });

  const session = await page.evaluate(async () => {
    const response = await fetch("/api/auth/session?scope=identity", { cache: "no-store" });
    return response.json();
  });

  if (!session.authenticated || !session.account?.user?.role) {
    throw new Error(`identity session did not load after login: ${JSON.stringify(session)}`);
  }

  console.log(`OK /account authenticated as ${session.account.user.role}`);

  await page.goto(urlFor("/quote"), { waitUntil: "domcontentloaded", timeout: timeoutMs });
  await waitForAppIdle(page);

  const confirmButton = page.getByRole("button", { name: "Confirm insurance" });
  await confirmButton.click({ timeout: timeoutMs });
  await waitForAppIdle(page);
  await assertNotOnAuth(page, "quote vehicle step");

  const loginRequired = await page.getByText("Login required").isVisible().catch(() => false);
  if (loginRequired) {
    throw new Error("quote vehicle step still shows Login required after authenticated login.");
  }

  await page.getByText("Logged in account").waitFor({ timeout: timeoutMs });
  console.log("OK /quote authenticated vehicle step");

  if (runtimeErrors.length > 0) {
    throw new Error(`browser runtime errors: ${runtimeErrors.join(" | ")}`);
  }
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
} finally {
  await browser.close();
}
