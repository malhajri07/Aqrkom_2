# Aqarkom Ultra Evaluation & Remediation Plan

**Evaluation Date:** March 2026  
**Reference:** `.agents/skills/` (backend_engineer, frontend, infra_engineer, quality_tester, saudi_localization)

---

## Executive Summary

The Aqarkom application has a solid foundation (auth, properties, requests, contacts, transactions, documents, RTL layout) but falls short of the target architecture defined in the agent skill files. **22 Critical**, **35 High**, **28 Medium**, and **8 Low** gaps were identified across Backend, Frontend, Infrastructure, QA, and Saudi Localization.

---

## Gap Summary by Domain

| Domain | Critical | High | Medium | Low |
|--------|----------|------|--------|-----|
| Backend | 8 | 15 | 12 | 0 |
| Frontend | 1 | 14 | 8 | 2 |
| Infrastructure | 5 | 2 | 1 | 1 |
| QA | 7 | 0 | 1 | 0 |
| Saudi Localization | 4 | 2 | 4 | 2 |

---

# ULTRA REMEDIATION PLAN

## Phase 0: Foundation (Sprint 0 — 1 week)

**Goal:** Establish non-breaking foundations that unblock later work.

### 0.1 API Versioning & Response Envelope
- [ ] Add `/api/v1/` prefix to all routes; keep `/api/` as redirect for backward compatibility
- [ ] Create response envelope middleware:
  ```ts
  { success: true, data, meta?: { page, limit, total, has_more } }
  { success: false, error: { code, message, message_en, details } }
  ```
- [ ] Wrap all route handlers to use envelope

### 0.2 Shared Package Enhancements
- [ ] Add Zod schemas in `packages/shared/src/validators/` for auth, properties, requests, contacts, transactions
- [ ] Add `formatSAR`, `formatSaudiPhone`, `formatArea`, `formatDualDate`, `timeAgo` to `packages/shared/src/utils/formatters.ts`
- [ ] Extend `SAUDI_CITIES` with `lat`, `lng`, `region`
- [ ] Add missing property types: duplex, townhouse, penthouse, compound, tower, house

### 0.3 Locales Structure
- [ ] Create `apps/web/src/locales/ar/` and `en/` with: `common.json`, `auth.json`, `properties.json`, `requests.json`, `crm.json`, `transactions.json`, `dashboard.json`
- [ ] Migrate inline strings to i18n keys (can be incremental)
- [ ] Add `react-i18next` and wire `I18nProvider`

---

## Phase 1: Backend Hardening (Sprints 1–3)

**Completed (Phase 1 partial):**
- [x] PATCH /api/v1/properties/:id/status
- [x] DELETE /api/v1/properties/:id/photos/:photoId
- [x] GET /api/v1/properties/map (GeoJSON)
- [x] GET /api/v1/properties/search (Arabic ILIKE search)
- [x] POST /api/v1/auth/logout
- [x] Auth: Zod validation (login, register)
- [x] Audit middleware on property create/update/delete
- [x] PATCH /api/v1/requests/:id/status
- [x] GET /api/v1/transactions/:id/timeline
- [x] GET /api/v1/transactions/:id/checklist
- [x] GET /api/v1/transactions/:id/commission

### 1.1 Database & Schema
- [ ] Add PostGIS extension; migrate `latitude`/`longitude` to `GEOGRAPHY(POINT, 4326)`
- [ ] Add `deleted_at TIMESTAMPTZ NULL` to all main tables; update queries with `WHERE deleted_at IS NULL`
- [ ] Add database triggers for `audit_log` on INSERT/UPDATE/DELETE
- [ ] Consider UUID v7 for new tables (optional; v4 acceptable if migration cost high)
- [ ] Add migration for `GET /properties/map` GeoJSON support

### 1.2 ORM & Validation
- [ ] Introduce Drizzle ORM (or Prisma); migrate from raw `pg` incrementally
- [ ] Use Zod schemas from shared package for all request validation
- [ ] Wire `auditLog` middleware to all mutation routes

### 1.3 Auth & Security
- [ ] Implement refresh token flow: httpOnly cookie, 7-day expiry, `/api/v1/auth/refresh`
- [ ] Add `POST /api/v1/auth/logout` (invalidate tokens)
- [ ] Add `POST /api/v1/auth/otp/send` and `POST /api/v1/auth/otp/verify`
- [ ] Add rate limiting (100 req/min user, 20 req/min unauthenticated)
- [ ] Add Redis for sessions and rate limiting

