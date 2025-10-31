# Playwright E2E Testing Guide

Guía compacta para escribir tests E2E con Playwright en Angular 20.

## 1. Estructura de Page Objects

### Pattern Básico

```typescript
export class MyPage extends BasePage {
  // Actions - Usa data-testid directamente
  async fillName(name: string) {
    const input = this.page.getByTestId('my-name-input');
    await input.fill(name);
    await input.blur(); // Si updateOn: 'blur'
    await this.page.waitForTimeout(100); // Espera procesamiento Angular
  }

  async submit() {
    await this.page.getByTestId('my-submit-button').click();
  }

  async submitAndWait() {
    await this.submit();
    await this.page.getByTestId('my-modal').waitFor({ state: 'hidden' });
  }

  // Assertions
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

**Reglas:**

- ❌ **NO** uses getters - accede a elementos directamente
- ✅ Métodos específicos para cada acción
- ✅ Separar métodos de acción vs assertion

## 2. data-testid Pattern

### En Componentes Angular

**Base Input Component:**

```typescript
// Component
readonly testId = input<string | null>(null);

// Template - Input
<input [attr.data-testid]="testId() ?? undefined" />

// Template - Error
<p [attr.data-testid]="testId() ? testId() + '-error' : undefined">
  {{ errorMessage }}
</p>
```

**Modal Component:**

```typescript
// Component
readonly testId = input<string>('');

// Template
<div class="modal-container" [attr.data-testid]="testId() || null">
```

**Uso:**

```html
<app-base-input [testId]="'company-name-input'" formControlName="name" />

<app-modal [testId]="'company-form-modal'"></app-modal>
```

## 3. Validación de Formularios

### updateOn: 'blur' Strategy

```typescript
// Component
this.form = this.fb.group({
  name: [
    '',
    {
      validators: [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(15),
        Validators.pattern(/^[a-zA-Z0-9\s-]+$/),
      ],
      updateOn: 'blur', // Valida solo en blur
    },
  ],
});
```

### Page Object Methods

```typescript
// Llenar y disparar validación
async fillField(value: string) {
  const input = this.page.getByTestId('field-input');
  await input.fill(value);
  await input.blur();  // Dispara validación
  await this.page.waitForTimeout(100);
}

// Para campos requeridos - marcar touched sin valor
async triggerValidation() {
  const input = this.page.getByTestId('field-input');
  await input.fill('x');
  await input.clear();
  await input.blur();
}
```

### Tests de Validación

```typescript
test('should validate required field', async () => {
  await formPage.triggerValidation();
  await formPage.expectValidationError(/required/i);
  await formPage.expectSubmitDisabled();
});

test('should validate min length', async () => {
  await formPage.fillField('A'); // Solo 1 char
  await formPage.expectValidationError(/minimum.*2/i);
  await formPage.expectSubmitDisabled();
});

test('should validate max length', async () => {
  await formPage.fillField('A'.repeat(20));
  await formPage.expectValidationError(/maximum.*15/i);
  await formPage.expectSubmitDisabled();
});

test('should validate pattern', async () => {
  await formPage.fillField('Invalid@#$');
  await formPage.expectValidationError(/does not match/i);
  await formPage.expectSubmitDisabled();
});
```

## 4. Testing Strategy

### Hybrid Approach (Real Backend + Selective Mocking)

**Default:** Usa el backend real

```typescript
test('should create company', async () => {
  const name = generateCompanyName(); // Nombres únicos
  await listPage.openNewForm();
  await formPage.fillAndSubmit(name);
  await listPage.expectCompanyInList(name);
});
```

**Mock solo edge cases:**

```typescript
test('should handle empty search', async ({ authenticatedPage }) => {
  await authenticatedPage.route('**/api/companies*', (route) => {
    const url = route.request().url();
    if (url.includes('NonExistent')) {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    } else {
      route.continue();
    }
  });

  await listPage.searchCompany('NonExistent');
  await listPage.expectRowCount(0);
});
```

## 5. Selectors - Manejo de Caracteres Especiales

### ❌ Incorrecto

```typescript
return this.page.locator(`tr:has-text("${name}")`); // Falla con comillas
```

### ✅ Correcto

```typescript
return this.page.getByTestId('companies-table').locator('tbody tr').filter({ hasText: name }); // Maneja cualquier carácter
```

## 6. Problemas Comunes

### Click en Botón Deshabilitado

```typescript
// ❌ Error: elemento deshabilitado
await button.click();

// ✅ Solución: force click solo para testing
await button.click({ force: true });
```

### Múltiples Elementos con Mismo Texto

```typescript
// ❌ Error: strict mode violation
const rows = this.page.locator('tr:has-text("Company 123")');

