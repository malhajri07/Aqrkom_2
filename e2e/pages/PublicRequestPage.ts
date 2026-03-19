import type { Page } from '@playwright/test';

export class PublicRequestPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/submit-request');
    await this.page.waitForURL(/\/submit-request/);
  }

  async expectLoaded() {
    await this.page.getByTestId('public-request-form').waitFor({ state: 'visible', timeout: 15000 });
  }

  async fillName(value: string) {
    await this.page.getByTestId('request-name').fill(value);
  }

  async fillPhone(value: string) {
    await this.page.getByTestId('request-phone').fill(value);
  }

  async fillEmail(value: string) {
    await this.page.getByTestId('request-email').fill(value);
  }

  async selectRequestType(value: string) {
    await this.page.getByTestId('request-type').selectOption(value);
  }

  async selectPropertyType(value: string) {
    await this.page.getByTestId('request-property-type').selectOption(value);
  }

  async fillCity(value: string) {
    await this.page.getByTestId('request-city').fill(value);
  }

  async fillMinBudget(value: string | number) {
    await this.page.getByTestId('request-min-budget').fill(String(value));
  }

  async fillMaxBudget(value: string | number) {
    await this.page.getByTestId('request-max-budget').fill(String(value));
  }

  async fillDescription(value: string) {
    await this.page.getByTestId('request-description').fill(value);
  }

  async submit() {
    await this.page.getByTestId('request-submit').click();
  }

  async expectSuccess() {
    await this.page.getByTestId('request-success').waitFor({ state: 'visible' });
  }
}
