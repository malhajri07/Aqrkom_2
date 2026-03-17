# PRD Completion Checklist

**Reference:** `PRD.md`, `docs/ULTRA_INVESTIGATION_AND_NEXT_STEPS.md`  
**Last Updated:** March 2026

---

## 1. Executive Summary

| Category | Status | Notes |
|----------|--------|-------|
| Phase 1 MVP | ✅ Complete | Auth, properties, requests, contacts, transactions, dashboard, documents |
| Phase 2 Saudi | 🔄 In Progress | Nafath, REGA, Ejar, ZATCA stubs |
| Phase 2 Infra | 🔄 In Progress | Cloud Armor WAF, k6 load tests |
| Phase 3 Polish | ⏳ Pending | Full i18n, Hijri dates, Kanban, MapPicker |

---

## 2. Functional Requirements

### 2.1 Authentication

| Endpoint | Status | Notes |
|----------|--------|------|
| POST /api/v1/auth/register | ✅ | |
| POST /api/v1/auth/login | ✅ | |
| POST /api/v1/auth/nafath/init | ✅ | |
| POST /api/v1/auth/nafath/callback | ✅ | |
| POST /api/v1/auth/otp/send | ✅ | |
| POST /api/v1/auth/otp/verify | ✅ | |
| POST /api/v1/auth/refresh | ✅ | |
| POST /api/v1/auth/logout | ✅ | |

### 2.2 Properties

| Endpoint | Status | Notes |
|----------|--------|------|
| GET /api/v1/properties | ✅ | |
| POST /api/v1/properties | ✅ | |
| GET /api/v1/properties/:id | ✅ | |
| PUT /api/v1/properties/:id | ✅ | |
| PATCH /api/v1/properties/:id/status | ✅ | |
| DELETE /api/v1/properties/:id | ✅ | |
| POST /api/v1/properties/:id/photos | ✅ | |
| DELETE /api/v1/properties/:id/photos/:photoId | ✅ | |
| GET /api/v1/properties/map | ✅ | |
| GET /api/v1/properties/search | ✅ | |
| GET /api/v1/properties/stats | ✅ | |

### 2.3 Requests

| Endpoint | Status | Notes |
|----------|--------|------|
| POST /api/v1/public/requests | ✅ | Public submit |
| GET /api/v1/requests | ✅ | |
| GET /api/v1/requests/:id | ✅ | |
| PATCH /api/v1/requests/:id/status | ✅ | |
| POST /api/v1/requests/:id/offers | ✅ | |
| GET /api/v1/requests/:id/offers | ✅ | |

### 2.4 CRM

| Endpoint | Status | Notes |
|----------|--------|------|
| GET/POST /api/v1/contacts | ✅ | |
| GET/PUT /api/v1/contacts/:id | ✅ | |
| POST /api/v1/contacts/import | ✅ | |
| GET/POST /api/v1/tasks | ✅ | |
| GET/POST /api/v1/activities | ✅ | |

### 2.5 Transactions

| Endpoint | Status | Notes |
|----------|--------|------|
| GET/POST /api/v1/transactions | ✅ | |
| GET/PUT /api/v1/transactions/:id | ✅ | |
| GET /api/v1/transactions/:id/timeline | ✅ | |
| GET /api/v1/transactions/:id/checklist | ✅ | |
| GET /api/v1/transactions/:id/commission | ✅ | |
| POST /api/v1/transactions/:id/ejar/register | ✅ | Phase 2 |
| GET /api/v1/transactions/:id/invoice | ✅ | Phase 2 ZATCA |

---

## 3. Saudi Integrations

| Integration | Status | Notes |
|-------------|--------|-------|
| Nafath | ✅ | Init + callback flow |
| REGA | ✅ | Validation + Redis cache |
| Ejar | ✅ Stub | `integrations/ejar/`; sandbox mock; POST /transactions/:id/ejar/register |
| ZATCA | ✅ Stub | `integrations/zatca/`; commission invoice, 15% VAT, QR; GET /transactions/:id/invoice |

---

## 4. Non-Functional Requirements

| Requirement | Status | Notes |
|-------------|--------|-------|
| RTL Arabic primary | ✅ | |
| Data residency me-central1 | ✅ | Terraform, Cloud Build |
| Rate limiting | ✅ | 100 req/min API, 20 req/min auth |
| Response envelope | ✅ | `{ success, data }` or `{ success: false, error }` |
| Soft deletes | ✅ | `deleted_at` on main tables |
| Audit | 🔄 | Middleware; DB triggers not yet |

---

## 5. Infrastructure

| Component | Status | Notes |
|-----------|--------|-------|
| Terraform modules | ✅ | networking, cloud-sql, memorystore, cloud-run, secrets, cloud-storage |
| Cloud Armor WAF | ✅ | `terraform/modules/cloud-armor/` — SQLi, XSS, rate limit |
| Docker PostGIS + Redis | ✅ | docker-compose |
| Health DB/Redis | ✅ | `/api/health` |

---

## 6. QA

| Item | Status | Notes |
|------|--------|-------|
| Playwright E2E | ✅ | auth, dashboard, contacts, properties |
| k6 load tests | ✅ | `load-tests/property-search.js`, `load-tests/auth.js` |
| Unit tests (API) | ⏳ | Vitest for services |
| RTL specs | ⏳ | |
| Page Objects | ⏳ | |

---

## 7. Phase 3 (Remaining)

| Item | Status |
|------|--------|
| Full i18n (no inline strings) | ⏳ |
| Hijri dates | ⏳ |
| Kanban Pipeline | ⏳ |
| MapPicker | ⏳ |
| Ejar renewal reminders | ⏳ |
| ZATCA full Fatoorah (production) | ⏳ |

---

## 8. Run Commands

```bash
# k6 load tests (requires k6 installed: brew install k6)
k6 run load-tests/property-search.js
k6 run load-tests/auth.js
BASE_URL=https://api.example.com k6 run load-tests/property-search.js
```
