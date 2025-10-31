import { test, expect } from '../../fixtures/auth.fixture';
import { CompaniesListPage } from '../../pages/companies-list.page';
import { CompanyFormPage } from '../../pages/company-form.page';
import { testCompanies, generateCompanyName } from '../../fixtures/mock-data';

test.describe('Companies CRUD', () => {
  let listPage: CompaniesListPage;
  let formPage: CompanyFormPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    listPage = new CompaniesListPage(authenticatedPage);
    formPage = new CompanyFormPage(authenticatedPage);
    await listPage.goto('/companies');
    await listPage.waitForTableLoad();
  });

  test.describe('Create', () => {
    test('should create new company with valid data', async () => {
      const companyName = generateCompanyName();

      await listPage.openNewForm();
      await formPage.expectModalOpen(/new company/i);

      await formPage.fillCompanyName(companyName);
      await formPage.submitAndWait();

      await formPage.expectModalClosed();
      await listPage.expectCompanyInList(companyName);
    });

    test('should validate required fields', async () => {
      await listPage.openNewForm();
      await formPage.expectModalOpen(/new company/i);

      // Submit button should be disabled when form is empty
      await formPage.expectSubmitDisabled();

      // Trigger validation by touching the field
      await formPage.triggerValidation();

      // Should show validation error
      await formPage.expectValidationError(/required/i);
      await formPage.expectModalOpen(); // Modal should remain open
    });

    test('should validate minimum length', async () => {
      await listPage.openNewForm();

      // Fill with short name (1 char) - blur happens automatically in fillCompanyName
      await formPage.fillCompanyName(testCompanies.short.name);

      // Should show validation error and button should be disabled
      await formPage.expectValidationError(/min.*2/i);
      await formPage.expectSubmitDisabled();
    });

    test('should cancel creation', async () => {
      await listPage.openNewForm();
      await formPage.expectModalOpen(/new company/i);

      await formPage.fillCompanyName('Company to Cancel');
      await formPage.cancel();

      await formPage.expectModalClosed();
      await listPage.expectCompanyNotInList('Company to Cancel');
    });
  });

  test.describe('Read', () => {
    test('should display companies list', async () => {
      await listPage.expectPageTitle(/companies/i);
      await listPage.waitForTableLoad();
    });

    test('should search companies by name', async ({ authenticatedPage }) => {
      // Create a searchable company first
      const searchName = generateCompanyName('Searchable');
      await listPage.openNewForm();
      await formPage.fillAndSubmit(searchName);

      // Search for it
      await listPage.searchCompany(searchName);
      await listPage.expectCompanyInList(searchName);
    });

    test('should filter out non-matching companies in search', async ({ authenticatedPage }) => {
      // Mock empty response for non-matching search
      await authenticatedPage.route('**/api/companies*', (route) => {
        const url = route.request().url();
        if (url.includes('NonExistentCompany12345')) {
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([]),
          });
        } else {
          route.continue();
        }
      });

      await listPage.searchCompany('NonExistentCompany12345');
      // Should show empty state or no matching rows
      await listPage.expectRowCount(0);
    });
  });

  test.describe('Update', () => {
    test('should edit existing company', async () => {
      // Create company to edit
      const originalName = generateCompanyName('Original');
      await listPage.openNewForm();
      await formPage.fillAndSubmit(originalName);

      // Edit it
      await listPage.editCompany(originalName);
      await formPage.expectModalOpen(/edit company/i);

      const updatedName = generateCompanyName('Updated');
      await formPage.fillCompanyName(updatedName);
      await formPage.submitAndWait();

      await formPage.expectModalClosed();
      await listPage.expectCompanyInList(updatedName);
      await listPage.expectCompanyNotInList(originalName);
    });

    test('should show edit modal with existing data', async () => {
      // Create company
      const companyName = generateCompanyName();
      await listPage.openNewForm();
      await formPage.fillAndSubmit(companyName);

      // Open edit
      await listPage.editCompany(companyName);
      await formPage.expectModalOpen(/edit/i);

      // Name should be pre-filled
      await formPage.expectNameValue(companyName);
    });

    test('should validate on update', async () => {
      // Create company
      const companyName = generateCompanyName();
      await listPage.openNewForm();
      await formPage.fillAndSubmit(companyName);

      // Edit with invalid data (1 char) - blur happens automatically
      await listPage.editCompany(companyName);
      await formPage.expectModalOpen(/edit company/i); // Wait for modal to open
      await formPage.fillCompanyName('A'); // Too short - triggers validation on blur

      // Should show validation error and button should be disabled
      await formPage.expectValidationError(/min.*2/i);
      await formPage.expectSubmitDisabled();
    });
  });

  test.describe('Delete', () => {
    test('should delete single company', async () => {
      // Create company to delete
      const companyName = generateCompanyName('ToDelete');
      await listPage.openNewForm();
      await formPage.fillAndSubmit(companyName);

      // Delete it
      await listPage.deleteCompany(companyName);
      await listPage.expectDeleteModalVisible();
      await listPage.confirmDelete();

      await listPage.expectDeleteModalHidden();
      await listPage.expectCompanyNotInList(companyName);
    });

    test('should cancel delete', async () => {
      // Create company
      const companyName = generateCompanyName();
      await listPage.openNewForm();
      await formPage.fillAndSubmit(companyName);

      // Try to delete but cancel
      await listPage.deleteCompany(companyName);
      await listPage.expectDeleteModalVisible();
      await listPage.cancelDelete();

      await listPage.expectDeleteModalHidden();
      await listPage.expectCompanyInList(companyName);
    });

    test('should bulk delete selected companies', async () => {
      // Create multiple companies
      const company1 = generateCompanyName('Bulk1');
      const company2 = generateCompanyName('Bulk2');

      await listPage.openNewForm();
      await formPage.fillAndSubmit(company1);

      await listPage.openNewForm();
      await formPage.fillAndSubmit(company2);

      // Select both
      await listPage.selectRow(company1);
      await listPage.selectRow(company2);

      // Bulk delete
      await listPage.bulkDelete();

      await listPage.expectCompanyNotInList(company1);
      await listPage.expectCompanyNotInList(company2);
    });
  });

  test.describe('Edge Cases', () => {
    test('should reject special characters in company name', async () => {
      const specialName = `Company & Co.`;
      await listPage.openNewForm();
      await formPage.fillCompanyName(specialName);

      // Should show validation error for invalid pattern
      await formPage.expectValidationError(/does not match/i);
      await formPage.expectSubmitDisabled();
    });

    test('should reject very long company names', async () => {
      const longName = 'A'.repeat(20) + ' Company'; // More than 15 chars
      await listPage.openNewForm();
      await formPage.fillCompanyName(longName);

      // Should show validation error for max length
      await formPage.expectValidationError(/maximum.*15/i);
      await formPage.expectSubmitDisabled();
    });

    test('should accept valid company names with numbers and spaces', async () => {
      const validName = generateCompanyName('Test123');
      await listPage.openNewForm();
      await formPage.fillAndSubmit(validName);

      await listPage.expectCompanyInList(validName);
    });
  });
});
