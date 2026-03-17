import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { TransactionsPage } from '../../pages/TransactionsPage';

test.describe('Transactions / Sale Pipeline', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('broker@aqarkom.com', 'Test123!');
    await loginPage.expectRedirectToDashboard();
  });

  test('transactions page loads', async ({ page }) => {
    const txPage = new TransactionsPage(page);
    await txPage.goto();
    await txPage.expectLoaded();
  });

  test('can open new transaction form', async ({ page }) => {
    await page.goto('/transactions');
    await page.getByTestId('transactions-page').waitFor({ state: 'visible' });

    await page.getByRole('button', { name: /صفقة جديدة|New Transaction/i }).click();
    await expect(page.locator('form')).toBeVisible();
  });
});
