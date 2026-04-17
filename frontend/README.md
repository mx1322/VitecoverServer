# Frontend Workspace

## Chosen stack

The first frontend foundation is designed around:

- Next.js 16
- React 19
- TypeScript
- App Router
- Tailwind CSS 4
- Directus JavaScript SDK

## Why this stack fits the project

This project is not only a marketing website.
It needs public pages, account pages, quote flow, policy access, and later payment integration.

For that reason:

- Next.js is a better fit than plain JavaScript
- TypeScript helps keep the frontend aligned with the growing backend schema
- Tailwind is fast for adapting a template and building custom workflow screens
- Directus SDK gives the app a clean path to backend integration

## Current scaffold

This directory now contains a manual Next.js-ready foundation with:

- `src/app/`
  App Router pages and global styling.
- `src/components/`
  Shared UI building blocks.
- `src/lib/directus.ts`
  Initial Directus client setup.
- `src/types/directus-schema.ts`
  Early frontend-facing schema types.

## Current routes

- `/`
  Homepage and project framing.
- `/quote`
  Quote flow placeholder.
- `/account`
  Customer account area placeholder.
- `/policies`
  Policy delivery and PDF strategy placeholder.

## PDF strategy

Email delivery is recommended, but email should not be the only storage model.

Recommended approach:

- send the PDF policy by email
- keep a private stored copy for portal access and support
- use local file storage during development
- move to private S3-backed storage in AWS production

## Notes

This frontend workspace is intended to run inside Docker for Linux deployment, so day-to-day development does not have to happen on the same machine that runs the server stack.

For local frontend development, use `frontend/.env.example` as the template for your own `frontend/.env`.
For the integrated Linux deployment, public URLs are supplied from `deploy/linux/.env.deploy`.
Public file URLs should go through the file-service layer in `src/lib/file-service.ts`, so frontend code does not need to know whether files are ultimately served by Directus, MinIO, or S3.

When Node.js is available in a development environment, the local development commands are:

```bash
npm install
npm run dev
```
