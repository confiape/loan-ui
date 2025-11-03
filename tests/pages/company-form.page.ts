import { expect } from '@playwright/test';
import { BasePage } from './base.page';

export class CompanyFormPage extends BasePage {
  // Actions
  async fillCompanyName(name: string) {
    const input = this.page.getByTestId('companies-input-name');
    await input.fill(name);
    await input.blur(); // Trigger validation with updateOn: 'blur'
    await this.page.waitForTimeout(100); // Wait for Angular to process validation
  }

  async submit() {
    await this.page.getByTestId('companies-btn-submit').click();
  }

  async submitForced() {
    // Force click for testing validation when button is disabled
    await this.page.getByTestId('companies-btn-submit').click({ force: true });
  }

  async triggerValidation() {
    // Fill and clear to trigger Angular validation (makes field dirty + touched)
    const input = this.page.getByTestId('companies-input-name');
    await input.fill('x'); // Write something
    await input.clear(); // Clear it (marks dirty + touched)
    await input.blur(); // Ensure blur event fires
  }

  async submitAndWait() {
    await this.page.getByTestId('companies-btn-submit').click();
    await this.page.getByTestId('companies-modal').waitFor({ state: 'hidden' });
  }

  async cancel() {
    await this.page.getByTestId('companies-btn-cancel').click();
    await this.page.getByTestId('companies-modal').waitFor({ state: 'hidden' });
  }

  async fillAndSubmit(name: string) {
    await this.fillCompanyName(name);
    await this.submitAndWait();
  }

  // Assertions
  async expectModalOpen(title?: string | RegExp) {
    const modal = this.page.getByTestId('companies-modal');
    await expect(modal).toBeVisible();
    if (title) {
      await expect(modal.locator('.modal-title').first()).toContainText(title);
    }
  }

  async expectModalClosed() {
    await expect(this.page.getByTestId('companies-modal')).not.toBeVisible();
  }

  async expectValidationError(message: string | RegExp) {
    // Validation errors appear as siblings to the input, not with a specific testId
    const input = this.page.getByTestId('companies-input-name');
    const errorMessage = input.locator('xpath=following-sibling::p[contains(@class, "text-red")]').first();
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(message);
  }

  async expectNoValidationError() {
    const input = this.page.getByTestId('companies-input-name');
    const errorMessage = input.locator('xpath=following-sibling::p[contains(@class, "text-red")]').first();
    await expect(errorMessage).not.toBeVisible();
  }

  async expectAlertError(message?: string | RegExp) {
    const alertError = this.page.getByTestId('companies-modal').locator('.alert-error');
    await expect(alertError).toBeVisible();
    if (message) {
      await expect(alertError).toContainText(message);
    }
  }

  async expectSubmitDisabled() {
    await expect(this.page.getByTestId('companies-btn-submit')).toBeDisabled();
  }

  async expectSubmitEnabled() {
    await expect(this.page.getByTestId('companies-btn-submit')).toBeEnabled();
  }

  async expectFormTitle(title: string | RegExp) {
    const modalTitle = this.page.getByTestId('companies-modal').locator('.modal-title').first();
    await expect(modalTitle).toContainText(title);
  }

  async expectNameValue(value: string) {
    await expect(this.page.getByTestId('companies-input-name')).toHaveValue(value);
  }
}
