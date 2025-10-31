import { test as base, Page } from '@playwright/test';

type AuthFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Navigate to login
    await page.goto('/login');

    // Fill login form
    await page.getByTestId('login-email-input').fill('admin@confia.com');
    await page.getByTestId('login-password-input').fill('password123');

    // Submit and wait for redirect
    await page.getByTestId('login-submit-button').click();
    await page.waitForURL('/dashboard');

    // Use authenticated page
    await use(page);
  },
});

export { expect } from '@playwright/test';
