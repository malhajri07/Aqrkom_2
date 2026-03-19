# Aqarkom End-to-End Testing Plan

**Reference:** `.agents/skills/quality_tester.md`, `backend_engineer.md`, `frontend.md`, `infra_engineer.md`, `saudi_localization.md`  
**Last Updated:** March 2026

---

## 1. Executive Summary

| Aspect | Current State | Target State |
|--------|---------------|--------------|
| **Framework** | Playwright (e2e/) | Playwright (e2e/) ✅ |
| **Config** | Basic (2 projects, ar-SA/en-US) | Full (desktop + mobile + tablet) |
| **Page Objects** | 6 pages | 11+ pages |
| **Specs** | ~10 specs | 25+ specs |
| **Fixtures** | auth only | auth, property, request, contact |
| **RTL** | layout-rtl, forms-rtl | + navigation-rtl, data-tables-rtl |
| **Accessibility** | None | axe-core + WCAG audit |
| **CI** | Not wired | Cloud Build / GitHub Actions |
| **Test Environment** | pnpm dev (API+Web) | Docker + seed data |

---

## 2. Current E2E Inventory

### Existing Specs
| Spec | Status | Notes |
|------|--------|------|
| `auth/login.spec.ts` | ✅ | broker/admin login, failed login, Nafath button |
| `dashboard/dashboard.spec.ts` | ✅ | Dashboard loads |
| `contacts/contacts.spec.ts` | ✅ | Contact list |
| `properties/create-listing.spec.ts` | ✅ | Create property, validation |
| `properties/properties-list.spec.ts` | ✅ | List view |
| `properties/search.spec.ts` | ✅ | Search/filter |
| `requests/submit-request.spec.ts` | ✅ | Public request form |
| `transactions/sale-pipeline.spec.ts` | ✅ | Sale pipeline |
| `rtl/layout-rtl.spec.ts` | ✅ | RTL layout |
| `rtl/forms-rtl.spec.ts` | ✅ | Form RTL |

### Existing Page Objects
| Page | Status | Coverage |
|------|--------|----------|
| LoginPage | ✅ | login, expectRedirectToDashboard, expectErrorVisible |
| DashboardPage | ✅ | |
| PropertyFormPage | ✅ | Full form flow |
| PropertyListPage | ✅ | |
| PublicRequestPage | ✅ | |
| TransactionsPage | ✅ | |

### Gaps vs Quality Tester Skill
- **Auth:** register.spec, nafath-sso.spec (redirect only), otp-verification.spec, account lockout
- **Properties:** map-view.spec, property-detail.spec, rega-license.spec (rejection)
- **Requests:** broker-inbox.spec, offer-response.spec, request-matching.spec
- **CRM:** lead-pipeline.spec, activity-logging.spec, csv-import.spec
- **Transactions:** lease-pipeline.spec, offer-management.spec, commission-calc.spec, closing-checklist.spec
- **RTL:** navigation-rtl.spec, data-tables-rtl.spec
- **Responsive:** mobile-views.spec, tablet-views.spec, touch-interactions.spec
- **Accessibility:** wcag-audit.spec, screen-reader.spec
- **Page Objects:** MapViewPage, RequestFormPage, BrokerInboxPage, ContactListPage, TransactionPipelinePage, CommissionDashboardPage
- **Fixtures:** property.fixture.ts, request.fixture.ts, contact.fixture.ts
- **Utils:** api-helpers.ts, screenshot-helpers.ts

---

## 3. Test Environment Requirements

### Prerequisites
| Requirement | Purpose |
|-------------|---------|
| PostgreSQL | API database |
| Redis (optional) | Rate limit, sessions |
| API (port 3000) | Backend |
| Web (port 5173) | Frontend (proxies /api to 3000) |
| Seed data | broker@aqarkom.com, admin@aqarkom.com, Test123! |

### Current webServer Config
```ts
// playwright.config.ts
webServer: {
  command: 'pnpm dev',  // Starts API + Web in parallel
  url: 'http://localhost:5173',
  reuseExistingServer: !process.env.CI,
  timeout: 60_000,
}
```

**Issue:** `pnpm dev` starts both API and web, but API requires `DATABASE_URL` and PostgreSQL. In CI, DB may not be available.

### Recommended CI Setup
1. **Docker Compose** — Start PostgreSQL + Redis + API + Web
2. **Seed** — Run `pnpm db:seed` before E2E
3. **Playwright** — Use `BASE_URL` pointing to web; no webServer if services started separately

