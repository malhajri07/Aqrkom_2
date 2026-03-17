import { test, expect } from '@playwright/test';

test.describe('Properties List', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('login-email').fill('broker@aqarkom.com');
    await page.getByTestId('login-password').fill('Test123!');
    await page.getByTestId('login-submit').click();
    await expect(page).toHaveURL(/\/(dashboard)?$/);
  });

  test('properties page loads after login', async ({ page }) => {
    await page.goto('/properties');
    await expect(page.getByTestId('properties-page')).toBeVisible();
  });

  test('can navigate to properties from dashboard', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/properties"]');
    await expect(page).toHaveURL('/properties');
    await expect(page.getByTestId('properties-page')).toBeVisible();
  });
});
