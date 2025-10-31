import { expect } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  // Actions
  async login(email: string, password: string) {
    await this.page.getByTestId('login-email-input').fill(email);
    await this.page.getByTestId('login-password-input').fill(password);
    await this.page.getByTestId('login-submit-button').click();
    await this.page.waitForTimeout(500); // Wait for HTTP request to complete
  }

  async loginAndWait(email: string, password: string) {
    await this.login(email, password);
    await this.page.waitForURL('/dashboard');
  }

  async triggerValidation() {
    // Try to submit the form to trigger validation
    const submitButton = this.page.getByTestId('login-submit-button');
    await submitButton.click({ force: true });
    await this.page.waitForTimeout(100); // Wait for Angular to process validation
  }

  // Assertions
  async expectLoginError() {
    await this.expectAlert('error');
  }

  async expectRedirectToDashboard() {
    await this.expectUrl('/dashboard');
  }

  async expectLoginPage() {
    await expect(this.page.getByTestId('login-submit-button')).toBeVisible();
  }

  async expectEmailVisible() {
    await expect(this.page.getByTestId('login-email-input')).toBeVisible();
  }

  async expectPasswordVisible() {
    await expect(this.page.getByTestId('login-password-input')).toBeVisible();
  }

  async expectSubmitVisible() {
    await expect(this.page.getByTestId('login-submit-button')).toBeVisible();
  }
}