---

## 4. Prioritized Implementation Plan

### Phase 1: Foundation (1–2 days)

| # | Task | Owner | Effort | Dependencies |
|---|------|-------|--------|---------------|
| 1.1 | Add `e2e/fixtures/property.fixture.ts` | QA | 0.5d | — |
| 1.2 | Add `e2e/fixtures/request.fixture.ts` | QA | 0.5d | — |
| 1.3 | Add `e2e/fixtures/contact.fixture.ts` | QA | 0.5d | — |
| 1.4 | Add `e2e/utils/api-helpers.ts` (login via API, create test data) | QA + Backend | 0.5d | API test seeds |
| 1.5 | Add `e2e/utils/test-helpers.ts` (waitForApi, formatSAR helpers) | QA | 0.25d | — |
| 1.6 | Extend Playwright config: mobile (Galaxy S9+, iPhone 14), tablet (iPad Pro) | QA | 0.25d | — |
| 1.7 | Add `data-testid` audit: ensure all critical flows have stable selectors | Frontend | 0.5d | — |

**Outcome:** Fixtures and helpers ready; config supports mobile/tablet.

---

### Phase 2: Auth & Properties (1–2 days)

| # | Task | Owner | Effort | Dependencies |
|---|------|-------|--------|---------------|
| 2.1 | `auth/register.spec.ts` — broker registration | QA | 0.5d | RegisterForm data-testids |
| 2.2 | `auth/nafath-sso.spec.ts` — Nafath redirect (no real callback) | QA | 0.25d | — |
| 2.3 | `auth/otp-verification.spec.ts` — OTP flow (if implemented) | QA | 0.5d | Backend OTP |
| 2.4 | `properties/property-detail.spec.ts` — view property, photos | QA | 0.5d | PropertyDetail data-testids |
| 2.5 | `properties/map-view.spec.ts` — map loads, pins visible | QA | 0.5d | MapPicker, data-testid="map-pin" |
| 2.6 | `properties/rega-license.spec.ts` — reject without REGA | QA | 0.25d | PropertyForm validation |
| 2.7 | Create `MapViewPage.ts` Page Object | QA | 0.25d | — |
| 2.8 | Create `PropertyDetailPage.ts` Page Object | QA | 0.25d | — |

**Outcome:** Auth and property flows covered.

---

### Phase 3: Requests & CRM (1–2 days)

| # | Task | Owner | Effort | Dependencies |
|---|------|-------|--------|---------------|
| 3.1 | `requests/broker-inbox.spec.ts` — broker sees requests | QA | 0.5d | Requests page, data-testids |
| 3.2 | `requests/offer-response.spec.ts` — broker sends offer | QA | 0.5d | RequestDetail, OfferResponse |
| 3.3 | `requests/request-matching.spec.ts` — seeker sees offers | QA | 0.5d | — |
| 3.4 | Create `BrokerInboxPage.ts`, `RequestFormPage.ts` | QA | 0.5d | — |
| 3.5 | `crm/lead-pipeline.spec.ts` — Kanban drag-and-drop | QA | 0.5d | LeadPipeline, @dnd-kit |
| 3.6 | `crm/activity-logging.spec.ts` — add activity, verify in timeline | QA | 0.5d | ActivityTimeline |
| 3.7 | `crm/csv-import.spec.ts` — import contacts | QA | 0.5d | ImportContacts |
| 3.8 | Create `ContactListPage.ts` | QA | 0.25d | — |

**Outcome:** Request matching and CRM flows covered.

---

### Phase 4: Transactions & Financial (1 day)

| # | Task | Owner | Effort | Dependencies |
|---|------|-------|--------|---------------|
| 4.1 | `transactions/lease-pipeline.spec.ts` — lease flow | QA | 0.5d | TransactionPipeline |
| 4.2 | `transactions/offer-management.spec.ts` — offers on transaction | QA | 0.5d | OfferManagement |
| 4.3 | `transactions/commission-calc.spec.ts` — commission + VAT display | QA | 0.5d | CommissionCalculator |
| 4.4 | `transactions/closing-checklist.spec.ts` — checklist items | QA | 0.5d | ClosingChecklist |
| 4.5 | Create `TransactionPipelinePage.ts`, `CommissionDashboardPage.ts` | QA | 0.5d | — |

**Outcome:** Transaction and commission flows covered.

---