// ✅ Solución 1: Nombres únicos
const name = generateCompanyName(); // Añade timestamp

// ✅ Solución 2: Búsqueda específica antes
await listPage.searchCompany(name); // Filtra antes de verificar
```

### Toasts/Alerts No Aparecen

```typescript
// Verificar que toast-container esté en app.html:
<router-outlet />
<app-toast-container />

// En tests, esperar con timeout mayor:
const alert = this.page.locator('.toast-error').first();
await expect(alert).toBeVisible({ timeout: 10000 });
```

### Validación No Aparece en Edit Mode

**Problema:** `controlState` no se actualiza con touched/dirty.

**Solución en base-input.base.ts:**

```typescript
handleBlur(): void {
  this.markAsTouched();
  this.markFocus(false);

  // Force update controlState (statusChanges no emite para touched/dirty)
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

## 7. Test Organization

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
    test('should create with valid data', async () => {});
    test('should validate required fields', async () => {});
    test('should validate min/max length', async () => {});
    test('should cancel creation', async () => {});
  });

  test.describe('Read', () => {
    test('should display list', async () => {});
    test('should search by name', async () => {});
  });

  test.describe('Update', () => {
    test('should edit existing', async () => {});
    test('should show existing data', async () => {});
    test('should validate on update', async () => {});
  });

  test.describe('Delete', () => {
    test('should delete single', async () => {});
    test('should cancel delete', async () => {});
    test('should bulk delete', async () => {});
  });

  test.describe('Edge Cases', () => {
    test('should reject invalid input', async () => {});
  });
});
```

## 8. Checklist para Nuevos Tests

**Componente:**

- [ ] Todos los inputs tienen `[testId]="'unique-id'"`
- [ ] Todos los botones tienen `data-testid`
- [ ] Modales tienen `[testId]` en el container
- [ ] Mensajes de error tienen `data-testid="{input-id}-error"`
- [ ] Toast container está en `app.html`

**Page Object:**

- [ ] Extiende `BasePage`
- [ ] Métodos usan `getByTestId()` directamente (no getters)
- [ ] `fill()` + `blur()` para validación on blur
- [ ] `waitForTimeout(100)` después de blur
- [ ] Métodos `expectX()` para assertions

**Tests:**

- [ ] Usa `generateCompanyName()` para nombres únicos
- [ ] Un test por escenario (no multiple assertions no relacionadas)
- [ ] Tests de validación usan `triggerValidation()` para required
- [ ] Tests de validación usan `fillField()` directo para otros
- [ ] Backend real por defecto, mock solo edge cases

## 9. Comandos Útiles

```bash
# Ejecutar todos los tests
npx playwright test

# Ejecutar tests específicos
npx playwright test tests/e2e/cruds/companies.spec.ts

# Ejecutar un test específico
npx playwright test -g "should create new company"

# Modo UI (debug interactivo)
npx playwright test --ui

# Modo headed (ver navegador)
npx playwright test --headed

# Generar reporte
npx playwright show-report
```

## 10. Ejemplo Completo

**company-form.page.ts:**

```typescript
export class CompanyFormPage extends BasePage {
  async fillCompanyName(name: string) {
    const input = this.page.getByTestId('company-name-input');
    await input.fill(name);
    await input.blur();
    await this.page.waitForTimeout(100);
  }

  async triggerValidation() {
    const input = this.page.getByTestId('company-name-input');
    await input.fill('x');
    await input.clear();
    await input.blur();
  }

  async submitAndWait() {
    await this.page.getByTestId('company-form-submit-button').click();
    await this.page.getByTestId('company-form-modal').waitFor({ state: 'hidden' });
  }

  async expectValidationError(message: string | RegExp) {
    const error = this.page.getByTestId('company-name-input-error');
    await expect(error).toBeVisible();
    await expect(error).toContainText(message);
  }

  async expectSubmitDisabled() {
    await expect(this.page.getByTestId('company-form-submit-button')).toBeDisabled();
  }
}
```

**companies.spec.ts:**

```typescript
test('should validate required field', async () => {
  await listPage.openNewForm();
  await formPage.triggerValidation();
  await formPage.expectValidationError(/required/i);
  await formPage.expectSubmitDisabled();
});

test('should validate min length', async () => {
  await listPage.openNewForm();
  await formPage.fillCompanyName('A');
  await formPage.expectValidationError(/minimum.*2/i);
  await formPage.expectSubmitDisabled();
});

test('should create company', async () => {
  const name = generateCompanyName();
  await listPage.openNewForm();
  await formPage.fillCompanyName(name);
  await formPage.submitAndWait();
  await listPage.expectCompanyInList(name);
});
```
