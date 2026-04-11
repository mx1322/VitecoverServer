# VitecoverServer Local Notes

## My current understanding

This repository is the backend workspace for an insurance website/project.
The current backend is centered on Directus and is designed for local-first development, with the final target environment being AWS.

Today this repo already contains:

- a local Docker stack for Directus, PostgreSQL, Redis, and Nginx
- a checked-in Directus schema workspace under `directus/schema`
- a custom schema sync script for pulling from and pushing to a Directus instance
- a place for future Directus extensions under `directus/extensions`

From the existing schema files, the current business model appears to focus on insurance application or policy workflow basics:

- `customers`
- `drivers`
- `vehicles`
- `orders`

The relationships suggest this is likely a quote/order intake flow for vehicle insurance:

- one customer can have multiple drivers
- one customer can have multiple vehicles
- an order links a customer, driver, and vehicle

## Repository structure

- `docker-compose.yml`
  Local infrastructure definition for PostgreSQL, Redis, Directus, and Nginx.
- `directus/schema/schema-target.json`
  The editable local schema source of truth you are actively working on and intend to push.
- `directus/schema/schema-remote-baseline.json`
  A cached snapshot of the latest schema pulled from the remote/server Directus instance.
- `directus/schema/live-current.tmp.json`
  A temporary snapshot of the currently queried Directus instance, generated during sync/status operations.
- `scripts/directus_schema_sync.py`
  The custom schema sync tool for `pull`, `status`, and `push`.
- `scripts/start.sh`
  Starts the local Docker stack.
- `scripts/stop.sh`
  Stops the local Docker stack.
- `nginx/default.conf`
  Reverse proxy config routing port `8080` to Directus on port `8055`.

## Local workflow

The intended workflow seems to be:

1. Start the local Directus stack.
2. Develop collections/fields/relations locally.
3. Save the working schema into `directus/schema/schema-target.json`.
4. Compare local schema with the target Directus instance.
5. Push schema changes to the server when ready.
6. Eventually deploy the finished backend stack to AWS-managed infrastructure.

## Schema sync script behavior

The custom sync script is the key part of this repo.

Command summary:

```bash
python3 scripts/directus_schema_sync.py pull
python3 scripts/directus_schema_sync.py status
python3 scripts/directus_schema_sync.py push
```

What each command does:

- `pull`
  Fetches the live schema snapshot from Directus, writes it to `schema-remote-baseline.json`, and can optionally overwrite `schema-target.json`.
- `status`
  Compares the live server schema against `schema-target.json`, and also compares against `schema-remote-baseline.json` if present.
- `push`
  Computes the diff from the live server to `schema-target.json`, previews the changes, asks for confirmation, then applies the schema to Directus.

Environment assumptions from the script:

- `.env` must exist
- `DIRECTUS_TOKEN` or `ADMIN_TOKEN` must exist in `.env`
- `DIRECTUS_URL` is used if present
- otherwise `PUBLIC_URL` is used
- otherwise it falls back to `http://localhost:8055`

## Local runtime

The Docker stack currently runs:

- `postgres:16-alpine`
- `redis:7-alpine`
- `directus/directus:11.12.0`
- `nginx:1.27-alpine`

Published ports:

- `8055` -> Directus
- `8080` -> Nginx reverse proxy

Mounted local directories:

- `./data/postgres`
- `./uploads`
- `./directus/extensions`

## AWS target architecture

Based on the current repo and the existing README, the intended production direction is likely:

- Directus running in AWS
- PostgreSQL moved to RDS
- file uploads moved to S3
- Nginx or a cloud load balancer placed in front of Directus
- secrets managed only in the server/cloud environment

This means the repo is acting as a local backend development cockpit, while production should become a more cloud-native deployment.

## Things worth noting

- The top-level `README.md` mentions `.env.example`, but this file is not currently present in the repository.
- `scripts/start.sh` expects `.env.example` to exist if `.env` is missing.
- The current checked-in schema is still a relatively early business skeleton and will likely expand as the insurance workflow becomes more detailed.

## Working assumption going forward

Unless you tell me otherwise, I will treat this repository as:

- a Directus-based backend for an insurance website
- developed locally first with Docker
- synchronized to a remote/server Directus instance through `scripts/directus_schema_sync.py`
- intended to end up on AWS after the schema and backend workflow are stable
