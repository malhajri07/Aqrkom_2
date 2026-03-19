import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { PropertyFormPage } from '../../pages/PropertyFormPage';

test.describe('Create Property Listing', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('broker@aqarkom.com', 'Test123!');
    await loginPage.expectRedirectToDashboard();
  });

  test('broker can create a new property listing', async ({ page }) => {
    const formPage = new PropertyFormPage(page);
    await formPage.gotoNew();
    await formPage.expectLoaded();

    await formPage.fillRegaLicense('REGA-TEST-12345');
    await formPage.fillTitleAr('شقة للبيع في الرياض');
    await formPage.selectPropertyType('apartment');
    await formPage.selectTransactionType('sale');
    await formPage.selectCity('riyadh');
    await formPage.fillDistrict('النرجس');
    await formPage.fillPrice('500000');
    await formPage.fillArea('120');

    await formPage.submit();
    await formPage.expectRedirectToPropertyDetail();
  });

  test('property form shows required validation', async ({ page }) => {
    await page.goto('/properties/new');
    await page.waitForURL(/\/properties\/new/);
    await page.getByTestId('property-rega-license').waitFor({ state: 'visible' });

    await page.getByTestId('property-form-submit').click();
    await expect(page.getByTestId('property-form')).toBeVisible();
  });
});
