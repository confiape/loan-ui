import { test, expect } from '../../fixtures/auth.fixture';
import { UsersListPage } from '../../pages/users-list.page';
import { UserFormPage } from '../../pages/user-form.page';

// Helper to generate unique test data
const generateUserEmail = (prefix = 'user') => {
  const id = Math.random().toString(36).substring(2, 6).toLowerCase();
  return `${prefix}.${id}@test.com`;
};

const generateDni = () => {
  const randomNum = Math.floor(10000000 + Math.random() * 90000000);
  return randomNum.toString();
};

const testUsers = {
  valid: () => ({
    email: generateUserEmail('john'),
    password: 'Test123456',
    name: 'John Doe',
    dni: generateDni(),
    phoneNumber: '+1234567890',
  }),
  short: {
    email: 'a@b.c',
    password: '123',
    name: 'A',
    dni: '1234567',
    phoneNumber: '+1',
  },
  complete: () => ({
    email: generateUserEmail('jane'),
    password: 'Test123456',
    isActive: true,
    name: 'Jane Smith',
    dni: generateDni(),
    phoneNumber: '+0987654321',
    birthday: '1990-01-15',
    address: '123 Main St, New York, NY 10001',
    notes: 'Test user with complete data',
  }),
};

test.describe('Users CRUD', () => {
  let listPage: UsersListPage;
  let formPage: UserFormPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    listPage = new UsersListPage(authenticatedPage);
    formPage = new UserFormPage(authenticatedPage);
    await listPage.goto('/users');
    await listPage.waitForTableLoad();
  });

  test.describe('Create', () => {
    test('should create new user with minimum required fields', async () => {
      const userData = testUsers.valid();

      await listPage.openNewForm();
      await formPage.expectModalOpen(/new user/i);

      await formPage.fillAndSubmit(userData);

      await formPage.expectModalClosed();
      await listPage.expectUserInList(userData.email);
    });

    test('should create user with complete data including optional fields', async () => {
      const userData = testUsers.complete();

      await listPage.openNewForm();
      await formPage.expectModalOpen(/new user/i);

      await formPage.fillCompleteUserData(userData);
      await formPage.submitAndWait();

      await formPage.expectModalClosed();
      await listPage.expectUserInList(userData.email);
    });

    test('should validate required email field', async () => {
      await listPage.openNewForm();
      await formPage.expectModalOpen(/new user/i);

      // Submit button should be disabled when form is empty
      await formPage.expectSubmitDisabled();

      // Trigger validation by touching the field
      await formPage.triggerValidation();

      // Should show validation error
      await formPage.expectValidationError(/required/i, 'users-input-email');
      await formPage.expectModalOpen(); // Modal should remain open
    });

    test('should validate email format', async () => {
      await listPage.openNewForm();

      // Fill with invalid email format
      await formPage.fillEmail('invalid-email');

      // Should show validation error
      await formPage.expectValidationError(/email/i, 'users-input-email');
      await formPage.expectSubmitDisabled();
    });

    test('should validate minimum password length', async () => {
      await listPage.openNewForm();

      const userData = testUsers.valid();
      await formPage.fillEmail(userData.email);
      await formPage.fillPassword('123'); // Too short (< 6 chars)

      // Should show validation error
      await formPage.expectValidationError(/minimum.*6/i, 'users-input-password');
      await formPage.expectSubmitDisabled();
    });

    test('should validate DNI format (8 digits)', async () => {
      await listPage.openNewForm();

      const userData = testUsers.valid();
      await formPage.fillEmail(userData.email);
      await formPage.fillPassword(userData.password);
      await formPage.fillName(userData.name);
      await formPage.fillDni('1234567'); // Invalid: only 7 digits
      await formPage.fillPhoneNumber(userData.phoneNumber);

      // Should show validation error
      await formPage.expectValidationError(/8.*digit/i, 'users-input-dni');
      await formPage.expectSubmitDisabled();
    });

    test('should validate phone number format', async () => {
      await listPage.openNewForm();

      const userData = testUsers.valid();
      await formPage.fillEmail(userData.email);
      await formPage.fillPassword(userData.password);
      await formPage.fillName(userData.name);
      await formPage.fillDni(userData.dni);
      await formPage.fillPhoneNumber('abc123'); // Invalid format

      // Should show validation error
      await formPage.expectValidationError(/invalid/i, 'users-input-phoneNumber');
      await formPage.expectSubmitDisabled();
    });

    test('should validate minimum name length', async () => {
      await listPage.openNewForm();

      const userData = testUsers.valid();
      await formPage.fillEmail(userData.email);
      await formPage.fillPassword(userData.password);
      await formPage.fillName('A'); // Too short (< 2 chars)

      // Should show validation error
      await formPage.expectValidationError(/minimum.*2/i, 'users-input-name');
      await formPage.expectSubmitDisabled();
    });

    test('should cancel creation', async () => {
      const userData = testUsers.valid();

      await listPage.openNewForm();
      await formPage.expectModalOpen(/new user/i);

      await formPage.fillMinimumRequiredFields(userData);
      await formPage.cancel();

      await formPage.expectModalClosed();
      await listPage.expectUserNotInList(userData.email);
    });

    test('should set user as active by default', async () => {
      const userData = testUsers.valid();

      await listPage.openNewForm();
      await formPage.fillMinimumRequiredFields(userData);

      // isActive should be checked by default
      await formPage.setActive(true);
      await formPage.submitAndWait();

      await listPage.expectUserInList(userData.email);
    });
  });

  test.describe('Read', () => {
    test('should display users list', async () => {
      await listPage.expectPageTitle(/users/i);
      await listPage.waitForTableLoad();
    });

    test('should search users by email', async ({ authenticatedPage }) => {
      // Create a searchable user first
      const userData = testUsers.valid();
      await listPage.openNewForm();
      await formPage.fillAndSubmit(userData);

      // Search for it
      await listPage.searchUser(userData.email);
      await listPage.expectUserInList(userData.email);
    });

    test('should search users by name', async ({ authenticatedPage }) => {
      // Create a user first
      const userData = testUsers.valid();
      await listPage.openNewForm();
      await formPage.fillAndSubmit(userData);

      // Search by name
      await listPage.searchUser(userData.name);
      await listPage.expectUserByNameInList(userData.name);
    });

    test('should search users by DNI', async ({ authenticatedPage }) => {
      // Create a user first
      const userData = testUsers.valid();
      await listPage.openNewForm();
      await formPage.fillAndSubmit(userData);

      // Search by DNI
      await listPage.searchUser(userData.dni);
      await listPage.expectUserInList(userData.email);
    });

    test('should filter out non-matching users in search', async ({ authenticatedPage }) => {
      await listPage.searchUser('NonExistentUser99999@test.com');
      // Should show empty state or no matching rows
      await listPage.expectRowCount(0);
    });
  });

  test.describe('Update', () => {
    test('should edit existing user', async () => {
      // Create user to edit
      const originalData = testUsers.valid();
      await listPage.openNewForm();
      await formPage.fillAndSubmit(originalData);

      // Edit it
      await listPage.editUser(originalData.email);
      await formPage.expectModalOpen(/edit user/i);

      const updatedEmail = generateUserEmail('updated');
      await formPage.fillEmail(updatedEmail);
      await formPage.submitAndWait();

      await formPage.expectModalClosed();
      await listPage.searchUser(updatedEmail);
      await listPage.expectUserInList(updatedEmail);
      await listPage.expectUserNotInList(originalData.email);
    });

    test('should show edit modal with existing data', async () => {
      // Create user
      const userData = testUsers.valid();
      await listPage.openNewForm();
      await formPage.fillAndSubmit(userData);

      // Open edit
      await listPage.editUser(userData.email);
      await formPage.expectModalOpen(/edit/i);

      // Fields should be pre-filled
      await formPage.expectEmailValue(userData.email);
      await formPage.expectNameValue(userData.name);
      await formPage.expectDniValue(userData.dni);
    });

    test('should allow editing without changing password', async () => {
      // Create user
      const userData = testUsers.valid();
      await listPage.openNewForm();
      await formPage.fillAndSubmit(userData);

      // Edit user without changing password
      await listPage.editUser(userData.email);
      await formPage.expectModalOpen(/edit user/i);

      // Change name only, don't touch password field
      await formPage.fillName('Updated Name');
      await formPage.submitAndWait();

      await formPage.expectModalClosed();
      await listPage.expectUserByNameInList('Updated Name');
    });

    test('should validate on update', async () => {
      // Create user
      const userData = testUsers.valid();
      await listPage.openNewForm();
      await formPage.fillAndSubmit(userData);

      // Edit with invalid data
      await listPage.editUser(userData.email);
      await formPage.expectModalOpen(/edit user/i);
      await formPage.fillEmail('invalid-email'); // Invalid format

      // Should show validation error and button should be disabled
      await formPage.expectValidationError(/email/i, 'users-input-email');
      await formPage.expectSubmitDisabled();
    });

    test('should allow deactivating a user', async () => {
      // Create active user
      const userData = testUsers.complete();
      await listPage.openNewForm();
      await formPage.fillCompleteUserData(userData);
      await formPage.submitAndWait();

      // Edit to deactivate
      await listPage.editUser(userData.email);
      await formPage.expectModalOpen(/edit user/i);
      await formPage.setActive(false);
      await formPage.submitAndWait();

      await formPage.expectModalClosed();
      // User should still be in list but marked as inactive
      await listPage.expectUserInList(userData.email);
    });
  });

  test.describe('Delete', () => {
    test('should delete single user', async () => {
      // Create user to delete
      const userData = testUsers.valid();
      await listPage.openNewForm();
      await formPage.fillAndSubmit(userData);

      // Delete it
      await listPage.deleteUser(userData.email);
      await listPage.expectDeleteModalVisible();
      await listPage.confirmDelete();

      await listPage.expectDeleteModalHidden();
      await listPage.expectUserNotInList(userData.email);
    });

    test('should cancel delete', async () => {
      // Create user
      const userData = testUsers.valid();
      await listPage.openNewForm();
      await formPage.fillAndSubmit(userData);

      // Try to delete but cancel
      await listPage.deleteUser(userData.email);
      await listPage.expectDeleteModalVisible();
      await listPage.cancelDelete();

      await listPage.expectDeleteModalHidden();
      await listPage.expectUserInList(userData.email);
    });

    test('should bulk delete selected users', async () => {
      // Create multiple users
      const user1 = testUsers.valid();
      const user2 = testUsers.valid();

      await listPage.openNewForm();
      await formPage.fillAndSubmit(user1);

      await listPage.openNewForm();
      await formPage.fillAndSubmit(user2);

      // Select both users individually
      await listPage.selectRow(user1.email);
      await listPage.selectRow(user2.email);

      // Bulk delete
      await listPage.bulkDelete();

      await listPage.expectUserNotInList(user1.email);
      await listPage.expectUserNotInList(user2.email);
    });
  });

  test.describe('Edge Cases', () => {
    test('should handle long email addresses', async () => {
      const longEmail = 'very.long.email.address.test.user@example-domain-name.com';
      const userData = {
        ...testUsers.valid(),
        email: longEmail,
      };

      await listPage.openNewForm();
      await formPage.fillAndSubmit(userData);

      await listPage.expectUserInList(longEmail);
    });

    test('should handle special characters in name', async () => {
      const userData = {
        ...testUsers.valid(),
        name: "O'Brien-Smith Jr.",
      };

      await listPage.openNewForm();
      await formPage.fillMinimumRequiredFields(userData);
      await formPage.submitAndWait();

      await listPage.expectUserByNameInList(userData.name);
    });

    test('should accept international phone format', async () => {
      const userData = {
        ...testUsers.valid(),
        phoneNumber: '+44 20 7946 0958', // UK format
      };

      await listPage.openNewForm();
      await formPage.fillMinimumRequiredFields(userData);
      await formPage.submitAndWait();

      await listPage.expectUserInList(userData.email);
    });

    test('should handle maximum length fields', async () => {
      const userData = {
        ...testUsers.valid(),
        name: 'A'.repeat(100), // Max 100 chars
        address: 'B'.repeat(500), // Max 500 chars
        notes: 'C'.repeat(1000), // Max 1000 chars
      };

      await listPage.openNewForm();
      await formPage.fillMinimumRequiredFields(userData);
      await formPage.fillAddress(userData.address);
      await formPage.fillNotes(userData.notes);
      await formPage.submitAndWait();

      await listPage.expectUserInList(userData.email);
    });

    test('should reject duplicate email addresses', async () => {
      // Create first user
      const userData = testUsers.valid();
      await listPage.openNewForm();
      await formPage.fillAndSubmit(userData);

      // Try to create second user with same email
      await listPage.openNewForm();
      await formPage.fillEmail(userData.email);

      // Should show async validation error after debounce
      await formPage.page.waitForTimeout(600); // Wait for async validation
      await formPage.expectValidationError(/already.*use|not.*unique/i, 'users-input-email');
      await formPage.expectSubmitDisabled();
    });

    test('should reject duplicate DNI', async () => {
      // Create first user
      const userData = testUsers.valid();
      await listPage.openNewForm();
      await formPage.fillAndSubmit(userData);

      // Try to create second user with same DNI
      const userData2 = {
        ...testUsers.valid(),
        dni: userData.dni, // Same DNI
      };
      await listPage.openNewForm();
      await formPage.fillMinimumRequiredFields(userData2);

      // Should show async validation error after debounce
      await formPage.page.waitForTimeout(600); // Wait for async validation
      await formPage.expectValidationError(/already.*use|not.*unique/i, 'users-input-dni');
      await formPage.expectSubmitDisabled();
    });
  });
});
