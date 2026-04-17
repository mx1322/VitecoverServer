# Local Documentation Index

## Purpose

This document explains how the repository is organized locally and how the backend schema workflow is currently managed.

## Repository structure

The repository is organized as a small monorepo:

- `backend/`
  Directus backend, Docker stack, schema files, sync scripts, and backend deployment assets.
- `frontend/`
  Reserved for the customer-facing and admin-facing web frontend.
- `docs/`
  Project documentation, business notes, and technical plans.

## Backend structure

The backend directory currently contains:

- `backend/docker-compose.yml`
  Local development stack definition.
- `backend/directus/`
  Directus extensions and schema workspace.
- `backend/nginx/`
  Reverse proxy configuration for local access.
- `backend/scripts/`
  Backend helper scripts, including schema synchronization.
- `backend/.env`
  Local environment configuration.

## Schema files

The backend schema workspace is under `backend/directus/schema/`.

- `schema-target.json`
  The editable target schema that represents the intended database structure.
  This is the main schema file to review, version, and push.
- `schema-remote-baseline.json`
  A cached snapshot of the latest known server schema.
  This helps compare the local target against the last synchronized remote state.
- `live-current.tmp.json`
  A temporary live snapshot fetched during schema comparison operations.
  This file is not meant to be committed.

## Schema sync commands

The backend currently uses:

```bash
python backend/scripts/directus_schema_sync.py pull
python backend/scripts/directus_schema_sync.py status
python backend/scripts/directus_schema_sync.py push
```

Command behavior:

- `pull`
  Fetches the current Directus schema from the server, updates `schema-remote-baseline.json`, and can optionally overwrite `schema-target.json`.
- `status`
  Compares the live Directus schema against the local target and the cached remote baseline.
- `push`
  Computes the schema diff from the live Directus instance to `schema-target.json`, previews it, and applies it after confirmation.

## Local Runtime

The current local backend stack includes:

- Directus
- PostgreSQL
- Redis
- Nginx

The intended local development flow is:

1. Start the backend stack.
2. Update the schema target as the business model evolves.
3. Check the schema diff against the server.
4. Push validated changes.
5. Continue backend and frontend implementation on top of the synchronized schema.

## Deployment Flow

The deployment workflow is intentionally split into two phases:

- validate and iterate locally in `backend/` and `frontend/`
- apply the same repository state to the deployment checkout through the `dev` branch auto-deploy workflow

In practice, this means:

1. update code in the repository
2. run the local backend and frontend checks
3. commit and push the validated changes
4. push to `dev`
5. let the self-hosted runner reset the deployment checkout and run `./up.sh`

This keeps the local development path and deployment runtime path aligned without requiring separate deployment stories for each service.

## Notes

- The backend is developed locally first.
- The current deployment target is the self-hosted local Linux machine through the `dev` auto-deploy workflow.
- The schema files should remain in Git, except for `live-current.tmp.json`.
