import { test, expect } from '@playwright/test';

test.describe('RTL Layout', () => {
  test('login page has RTL direction when Arabic', async ({ page }) => {
    await page.goto('/login');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('dir', 'rtl');
    await expect(html).toHaveAttribute('lang', 'ar');
  });

  test('dashboard layout is RTL', async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('login-email').fill('broker@aqarkom.com');
    await page.getByTestId('login-password').fill('Test123!');
    await page.getByTestId('login-submit').click();
    await page.waitForURL(/\/(dashboard)?$/);

    const html = page.locator('html');
    await expect(html).toHaveAttribute('dir', 'rtl');
  });
});
