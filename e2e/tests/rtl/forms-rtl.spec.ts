import { test, expect } from '@playwright/test';

test.describe('RTL Forms', () => {
  test('login form inputs are visible and RTL', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByTestId('login-email')).toBeVisible();
    await expect(page.getByTestId('login-password')).toBeVisible();

    const html = page.locator('html');
    await expect(html).toHaveAttribute('dir', 'rtl');
  });

  test('public request form is RTL', async ({ page }) => {
    await page.goto('/submit-request');
    await page.waitForURL(/\/submit-request/);
    await page.getByTestId('public-request-form').waitFor({ state: 'visible' });

    const html = page.locator('html');
    await expect(html).toHaveAttribute('dir', 'rtl');
  });
});
