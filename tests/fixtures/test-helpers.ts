import { Page, expect } from '@playwright/test';

/**
 * Wait for table to finish loading
 */
export async function waitForTableLoad(page: Page) {
  await page.waitForSelector('app-table', { state: 'visible' });
  await page.waitForSelector('app-table [role="row"]', { state: 'visible' });
}

/**
 * Search in table toolbar
 */
export async function searchInTable(page: Page, term: string) {
  const searchInput = page.getByPlaceholder(/search/i);
  await searchInput.fill(term);
  await page.waitForTimeout(300); // Debounce
}

/**
 * Get number of rows in table
 */
export async function getTableRowCount(page: Page) {
  return await page.locator('app-table tbody tr').count();
}

/**
 * Fill form fields by formControlName
 */
export async function fillForm(page: Page, formData: Record<string, string>) {
  for (const [field, value] of Object.entries(formData)) {
    await page.locator(`[formControlName="${field}"]`).fill(value);
  }
}

/**
 * Wait for modal to open
 */
export async function waitForModal(page: Page, titlePattern?: string | RegExp) {
  const modal = page.locator('app-modal');
  await modal.waitFor({ state: 'visible' });

  if (titlePattern) {
    const title = modal.locator('[class*="text-xl"]').first();
    await expect(title).toContainText(titlePattern);
  }
}

/**
 * Wait for modal to close
 */
export async function waitForModalClose(page: Page) {
  await page.locator('app-modal').waitFor({ state: 'hidden' });
}

/**
 * Click button with loading state handling
 */
export async function clickButtonAndWait(page: Page, buttonText: string | RegExp) {
  const button = page.getByRole('button', { name: buttonText });
  await button.click();

  // Wait for button to stop being disabled (loading state)
  await expect(button).not.toBeDisabled({ timeout: 5000 });
}