### Phase 5: RTL, Responsive, Accessibility (1–2 days)

| # | Task | Owner | Effort | Dependencies |
|---|------|-------|--------|---------------|
| 5.1 | `rtl/navigation-rtl.spec.ts` — nav direction, back button | QA | 0.25d | — |
| 5.2 | `rtl/data-tables-rtl.spec.ts` — table alignment | QA | 0.25d | — |
| 5.3 | `responsive/mobile-views.spec.ts` — key pages on mobile | QA | 0.5d | — |
| 5.4 | `responsive/tablet-views.spec.ts` | QA | 0.25d | — |
| 5.5 | `responsive/touch-interactions.spec.ts` — tap, swipe | QA | 0.25d | — |
| 5.6 | Add `@axe-core/playwright` | QA | 0.25d | — |
| 5.7 | `accessibility/wcag-audit.spec.ts` — axe on key pages | QA | 0.5d | — |
| 5.8 | `accessibility/screen-reader.spec.ts` — basic ARIA checks | QA | 0.5d | — |

**Outcome:** RTL, responsive, and a11y coverage.

---

### Phase 6: CI & Test Environment (1 day)

| # | Task | Owner | Effort | Dependencies |
|---|------|-------|--------|---------------|
| 6.1 | Docker Compose E2E profile: PostgreSQL + Redis + API + Web | Infra | 0.5d | — |
| 6.2 | E2E seed script: create test users, properties, requests | Backend | 0.5d | — |
| 6.3 | GitHub Actions / Cloud Build: run E2E on PR | Infra | 0.5d | 6.1, 6.2 |
| 6.4 | Playwright HTML report in CI artifacts | Infra | 0.25d | — |

**Outcome:** E2E runs in CI on every PR.

---

## 5. data-testid Audit (Frontend)

Pages/components that need stable `data-testid` for E2E:

| Component | Required data-testids |
|-----------|------------------------|
| Login | login-email, login-password, login-submit, login-error, nafath-login-btn ✅ |
| Register | register-email, register-password, register-submit, rega-license |
| PropertyForm | property-form, property-rega-license, property-title-ar, property-type, property-transaction-type, property-city, property-district, property-price, property-area, property-form-submit ✅ |
| PropertyDetail | property-detail, property-photos, property-map |
| MapView | map-container, map-pin, map-preview-card |
| RequestForm | request-type, request-city, request-submit |
| BrokerInbox | request-card, respond-btn |
| ContactList | contact-row, contact-search |
| TransactionPipeline | pipeline-column, pipeline-card |
| CommissionCalculator | commission-amount, vat-amount, total-with-vat |
| ClosingChecklist | checklist-item, ejar-status |

---

## 6. Saudi Compliance E2E (Phase 2)

| Test | Scope | Owner |
|------|-------|-------|
| REGA license required for publish | PropertyForm | QA |
| REGA displayed on listing | PropertyDetail | QA |
| Nafath redirect | Login | QA |
| Ejar contract number in checklist | TransactionDetail | QA |
| ZATCA invoice fields | Transaction invoice | QA |
| VAT 15% in commission | CommissionCalculator | QA |

---

## 7. Coordination Protocol

### QA Depends On
- **Backend:** API seeds, demo users (broker@aqarkom.com, admin@aqarkom.com), test endpoints
- **Frontend:** data-testid on all critical elements, stable selectors
- **Saudi:** Compliance checklists, validation rules
- **Infra:** Docker E2E stack, CI pipeline

### QA Provides To
- **All:** Bug reports with reproduction steps
- **Backend:** API contract test results
- **Frontend:** Visual regression, RTL layout issues
- **Saudi:** Compliance test results
- **Infra:** Test pipeline config, quality gates

---

## 8. Success Metrics

- [ ] 25+ E2E specs passing
- [ ] 11+ Page Objects
- [ ] Full auth, properties, requests, crm, transactions coverage
- [ ] RTL specs (4)
- [ ] Responsive specs (3)
- [ ] Accessibility specs (2)
- [ ] E2E runs in CI on every PR
- [ ] < 10 min E2E suite duration

---

## 9. Quick Reference

```bash
# Run all E2E
pnpm test:e2e

# Run specific project
pnpm test:e2e --project=desktop-arabic

# Run specific spec
pnpm test:e2e e2e/tests/auth/login.spec.ts

# Run with UI
pnpm test:e2e:ui

# Install browsers
pnpm test:e2e:install
```
