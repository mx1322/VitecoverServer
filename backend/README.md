# Directus Starter for Insurance Backend

This starter gives you a local Docker-based Directus backend with:

- Directus
- PostgreSQL
- Redis
- Nginx reverse proxy

Base-only commands assume your working directory is `backend/`.

Directory note:

- `backend/directus/` contains extensions, schema, and seed assets for the backend.
- `backend/nginx/` contains the backend-only Nginx config used by `backend/docker-compose.yml`.
- `compose/nginx/` at the repository root contains the shared public Nginx config used by the integrated stack.

## Quick start

### 1. Prepare environment variables

For local backend development, keep the repo-root `.env` with the correct local configuration.
This file is used by the backend base stack.

For the integrated monorepo deployment, the override stack reads from `deploy/linux/.env.deploy`.

### 2. Start the stack

```bash
docker compose up -d
```

## Integrated monorepo start

From the repository root, keep the official backend starter as the base file and layer local services with the override. The simplest entry point is:

```bash
./up.sh
```

Equivalent manual command:

```bash
docker compose --env-file deploy/linux/.env.deploy -f backend/docker-compose.yml -f docker-compose.override.yml up -d --build
```

### 3. Open Directus

- Base starter through Nginx: http://localhost:8080
- Base starter direct access: http://localhost:8055
- Integrated monorepo edge: http://localhost
- Integrated monorepo Directus: http://localhost/directus

## Stop the stack

```bash
docker compose down
```

Integrated monorepo stop:

```bash
docker compose --env-file deploy/linux/.env.deploy -f backend/docker-compose.yml -f docker-compose.override.yml down
```

## Schema files

The schema workspace under `backend/directus/schema` is intended to stay in Git, except for the temporary live snapshot file.

- `schema-target.json`
  The editable target schema you want to push to Directus. This is the main schema file to review, change, and version.
- `schema-remote-baseline.json`
  The last known remote/server baseline pulled from Directus. This helps compare your local target against the latest synced server state.
- `live-current.tmp.json`
  A temporary snapshot fetched during `pull` and `status`. This should not be committed.

## Schema sync workflow

Use the custom sync script to compare and move schema changes between your local repo and a Directus instance.

```bash
python3 scripts/directus_schema_sync.py pull
python3 scripts/directus_schema_sync.py status
python3 scripts/directus_schema_sync.py push
```

What each command does:

- `pull`
  Fetches the current Directus schema and refreshes `schema-remote-baseline.json`. You can also choose to overwrite `schema-target.json`.
- `status`
  Compares the live Directus schema against `schema-target.json` and the cached `schema-remote-baseline.json`.
- `push`
  Applies the diff from the live Directus schema to `schema-target.json`, then optionally refreshes both baseline files from the server.

## Product catalog seed

The repository now includes a seed file for the product catalog and pricing grid:

- [product-catalog.json](directus/seed/product-catalog.json)

This catalog is designed for:

- one product record per sellable insurance line
- one pricing rule per duration and fiscal power range

The first seeded tariff block currently covers:

- `AUTOMOBILE`
- durations from 1 to 90 days
- fiscal power range `2` to `10` CV

To import or update the catalog in Directus:

```bash
python3 scripts/directus_catalog_seed.py seed
```

The script expects `DIRECTUS_TOKEN` or `ADMIN_TOKEN` in the repo-root `.env`.
It upserts:

- `geo_zones`
- `insurance_products`
- `pricing_rules`

## Reset local data

This removes containers and deletes local database/uploads.

```bash
docker compose down -v
rm -rf data uploads
mkdir -p data/postgres uploads
```

## Suggested next steps

1. Continue refining the insurance backend collections and business logic:
   - customers
   - drivers
   - vehicles
   - insurance_products
   - geo_zones
   - pricing_rules
   - quotes
   - orders
   - payments
   - admin_reviews
   - policies
   - refunds

2. Move uploads to S3 when you deploy to AWS.
3. Put production secrets only on the server, not in GitHub.
4. Add custom logic under `backend/directus/extensions`.

## Notes

- Keep `.env` and `deploy/linux/.env.deploy` out of Git.
- Commit `docker-compose.yml`, `../docker-compose.override.yml`, `nginx/`, `../compose/nginx/`, and `directus/extensions/`.
- Commit `directus/schema/schema-target.json` and `directus/schema/schema-remote-baseline.json`.
- Ignore `directus/schema/live-current.tmp.json`.
- For EC2 production, put Directus behind HTTPS and use RDS + S3.
