# Aqarkom Ultra Investigation & Next Steps

**Investigation Date:** March 2026  
**Reference:** `.agents/skills/` (backend_engineer, frontend, infra_engineer, quality_tester, saudi_localization)  
**Current State:** `memory-bank/progress.md`, `memory-bank/activeContext.md`

---

## Executive Summary

This document provides an **ultra investigation** of remaining gaps between the Aqarkom application and the target architecture defined in the agent skill files. It prioritizes work by impact, dependency, and effort to produce a clear **next-step plan**.

---

## 1. Gap Investigation by Domain

### 1.1 Backend (Banyan)

| Gap | Severity | Current State | Target State | Effort |
|-----|----------|---------------|--------------|--------|
| **PostGIS** | Critical | `latitude`/`longitude` DECIMAL columns | `GEOGRAPHY(POINT, 4326)` for spatial queries | 2–3 days |
| **Redis** | Critical | Not present; rate limit in-memory | Redis for sessions, rate limiting, cache | 1–2 days |
| **BullMQ** | Critical | No background jobs | BullMQ for photo processing, matching, notifications | 2–3 days |
| **Refresh token** | High | JWT only | httpOnly cookie, 7-day expiry, `/auth/refresh` | 1 day |
| **OTP send/verify** | High | Not implemented | `POST /auth/otp/send`, `POST /auth/otp/verify` | 2 days |
| **Module architecture** | Medium | `routes/` flat structure | `modules/` per feature (controller/service/repository) | 3–5 days |
| **Drizzle/Prisma** | High | Raw `pg` | Type-safe ORM | 5–7 days (deferred) |
| **Audit triggers** | Medium | Middleware only | DB triggers for `audit_log` | 1 day |
| **Nafath** | Critical | Button placeholder | Full Nafath SSO flow | 3–5 days |
| **REGA API** | Critical | Format validation only | REGA validation API + Redis cache | 2–3 days |
| **Ejar** | High | Not started | Contract creation, renewal reminders | 5–7 days |
| **ZATCA** | High | Not started | E-invoicing, QR code, VAT | 5–7 days |

**Done:** API v1, envelope, Zod validation, soft deletes, rate limiting, auth/logout, property/request/transaction endpoints.

---

### 1.2 Frontend (Wajha)

| Gap | Severity | Current State | Target State | Effort |
|-----|----------|---------------|--------------|--------|
| **MapPicker** | High | No component | Reusable map picker for PropertyForm Step2 | 1–2 days |
| **HijriDatePicker** | High | Gregorian only | Dual Hijri/Gregorian display | 1–2 days |
| **ArabicSearchInput** | Medium | Plain input | RTL-aware search with Arabic FTS | 0.5 day |
| **Kanban @dnd-kit** | High | Static pipeline | Drag-and-drop Pipeline, LeadPipeline | 2–3 days |
| **PropertyForm multi-step** | Medium | Single form | Step1Type → Step6Review | 2–3 days |
| **features/auth** | Low | Login inline | Extract LoginForm, NafathButton, OTPInput | 0.5 day |
| **Socket.io-client** | High | Not present | Real-time messages, notifications | 1–2 days |
| **Full locales** | Medium | Partial; LanguageContext + t() | No inline strings; full i18n keys | 2–3 days |
| **Logical properties audit** | Medium | Mixed | All ps-, pe-, ms-, me-, start-, end- | 1 day |
| **Virtualization** | Low | None | @tanstack/react-virtual for long lists | 0.5 day |

**Done:** shadcn Button, Input, PriceInput, PhoneInput, PropertyCard, Recharts, code-splitting, TanStack Query, features structure.

---

### 1.3 Infrastructure (Mesar)

| Gap | Severity | Current State | Target State | Effort |
|-----|----------|---------------|--------------|--------|
| **Terraform modules** | High | Base main.tf only | cloud-run, cloud-sql, memorystore, storage, networking, secrets | 3–5 days |
| **Docker PostGIS + Redis** | Critical | Standard PostgreSQL | postgis/postgis:16 + redis:7 in docker-compose | 0.5 day |
| **Health DB/Redis** | High | DB check only | `/health` returns `database`, `redis` status | 0.5 day |
| **Cloud Armor WAF** | Medium | Not present | SQLi, XSS, rate limit rules | 1–2 days |
| **Monitoring alerts** | Medium | Basic | Error rate, latency, DB CPU, storage | 1 day |

