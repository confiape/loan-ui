# E2E Testing Guide

Playwright tests para loan-ui siguiendo arquitectura Page Object Model.

## Comandos

```bash
# Ejecutar todos los tests
npm run test:e2e

# UI Mode (recomendado para desarrollo)
npm run test:e2e:ui

# Headed mode (ver navegador)
npm run test:e2e:headed

# Debug mode (paso a paso)
npm run test:e2e:debug

# Ver reporte HTML
npm run test:e2e:report
```

## Estructura

```
tests/
├── e2e/              # Test specs
│   ├── auth/         # Login/logout
│   ├── cruds/        # CRUD tests (companies como referencia)
│   └── components/   # UI components
├── fixtures/         # Utilidades reutilizables
│   ├── auth.fixture.ts      # Auto-login
│   ├── mock-data.ts         # Test data
│   └── test-helpers.ts      # Helpers
└── pages/            # Page Object Models
    ├── base.page.ts
    ├── login.page.ts
    ├── companies-list.page.ts
    └── company-form.page.ts
```

## Uso Básico

### 1. Test Simple (sin autenticación)

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

test('should login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto('/login');
  await loginPage.login('admin@confia.com', 'password123');
  await loginPage.expectRedirectToDashboard();
});
```

### 2. Test con Autenticación

```typescript
import { test, expect } from '../fixtures/auth.fixture';
import { CompaniesListPage } from '../pages/companies-list.page';

test('should access companies', async ({ authenticatedPage }) => {
  const listPage = new CompaniesListPage(authenticatedPage);
  await listPage.goto('/companies');
  await listPage.expectPageTitle(/companies/i);
});
```

### 3. CRUD Test Completo

Ver `tests/e2e/cruds/companies.spec.ts` como referencia.

## Page Objects

### Crear nuevo Page Object

```typescript
// tests/pages/my-entity-list.page.ts
import { expect } from '@playwright/test';
import { BasePage } from './base.page';

export class MyEntityListPage extends BasePage {
  // Locators
  get newButton() {
    return this.page.getByRole('button', { name: /new/i });
  }

  // Actions
  async openNewForm() {
    await this.newButton.click();
  }

  // Assertions
  async expectEntityInList(name: string) {
    await expect(this.page.getByText(name)).toBeVisible();
  }
}
```

## Best Practices

### Selectors (orden de preferencia)

```typescript
// 1. Role (más semántico)
page.getByRole('button', { name: 'Submit' })

// 2. Label
page.getByLabel('Email')

// 3. Placeholder
page.getByPlaceholder('Search...')

// 4. Test ID
page.getByTestId('company-row')

// 5. CSS (último recurso)
page.locator('.btn-primary')
```

### Esperas

```typescript
// ✅ Correcto
await page.waitForSelector('[data-loaded]');
await page.waitForLoadState('networkidle');

// ❌ Evitar
await page.waitForTimeout(1000);
```

### Assertions

```typescript
await expect(element).toBeVisible();
await expect(element).toHaveText('Expected');
await expect(input).toBeEnabled();
await expect(checkbox).toBeChecked();
```

## Crear Test para Nuevo CRUD

1. **Copiar companies.spec.ts**
```bash
cp tests/e2e/cruds/companies.spec.ts tests/e2e/cruds/my-entity.spec.ts
```

2. **Crear Page Objects**
```bash
# List page
cp tests/pages/companies-list.page.ts tests/pages/my-entity-list.page.ts

# Form page
cp tests/pages/company-form.page.ts tests/pages/my-entity-form.page.ts
```

3. **Actualizar nombres** (buscar/reemplazar):
   - `Company` → `MyEntity`
   - `companies` → `my-entities`

4. **Ajustar locators** según UI específica

5. **Ejecutar**: `npm run test:e2e:ui`

## Debugging

### Playwright UI Mode
```bash
npm run test:e2e:ui
```
- Ver tests en tiempo real
- Time travel debugging
- Inspeccionar locators

### Debug Mode
```bash
npm run test:e2e:debug
```
- Paso a paso
- Breakpoints
- Consola disponible

### Screenshots/Videos
- Automáticos en fallos
- Ver en `test-results/` y `playwright-report/`

## CI/CD

El config ya incluye ajustes para CI:
- Retries: 2 en CI
- Workers: 1 en CI (evita race conditions)
- Screenshots/videos en fallos
- Traces en retries

## Troubleshooting

**Tests fallan por timeouts:**
- Aumentar `actionTimeout` en `playwright.config.ts`
- Verificar que el server esté corriendo

**"Element not found":**
- Usar Playwright Inspector: `npm run test:e2e:debug`
- Revisar selectores con `page.locator('selector').highlight()`

**Auth no funciona:**
- Verificar credenciales en `mock-data.ts`
- Revisar que guards permitan acceso
