import { expect } from '@playwright/test';
import { BasePage } from './base.page';

export class UserFormPage extends BasePage {
  // Actions - User credentials
  async fillEmail(email: string) {
    const input = this.page.getByTestId('users-input-email');
    await input.fill(email);
    await input.blur();
    await this.page.waitForTimeout(100);
  }

  async fillPassword(password: string) {
    const input = this.page.getByTestId('users-input-password');
    await input.fill(password);
    await input.blur();
    await this.page.waitForTimeout(100);
  }

  async setActive(isActive: boolean) {
    const checkbox = this.page.getByTestId('users-input-isActive');
    if (isActive) {
      await checkbox.check();
    } else {
      await checkbox.uncheck();
    }
  }

  // Actions - Person data
  async fillName(name: string) {
    const input = this.page.getByTestId('users-input-name');
    await input.fill(name);
    await input.blur();
    await this.page.waitForTimeout(100);
  }

  async fillDni(dni: string) {
    const input = this.page.getByTestId('users-input-dni');
    await input.fill(dni);
    await input.blur();
    await this.page.waitForTimeout(100);
  }

  async fillPhoneNumber(phone: string) {
    const input = this.page.getByTestId('users-input-phoneNumber');
    await input.fill(phone);
    await input.blur();
    await this.page.waitForTimeout(100);
  }

  async fillBirthday(birthday: string) {
    const input = this.page.getByTestId('users-input-birthday');
    await input.fill(birthday);
    await input.blur();
    await this.page.waitForTimeout(100);
  }

  async fillAddress(address: string) {
    const input = this.page.getByTestId('users-input-address');
    await input.fill(address);
    await input.blur();
    await this.page.waitForTimeout(100);
  }

  async fillNotes(notes: string) {
    const input = this.page.getByTestId('users-input-notes');
    await input.fill(notes);
    await input.blur();
    await this.page.waitForTimeout(100);
  }

  // Combined actions
  async fillMinimumRequiredFields(data: {
    email: string;
    password: string;
    name: string;
    dni: string;
    phoneNumber: string;
  }) {
    await this.fillEmail(data.email);
    await this.fillPassword(data.password);
    await this.fillName(data.name);
    await this.fillDni(data.dni);
    await this.fillPhoneNumber(data.phoneNumber);
  }

  async fillCompleteUserData(data: {
    email: string;
    password: string;
    isActive: boolean;
    name: string;
    dni: string;
    phoneNumber: string;
    birthday?: string;
    address?: string;
    notes?: string;
  }) {
    await this.fillEmail(data.email);
    await this.fillPassword(data.password);
    await this.setActive(data.isActive);
    await this.fillName(data.name);
    await this.fillDni(data.dni);
    await this.fillPhoneNumber(data.phoneNumber);
    if (data.birthday) await this.fillBirthday(data.birthday);
    if (data.address) await this.fillAddress(data.address);
    if (data.notes) await this.fillNotes(data.notes);
  }

  async submit() {
    await this.page.getByTestId('users-btn-submit').click();
  }

  async submitForced() {
    // Force click for testing validation when button is disabled
    await this.page.getByTestId('users-btn-submit').click({ force: true });
  }

  async triggerValidation() {
    // Fill and clear to trigger Angular validation (makes field dirty + touched)
    const input = this.page.getByTestId('users-input-email');
    await input.fill('x'); // Write something
    await input.clear(); // Clear it (marks dirty + touched)
    await input.blur(); // Ensure blur event fires
  }

  async submitAndWait() {
    await this.page.getByTestId('users-btn-submit').click();
    await this.page.getByTestId('users-modal').waitFor({ state: 'hidden' });
  }

  async cancel() {
    await this.page.getByTestId('users-btn-cancel').click();
    await this.page.getByTestId('users-modal').waitFor({ state: 'hidden' });
  }

  async fillAndSubmit(data: {
    email: string;
    password: string;
    name: string;
    dni: string;
    phoneNumber: string;
  }) {
    await this.fillMinimumRequiredFields(data);
    await this.submitAndWait();
  }

  // Assertions
  async expectModalOpen(title?: string | RegExp) {
    const modal = this.page.getByTestId('users-modal');
    await expect(modal).toBeVisible();
    if (title) {
      await expect(modal.locator('.modal-title').first()).toContainText(title);
    }
  }

  async expectModalClosed() {
    await expect(this.page.getByTestId('users-modal')).not.toBeVisible();
  }

  async expectValidationError(message: string | RegExp, fieldTestId?: string) {
    // Validation errors appear as siblings to the input
    const input = fieldTestId
      ? this.page.getByTestId(fieldTestId)
      : this.page.getByTestId('users-input-email');
    const errorMessage = input
      .locator('xpath=following-sibling::p[contains(@class, "text-red")]')
      .first();
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(message);
  }

  async expectNoValidationError(fieldTestId?: string) {
    const input = fieldTestId
      ? this.page.getByTestId(fieldTestId)
      : this.page.getByTestId('users-input-email');
    const errorMessage = input
      .locator('xpath=following-sibling::p[contains(@class, "text-red")]')
      .first();
    await expect(errorMessage).not.toBeVisible();
  }

  async expectAlertError(message?: string | RegExp) {
    const alertError = this.page.getByTestId('users-modal').locator('.alert-error');
    await expect(alertError).toBeVisible();
    if (message) {
      await expect(alertError).toContainText(message);
    }
  }

  async expectSubmitDisabled() {
    await expect(this.page.getByTestId('users-btn-submit')).toBeDisabled();
  }

  async expectSubmitEnabled() {
    await expect(this.page.getByTestId('users-btn-submit')).toBeEnabled();
  }

  async expectFormTitle(title: string | RegExp) {
    const modalTitle = this.page.getByTestId('users-modal').locator('.modal-title').first();
    await expect(modalTitle).toContainText(title);
  }

  async expectEmailValue(value: string) {
    await expect(this.page.getByTestId('users-input-email')).toHaveValue(value);
  }

  async expectNameValue(value: string) {
    await expect(this.page.getByTestId('users-input-name')).toHaveValue(value);
  }

  async expectDniValue(value: string) {
    await expect(this.page.getByTestId('users-input-dni')).toHaveValue(value);
  }
}
