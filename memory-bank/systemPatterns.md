# System Patterns

## API Architecture

- **Versioning:** `/api/v1/` prefix; legacy `/api/` kept for backward compat
- **Envelope:** All v1 responses wrapped: `{ success: true, data }` or `{ success: false, error: { code, message, message_en } }`
- **Auth:** JWT Bearer; `authMiddleware` + `requireRole(...)` on protected routes
- **Rate limiting:** 100 req/min API, 20 req/min auth (express-rate-limit)
- **Audit:** `auditLog(action, entityType)` middleware on property create/update/delete

## Frontend Patterns

- **Language:** react-i18next (ar primary); `LanguageContext` for `t(ar, en)` backward compat, `isRtl`, `toggleLanguage`; `useTranslation('auth'|'common')` for key-based strings
- **API client:** `api<T>(path)` unwraps envelope; `unwrapEnvelope(body)` for raw fetch
- **Layout:** `dir={isRtl ? 'rtl' : 'ltr'}` on containers; logical properties (ps-, pe-, start-, end-)
- **UI:** shadcn/ui (Base UI); `cn()` from `lib/utils.ts`; semantic colors (background, foreground, primary) via CSS vars + Tailwind extend
- **Forms:** React Hook Form + zodResolver; shared Zod schemas from @aqarkom/shared; field-level errors via formState.errors
- **Data fetching:** TanStack Query via `QueryProvider`; feature hooks in `features/{dashboard,properties,contacts,requests,transactions}/api.ts`

## Database

- Raw SQL via `query()` from `db.ts`
- Migrations in `db/migrations/` (001–004; 004 adds soft deletes)
- Tables: users, properties, property_requests, request_offers, contacts, transactions, activities, tasks, documents, rent_payments, earnest_money, audit_log

## File Conventions

- Routes: `apps/api/src/routes/*.ts`
- Middleware: `apps/api/src/middleware/`
- Shared validators: `packages/shared/src/validators/` (auth, properties, contacts, requests)
- Feature hooks: `apps/web/src/features/<domain>/api.ts` (TanStack Query)
