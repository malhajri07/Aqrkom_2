# E2E Failed Tests — Fix Plan

**Reference:** `.agents/skills/quality_tester.md`, terminal 11 test output  
**Last Updated:** March 2026

---

## 1. Failure Summary

| Category | Tests Affected | Root Cause |
|----------|----------------|------------|
| **Login error** | `auth/login.spec.ts` › failed login | API client redirects on 401, error never shown |
| **Property form** | `create-listing.spec.ts` (both) | Lazy load + selector; fix partially applied |
| **Public request** | `submit-request.spec.ts`, `forms-rtl.spec.ts` | Lazy load + missing `waitForURL` |
| **Search page** | `search.spec.ts` › map/grid toggle | Icon buttons use `title` only; no `aria-label` |
| **Transactions** | `sale-pipeline.spec.ts` › New Transaction | Button needs stable selector |

---

## 2. Fix Plan by Priority

### P0: Login Error (Blocking)

**Issue:** On failed login (401), `api()` in `lib/api.ts` does `window.location.href = '/login'`, causing a full reload. The Login component never gets to show the error.

**Fix:** Skip redirect on 401 for auth/login so the error can be displayed.

```ts
// apps/web/src/lib/api.ts — in api() function
if (res.status === 401) {
  setAuthToken(null);
  // Don't redirect when already on login flow — let Login component show error
  if (!path.startsWith('/auth/login')) {
    window.location.href = '/login';
  }
  throw new Error(body?.error?.message || (body as { error?: string }).error || 'Unauthorized');
}
```

**Owner:** Frontend

---

### P0: Property Form (Already Partially Fixed)

**Issue:** `property-form-page` times out; lazy-loaded PropertyForm may not be ready.

**Status:** PropertyFormPage already updated to use `property-form` and `waitForURL`. Ensure `create-listing.spec.ts` validation test also waits for URL before form.

**Fix:** Add `waitForURL` before form wait in validation test.

```ts
// e2e/tests/properties/create-listing.spec.ts
test('property form shows required validation', async ({ page }) => {
  await page.goto('/properties/new');
  await page.waitForURL(/\/properties\/new/);
  await page.getByTestId('property-form').waitFor({ state: 'visible' });
  // ...
});
```

**Owner:** QA

---

### P0: Public Request Form

**Issue:** `public-request-form` times out; PublicRequest is lazy-loaded.

**Fix:** Add `waitForURL` in PublicRequestPage before waiting for form.

```ts
// e2e/pages/PublicRequestPage.ts
async goto() {
  await this.page.goto('/submit-request');
  await this.page.waitForURL(/\/submit-request/);
}

async expectLoaded() {
  await this.page.getByTestId('public-request-form').waitFor({ state: 'visible', timeout: 15000 });
}
```

**Owner:** QA

---

### P1: Search Page — Map/Grid Toggle

**Issue:** Buttons use `title` only; `getByRole('button', { name: /Grid view/ })` may not resolve for icon-only buttons in all locales.

**Fix:** Add `aria-label` to SearchMap toggle buttons for stable selectors.

```tsx
// apps/web/src/pages/SearchMap.tsx
<button
  type="button"
  onClick={() => setViewMode('grid')}
  aria-label={t('عرض شبكي', 'Grid view')}
  title={t('عرض شبكي', 'Grid view')}
  className={...}
>
  <HiOutlineSquares2X2 className="w-5 h-5" />
</button>
<button
  type="button"
  onClick={() => setViewMode('map')}
  aria-label={t('عرض الخريطة', 'Map view')}
  title={t('عرض الخريطة', 'Map view')}
  className={...}
>
  <HiOutlineMap className="w-5 h-5" />
</button>
```

**Owner:** Frontend

---

### P1: Transactions — New Transaction Button

**Issue:** `getByRole('button', { name: /صفقة جديدة|New Transaction/i })` times out; i18n or timing.

**Fix:** Add `data-testid` for a stable selector.

```tsx
// apps/web/src/pages/Transactions.tsx
<button
  onClick={() => setShowForm(!showForm)}
  className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium"
  data-testid="transaction-new-btn"
>
  {showForm ? tCommon('buttons.cancel') : t('newTransaction')}
</button>
```

```ts
// e2e/tests/transactions/sale-pipeline.spec.ts
await page.getByTestId('transaction-new-btn').click();
```

**Owner:** Frontend + QA

---

### P2: RTL / Locale-Specific Flakiness

**Issue:** Some tests fail only on `desktop-english` (e.g. create-listing, submit-request). Likely lazy-load timing or locale-dependent rendering.

**Fix:** Ensure all page objects use `waitForURL` after navigation and resilient selectors (`data-testid` over role/name where possible).

---

## 3. Implementation Order

| # | Task | File(s) | Effort |
|---|------|---------|--------|
| 1 | Skip 401 redirect for /auth/login | `apps/web/src/lib/api.ts` | 0.25d |
| 2 | Add waitForURL to create-listing validation test | `e2e/tests/properties/create-listing.spec.ts` | 0.1d |
| 3 | Add waitForURL + timeout to PublicRequestPage | `e2e/pages/PublicRequestPage.ts` | 0.1d |
| 4 | Add aria-label to SearchMap toggle buttons | `apps/web/src/pages/SearchMap.tsx` | 0.1d |
| 5 | Add data-testid to Transactions New button | `apps/web/src/pages/Transactions.tsx` | 0.1d |
| 6 | Update sale-pipeline spec to use data-testid | `e2e/tests/transactions/sale-pipeline.spec.ts` | 0.1d |

---

## 4. Verification

```bash
pnpm db:seed
DATABASE_URL="postgresql://aqarkom:aqarkom@localhost:5432/aqarkom" pnpm test:e2e
```

---

## 5. Playwright Best Practices Applied

- Use `waitForURL` after `goto` for SPA routes
- Prefer `data-testid` for critical interactive elements
- Add `aria-label` for icon-only buttons
- Avoid redirects that prevent error UI from rendering
- Use consistent selectors across page objects and specs
