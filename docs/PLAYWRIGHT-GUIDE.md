# Playwright E2E Testing Guide

Guía compacta para escribir tests E2E con Playwright en Angular 20.

## Estructura

```
tests/
├── e2e/                      # Test specs
│   ├── auth/login.spec.ts
│   └── cruds/companies.spec.ts
├── fixtures/
│   ├── auth.fixture.ts       # Auto-login
│   ├── mock-data.ts          # Test data
│   └── test-helpers.ts       # Utilities
└── pages/                    # Page Objects
    ├── base.page.ts
    ├── login.page.ts
    ├── {entity}-list.page.ts
    └── {entity}-form.page.ts
```

## 1. Page Object Pattern

**Regla:** NO uses getters, accede a elementos directamente con `getByTestId()`.

```typescript
export class MyPage extends BasePage {
  // ✅ Actions
  async fillName(name: string) {
    const input = this.page.getByTestId('my-name-input');
    await input.fill(name);
    await input.blur();
    await this.page.waitForTimeout(100); // Angular processing
  }

  async submitAndWait() {
    await this.page.getByTestId('my-submit-button').click();
    await this.page.getByTestId('my-modal').waitFor({ state: 'hidden' });
  }

  // ✅ Assertions
  async expectValidationError(message: string | RegExp) {
    const error = this.page.getByTestId('my-name-input-error');
    await expect(error).toBeVisible();
    await expect(error).toContainText(message);
  }

  async expectSubmitDisabled() {
    await expect(this.page.getByTestId('my-submit-button')).toBeDisabled();
  }
}
```

## 2. data-testid en Componentes

```html
<!-- Inputs -->
<app-base-input [testId]="'entity-name-input'" formControlName="name" />

<!-- Botones -->
<button [attr.data-testid]="'entity-form-submit-button'">Submit</button>

<!-- Modales -->
<app-modal [testId]="'entity-form-modal'" [isOpen]="showModal()"></app-modal>
```

**Patrón:** `{entity}-{field}-input`, `{entity}-form-{action}-button`, `{entity}-form-modal`

## 3. Testear Validaciones

**Nota:** Formularios usan `updateOn: 'blur'` (ver CRUD-GUIDE.md).

```typescript
// Page Object
async fillField(value: string) {
  const input = this.page.getByTestId('field-input');
  await input.fill(value);
  await input.blur();
  await this.page.waitForTimeout(100);
}

async triggerValidation() {
  const input = this.page.getByTestId('field-input');
  await input.fill('x');
  await input.clear();
  await input.blur();
}

// Tests
test('should validate required', async () => {
  await formPage.triggerValidation();
  await formPage.expectValidationError(/required/i);
  await formPage.expectSubmitDisabled();
});

test('should validate min length', async () => {
  await formPage.fillField('A');
  await formPage.expectValidationError(/minimum.*2/i);
});
```

## 4. Fixtures

**auth.fixture.ts** - Auto-login para tests autenticados:

```typescript
import { test as base } from '@playwright/test';

export const test = base.extend({
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

**mock-data.ts** - Data centralizada:

```typescript
export function generateEntityName() {
  return `Test Entity ${Date.now()}`;
}
```

## 5. Test Organization

```typescript
test.describe('Entity CRUD', () => {
  let listPage: EntityListPage;
  let formPage: EntityFormPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    listPage = new EntityListPage(authenticatedPage);
    formPage = new EntityFormPage(authenticatedPage);
    await listPage.goto('/entities');
  });

  test.describe('Create', () => {
    test('should create with valid data', async () => {
      /* ... */
    });
    test('should validate required fields', async () => {
      /* ... */
    });
  });

  test.describe('Update', () => {
    test('should edit existing', async () => {
      /* ... */
    });
  });

  test.describe('Delete', () => {
    test('should delete single', async () => {
      /* ... */
    });
  });
});
```

## 6. Testing Strategy

**Default:** Backend real + nombres únicos

```typescript
test('should create company', async () => {
  const name = generateCompanyName();
  await listPage.openNewForm();
  await formPage.fillAndSubmit(name);
  await listPage.expectCompanyInList(name);
});
```

**Mock solo edge cases específicos.**

## 7. Selectors

```typescript
// ❌ Falla con caracteres especiales
this.page.locator(`tr:has-text("${name}")`);

// ✅ Maneja cualquier carácter
this.page.getByTestId('table').locator('tbody tr').filter({ hasText: name });
```

## 8. Problemas Comunes

### Click en Botón Deshabilitado

```typescript
await button.click({ force: true });
```

### Múltiples Elementos Mismo Texto

```typescript
// ✅ Solución: Nombres únicos
const name = generateEntityName();

// ✅ O buscar antes
await listPage.searchEntity(name);
```

### Validación en Edit Mode

**Fix en base-input.base.ts:**

```typescript
handleBlur(): void {
  this.markAsTouched();
  const control = this.ngControl?.control;
  if (control) {
    this.controlState.set({
      control,
      invalid: control.invalid,
      touched: control.touched,
      dirty: control.dirty,
      errors: control.errors,
    });
  }
}
```

## 9. Configuración

```bash
# Ejecutar todos los tests
npx playwright test

# Modo UI (recomendado)
npx playwright test --ui

# Un test específico
npx playwright test -g "should create"

# Ver reporte
npx playwright show-report
```

## 10. Checklist

**Componente:**

- [ ] Inputs tienen `[testId]`
- [ ] Botones tienen `data-testid`
- [ ] Modales tienen `[testId]`

**Page Object:**

- [ ] Extiende `BasePage`
- [ ] Usa `getByTestId()` (no getters)
- [ ] `fill()` + `blur()` + `waitForTimeout(100)`
- [ ] Métodos `expectX()` para assertions

**Tests:**

- [ ] Usa `generateName()` para nombres únicos
- [ ] Backend real por defecto
- [ ] Un test por escenario

## Referencia Rápida

| Acción          | Código                                      |
| --------------- | ------------------------------------------- |
| Selector        | `getByTestId('id')`                         |
| Validación blur | `fill()` + `blur()` + `waitForTimeout(100)` |
| Click forzado   | `click({ force: true })`                    |
| Texto seguro    | `filter({ hasText })`                       |
| Auto-login      | `authenticatedPage` fixture                 |
