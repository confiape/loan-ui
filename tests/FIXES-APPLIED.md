# Fixes Aplicados - Selectores E2E

## Problema

Los tests E2E fallaban con `TimeoutError` porque no encontraban elementos usando selectores semánticos (`getByLabel`, `getByRole`).

## Solución

Se agregaron `data-testid` a todos los elementos críticos para tests más confiables y rápidos.

## Cambios Realizados

### 1. Login Component (`login.html`)

```html
<!-- Email -->
<input data-testid="login-email-input" ... />

<!-- Password -->
<input data-testid="login-password-input" ... />

<!-- Submit Button -->
<button data-testid="login-submit-button" ... />
```

### 2. Companies List (`companies-list.html`)

```html
<!-- Toolbar -->
<app-table-toolbar data-testid="companies-toolbar" ... />

<!-- Table -->
<app-table data-testid="companies-table" ... />

<!-- Form Modal -->
<app-modal data-testid="company-form-modal" ... />

<!-- Delete Modal -->
<app-modal data-testid="company-delete-modal" ... />
  <button data-testid="delete-cancel-button" ... />
  <button data-testid="delete-confirm-button" ... />
```

### 3. Company Form (`company-form.html`)

```html
<!-- Form -->
<form data-testid="company-form" ... />

<!-- Name Input -->
<app-base-input data-testid="company-name-input" ... />

<!-- Buttons -->
<button data-testid="company-form-cancel-button" ... />
<button data-testid="company-form-submit-button" ... />
```

### 4. Page Objects Actualizados

**login.page.ts:**
```typescript
get emailInput() {
  return this.page.getByTestId('login-email-input');
}

get passwordInput() {
  return this.page.getByTestId('login-password-input');
}

get submitButton() {
  return this.page.getByTestId('login-submit-button');
}
```

**companies-list.page.ts:**
```typescript
get table() {
  return this.page.getByTestId('companies-table');
}

get deleteModal() {
  return this.page.getByTestId('company-delete-modal');
}

get formModal() {
  return this.page.getByTestId('company-form-modal');
}
```

**company-form.page.ts:**
```typescript
get modal() {
  return this.page.getByTestId('company-form-modal');
}

get form() {
  return this.page.getByTestId('company-form');
}

get nameInput() {
  return this.page.getByTestId('company-name-input');
}

get submitButton() {
  return this.page.getByTestId('company-form-submit-button');
}
```

**auth.fixture.ts:**
```typescript
await page.getByTestId('login-email-input').fill('admin@confia.com');
await page.getByTestId('login-password-input').fill('password123');
await page.getByTestId('login-submit-button').click();
```

## Ventajas de data-testid

✅ **Más rápido** - Selector directo sin búsqueda por texto/role
✅ **Más confiable** - No afectado por cambios de texto o idioma
✅ **Más específico** - Sin ambigüedades
✅ **Mejor práctica** - Recomendado por Playwright/Testing Library

## Cómo Ejecutar Tests

```bash
# UI Mode (recomendado)
npm run test:e2e:ui

# Headless
npm run test:e2e

# Con navegador visible
npm run test:e2e:headed

# Debug
npm run test:e2e:debug
```

## Notas Importantes

- **Backend requerido**: Los tests necesitan que la API esté corriendo
- **Credenciales**: Verificar que existan users en `mock-data.ts`
- **Puerto**: App debe correr en `localhost:4200`

## Próximos Pasos

Si los tests aún fallan:

1. **Verificar backend está corriendo**
2. **Verificar credenciales son válidas**
3. **Usar debug mode**: `npm run test:e2e:debug`
4. **Ver screenshots/videos** en `test-results/`

## Pattern para Nuevos Tests

Siempre agregar `data-testid` a elementos que necesiten testing:

```html
<!-- Buttons -->
<button data-testid="feature-action-button">Action</button>

<!-- Inputs -->
<input data-testid="feature-field-input" />

<!-- Modals -->
<app-modal data-testid="feature-modal">

<!-- Tables -->
<app-table data-testid="feature-table">
```

**Naming convention:**
`{feature}-{element}-{type}`

Ejemplos:
- `login-email-input`
- `company-form-submit-button`
- `companies-table`
- `company-delete-modal`
