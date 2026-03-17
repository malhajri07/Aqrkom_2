# Tech Context

## Current Stack

| Layer | Technology |
|-------|------------|
| Monorepo | pnpm workspace |
| Backend | Express.js, TypeScript, raw `pg`, express-rate-limit |
| Frontend | React 18, Vite, Tailwind CSS, shadcn/ui (Base UI), TanStack Query, react-i18next, React Hook Form + @hookform/resolvers (Zod), Recharts, React.lazy code-splitting |
| Database | PostgreSQL 16 |
| Maps | @vis.gl/react-google-maps |
| Shared | @aqarkom/shared (types, constants, Zod, formatters) |

## Development Setup

```bash
# PostgreSQL must run first
DATABASE_URL="postgresql://aqarkom:aqarkom@localhost:5432/aqarkom" pnpm dev:api
pnpm dev:web  # http://localhost:5173
```

## Key Paths

- `apps/api/src/` — API routes, middleware, services
- `apps/web/src/` — Pages, components, context, features/, providers/
- `packages/shared/src/` — Types, constants, validators, formatters
- `db/migrations/` — SQL migrations 001–004 (004: soft deletes); apply with psql
- `terraform/` — GCP infra (Cloud Run, Cloud SQL, Memorystore)
- `Dockerfile.gcp`, `cloudbuild.yaml` — API container, Cloud Build CI/CD

## Constraints

- `@aqarkom/shared` must be built before API/web
- API uses `/api/v1/` with response envelope `{ success, data }` / `{ success: false, error }`
- Frontend `lib/api.ts` uses `API_BASE = '/api/v1'` and unwraps envelope
