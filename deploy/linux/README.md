# Integrated Linux Deployment

## Recommended mode

Use a single deployment entry point for the whole stack.

This deployment layer now starts:

- PostgreSQL
- Redis
- MinIO
- Directus
- Next.js frontend
- edge Nginx

## Why this is the recommended setup

This is simpler than starting frontend and backend separately.

It gives you:

- one Compose entry point
- one place for Linux deployment configuration
- MinIO as an S3-compatible bridge for future AWS migration
- one public Nginx layer for traffic routing

## Should you pull the whole repository?

Yes.

For the current project stage, the easiest and least fragile approach is to pull the whole repository onto the Linux server.

Reasons:

- frontend and backend still evolve together
- schema files remain useful on the server
- deployment paths stay aligned with local development
- the repository is still small enough that full checkout is simple

## Expected layout on the server

```text
VitecoverServer/
  backend/
  frontend/
  docs/
  deploy/
```

## Environment files

Before first startup:

1. make sure `backend/.env` is correct
2. keep `deploy/linux/.env.frontend.example` and `deploy/linux/.env.minio.example` as the committed reference templates
3. let `up.sh` create `.env.frontend` and `.env.minio` automatically if they do not exist
4. edit the generated files before the first successful startup

Suggested frontend values:

- `NEXT_PUBLIC_SITE_URL=http://192.168.3.60`
- `NEXT_PUBLIC_DIRECTUS_URL=http://192.168.3.60/directus`

Suggested backend note:

- if Directus is meant to live behind `/directus`, update `backend/.env` so `PUBLIC_URL` matches that final public URL

The repository keeps the example files as the initial committed reference.
The real `.env.frontend` and `.env.minio` files should live only on the server and are ignored by Git.
If a real env file is missing, `up.sh` will create it from the template.
If a real env file still matches the template exactly, `up.sh` will stop and require you to edit it before startup.

## One-command startup

From the repository root:

```bash
cd deploy/linux
bash up.sh
```

This will:

- create missing env files from the example templates
- stop if those env files still match the template content
- build the frontend image
- start the full stack

## Updating after new code is pushed

On the Linux server, the normal update flow is:

```bash
git pull
cd deploy/linux
bash up.sh
```

This matches the intended workflow where development can continue elsewhere and the Linux server simply pulls the latest repository state and restarts the integrated stack.

## Shutdown

```bash
cd deploy/linux
bash down.sh
```

## Public endpoints

With the included Nginx config:

- `http://192.168.3.60/` -> frontend
- `http://192.168.3.60/directus/` -> Directus
- `http://192.168.3.60:9001/` -> MinIO console

## MinIO role

MinIO is included so the platform can use S3-style object storage now and migrate more smoothly to AWS S3 later.

Recommended usage:

- store generated policy PDFs in MinIO
- keep file access private
- expose document access to customers only through authenticated application flows

Later, when moving to AWS:

- replace MinIO configuration with S3 configuration
- keep the overall document flow the same

## PDF delivery recommendation

Email delivery is good, but it should not be the only delivery path.

Recommended model:

- store the PDF privately in object storage
- send the policy to the customer by email
- keep the document available in the customer portal

This supports:

- re-download
- support cases
- audit trail
- future operational recovery

## Notes

- This deployment layer is meant for your Linux server that simulates an EC2-style environment.
- It is a manual deployment path for now.
- Later, this same structure can be automated with GitHub Actions.