### 1.4 Missing API Endpoints
- [ ] `PATCH /api/v1/properties/:id/status`
- [ ] `DELETE /api/v1/properties/:id/photos/:photoId`
- [ ] `GET /api/v1/properties/map` (GeoJSON)
- [ ] `GET /api/v1/properties/search` (Arabic full-text search)
- [x] `GET /api/v1/properties/stats` (neighborhood stats)
- [ ] `PATCH /api/v1/requests/:id/status`
- [ ] `GET /api/v1/transactions/:id/timeline`
- [ ] `GET /api/v1/transactions/:id/checklist`
- [ ] `GET /api/v1/transactions/:id/commission`

### 1.5 Module Architecture
- [ ] Refactor to `modules/` structure per feature:
  ```
  modules/properties/
  ├── properties.controller.ts
  ├── properties.service.ts
  ├── properties.repository.ts
  ├── properties.validator.ts
  └── properties.routes.ts
  ```

### 1.6 Background Jobs
- [ ] Add Redis + BullMQ
- [ ] Implement jobs: `property.photos.process`, `request.match.auto`, `notification.send`, `rega.license.revalidate`

---

## Phase 2: Saudi Integrations (Sprints 4–6)

### 2.1 Nafath (نفاذ)
- [ ] Create `apps/api/src/integrations/nafath/`
- [ ] Implement `POST /api/v1/auth/nafath/init` and `POST /api/v1/auth/nafath/callback`
- [ ] Store NIN encrypted (AES-256-GCM); add `nafath_verified` to users
- [ ] Add Nafath login button to frontend

### 2.2 REGA (هيئة العقار)
- [ ] Create `apps/api/src/integrations/rega/`
- [ ] Integrate REGA validation API (not just format validation)
- [ ] Cache validation results in Redis (24h)
- [ ] Weekly cron: revalidate active listing licenses
- [ ] Display REGA license on property detail; block publish without valid license

### 2.3 Ejar (إيجار) — Phase 2
- [ ] Create `apps/api/src/integrations/ejar/`
- [ ] Implement contract creation from transaction data
- [ ] Store `ejar_contract_number` on transactions
- [ ] Renewal reminders (90, 60, 30 days)

### 2.4 ZATCA (هيئة الزكاة) — Phase 2
- [ ] Create `apps/api/src/integrations/zatca/`
- [ ] Implement ZATCA invoice format (QR code, TLV, digital signature)
- [ ] Commission invoices with 15% VAT

---

## Phase 3: Frontend Modernization (Sprints 5–8)

### 3.1 Structure & Tooling
- [ ] Introduce `app/` with `App.tsx`, `router.tsx`, `providers/` (Auth, I18n, Query, Theme)
- [ ] Introduce `features/` for auth, properties, requests, crm, transactions, documents, reports, admin
- [ ] Add `tailwindcss-rtl` plugin; audit all layouts for logical properties (ps-, pe-, ms-, me-, start-, end-)
- [ ] Add shadcn/ui (`npx shadcn-ui@latest init`); migrate key components
- [ ] Add TanStack Query for server state; replace useState/useEffect fetch patterns
- [ ] Add React Hook Form + Zod for forms

### 3.2 Components
- [ ] Extract `PropertyCard` component (Aqar-style)
- [ ] Refactor `PropertyForm` to multi-step: Step1Type, Step2Location (MapPicker), Step3Details, Step4Photos, Step5Price, Step6Review
- [ ] Create reusable `MapPicker` component
- [ ] Add `@dnd-kit/core` for Kanban (Pipeline, LeadPipeline)
- [ ] Add `HijriDatePicker` (moment-hijri or date-fns-jalali)
- [ ] Add `PriceInput` (SAR), `PhoneInput` (+966), `ArabicSearchInput`
- [ ] Add `CommissionCalculator` component

### 3.3 Real-time & Charts
- [ ] Add Socket.io-client for messages, notifications
- [ ] Add Recharts or Chart.js for Reports, Dashboard KPIs

### 3.4 Performance & A11y
- [ ] Code-split with `React.lazy()` + `Suspense`
- [ ] Add `data-testid` to critical elements
- [ ] WCAG 2.1 AA: aria-labels, focus styles, contrast

---

## Phase 4: Infrastructure (Sprints 7–9)

### 4.1 Terraform
- [ ] Create `terraform/` with `main.tf`, `variables.tf`, `outputs.tf`
- [ ] Create modules: `cloud-run`, `cloud-sql`, `memorystore`, `cloud-storage`, `networking`, `secrets`, `monitoring`
- [ ] All resources in `me-central1` (Dammam)
- [ ] GCS backend for state

