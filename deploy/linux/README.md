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
    directus/
    nginx/
  compose/
    nginx/
  frontend/
  docs/
  deploy/
  docker-compose.override.yml
  up.sh
```

## Environment files

Before first startup:

1. keep `deploy/linux/.env.deploy.example` as the committed reference template
2. let `up.sh` create `.env.deploy` automatically if it does not exist
3. edit the generated file before the first successful startup, especially `DB_PASSWORD`, `MINIO_ROOT_PASSWORD`, and the public URLs

Suggested frontend values:

- `NEXT_PUBLIC_SITE_URL=http://your-host`
- `NEXT_PUBLIC_DIRECTUS_URL=http://your-host/directus`
- `EDGE_HTTP_PORT=80` for AWS, or another free local port such as `8088`

Suggested backend note:

- if Directus is meant to live behind `/directus`, keep `PUBLIC_URL` aligned with that final public URL
- replace `your-host` with the current machine's IP, a load balancer DNS name, or your actual domain when you deploy

The repository keeps the example file as the initial committed reference.
The real `.env.deploy` file should live only on the server and is ignored by Git.
If the real env file is missing, `up.sh` will create it from the template.
If the real env file still matches the template exactly, `up.sh` will stop and require you to edit it before startup.
## One-command startup

From the repository root:

```bash
./up.sh
```

This will:

- create missing env file from the example template
- stop if that env file still matches the template content
- stop if required values are missing
- stop if `MINIO_ROOT_PASSWORD` is still default/placeholder
- build the frontend image
- start the full stack

## Updating after new code is pushed

On the Linux server, the normal update flow is:

```bash
git pull
./up.sh
```

This matches the intended workflow where development can continue elsewhere and the Linux server simply pulls the latest repository state and restarts the integrated stack.

## Shutdown

```bash
docker compose --env-file deploy/linux/.env.deploy -f backend/docker-compose.yml -f docker-compose.override.yml down
```

## Public endpoints

With the included Nginx config:

- `http://your-host/` -> frontend
- `http://your-host/directus/` -> Directus
- `http://your-host:9001/` -> MinIO console

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
