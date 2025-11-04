import { expect, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class UsersListPage extends BasePage {
  // Actions
  async openNewForm() {
    await this.page.getByRole('button', { name: /new user/i }).click();
    await this.page.getByTestId('users-modal').waitFor({ state: 'visible' });
  }

  async searchUser(term: string) {
    await this.page.getByTestId('users-search-input').fill(term);
    await this.page.waitForTimeout(300); // Debounce
  }

  async clearSearch() {
    await this.page.getByTestId('users-search-input').clear();
    await this.page.waitForTimeout(300); // Debounce
  }

  async getRowByEmail(email: string): Promise<Locator> {
    // Use filter with getByText to handle special characters correctly
    return this.page.getByTestId('users-table').locator('tbody tr').filter({ hasText: email });
  }

  async getRowByName(name: string): Promise<Locator> {
    // Use filter with getByText to handle special characters correctly
    return this.page.getByTestId('users-table').locator('tbody tr').filter({ hasText: name });
  }

  async editUser(email: string) {
    // Search for the user first to handle pagination
    await this.searchUser(email);
    const row = await this.getRowByEmail(email);
    await row.getByRole('button', { name: /edit/i }).click();
    await this.page.waitForURL(`/users/**`);
  }

  async deleteUser(email: string) {
    // Search for the user first to handle pagination
    await this.searchUser(email);
    const row = await this.getRowByEmail(email);
    await row.getByRole('button', { name: /delete/i }).click();
    await expect(this.page.getByTestId('users-delete-modal')).toBeVisible();
  }

  async confirmDelete() {
    await this.page.getByTestId('users-btn-confirm-delete').click();
    await this.page.getByTestId('users-delete-modal').waitFor({ state: 'hidden' });
  }

  async cancelDelete() {
    await this.page.getByTestId('users-btn-cancel-delete').click();
    await this.page.getByTestId('users-delete-modal').waitFor({ state: 'hidden' });
  }

  async selectRow(email: string) {
    // Search for the user first to handle pagination
    await this.searchUser(email);
    const row = await this.getRowByEmail(email);
    await row.locator('input[type="checkbox"]').check();
  }

  async selectAllRows() {
    await this.page.getByTestId('users-table').locator('thead input[type="checkbox"]').check();
  }

  async bulkDelete() {
    await this.page.getByRole('button', { name: /delete selected/i }).click();
    await expect(this.page.getByTestId('users-delete-modal')).toBeVisible();
    await this.confirmDelete();
  }

  async waitForTableLoad() {
    await this.page.getByTestId('users-table').waitFor({ state: 'visible' });
  }

  // Assertions
  async expectUserInList(email: string) {
    // Search for the user first to handle pagination
    await this.searchUser(email);
    const row = await this.getRowByEmail(email);
    await expect(row).toBeVisible();
  }

  async expectUserByNameInList(name: string) {
    // Search for the user first to handle pagination
    await this.searchUser(name);
    const row = await this.getRowByName(name);
    await expect(row).toBeVisible();
  }

  async expectUserNotInList(email: string) {
    const row = await this.getRowByEmail(email);
    await expect(row).not.toBeVisible();
  }

  async expectEmptyState() {
    await expect(
      this.page.getByTestId('users-table').getByText(/no users found/i),
    ).toBeVisible();
  }

  async expectRowCount(count: number) {
    // Only count data rows (excludes loading and empty state rows)
    const rows = this.page.getByTestId('users-table').locator('tbody tr.table-row');
    await expect(rows).toHaveCount(count);
  }

  async expectDeleteModalVisible() {
    await expect(this.page.getByTestId('users-delete-modal')).toBeVisible();
  }

  async expectDeleteModalHidden() {
    await expect(this.page.getByTestId('users-delete-modal')).not.toBeVisible();
  }

  async expectPageTitle(title: string | RegExp) {
    await expect(this.page.getByRole('heading', { level: 1 })).toContainText(title);
  }
}
