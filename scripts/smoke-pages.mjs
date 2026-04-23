#!/usr/bin/env node
import { readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const appDir = join(process.cwd(), "frontend", "src", "app");
const args = new Map();

for (let index = 2; index < process.argv.length; index += 2) {
  args.set(process.argv[index], process.argv[index + 1]);
}

const baseUrl =
  args.get("--base-url") ||
  process.env.SMOKE_BASE_URL ||
  `http://127.0.0.1:${process.env.EDGE_HTTP_PORT || "80"}`;
const timeoutMs = Number(args.get("--timeout-ms") || process.env.SMOKE_TIMEOUT_MS || 10000);
const retries = Number(args.get("--retries") || process.env.SMOKE_RETRIES || 5);

function findPageFiles(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    const stats = statSync(path);

    if (stats.isDirectory()) {
      return findPageFiles(path);
    }

    return entry === "page.tsx" ? [path] : [];
  });
}

function toRoute(file) {
  const parts = relative(appDir, file).split(sep).slice(0, -1);
  const routeParts = parts.filter((part) => !part.startsWith("(") && !part.startsWith("@"));

  if (routeParts.some((part) => part.startsWith("[") || part === "api")) {
    return null;
  }

  return `/${routeParts.join("/")}`.replace(/\/$/, "") || "/";
}

async function requestRoute(route) {
  const url = new URL(route, baseUrl);

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        redirect: "follow",
        signal: controller.signal,
        headers: { "User-Agent": "vitecover-smoke-test/1.0" },
      });

      clearTimeout(timeout);

      const body = await response.text();
      const hasFallback = body.includes("网站正在更新中") || body.includes("__fallback.html");
      const hasNextError = body.includes('id="__next_error__"');

      if (response.status >= 200 && response.status < 300) {
        if (hasFallback || hasNextError) {
          return { route, status: response.status, finalUrl: response.url, error: "Error page rendered" };
        }
        return { route, status: response.status, finalUrl: response.url };
      }

      if (response.status >= 300 && response.status < 400 && !hasFallback && !hasNextError) {
        return { route, status: response.status, finalUrl: response.headers.get("location") ?? response.url };
      }

      if (attempt === retries) {
        return { route, status: response.status, finalUrl: response.url, error: response.statusText };
      }
    } catch (error) {
      clearTimeout(timeout);

      if (attempt === retries) {
        return { route, error: error instanceof Error ? error.message : String(error) };
      }
    }

    await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
  }
}

const routes = [...new Set(findPageFiles(appDir).map(toRoute).filter(Boolean))].sort();
const results = await Promise.all(routes.map(requestRoute));
const failures = results.filter((result) => result.error || !result.status);

for (const result of results) {
  const label = result.error ? "FAIL" : "OK";
  const detail = result.status ? `${result.status}` : result.error;
  const finalUrl = result.finalUrl && !result.finalUrl.endsWith(result.route) ? ` -> ${result.finalUrl}` : "";
  console.log(`${label} ${result.route} ${detail}${finalUrl}`);
}

if (failures.length > 0) {
  console.error(`Smoke test failed: ${failures.length}/${routes.length} routes failed.`);
  process.exit(1);
}

console.log(`Smoke test passed: ${routes.length} routes checked at ${baseUrl}.`);
