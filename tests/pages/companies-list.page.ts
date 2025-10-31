import { expect, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class CompaniesListPage extends BasePage {
  // Actions
  async openNewForm() {
    await this.page.getByRole('button', { name: /new company/i }).click();
    await this.page.getByTestId('company-form-modal').waitFor({ state: 'visible' });
  }

  async searchCompany(term: string) {
    await this.page.getByTestId('companies-search-input').fill(term);
    await this.page.waitForTimeout(300); // Debounce
  }

  async getRowByName(name: string): Promise<Locator> {
    // Use filter with getByText to handle special characters correctly
    return this.page.getByTestId('companies-table').locator('tbody tr').filter({ hasText: name });
  }

  async editCompany(name: string) {
    const row = await this.getRowByName(name);
    await row.getByRole('button', { name: /edit/i }).click();
    await this.page.waitForURL(`/companies/**`);
  }

  async deleteCompany(name: string) {
    const row = await this.getRowByName(name);
    await row.getByRole('button', { name: /delete/i }).click();
    await expect(this.page.getByTestId('company-delete-modal')).toBeVisible();
  }

  async confirmDelete() {
    await this.page.getByTestId('delete-confirm-button').click();
    await this.page.getByTestId('company-delete-modal').waitFor({ state: 'hidden' });
  }

  async cancelDelete() {
    await this.page.getByTestId('delete-cancel-button').click();
    await this.page.getByTestId('company-delete-modal').waitFor({ state: 'hidden' });
  }

  async selectRow(name: string) {
    const row = await this.getRowByName(name);
    await row.locator('input[type="checkbox"]').check();
  }

  async selectAllRows() {
    await this.page.getByTestId('companies-table').locator('thead input[type="checkbox"]').check();
  }

  async bulkDelete() {
    await this.page.getByRole('button', { name: /delete selected/i }).click();
    await expect(this.page.getByTestId('company-delete-modal')).toBeVisible();
    await this.confirmDelete();
  }

  async waitForTableLoad() {
    await this.page.getByTestId('companies-table').waitFor({ state: 'visible' });
  }

  // Assertions
  async expectCompanyInList(name: string) {
    const row = await this.getRowByName(name);
    await expect(row).toBeVisible();
  }

  async expectCompanyNotInList(name: string) {
    const row = await this.getRowByName(name);
    await expect(row).not.toBeVisible();
  }

  async expectEmptyState() {
    await expect(
      this.page.getByTestId('companies-table').getByText(/no companies found/i),
    ).toBeVisible();
  }

  async expectRowCount(count: number) {
    // Only count data rows (excludes loading and empty state rows)
    const rows = this.page.getByTestId('companies-table').locator('tbody tr.table-row');
    await expect(rows).toHaveCount(count);
  }

  async expectDeleteModalVisible() {
    await expect(this.page.getByTestId('company-delete-modal')).toBeVisible();
  }

  async expectDeleteModalHidden() {
    await expect(this.page.getByTestId('company-delete-modal')).not.toBeVisible();
  }

  async expectPageTitle(title: string | RegExp) {
    await expect(this.page.getByRole('heading', { level: 1 })).toContainText(title);
  }
}
