# Progress

## What Works

- **Auth:** Login, register, JWT, logout, Zod validation
- **Properties:** CRUD, photos upload/reorder/delete, status PATCH, map GeoJSON, search, stats
- **Requests:** List, create, offers, status PATCH
- **Contacts:** CRUD, import, export
- **Transactions:** CRUD, offers, rent-payments, earnest-money, timeline, checklist, commission
- **Dashboard:** KPIs, pipeline, recent activity
- **Documents:** Library, templates
- **Search map:** Google Maps (SearchMap.tsx), property pins
- **RTL:** Arabic-first, tailwindcss-rtl, logical properties
- **E2E:** Playwright config, login specs; data-testid on Login, Requests, Transactions

## What's Left

### Done (Sprint A)
- **Redis + PostGIS in docker-compose:** Redis 7, PostGIS 16-3.4; migration 005_postgis
- **Redis rate limiting:** rate-limit-redis + ioredis; api/auth limiters use Redis when REDIS_URL set
- **Health checks:** `/health` returns `database`, `redis` (connected/disconnected/skipped)

### Done (BullMQ)
- BullMQ queues: property.photos.process, request.match.auto, notification.send, rega.license.revalidate
- Refresh token flow (httpOnly cookie, 7d)
- OTP send/verify (Redis or in-memory fallback)
- property.photos.process job queued on photo upload

### Done (Sprint B)
- Nafath: init + callback (sandbox), encrypted_nin, NafathButton on Login
- REGA: integrations/rega/ with API validation + Redis cache (24h)
- Property create/update: async REGA validation, block invalid license

### Critical
- Saudi integrations (Ejar, ZATCA — Phase 2)
- Full E2E coverage (Playwright browsers: `pnpm exec playwright install`)

### High
- Drizzle/Prisma migration
- Refresh token flow

### Done (Phase 1/3/4)
- **Soft deletes:** Migration 004, `deleted_at` on properties/contacts/requests/transactions
- **Zod validators:** properties, contacts, requests, publicRequestSubmitSchema; wired in API (properties, contacts, requests, public/requests)
- **Rate limiting:** 100 req/min API, 20 req/min auth
- **features/** structure: dashboard, properties, contacts, requests, transactions with TanStack Query hooks
- **Terraform:** base structure (main.tf, variables.tf, outputs.tf, dev.tfvars)
- **cloudbuild.yaml:** CI/CD for Cloud Run (me-central1)
- **react-i18next:** i18n.ts, I18nextProvider, LanguageProvider synced; Login uses useTranslation
- **shadcn/ui:** components.json (RTL), Button, cn(), index.css theme vars, Tailwind extend for background/foreground/primary/etc., build passing; Login uses Button
- **Login:** React Hook Form + zodResolver(loginSchema), field-level validation, shadcn Button
- **PropertyCard:** Aqar-style card (image, title, SAR price, location, type/area/bedrooms); used in Properties grid
- **Recharts:** Pipeline bar chart on Dashboard (leads by stage)
- **BrokerRegister:** React Hook Form + zodResolver(registerSchema), shadcn Button, field-level validation
- **Code-splitting:** React.lazy + Suspense for all routes; separate chunks per page

### Done (Zod & Components)
- **Zod for PUT/PATCH:** contact update, transaction update (property already had it)
- **PriceInput:** SAR price input with ر.س formatting; wired in PropertyForm, SubmitListing, Transactions, PublicRequest (min/max budget)
- **PhoneInput:** Saudi +966 format; wired in BrokerRegister, Contacts, SubmitListing, PublicRequest
- **Input:** shadcn Input component; shadow-sm for Tailwind v3 compatibility

### Medium
- Module architecture (controller/service/repository)
- OTP send/verify

## Known Issues

- pnpm store location warning on some installs
- Node 18 used; project prefers Node 20+
- ESLint referenced but not installed; use `pnpm build` for type-check
