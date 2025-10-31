# Playwright E2E Testing Architecture

Arquitectura de testing end-to-end para loan-ui usando Playwright.

## Análisis del Proyecto

**Stack actual:**
- Angular 20 (standalone, signals, zoneless)
- Playwright instalado (`@playwright/test`: ^1.56.1)
- 30+ componentes UI reutilizables
- CRUD pattern establecido (Companies)
- Auth con guards (authGuard, loginGuard)

**Lo que necesitamos testear:**
1. **Autenticación** - Login/logout flows
2. **CRUDs** - Companies (referencia para otros)
3. **UI Components** - Modals, tables, forms, dropdowns, etc.
4. **Navegación** - Routing, sidenav, guards

## Arquitectura Propuesta

```
tests/
├── e2e/
│   ├── auth/
│   │   ├── login.spec.ts
│   │   └── logout.spec.ts
│   ├── cruds/
│   │   └── companies.spec.ts          # CRUD completo de referencia
│   └── components/
│       ├── modal.spec.ts
│       ├── table.spec.ts
│       └── dropdown.spec.ts
├── fixtures/
│   ├── auth.fixture.ts                # Login automático
│   ├── mock-data.ts                   # Test data (companies, users)
│   └── test-helpers.ts                # Utilidades comunes
├── pages/
│   ├── base.page.ts                   # Page Object base
│   ├── login.page.ts
│   ├── companies-list.page.ts
│   └── company-form.page.ts
└── config/
    └── test.config.ts                 # URLs, timeouts, etc.
```

## 1. Fixtures (tests/fixtures/)

### auth.fixture.ts
Manejo centralizado de autenticación para evitar login repetido.

```typescript
import { test as base } from '@playwright/test';

export const test = base.extend({
  // Auto-login para tests autenticados
  authenticatedPage: async ({ page }, use) => {
    await page.goto('/login');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
    await use(page);
  },
});
```

**Uso:**
```typescript
test('should access companies', async ({ authenticatedPage }) => {
  await authenticatedPage.goto('/companies');
  // Ya está autenticado
});
```

### mock-data.ts
Data centralizada para tests consistentes.

```typescript
export const testCompanies = {
  valid: {
    name: 'Test Company Inc.',
  },
  invalid: {
    name: 'A', // < 2 chars
  },
  forUpdate: {
    name: 'Updated Company Name',
  },
};

export const testUsers = {
  admin: {
    email: 'admin@test.com',
    password: 'admin123',
  },
  user: {
    email: 'user@test.com',
    password: 'user123',
  },
};
```

### test-helpers.ts
Utilidades comunes reutilizables.

```typescript
export async function waitForTableLoad(page) {
  await page.waitForSelector('app-table [role="row"]', { state: 'visible' });
}

export async function searchInTable(page, term: string) {
  await page.fill('[placeholder*="Search"]', term);
  await page.waitForTimeout(300); // Debounce
}

export async function getTableRowCount(page) {
  return await page.locator('app-table tbody tr').count();
}

export async function fillForm(page, formData: Record<string, string>) {
  for (const [field, value] of Object.entries(formData)) {
    await page.fill(`[formControlName="${field}"]`, value);
  }
}
```

## 2. Page Objects (tests/pages/)

Page Object Model para encapsular lógica de interacción con páginas.

### base.page.ts
Clase base con métodos comunes.

```typescript
import { Page } from '@playwright/test';

export class BasePage {
  constructor(protected page: Page) {}

  async goto(path: string) {
    await this.page.goto(path);
  }

  async waitForLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  async clickButton(text: string) {
    await this.page.getByRole('button', { name: text }).click();
  }

  async fillInput(label: string, value: string) {
    await this.page.getByLabel(label).fill(value);
  }

  async expectAlert(type: 'error' | 'success', message?: string) {
    const alert = this.page.locator(`.alert-${type}`);
    await alert.waitFor({ state: 'visible' });
    if (message) {
      await expect(alert).toContainText(message);
    }
  }
}
```

### login.page.ts
Página de login con métodos específicos.

```typescript
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  async login(email: string, password: string) {
    await this.fillInput('Email', email);
    await this.fillInput('Password', password);
    await this.clickButton('Sign in');
  }

  async expectLoginError() {
    await this.expectAlert('error');
  }

  async expectRedirectToDashboard() {
    await this.page.waitForURL('/dashboard');
  }
}
```

### companies-list.page.ts
Página de listado CRUD.

```typescript
import { BasePage } from './base.page';

export class CompaniesListPage extends BasePage {
  // Locators
  get newButton() {
    return this.page.getByRole('button', { name: /New Company/i });
  }

  get searchInput() {
    return this.page.getByPlaceholder(/Search/i);
  }

  get table() {
    return this.page.locator('app-table');
  }

  // Actions
  async openNewForm() {
    await this.newButton.click();
    await this.page.waitForSelector('app-modal[title*="New"]');
  }

  async searchCompany(term: string) {
    await this.searchInput.fill(term);
    await this.page.waitForTimeout(300);
  }

  async getRowByName(name: string) {
    return this.table.locator(`tr:has-text("${name}")`);
  }

  async editCompany(name: string) {
    const row = await this.getRowByName(name);
    await row.getByRole('button', { name: /Edit/i }).click();
  }

  async deleteCompany(name: string) {
    const row = await this.getRowByName(name);
    await row.getByRole('button', { name: /Delete/i }).click();
  }

  async confirmDelete() {
    await this.page.getByRole('button', { name: /^Delete$/i }).click();
  }

  async selectRow(name: string) {
    const row = await this.getRowByName(name);
    await row.locator('input[type="checkbox"]').check();
  }

  async bulkDelete() {
    await this.page.getByRole('button', { name: /Delete Selected/i }).click();
    await this.confirmDelete();
  }

  // Assertions
  async expectCompanyInList(name: string) {
    await expect(this.getRowByName(name)).toBeVisible();
  }

  async expectCompanyNotInList(name: string) {
    await expect(this.getRowByName(name)).not.toBeVisible();
  }

  async expectEmptyState() {
    await expect(this.table.getByText(/No companies found/i)).toBeVisible();
  }
}
```

