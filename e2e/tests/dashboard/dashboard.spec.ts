import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('login-email').fill('broker@aqarkom.com');
    await page.getByTestId('login-password').fill('Test123!');
    await page.getByTestId('login-submit').click();
    await expect(page).toHaveURL(/\/(dashboard)?$/);
  });

  test('dashboard shows after login', async ({ page }) => {
    await expect(page).toHaveURL(/\/(dashboard)?$/);
  });

  test('can navigate to properties from dashboard', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/properties"]');
    await expect(page).toHaveURL('/properties');
  });

  test('can navigate to contacts', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/contacts"]');
    await expect(page).toHaveURL('/contacts');
  });
});
