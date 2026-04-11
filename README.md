# Directus Starter for Insurance Backend

This starter gives you a local Docker-based Directus backend with:

- Directus
- PostgreSQL
- Redis
- Nginx reverse proxy

## Quick start

### 1. Copy environment variables

```bash
cp .env.example .env
```

### 2. Start the stack

```bash
docker compose up -d
```

### 3. Open Directus

- Through Nginx: http://localhost:8080
- Direct access: http://localhost:8055

## Stop the stack

```bash
docker compose down
```

## Reset local data

This removes containers and deletes local database/uploads.

```bash
docker compose down -v
rm -rf data uploads
mkdir -p data/postgres uploads
```

## Suggested next steps

1. Create Directus collections:
   - customers
   - drivers
   - vehicles
   - orders
   - order_documents
   - policies
   - admin_review_logs

2. Move uploads to S3 when you deploy to AWS.
3. Put production secrets only on the server, not in GitHub.
4. Add custom logic under `directus/extensions`.

## Notes

- Keep `.env` out of Git.
- Commit `.env.example`, `docker-compose.yml`, `nginx/`, and `directus/extensions/`.
- For EC2 production, put Directus behind HTTPS and use RDS + S3.
