import type { Page } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.page.getByTestId('login-email').fill(email);
    await this.page.getByTestId('login-password').fill(password);
    await this.page.getByTestId('login-submit').click();
  }

  async expectRedirectToDashboard() {
    await this.page.waitForURL(/\/(dashboard)?$/);
  }

  async expectErrorVisible() {
    await this.page.getByTestId('login-error').waitFor({ state: 'visible' });
  }

  async expectNafathButtonVisible() {
    await this.page.getByTestId('nafath-login-btn').waitFor({ state: 'visible' });
  }
}
