# VitecoverServer

This repository is now organized as a small monorepo:

- `backend/`
  Directus-based insurance backend, backend Nginx config, extensions, schema sync script, and seed assets.
- `frontend/`
  Website and customer/admin-facing frontend application.
- `compose/`
  Shared compose-level assets, including the public Nginx config used by the integrated stack.
- `deploy/`
  Deployment scripts and deployment env templates.
- `docs/`
  Product, schema, and local workflow documentation.

The intended workflow is:

1. validate locally
2. merge the deployment changes
3. push to `dev` to auto-deploy on the self-hosted local machine runner

## Runtime layout

- `backend/directus/`
  Directus extensions, schema files, and seed files.
- `backend/nginx/`
  Nginx config for the backend-only starter stack.
- `compose/nginx/`
  Nginx config for the integrated frontend + backend stack.
- `docker-compose.override.yml`
  Root override that layers frontend, MinIO, and the shared edge config on top of `backend/docker-compose.yml`.
- `up.sh`
  Single startup entry point from the repository root.

## Dev Deployment

- `.github/workflows/deploy-dev-local.yml`
  Pushes to `dev` trigger deployment on a GitHub self-hosted runner running on this machine.
- Deployment target path:
  configured via repository variable `DEPLOY_REPO_DIR` (for example `apps/VitecoverServer`)
- Deployment command:
  `./up.sh`
- Important:
  This path is hard-reset to `origin/dev` during deployment, so it should be treated as a dedicated deployment checkout, not a place for uncommitted local work.

## Reverse proxy access model (recommended)

For integrated frontend + backend runs (`./up.sh`), use **one public entrypoint**:

- Public/LAN URL: `http://<host>[:EDGE_HTTP_PORT]` via `vitecover_edge` (Nginx)
- Frontend app is reachable only behind this edge proxy
- Directus public API/assets are exposed through `/directus/*` on the same edge host

Directus keeps its default backend port for debugging/testing, but it is bound to localhost by
default in `docker-compose.override.yml`:

- `DIRECTUS_DEV_BIND=127.0.0.1`
- `DIRECTUS_DEV_PORT=8055`

That means:

- on the server itself you can still test Directus directly at `http://127.0.0.1:8055`
- LAN/mobile clients should use the edge URL only, preventing multi-channel access confusion

## Optional local browser test container

When you need to quickly validate frontend/backend integration flows (for example: Google account
login management, self-service order creation, PDF/contract attachment access), you can run the
optional browser tooling container:

```bash
docker compose -f docker-compose.browser.yml up -d
docker exec -it vitecover_browser_tools bash
```

Then inside the container, you can run Playwright one-off checks against the reverse-proxy URL:

```bash
npx -y playwright@1.53.0 open http://127.0.0.1:${EDGE_HTTP_PORT:-80}
```

For CI-like headless smoke checks and screenshots:

```bash
npx -y playwright@1.53.0 screenshot --browser=chromium http://127.0.0.1:${EDGE_HTTP_PORT:-80} /tmp/home.png
```

The browser container uses host networking so it can access your local reverse-proxy endpoint and
the local-only Directus debug endpoint when needed.

## Current focus

The backend is already initialized around the temporary vehicle insurance workflow:

- customer accounts
- vehicles
- drivers
- insurance products
- geo zones
- pricing rules
- quotes
- orders
- payments
- admin reviews
- policies
- refunds

## Where to start

- Backend runtime and schema workflow: [backend/README.md](backend/README.md)
- Documentation index: [docs/README.md](docs/README.md)
- Local workflow and repository usage: [docs/01-local-doc-index.md](docs/01-local-doc-index.md)
- Business scope: [docs/02-business-plan.md](docs/02-business-plan.md)
- Technical roadmap: [docs/03-technical-roadmap.md](docs/03-technical-roadmap.md)
- Frontend plan: [docs/04-frontend-plan.md](docs/04-frontend-plan.md)
- Backend plan: [docs/05-backend-plan.md](docs/05-backend-plan.md)
