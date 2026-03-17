import type { Page } from '@playwright/test';

export class PropertyFormPage {
  constructor(private readonly page: Page) {}

  async gotoNew() {
    await this.page.goto('/properties/new');
  }

  async gotoEdit(id: string) {
    await this.page.goto(`/properties/${id}/edit`);
  }

  async expectLoaded() {
    await this.page.getByTestId('property-form-page').waitFor({ state: 'visible' });
  }

  async fillRegaLicense(value: string) {
    await this.page.getByTestId('property-rega-license').fill(value);
  }

  async fillTitleAr(value: string) {
    await this.page.getByTestId('property-title-ar').fill(value);
  }

  async selectPropertyType(value: string) {
    await this.page.getByTestId('property-type').selectOption(value);
  }

  async selectTransactionType(value: string) {
    await this.page.getByTestId('property-transaction-type').selectOption(value);
  }

  async selectCity(value: string) {
    await this.page.getByTestId('property-city').selectOption(value);
  }

  async fillDistrict(value: string) {
    const districtSelect = this.page.getByTestId('property-district');
    const count = await districtSelect.count();
    if (count > 0) {
      const tagName = await districtSelect.first().evaluate((el) => el.tagName);
      if (tagName === 'SELECT') {
        await districtSelect.first().selectOption({ value });
      } else {
        await districtSelect.first().fill(value);
      }
    }
  }

  async fillPrice(value: string | number) {
    await this.page.getByTestId('property-price').fill(String(value));
  }

  async fillArea(value: string | number) {
    await this.page.getByTestId('property-area').fill(String(value));
  }

  async submit() {
    await this.page.getByTestId('property-form-submit').click();
  }

  async expectRedirectToPropertyDetail() {
    await this.page.waitForURL(/\/properties\/[^/]+$/);
  }
}
