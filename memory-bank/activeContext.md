# Active Context

## Current Focus

Remediation plan execution per `docs/ULTRA_EVALUATION_AND_PLAN.md`. Phase 0, Phase 1 (partial), Phase 3 (TanStack Query + features), and Phase 4 (infra base) completed.

## Recent Changes (March 2026)

### Phase 0 — Foundation
- API v1 router + response envelope
- Health check with DB connectivity
- tailwindcss-rtl plugin
- Locales structure (`apps/web/src/locales/ar|en/`)
- Shared formatters (formatSAR, formatSaudiPhone, formatArea, timeAgo)
- Shared Zod validators (loginSchema, registerSchema)
- data-testid on Login; Playwright E2E setup

### Phase 1 — Backend
- PATCH /properties/:id/status, DELETE /properties/:id/photos/:photoId
- GET /properties/map (GeoJSON), GET /properties/search (Arabic ILIKE)
- POST /auth/logout, Auth Zod validation
- Audit middleware on property mutations
- PATCH /requests/:id/status
- GET /transactions/:id/timeline, checklist, commission
- **Soft deletes:** Migration 004 adds `deleted_at` to properties, contacts, property_requests, transactions; all queries updated
- **Zod validators:** propertyCreateSchema, contactCreateSchema, requestCreateSchema, publicRequestSubmitSchema; wired in API (properties, contacts, requests, public/requests)
- **Rate limiting:** express-rate-limit 100 req/min API, 20 req/min auth

### Phase 3 — Frontend (partial)
- **shadcn/ui:** components.json (RTL), Button, cn(), index.css theme vars (--background, --foreground, --primary, etc.), Tailwind extend for semantic colors, build passing; Login uses Button
- **Login:** React Hook Form + zodResolver(loginSchema) from @aqarkom/shared; field-level validation errors; shadcn Button (submit, outline Nafath, ghost language toggle)
- **PropertyCard:** Aqar-style card in features/properties/components/; image, title, formatSAR price, location, type/area/bedrooms; used in Properties grid view
- **react-i18next:** i18n.ts, I18nextProvider, LanguageProvider synced with i18n.changeLanguage; Login uses useTranslation('auth','common')
- TanStack Query: QueryProvider, `staleTime: 60s`, `retry: 1`
- `features/dashboard/`: `useDashboardData()` hook with `useQueries` (KPIs, pipeline, activities, properties, tasks)
- `features/properties/`: `usePropertiesList()`, `useProperty()` hooks
- `features/contacts/`: `useContactsList()`, `useContactCreate()`, `useContactImport()` hooks
- `features/requests/`: `useRequestsList()`, `useRequest()` hooks
- `features/transactions/`: `useTransactionsList()`, `useTransactionCreate()`, `useTransactionFormData()` hooks
- Dashboard, Properties, Contacts, Requests, Transactions pages migrated to TanStack Query

### Phase 4 — Infrastructure (base)
- `Dockerfile.gcp`: Node 20 multi-stage build for API
- `cloudbuild.yaml`: install → build → docker build → push → deploy Cloud Run (me-central1)
- `terraform/`: main.tf, variables.tf, outputs.tf, environments/dev.tfvars, README

## Next Steps (per docs/ULTRA_INVESTIGATION_AND_NEXT_STEPS.md)

**Sprint A (DONE):** A1 Redis+PostGIS docker-compose ✓ A2 Redis rate limit ✓ A3 Health checks ✓

**Done (Sprint A):** A4 BullMQ ✓ A5 refresh token ✓ OTP send/verify ✓ property.photos.process job ✓

**Done (Sprint B):** Nafath init/callback ✓ REGA API + Redis cache ✓ NafathButton wired ✓ Block publish without REGA ✓

**Next:** Sprint C (MapPicker, Hijri, Kanban) → Sprint D (E2E) → Sprint E (Terraform modules)

## Active Decisions

- Keep raw `pg` for now; Drizzle migration deferred
- Locales ready for react-i18next; LanguageContext still in use
- Legacy `/api/` routes retained; frontend uses `/api/v1/`
