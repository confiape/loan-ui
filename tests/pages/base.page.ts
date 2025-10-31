import { Page, expect } from '@playwright/test';

export class BasePage {
  constructor(protected page: Page) {}

  async goto(path: string) {
    await this.page.goto(path);
  }

  async waitForLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  async clickButton(text: string | RegExp) {
    await this.page.getByRole('button', { name: text }).click();
  }

  async fillInput(label: string | RegExp, value: string) {
    await this.page.getByLabel(label).fill(value);
  }

  async expectAlert(type: 'error' | 'success' | 'warning' | 'info', message?: string) {
    // Try alert first, then toast (different components use different patterns)
    const alert = this.page.locator(`.alert-${type}, .toast-${type}`).first();
    await expect(alert).toBeVisible({ timeout: 10000 }); // Toasts may take time to appear
    if (message) {
      await expect(alert).toContainText(message);
    }
  }

  async expectUrl(path: string | RegExp) {
    await this.page.waitForURL(path);
  }

  async expectPageTitle(title: string | RegExp) {
    const heading = this.page.getByRole('heading', { level: 1 });
    await expect(heading).toContainText(title);
  }
}