**Done:** Dockerfile.gcp, cloudbuild.yaml (me-central1), terraform base.

---

### 1.4 QA (Daqeeq)

| Gap | Severity | Current State | Target State | Effort |
|-----|----------|---------------|--------------|--------|
| **E2E coverage** | Critical | 5 specs (auth, dashboard, contacts, properties) | Full auth, properties, requests, crm, transactions, rtl, accessibility | 3–5 days |
| **Page Objects** | High | Minimal | LoginPage, DashboardPage, PropertyFormPage, etc. | 1–2 days |
| **Fixtures** | High | Minimal | auth, property, request, contact fixtures | 0.5 day |
| **RTL specs** | High | None | layout-rtl, forms-rtl, navigation-rtl | 1 day |
| **Unit tests (API)** | Medium | None | Vitest for services | 2–3 days |
| **Load tests (k6)** | Medium | None | property-search, auth | 0.5 day |
| **Security checklist** | Medium | None | OWASP ZAP, IDOR, SQLi, XSS | 1 day |

**Done:** Playwright config (ar-SA, Asia/Riyadh), login, dashboard, contacts, properties specs.

---

### 1.5 Saudi Localization (Waseel)

| Gap | Severity | Current State | Target State | Effort |
|-----|----------|---------------|--------------|--------|
| **Nafath integration** | Critical | Button only | Full init/callback flow | 3–5 days |
| **REGA API integration** | Critical | Format only | Validation API + cache | 2–3 days |
| **Ejar integration** | High | None | Contract creation | 5–7 days |
| **ZATCA integration** | High | None | E-invoicing | 5–7 days |
| **Hijri dates** | High | Gregorian only | formatDualDate everywhere | 1–2 days |
| **SAUDI_CITIES lat/lng/region** | Medium | Partial | Full geo data | 0.5 day |
| **Property types** | Low | Most present | duplex, townhouse, penthouse, compound, tower, house | 0.5 day |
| **integrations/ folder** | High | Empty | nafath/, rega/, ejar/, zatca/ | — |

**Done:** formatSAR, formatSaudiPhone, formatArea, timeAgo, PhoneInput, PriceInput, Saudi phone validation.

---

## 2. Dependency Graph

