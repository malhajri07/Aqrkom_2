# Aqarkom (عقاركم) — Product Requirements Document

**Version:** 1.0  
**Last Updated:** March 2026  
**Reference:** `.agents/skills/` (backend_engineer, frontend, infra_engineer, quality_tester, saudi_localization)

---

## 1. Executive Summary

**Aqarkom** is an Arabic-first Saudi Real Estate CRM combining:

- **Aqar.fm model:** Property listing marketplace (largest Saudi RE platform)
- **DealApp.sa model:** Request-matching (seekers post requests → brokers respond with offers)
- **Custom CRM:** Contact management, transaction pipelines, commission tracking

**Target Users:** Saudi real estate brokers, agents, property seekers, property owners.

**Success Criteria:**
- Saudi Arabia–focused (RTL Arabic primary, English secondary)
- REGA ad licensing for all property listings
- Government integrations: Nafath (SSO), Ejar (rental contracts), ZATCA (e-invoicing)
- Data residency: GCP me-central1 (Dammam)

---

## 2. Product Model

| Component | Description |
|-----------|-------------|
| **Property Listings** | Aqar-style: photos, specs, map, REGA license, search/filter |
| **Request Matching** | DealApp-style: seekers submit requests, brokers respond with offers |
| **CRM** | Contacts, activities, tasks, lead pipeline, transaction pipeline |
| **Documents** | Library, templates, Ejar contracts |
| **Reports** | Dashboard KPIs, pipeline charts, commission tracking |

---

## 3. Functional Requirements

### 3.1 Authentication

| Endpoint | Description |
|----------|-------------|
| POST /api/v1/auth/register | Register with role, REGA license for brokers |
| POST /api/v1/auth/login | Email/phone + password |
| POST /api/v1/auth/nafath/init | Initialize Nafath SSO |
| POST /api/v1/auth/nafath/callback | Nafath verification callback |
| POST /api/v1/auth/otp/send | Send OTP to +966 number |
| POST /api/v1/auth/otp/verify | Verify OTP |
| POST /api/v1/auth/refresh | Refresh access token (httpOnly cookie) |
| POST /api/v1/auth/logout | Invalidate tokens |

**Auth Flow:** JWT access token (15min) + Refresh token (7 days, httpOnly cookie) + Nafath SSO.

### 3.2 Properties (Aqar-style)

| Endpoint | Description |
|----------|-------------|
| GET /api/v1/properties | List with filters |
| POST /api/v1/properties | Create listing (REGA required) |
| GET /api/v1/properties/:id | Get details |
| PUT /api/v1/properties/:id | Update |
| PATCH /api/v1/properties/:id/status | Change status |
| DELETE /api/v1/properties/:id | Soft delete |
| POST /api/v1/properties/:id/photos | Upload photos |
| DELETE /api/v1/properties/:id/photos/:photoId | Delete photo |
| GET /api/v1/properties/map | GeoJSON for map view |
| GET /api/v1/properties/search | Full-text Arabic search |
| GET /api/v1/properties/stats | Neighborhood price stats |

### 3.3 Requests (DealApp-style)

| Endpoint | Description |
|----------|-------------|
| POST /api/v1/requests | Seeker submits request |
| GET /api/v1/requests | List requests |
| GET /api/v1/requests/:id | Request details |
| PATCH /api/v1/requests/:id/status | Update status |
| POST /api/v1/requests/:id/offers | Broker sends offer |
| GET /api/v1/requests/:id/offers | List offers |

### 3.4 CRM

| Endpoint | Description |
|----------|-------------|
| GET/POST /api/v1/contacts | List, create |
| GET/PUT /api/v1/contacts/:id | Get, update |
| POST /api/v1/contacts/import | CSV import |
| GET /api/v1/contacts/:id/activities | Activities |
| GET/POST /api/v1/tasks | Tasks |

### 3.5 Transactions

| Endpoint | Description |
|----------|-------------|
| GET/POST /api/v1/transactions | List, create |
| GET/PATCH /api/v1/transactions/:id | Get, update |
| GET /api/v1/transactions/:id/timeline | Timeline |
| GET /api/v1/transactions/:id/checklist | Closing checklist |
| GET /api/v1/transactions/:id/commission | Commission breakdown |

---

## 4. Saudi Integrations

### 4.1 Nafath (نفاذ) — National Digital Identity

- Init → User redirects to Nafath → Callback with token
- Store NIN encrypted (AES-256-GCM)
- Set `nafath_verified = true` on user

### 4.2 REGA (هيئة العقار) — Ad Licensing

- Every listing requires valid REGA ad license
- Validate against REGA API; cache 24h in Redis
- Display license on listing; block publish without valid license

### 4.3 Ejar (إيجار) — Rental Contracts (Phase 2)

- Create rental contract from transaction data
- Store `ejar_contract_number`
- Renewal reminders (90, 60, 30 days)

### 4.4 ZATCA (هيئة الزكاة) — E-Invoicing (Phase 2)

- Commission invoices with 15% VAT
- QR code (TLV), digital signature

---

## 5. Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| **RTL** | Arabic primary; logical CSS (ps-, pe-, ms-, me-) |
| **Data residency** | GCP me-central1 (Dammam) |
| **Rate limiting** | 100 req/min API, 20 req/min auth |
| **Response envelope** | `{ success, data }` or `{ success: false, error }` |
| **Soft deletes** | `deleted_at` on main tables |
| **Audit** | Log mutations to audit_log |

---

## 6. Tech Stack

| Layer | Technology |
|------|------------|
| Backend | Express.js, TypeScript, PostgreSQL 16, Redis, BullMQ |
| Frontend | React 18, Vite, Tailwind, shadcn/ui, TanStack Query, react-i18next |
| Infra | Terraform, Cloud Run, Cloud SQL, Memorystore |
| QA | Vitest, Playwright E2E, k6 load tests |

---

## 7. Phase Roadmap

| Phase | Scope |
|-------|-------|
| **Phase 1 MVP** | Auth, properties, requests, contacts, transactions, dashboard, documents |
| **Phase 2** | Saudi integrations (Nafath, REGA API, Ejar, ZATCA), infrastructure |
| **Phase 3** | Polish: full i18n, Hijri dates, Kanban, MapPicker, E2E coverage |