### 4.2 Docker & CI/CD
- [ ] Create `Dockerfile.gcp` for production (Node 20, multi-stage)
- [ ] Add `cloudbuild.yaml` with: install → build shared → typecheck → lint → test → build API → push → deploy Cloud Run → migrate → build web → deploy GCS
- [ ] Add Redis and PostGIS to `docker-compose.yml` for local dev

### 4.3 Health & Monitoring
- [ ] Extend `/health` with `database`, `redis`, `disk` checks
- [ ] Add Cloud Monitoring alerts (error rate, latency, DB CPU, storage)
- [ ] Structured logging (pino) with `requestId`, `userId`, `action`

---

## Phase 5: QA & Testing (Sprints 8–10)

### 5.1 E2E (Playwright)
- [ ] Create `e2e/` directory
- [ ] Add `playwright.config.ts` with Arabic locale, RTL projects
- [ ] Create Page Objects: LoginPage, DashboardPage, PropertyListPage, PropertyFormPage, MapViewPage, RequestFormPage, BrokerInboxPage, ContactListPage, TransactionPipelinePage
- [ ] Create fixtures: auth.fixture, property.fixture, request.fixture, contact.fixture
- [ ] Implement specs: auth/, properties/, requests/, crm/, transactions/, rtl/, accessibility/

### 5.2 Unit & Integration
- [ ] Add Vitest + React Testing Library to `apps/web`
- [ ] Add unit tests for services in `apps/api`
- [ ] Add API integration tests with supertest

### 5.3 Load & Security
- [ ] Add `tests/load/` with k6 scripts (property search, auth)
- [ ] Add `tests/security/` with OWASP ZAP scripts and checklist
- [ ] Saudi compliance checklist: REGA, Ejar, ZATCA, Nafath

---

## Phase 6: Polish & Compliance (Sprints 10–12)

### 6.1 Saudi UX
- [ ] Full `locales/` coverage; no inline strings
- [ ] Hijri dates on all date displays
- [ ] Saudi phone validation (+966 5XX XXX XXXX)
- [ ] Working week (Sun–Thu) in date pickers

### 6.2 Documentation
- [ ] `docs/api-change-log.md` for API changes
- [ ] `docs/database-change-log.md` for schema changes
- [ ] OpenAPI spec (auto-generated from Zod)

### 6.3 Final Hardening
- [ ] PII encryption at rest (NIN, phone)
- [ ] NIN masking in API (last 4 digits only)
- [ ] CORS whitelist
- [ ] Cloud Armor WAF rules (SQLi, XSS, rate limit)

---

## Implementation Order (Dependency Graph)

```
Phase 0 (Foundation)
    ├── Phase 1 (Backend) ──────────────────┐
    │   └── Phase 2 (Saudi Integrations)    │
    │                                        ├── Phase 4 (Infra)
    └── Phase 3 (Frontend) ─────────────────┘
                                                │
    Phase 5 (QA) ─────────────────────────────┘
                                                │
    Phase 6 (Polish) ───────────────────────────┘
```

---

## Quick Wins (Can Start Immediately)

1. **API versioning** — Add `/api/v1` router; 1–2 days
2. **Response envelope** — Middleware wrapper; 1 day
3. **tailwindcss-rtl** — Add plugin; audit 5 key pages; 1 day
4. **locales/ structure** — Create JSON files; wire i18next; 2 days
5. **Health checks** — Add DB/Redis to `/health`; 0.5 day
6. **data-testid** — Add to Login, Dashboard, PropertyForm; 1 day
7. **Playwright setup** — `e2e/`, config, 1 login spec; 1 day

---

## Risk Mitigation

| Risk | Mitigation |
|------|-------------|
| Breaking existing clients | Keep `/api/` routes during transition; deprecation notice |
| Migration complexity | Use feature flags; incremental rollout |
| Saudi API availability | Mock integrations for dev; sandbox keys |
| Team capacity | Prioritize Phase 0 + Quick Wins; parallelize Backend/Frontend |

---

## Success Criteria

- [ ] All routes under `/api/v1/` with envelope
- [ ] PostGIS + soft deletes in place
- [ ] Redis + BullMQ operational
- [ ] Nafath + REGA integrations live
- [ ] `locales/` + react-i18next; no inline strings
- [ ] Playwright E2E covering auth, properties, requests
- [ ] Terraform + Cloud Build deploying to me-central1
- [ ] Health endpoint returns DB + Redis status
