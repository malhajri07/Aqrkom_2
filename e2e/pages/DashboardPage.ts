import type { Page } from '@playwright/test';

export class DashboardPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/');
  }

  async expectLoaded() {
    await this.page.getByTestId('dashboard-page').waitFor({ state: 'visible' });
  }

  async navigateToProperties() {
    await this.page.click('a[href="/properties"]');
  }

  async navigateToPropertiesNew() {
    await this.page.click('a[href="/properties/new"]');
  }

  async navigateToRequests() {
    await this.page.click('a[href="/requests"]');
  }

  async navigateToTransactions() {
    await this.page.click('a[href="/transactions"]');
  }

  async navigateToContacts() {
    await this.page.click('a[href="/contacts"]');
  }

  async navigateToPipeline() {
    await this.page.click('a[href="/pipeline"]');
  }

  async expectPipelineChartVisible() {
    await this.page.getByTestId('pipeline-chart').waitFor({ state: 'visible' });
  }
}
