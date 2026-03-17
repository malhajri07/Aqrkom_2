import { test, expect } from '@playwright/test';

test.describe('Property Search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('login-email').fill('broker@aqarkom.com');
    await page.getByTestId('login-password').fill('Test123!');
    await page.getByTestId('login-submit').click();
    await expect(page).toHaveURL(/\/(dashboard)?$/);
  });

  test('navigates to properties list', async ({ page }) => {
    await page.goto('/properties');
    await expect(page).toHaveURL('/properties');
  });

  test('search page loads with map and grid toggle', async ({ page }) => {
    await page.goto('/search');
    await expect(page).toHaveURL('/search');
    await expect(page.getByRole('button', { name: /عرض شبكي|Grid view/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /عرض الخريطة|Map view/ })).toBeVisible();
  });
});
