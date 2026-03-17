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
4. **Run migrations:** `PGPASSWORD=aqarkom psql -U aqarkom -d aqarkom -h localhost -f db/migrations/001_initial_schema.sql && PGPASSWORD=aqarkom psql -U aqarkom -d aqarkom -h localhost -f db/migrations/002_activities_tasks_documents.sql` (and 003, 004, 005)
5. **Start API:** `DATABASE_URL="postgresql://aqarkom:aqarkom@localhost:5432/aqarkom" pnpm dev:api`
6. **Start Web:** `pnpm dev:web`
7. **Start both (parallel):** `pnpm dev` (but API needs `DATABASE_URL` in env)
8. **Docker (full stack):** `docker compose up` — API, PostgreSQL (PostGIS), Redis. Use `REDIS_URL=redis://redis:6379` when running API in Docker.

### Non-obvious caveats

- The `pnpm lint` scripts reference `eslint` but ESLint is not installed as a dependency. Use `pnpm build` (runs `tsc`) as the effective type-checking/linting step.
- The `@aqarkom/shared` package must be built (`pnpm --filter @aqarkom/shared build`) before the API or web apps can resolve its types. If you see import errors for `@aqarkom/shared`, rebuild it.
- The API uses `tsx watch` for hot-reload in dev mode. If you install new npm dependencies, restart the API server for them to take effect.
- Migrations are plain SQL files in `db/migrations/` and are applied directly with `psql` (not an ORM migration tool).
- The web frontend is RTL Arabic-first. The login page shows demo credentials for testing.

### E2E (Playwright)

- **Install browsers:** `pnpm test:e2e:install` (Chromium only) or `pnpm test:e2e:install:all`
- **Run E2E:** `pnpm test:e2e` (starts dev server automatically)
- **If install fails (ENOTFOUND cdn.playwright.dev):** Network/DNS issue. Try: (1) different network/VPN, (2) `pnpm test:e2e:install` for smaller Chromium-only download, (3) Docker: `docker run -v $(pwd):/app -w /app mcr.microsoft.com/playwright:v1.48.0-noble pnpm test:e2e` (browsers pre-installed)

### Standard commands

See `package.json` scripts. Key commands: `pnpm dev`, `pnpm build`, `pnpm dev:api`, `pnpm dev:web`.
