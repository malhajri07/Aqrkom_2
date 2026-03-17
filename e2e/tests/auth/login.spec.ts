import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test('broker can login with email and password', async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('login-email').fill('broker@aqarkom.com');
    await page.getByTestId('login-password').fill('Test123!');
    await page.getByTestId('login-submit').click();
    await expect(page).toHaveURL(/\/(dashboard)?$/);
  });

  test('admin can login', async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('login-email').fill('admin@aqarkom.com');
    await page.getByTestId('login-password').fill('Test123!');
    await page.getByTestId('login-submit').click();
    await expect(page).toHaveURL(/\/(dashboard)?$/);
  });

  test('failed login shows error message', async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('login-email').fill('wrong@test.com');
    await page.getByTestId('login-password').fill('wrong');
    await page.getByTestId('login-submit').click();
    await expect(page.getByTestId('login-error')).toBeVisible();
  });

  test('Nafath button is visible', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByTestId('nafath-login-btn')).toBeVisible();
  });
});