```
                    ┌─────────────────────────────────────┐
                    │ Redis (sessions, rate limit, cache)  │
                    └─────────────────┬───────────────────┘
                                      │
┌─────────────┐    ┌──────────────────┴──────────────────┐
│ PostGIS     │    │ BullMQ (needs Redis)                 │
│ (optional   │    │   → property.photos.process          │
│  for now)   │    │   → request.match.auto               │
└─────────────┘    │   → notification.send                │
                   └──────────────────┬──────────────────┘
                                      │
┌─────────────────────────────────────┴─────────────────────────────────────┐
│ Saudi Integrations (can run in parallel after Redis)                      │
│   Nafath ──► REGA (cache in Redis) ──► Ejar ──► ZATCA                    │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Prioritized Next Steps

### Sprint A: Foundation Unblock (1 week)

**Goal:** Unblock Redis/BullMQ and improve dev experience.

| # | Task | Owner | Effort | Priority |
|---|------|-------|--------|----------|
| A1 | Add Redis + PostGIS to docker-compose | Infra | 0.5d | P0 |
| A2 | Add Redis client; wire rate limit + sessions to Redis | Backend | 1d | P0 |
| A3 | Extend `/health` with `database`, `redis` checks | Backend | 0.5d | P0 |
| A4 | Add BullMQ; implement `property.photos.process` job | Backend | 1.5d | P1 |
| A5 | Refresh token flow (httpOnly cookie, `/auth/refresh`) | Backend | 1d | P1 |

**Outcome:** Redis operational, health checks complete, BullMQ ready, refresh tokens.

---

### Sprint B: Saudi Integrations Start (1–2 weeks)

**Goal:** Nafath + REGA as first Saudi integrations.

| # | Task | Owner | Effort | Priority |
|---|------|-------|--------|----------|
| B1 | Create `apps/api/src/integrations/nafath/` structure | Backend | 0.5d | P0 |
| B2 | Implement Nafath init + callback (sandbox) | Backend | 2d | P0 |
| B3 | Wire Nafath button to real flow; store `nafath_verified` | Frontend | 0.5d | P0 |
| B4 | Create `integrations/rega/`; REGA validation API (sandbox) | Backend | 1.5d | P0 |
| B5 | Cache REGA validation in Redis (24h) | Backend | 0.5d | P0 |
| B6 | Block property publish without valid REGA license | Backend | 0.5d | P1 |

**Outcome:** Nafath SSO working (sandbox), REGA validation with cache.

---

### Sprint C: Frontend Polish (1 week)

**Goal:** MapPicker, Hijri, Kanban, locales.

| # | Task | Owner | Effort | Priority |
|---|------|-------|--------|----------|
| C1 | Create MapPicker component (Google Maps) | Frontend | 1.5d | P0 |
| C2 | Add HijriDatePicker (moment-hijri) | Frontend | 1d | P0 |
| C3 | Add @dnd-kit for Pipeline Kanban | Frontend | 1.5d | P1 |
| C4 | Migrate 5 key pages to full i18n (no inline strings) | Frontend | 1d | P1 |
| C5 | Extract LoginForm to `features/auth` | Frontend | 0.5d | P2 |

**Outcome:** MapPicker, Hijri dates, Kanban pipeline, better i18n.

---

### Sprint D: E2E & QA (1 week)

**Goal:** Broader E2E coverage, RTL tests.

| # | Task | Owner | Effort | Priority |
|---|------|-------|--------|----------|
| D1 | Create Page Objects (LoginPage, PropertyFormPage, etc.) | QA | 1d | P0 |
| D2 | Add E2E: properties/create-listing, requests/submit-request | QA | 1d | P0 |
| D3 | Add E2E: transactions/sale-pipeline | QA | 0.5d | P1 |
| D4 | Add RTL specs (layout-rtl, forms-rtl) | QA | 1d | P1 |
| D5 | Add k6 load test for property search | QA | 0.5d | P2 |

**Outcome:** 10+ E2E specs, RTL coverage, load test baseline.

---

### Sprint E: Infrastructure Complete (1 week)

**Goal:** Terraform modules, full deploy.

| # | Task | Owner | Effort | Priority |
|---|------|-------|--------|----------|
| E1 | Terraform: cloud-sql, memorystore modules | Infra | 1.5d | P0 |
| E2 | Terraform: cloud-run module (API + Worker) | Infra | 1d | P0 |
| E3 | Terraform: cloud-storage, secrets modules | Infra | 1d | P1 |
| E4 | Cloud Build: add migrate step, web deploy | Infra | 0.5d | P1 |
| E5 | Cloud Armor WAF (SQLi, XSS, rate limit) | Infra | 1d | P2 |

**Outcome:** Full Terraform, deployable to me-central1.

---

## 4. Recommended Immediate Next Step

**Start with Sprint A** — specifically:

1. **A1: Add Redis + PostGIS to docker-compose** (0.5 day)  
   - Unblocks Redis-dependent work  
   - PostGIS enables future spatial queries  

2. **A2: Wire Redis for rate limit + sessions** (1 day)  
   - Production-ready rate limiting  
   - Foundation for refresh tokens  

3. **A3: Extend `/health`** (0.5 day)  
   - Required for Cloud Run probes  
   - Quick win  

**Total: ~2 days** to unblock Redis/BullMQ and improve production readiness.

---

## 5. Deferred / Lower Priority

| Item | Reason |
|------|--------|
| Drizzle/Prisma migration | Raw `pg` works; migration is high effort |
| PostGIS migration | Current lat/lng sufficient; migrate when spatial queries needed |
| Module architecture refactor | Improves structure but not functionality |
| OTP send/verify | Can follow Nafath; lower priority |
| Ejar, ZATCA | Phase 2; after Nafath + REGA |
| Socket.io real-time | Nice-to-have; not blocking |

---

## 6. Success Metrics

- [ ] Redis + BullMQ operational
- [ ] Health endpoint returns DB + Redis status
- [ ] Nafath SSO (sandbox) working
- [ ] REGA validation with Redis cache
- [ ] MapPicker + HijriDatePicker in use
- [ ] 10+ E2E specs passing
- [ ] Terraform deploys to me-central1

---

## 7. Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Saudi API sandbox unavailable | Mock integrations; document sandbox key process |
| Redis adds dev complexity | docker-compose makes it one command |
| Terraform state drift | Use GCS backend; lock state |
| E2E flakiness | Use data-testid; stable selectors |
