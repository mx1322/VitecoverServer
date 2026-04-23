const { test, expect } = require("@playwright/test");

const baseUrl = (process.env.SMOKE_BASE_URL || "http://127.0.0.1").replace(/\/$/, "");
const email = process.env.SMOKE_AUTH_EMAIL || process.env.DIRECTUS_ADMIN_EMAIL;
const password = process.env.SMOKE_AUTH_PASSWORD || process.env.DIRECTUS_ADMIN_PASSWORD;

if (!email || !password) {
  throw new Error("Missing smoke auth credentials: set SMOKE_AUTH_EMAIL/PASSWORD or DIRECTUS_ADMIN_EMAIL/PASSWORD.");
}

function urlFor(path) {
  return new URL(path, baseUrl).toString();
}

async function waitForAppIdle(page) {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => {});
}

async function assertNotOnAuth(page, label) {
  const currentUrl = new URL(page.url());
  expect(currentUrl.pathname, `${label} is still on /auth (${page.url()})`).not.toBe("/auth");
}

async function login(page, returnTo) {
  await page.goto(urlFor(`/auth?returnTo=${encodeURIComponent(returnTo)}`));

  if (new URL(page.url()).pathname !== "/auth") {
    return;
  }

  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).last().click();
  await page.waitForURL((url) => url.pathname !== "/auth");
}

test("account and quote authenticated flows work through nginx", async ({ page }) => {
  const runtimeErrors = [];
  page.on("pageerror", (error) => {
    runtimeErrors.push(error.message);
  });

  await login(page, "/account");
  await waitForAppIdle(page);
  await assertNotOnAuth(page, "account login");
  await page.getByText("Account Center").waitFor();

  const session = await page.evaluate(async () => {
    const response = await fetch("/api/auth/session?scope=identity", { cache: "no-store" });
    return response.json();
  });

  expect(session.authenticated).toBe(true);
  expect(session.account?.user?.role).toBeTruthy();
  console.log(`OK /account authenticated as ${session.account.user.role}`);

  await page.goto(urlFor("/quote"));
  await waitForAppIdle(page);

  await page.getByRole("button", { name: "Confirm insurance" }).click();
  await waitForAppIdle(page);
  await assertNotOnAuth(page, "quote vehicle step");

  await expect(page.getByText("Login required")).toHaveCount(0);
  await page.getByText("Logged in account").waitFor();
  console.log("OK /quote authenticated vehicle step");

  expect(runtimeErrors).toEqual([]);
});
