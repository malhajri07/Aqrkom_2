import { test, expect } from '@playwright/test';
import { PublicRequestPage } from '../../pages/PublicRequestPage';

test.describe('Submit Property Request (Public)', () => {
  test('seeker can submit a property request', async ({ page }) => {
    const requestPage = new PublicRequestPage(page);
    await requestPage.goto();
    await requestPage.expectLoaded();

    await requestPage.fillName('أحمد محمد');
    await requestPage.fillPhone('+966501234567');
    await requestPage.fillEmail('ahmed@example.com');
    await requestPage.selectRequestType('buy');
    await requestPage.selectPropertyType('apartment');
    await requestPage.fillCity('الرياض');
    await requestPage.fillMinBudget('300000');
    await requestPage.fillMaxBudget('600000');
    await requestPage.fillDescription('أبحث عن شقة 3 غرف');

    await requestPage.submit();
    await requestPage.expectSuccess();
  });

  test('request form is visible and has required fields', async ({ page }) => {
    await page.goto('/submit-request');
    await page.waitForURL(/\/submit-request/);
    await page.getByTestId('public-request-form').waitFor({ state: 'visible' });

    await expect(page.getByTestId('request-name')).toBeVisible();
    await expect(page.getByTestId('request-phone')).toBeVisible();
    await expect(page.getByTestId('request-submit')).toBeVisible();
  });
});
