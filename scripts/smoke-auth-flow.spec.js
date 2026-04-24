const { test, expect } = require("@playwright/test");

const baseUrl = (process.env.SMOKE_BASE_URL || "http://127.0.0.1").replace(/\/$/, "");
const accounts = [
  {
    label: "admin",
    email: process.env.SMOKE_AUTH_EMAIL || process.env.DIRECTUS_ADMIN_EMAIL,
    password: process.env.SMOKE_AUTH_PASSWORD || process.env.DIRECTUS_ADMIN_PASSWORD,
    expectedRole: process.env.SMOKE_AUTH_ROLE || "admin",
    shouldSeeManager: true,
  },
  {
    label: "manager",
    email: process.env.SMOKE_MANAGER_EMAIL,
    password: process.env.SMOKE_MANAGER_PASSWORD,
    expectedRole: "product_manager",
    shouldSeeManager: true,
  },
  {
    label: "customer",
    email: process.env.SMOKE_CUSTOMER_EMAIL,
    password: process.env.SMOKE_CUSTOMER_PASSWORD,
    expectedRole: "customer",
    shouldSeeManager: false,
  },
].filter((account) => account.email && account.password);

if (accounts.length === 0) {
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

async function login(page, account, returnTo) {
  await page.goto(urlFor(`/auth?returnTo=${encodeURIComponent(returnTo)}`));

  if (new URL(page.url()).pathname !== "/auth") {
    return;
  }

  await page.getByLabel("Email").fill(account.email);
  await page.getByLabel("Password").fill(account.password);
  await page.getByRole("button", { name: "Sign in" }).last().click();
  await page.waitForURL((url) => url.pathname !== "/auth");
}

for (const account of accounts) {
  test(`account and quote authenticated flows work through nginx for ${account.label}`, async ({ page }) => {
    const runtimeErrors = [];
    page.on("pageerror", (error) => {
      runtimeErrors.push(error.message);
    });

    await login(page, account, "/account");
    await waitForAppIdle(page);
    await assertNotOnAuth(page, `${account.label} account login`);
    await page.getByText("Account Center").waitFor();

    const session = await page.evaluate(async () => {
      const response = await fetch("/api/auth/session?scope=identity", { cache: "no-store" });
      return response.json();
    });

    expect(session.authenticated).toBe(true);
    expect(session.account?.user?.email).toBe(account.email);
    expect(session.account?.user?.role).toBe(account.expectedRole);
    console.log(`OK /account ${account.label} authenticated as ${session.account.user.role}`);

    if (account.shouldSeeManager) {
      await expect(page.getByRole("link", { name: "Approvals" })).toBeVisible();
    } else {
      await expect(page.getByRole("link", { name: "Approvals" })).toHaveCount(0);
    }

    await page.goto(urlFor("/quote"));
    await waitForAppIdle(page);

    await page.getByRole("button", { name: "Confirm insurance" }).click();
    await waitForAppIdle(page);
    await assertNotOnAuth(page, `${account.label} quote vehicle step`);

    await expect(page.getByText("Login required")).toHaveCount(0);
    await page.getByText("Logged in account").waitFor();
    console.log(`OK /quote ${account.label} authenticated vehicle step`);

    expect(runtimeErrors).toEqual([]);
  });
}
