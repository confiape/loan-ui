import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { testUsers } from '../../fixtures/mock-data';

test.describe('Authentication', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto('/login');
  });

  test('should display login page', async () => {
    await loginPage.expectLoginPage();
    await loginPage.expectEmailVisible();
    await loginPage.expectPasswordVisible();
    await loginPage.expectSubmitVisible();
  });

  test('should login with valid credentials', async () => {
    await loginPage.loginAndWait(testUsers.user.email, testUsers.user.password);
    await loginPage.expectRedirectToDashboard();
  });

  test('should show error with invalid credentials', async () => {
    await loginPage.login('invalid@test.com', 'wrongpassword');
    await loginPage.expectLoginError();
  });

  test('should validate required fields', async () => {
    // Submit button should be disabled when fields are empty
    await expect(loginPage.page.getByTestId('login-submit-button')).toBeDisabled();

    // Fill only email
    await loginPage.page.getByTestId('login-email-input').fill('test@example.com');
    await expect(loginPage.page.getByTestId('login-submit-button')).toBeDisabled();

    // Clear email - button should still be disabled
    await loginPage.page.getByTestId('login-email-input').clear();
    await expect(loginPage.page.getByTestId('login-submit-button')).toBeDisabled();
  });

  test('should redirect to dashboard if already logged in', async ({ page }) => {
    // Login first
    await loginPage.loginAndWait(testUsers.user.email, testUsers.user.password);

    // Try to access login page again
    await page.goto('/login');

    // Should redirect to dashboard
    await page.waitForURL('/dashboard');
  });
});
