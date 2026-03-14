# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

Aqarkom is an Arabic-first Saudi Real Estate CRM (pnpm monorepo). Three workspace packages:

| Package | Path | Purpose |
|---------|------|---------|
| `@aqarkom/shared` | `packages/shared/` | Shared TypeScript types & constants |
| `@aqarkom/api` | `apps/api/` | Express.js REST API (port 3000) |
| `@aqarkom/web` | `apps/web/` | React + Vite frontend (port 5173, proxies `/api` to API) |

### Running services

1. **PostgreSQL** must be running before the API starts. Default connection: `postgresql://aqarkom:aqarkom@localhost:5432/aqarkom`.
2. **Start PostgreSQL:** `sudo pg_ctlcluster 16 main start`
3. **Build shared package first** (required before API/web): `pnpm --filter @aqarkom/shared build`
4. **Run migrations:** `PGPASSWORD=aqarkom psql -U aqarkom -d aqarkom -h localhost -f db/migrations/001_initial_schema.sql && PGPASSWORD=aqarkom psql -U aqarkom -d aqarkom -h localhost -f db/migrations/002_activities_tasks_documents.sql`
5. **Start API:** `DATABASE_URL="postgresql://aqarkom:aqarkom@localhost:5432/aqarkom" pnpm dev:api`
6. **Start Web:** `pnpm dev:web`
7. **Start both (parallel):** `pnpm dev` (but API needs `DATABASE_URL` in env)

### Non-obvious caveats

- The `pnpm lint` scripts reference `eslint` but ESLint is not installed as a dependency. Use `pnpm build` (runs `tsc`) as the effective type-checking/linting step.
- The `@aqarkom/shared` package must be built (`pnpm --filter @aqarkom/shared build`) before the API or web apps can resolve its types. If you see import errors for `@aqarkom/shared`, rebuild it.
- The API uses `tsx watch` for hot-reload in dev mode. If you install new npm dependencies, restart the API server for them to take effect.
- Migrations are plain SQL files in `db/migrations/` and are applied directly with `psql` (not an ORM migration tool).
- The web frontend is RTL Arabic-first. The login page shows demo credentials for testing.

### Standard commands

See `package.json` scripts. Key commands: `pnpm dev`, `pnpm build`, `pnpm dev:api`, `pnpm dev:web`.
