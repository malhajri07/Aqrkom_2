import type { Page } from '@playwright/test';

export class PropertyListPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/properties');
  }

  async expectLoaded() {
    await this.page.getByTestId('properties-page').waitFor({ state: 'visible' });
  }

  async clickAddListing() {
    await this.page.getByRole('link', { name: /إضافة إعلان|Add Listing/i }).click();
  }

  async search(query: string) {
    await this.page.getByPlaceholder(/بحث|Search/i).fill(query);
  }

  async setFilterStatus(status: string) {
    await this.page.locator('select').first().selectOption(status);
  }
}
