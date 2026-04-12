# VitecoverServer

This repository is now organized as a small monorepo:

- `backend/`
  Directus-based insurance backend, local Docker stack, schema sync script, and backend assets for the deployment path.
- `frontend/`
  Reserved for the website and customer/admin-facing frontend application.
- `docs/`
  Product, schema, and local workflow documentation.

The intended workflow is:

1. validate locally
2. merge the deployment changes
3. update AWS in one pass using the integrated deployment config under `deploy/linux/`

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

- Backend runtime and schema workflow: [backend/README.md](/home/max/devwork/VitecoverServer/backend/README.md)
- Documentation index: [docs/README.md](/home/max/devwork/VitecoverServer/docs/README.md)
- Local workflow and repository usage: [docs/01-local-doc-index.md](/home/max/devwork/VitecoverServer/docs/01-local-doc-index.md)
- Business scope: [docs/02-business-plan.md](/home/max/devwork/VitecoverServer/docs/02-business-plan.md)
- Technical roadmap: [docs/03-technical-roadmap.md](/home/max/devwork/VitecoverServer/docs/03-technical-roadmap.md)
- Frontend plan: [docs/04-frontend-plan.md](/home/max/devwork/VitecoverServer/docs/04-frontend-plan.md)
- Backend plan: [docs/05-backend-plan.md](/home/max/devwork/VitecoverServer/docs/05-backend-plan.md)
