# Technical Roadmap Description

## Current technical approach

The project is currently organized as a local-first development system.

The backend stack is built around:

- Directus
- PostgreSQL
- Redis
- Nginx
- Docker Compose

The local development model is:

- design and evolve the schema locally
- synchronize the schema to a running Directus instance
- build the product iteratively
- move the validated stack to AWS for production

In practice, the current workflow can also use a split setup:

- edit code from a cloud development environment
- let the Linux server pull the repository and run the stack

## Why this approach makes sense now

At the current stage, the project benefits from:

- fast iteration on schema and product logic
- low operational overhead during discovery
- direct visibility into collections, fields, and relations through Directus
- a practical path from experimentation to production hardening

This is especially useful because the business workflow is still taking shape.

## Planned architecture direction

The likely production direction is:

- application hosting on AWS compute
- PostgreSQL hosted on AWS RDS
- uploads and generated policy PDFs stored on S3
- secure public access through a reverse proxy or load balancer
- environment secrets managed in the cloud environment

## Delivery phases

### Phase 1

Build the temporary motor insurance backbone:

- customer identity
- vehicles
- drivers
- insurance products
- geographic zones
- pricing rules
- quotes
- orders
- payments
- admin review
- policies
- refunds

### Phase 2

Stabilize operations:

- improve admin workflows
- refine payment handling
- support PDF generation and delivery
- improve field-level validation and statuses
- prepare first production deployment

### Phase 3

Expand product scope:

- VTC insurance
- taxi insurance
- more specialized commercial products
- more advanced pricing logic

## Documentation and repository direction

The repository now uses a monorepo-style structure:

- `backend/`
- `frontend/`
- `docs/`

This is the recommended mode for the current project stage because:

- frontend and backend are still tightly coupled
- schema and UI will evolve together
- product requirements are still being refined

If the project later grows into separate teams or independent deployment cycles, the frontend and backend can still be split into separate repositories at that time.

## Technical priorities from here

The next technical priorities should be:

1. keep the schema stable and intentional
2. seed initial business data such as products and geo zones
3. build the frontend quote and purchase flow
4. define payment integration
5. implement PDF policy generation
6. prepare AWS deployment and operational hardening
