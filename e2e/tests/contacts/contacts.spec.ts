import { test, expect } from '@playwright/test';

test.describe('Contacts', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('login-email').fill('broker@aqarkom.com');
    await page.getByTestId('login-password').fill('Test123!');
    await page.getByTestId('login-submit').click();
    await expect(page).toHaveURL(/\/(dashboard)?$/);
  });

  test('contacts page loads after login', async ({ page }) => {
    await page.goto('/contacts');
    await expect(page.getByTestId('contacts-page')).toBeVisible();
  });

  test('can navigate to contacts from dashboard', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/contacts"]');
    await expect(page).toHaveURL('/contacts');
    await expect(page.getByTestId('contacts-page')).toBeVisible();
  });
});
