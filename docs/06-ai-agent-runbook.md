# AI Agent Runbook

## Purpose

This runbook is the **operational shortcut** for AI agents working in this repository.
It focuses on local verification paths that match the intended EC2 production topology.

---

## 1) Network model to respect

Use one public entrypoint in integrated mode:

- Edge URL: `http://<host>[:EDGE_HTTP_PORT]`
- Frontend access: through edge proxy only
- Directus public API/assets: through `/directus/*` on the same edge host

Why:

- keeps local and EC2 traffic shape consistent
- avoids “works on localhost but not on LAN/mobile” issues

Directus direct port for debugging is intentionally kept, but local-only by default:

- Directus stays internal to the Docker network in the integrated stack

---

## 2) Local startup (integrated stack)

From repository root:

```bash
./up.sh
```

Expected behavior:

- edge proxy is reachable on `EDGE_HTTP_PORT` (default `80`)
- Directus direct debug endpoint remains local-only unless explicitly rebound

---

## 3) Browser-based verification (optional, recommended)

When validating end-to-end UI flows, use the optional browser tools container:

```bash
docker compose -f docker-compose.browser.yml up -d
docker exec -it vitecover_browser_tools bash
```

Then run one-off checks with Playwright:

```bash
npx -y playwright@1.53.0 open http://127.0.0.1:${EDGE_HTTP_PORT:-80}
npx -y playwright@1.53.0 screenshot --browser=chromium http://127.0.0.1:${EDGE_HTTP_PORT:-80} /tmp/home.png
```

---

## 4) Minimum smoke checklist for feature work

For auth/order/policy document changes, verify at least:

1. Homepage product cards load images from proxied `/directus/assets/*`
2. Account auth path still works (login/session refresh)
3. Self-service checkout can create an order
4. Contract/policy attachment link is visible in account orders and downloadable
5. No hardcoded `localhost` URLs leak into public browser responses

---

## 5) Agent guardrails

- Prefer editing docs/config through repository files, not ad-hoc shell notes.
- Do not expose extra public ports unless the task explicitly requires it.
- If you need a temporary debug port, bind to `127.0.0.1` first.
- When reporting test results, state exactly which URL was tested
  (edge URL vs direct service URL).