### company-form.page.ts
Formulario modal.

```typescript
import { BasePage } from './base.page';

export class CompanyFormPage extends BasePage {
  get modal() {
    return this.page.locator('app-modal');
  }

  get nameInput() {
    return this.page.locator('[formControlName="name"]');
  }

  get submitButton() {
    return this.modal.getByRole('button', { name: /(Create|Update)/i });
  }

  get cancelButton() {
    return this.modal.getByRole('button', { name: /Cancel/i });
  }

  async fillCompanyName(name: string) {
    await this.nameInput.fill(name);
  }

  async submit() {
    await this.submitButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  async expectValidationError(field: string, message: string) {
    const error = this.page.locator('.text-sm.text-\\[var\\(--color-error\\)\\]');
    await expect(error).toContainText(message);
  }

  async expectModalClosed() {
    await expect(this.modal).not.toBeVisible();
  }
}
```

## 3. Test Specs (tests/e2e/)

### companies.spec.ts - CRUD Completo

```typescript
import { test, expect } from '../fixtures/auth.fixture';
import { CompaniesListPage } from '../pages/companies-list.page';
import { CompanyFormPage } from '../pages/company-form.page';
import { testCompanies } from '../fixtures/mock-data';

test.describe('Companies CRUD', () => {
  let listPage: CompaniesListPage;
  let formPage: CompanyFormPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    listPage = new CompaniesListPage(authenticatedPage);
    formPage = new CompanyFormPage(authenticatedPage);
    await listPage.goto('/companies');
  });

  test('should create new company', async () => {
    await listPage.openNewForm();
    await formPage.fillCompanyName(testCompanies.valid.name);
    await formPage.submit();
    await formPage.expectModalClosed();
    await listPage.expectCompanyInList(testCompanies.valid.name);
  });

  test('should validate required fields', async () => {
    await listPage.openNewForm();
    await formPage.submit();
    await formPage.expectValidationError('name', 'Required');
  });

  test('should edit company', async () => {
    // Asume que existe una company
    await listPage.editCompany('Existing Company');
    await formPage.fillCompanyName(testCompanies.forUpdate.name);
    await formPage.submit();
    await listPage.expectCompanyInList(testCompanies.forUpdate.name);
  });

  test('should delete company', async () => {
    await listPage.deleteCompany('Company to Delete');
    await listPage.confirmDelete();
    await listPage.expectCompanyNotInList('Company to Delete');
  });

  test('should search companies', async () => {
    await listPage.searchCompany('Test');
    await listPage.expectCompanyInList('Test Company');
  });

  test('should bulk delete companies', async () => {
    await listPage.selectRow('Company 1');
    await listPage.selectRow('Company 2');
    await listPage.bulkDelete();
    await listPage.expectCompanyNotInList('Company 1');
    await listPage.expectCompanyNotInList('Company 2');
  });
});
```

## 4. Configuración

### playwright.config.ts (actualizar)

```typescript
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm start',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
```

### package.json scripts

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:report": "playwright show-report"
  }
}
```

## 5. Patrones y Best Practices

### Patrón de Espera
```typescript
// ❌ Evitar
await page.waitForTimeout(1000);

// ✅ Usar
await page.waitForSelector('[data-testid="loaded"]');
await page.waitForLoadState('networkidle');
```

### Selectors Preferidos
```typescript
// 1. Role (más semántico)
page.getByRole('button', { name: 'Submit' })

// 2. Label
page.getByLabel('Email')

// 3. Placeholder
page.getByPlaceholder('Search...')

// 4. Test ID (cuando es necesario)
page.getByTestId('company-row-1')

// 5. CSS (último recurso)
page.locator('.btn-primary')
```

### Assertions Específicas
```typescript
// Visibilidad
await expect(element).toBeVisible();
await expect(element).toBeHidden();

// Texto
await expect(element).toHaveText('Expected');
await expect(element).toContainText('Partial');

// Estado
await expect(input).toBeEnabled();
await expect(input).toBeDisabled();
await expect(checkbox).toBeChecked();

// Conteo
await expect(rows).toHaveCount(5);
```

## Checklist de Implementación

- [ ] Estructura de carpetas (e2e, fixtures, pages, config)
- [ ] Fixtures: auth, mock-data, helpers
- [ ] Page Objects: base, login, companies-list, company-form
- [ ] Test: companies.spec.ts (CRUD completo)
- [ ] Config: playwright.config.ts actualizado
- [ ] Scripts: package.json e2e commands
- [ ] Documentación: README con instrucciones

## Próximos Pasos

1. **Implementar arquitectura base** (fixtures, pages, config)
2. **Crear test de Companies** (referencia CRUD)
3. **Expandir a otros CRUDs** (copiar patrón)
4. **Tests de componentes UI** (modal, table, dropdown)
5. **CI/CD integration** (GitHub Actions)
