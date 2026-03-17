import type { Page } from '@playwright/test';

export class TransactionsPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/transactions');
  }

  async expectLoaded() {
    await this.page.getByTestId('transactions-page').waitFor({ state: 'visible' });
  }

  async clickNewTransaction() {
    await this.page.getByRole('button', { name: /صفقة جديدة|New Transaction/i }).click();
  }

  async selectProperty(propertyTitle: string) {
    await this.page.locator('select').filter({ has: this.page.locator(`option:has-text("${propertyTitle}")`) }).selectOption({ label: new RegExp(propertyTitle, 'i') });
  }

  async selectClient(clientName: string) {
    await this.page.locator('select').nth(2).selectOption({ label: new RegExp(clientName, 'i') });
  }

  async fillListPrice(value: string | number) {
    const priceInput = this.page.locator('input[type="text"]').filter({ has: this.page.locator('[class*="price"]') }).first();
    if (await priceInput.count() > 0) {
      await priceInput.fill(String(value));
    } else {
      await this.page.getByTestId('transaction-list-price').fill(String(value));
    }
  }

  async submitCreate() {
    await this.page.getByRole('button', { name: /إنشاء|Create/i }).click();
  }

  async expectTransactionInList() {
    await this.page.locator('table tbody tr').first().waitFor({ state: 'visible' });
  }
}
