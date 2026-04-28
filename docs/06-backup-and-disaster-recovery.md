# Backup and Disaster Recovery

## 1) Backup domains

Vitecover backup strategy is split into two strict domains:

1. **Operational website data (Git-safe domain)**
   - Directus schema
   - Operational seed data (geo zones, insurance products, pricing rules, website operational content)
   - Public website/product assets used to rebuild the operating environment
2. **Customer/private data (non-Git domain)**
   - Customers, drivers, vehicles, quotes, orders, payments, policies, refunds, admin reviews
   - Private documents and uploaded files
   - PostgreSQL dumps and MinIO private bucket contents
3. **Runtime infrastructure/config**
   - Docker compose runtime
   - Deployment environment variables and secrets (managed outside Git)

## 2) What goes to Git

The following files are intended to be committed:

- `backend/directus/schema/schema-target.json`
- `backend/directus/schema/schema-remote-baseline.json`
- `backend/directus/seed/operational/**`
- `backend/backup/backup-policy.yaml`
- Product catalog/pricing/operational JSON seed files
- Public product logos and website assets needed for operational rebuild

## 3) What never goes to Git

Never commit any of the following:

- Customer identity data
- Drivers and vehicles
- Orders, payments, and refunds
- Policy PDFs and private uploaded documents
- PostgreSQL dump files
- Customer backup archives (`.tar.gz`, `.dump`)
- `.env` files and secrets

## 4) Manual operational restore

1. Start stack:
   ```bash
   ./up.sh
   ```
2. (Optional) Apply schema from operational backup:
   ```bash
   python3 backend/scripts/backup_operational_data.py restore --apply-schema
   ```
3. Restore operational seed data:
   ```bash
   python3 backend/scripts/backup_operational_data.py restore
   ```
   Use `--replace` only when you explicitly want to wipe/import full collection content.
4. Verify:
   ```bash
   python3 backend/scripts/backup_operational_data.py verify
   ```

## 5) Manual customer data restore

1. Get the backup archive (local MinIO/S3/private storage).
2. Run restore:
   ```bash
   bash backend/scripts/restore_customer_data.sh --archive <archive> --yes
   ```
3. The restore script will:
   - stop app containers
   - restore PostgreSQL from `postgres.dump`
   - restore MinIO bucket content
   - restart the stack with `./up.sh`
   - run basic health checks

## 6) Production AWS future direction

- Replace local MinIO storage target with private AWS S3 bucket.
- Keep PostgreSQL in RDS.
- Use both RDS snapshots (physical) and periodic `pg_dump` logical backups.
- Store encrypted backup archives in private S3.
- Do not store customer/private data in GitHub.
