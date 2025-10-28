# loan-ui Angular 20 – Guía Rápida

Este proyecto es una UI de gestión de préstamos en Angular 20, con diseño semántico y Tailwind CSS v4. Las buenas prácticas y convenciones están centralizadas en el MCP (Manual de Convenciones y Prácticas). Este archivo solo contiene lo esencial para trabajar y navegar el proyecto.

---

## Comandos Clave

| Acción           | Comando             |
| ---------------- | ------------------- |
| Dev server       | `npm start`         |
| Test unitarios   | `npm test`          |
| Storybook        | `npm run storybook` |
| Lint/Prettier    | `npm run lint`      |
| Build producción | `npm run build`     |
| Prettier         | `npm run prettier`  |

---

## Estructura Principal

```text
loan-ui
.
├── angular.json
├── AUTHENTICATION.md
├── .claude
│   └── settings.local.json
├── CLAUDE.md
├── CLAUDE.md.backup
├── documentation.json
├── .editorconfig
├── eslint.config.js
├── .github
│   └── workflows
│       └── playwright.yml
├── .gitignore
├── .mcp.json
├── package.json
├── package-lock.json
├── playwright.config.ts
├── .postcssrc.json
├── .prettierignore
├── .prettierrc
├── public
│   └── favicon.ico
├── README.md
├── sonar-project.properties
├── src
│   ├── app
│   │   ├── app.config.spec.ts
│   │   ├── app.config.ts
│   │   ├── app.css
│   │   ├── app.html
│   │   ├── app.routes.ts
│   │   ├── app.spec.ts
│   │   ├── app.ts
│   │   ├── components
│   │   │   └── ui
│   │   │       ├── accordion
│   │   │       │   ├── accordion.component.spec.ts
│   │   │       │   ├── accordion.css
│   │   │       │   ├── accordion.html
│   │   │       │   └── accordion.ts
│   │   │       ├── apps-menu
│   │   │       │   ├── apps-menu.css
│   │   │       │   ├── apps-menu.html
│   │   │       │   ├── apps-menu.spec.ts
│   │   │       │   └── apps-menu.ts
│   │   │       ├── data-table
│   │   │       │   ├── data-table.css
│   │   │       │   ├── data-table.html
│   │   │       │   ├── data-table.spec.ts
│   │   │       │   └── data-table.ts
│   │   │       ├── datepicker
│   │   │       │   ├── datepicker.css
│   │   │       │   ├── datepicker.html
│   │   │       │   ├── datepicker.spec.ts
│   │   │       │   └── datepicker.ts
│   │   │       ├── dropdown
│   │   │       │   ├── dropdown.component.spec.ts
│   │   │       │   ├── dropdown.css
│   │   │       │   ├── dropdown.html
│   │   │       │   └── dropdown.ts
│   │   │       ├── index.ts
│   │   │       ├── modal
│   │   │       │   ├── modal.component.spec.ts
│   │   │       │   ├── modal.css
│   │   │       │   ├── modal.html
│   │   │       │   └── modal.ts
│   │   │       ├── multiselect
│   │   │       │   ├── multiselect.component.spec.ts
│   │   │       │   ├── multiselect.css
│   │   │       │   ├── multiselect.html
│   │   │       │   └── multiselect.ts
│   │   │       ├── notification-button
│   │   │       │   ├── notification-button.css
│   │   │       │   ├── notification-button.html
│   │   │       │   ├── notification-button.spec.ts
│   │   │       │   └── notification-button.ts
│   │   │       ├── README.md
│   │   │       ├── search-bar
│   │   │       │   ├── search-bar.css
│   │   │       │   ├── search-bar.html
│   │   │       │   ├── search-bar.spec.ts
│   │   │       │   └── search-bar.ts
│   │   │       ├── table
│   │   │       │   ├── table.css
│   │   │       │   ├── table.html
│   │   │       │   ├── table.spec.ts
│   │   │       │   └── table.ts
│   │   │       ├── table-pagination
│   │   │       │   ├── table-pagination.css
│   │   │       │   ├── table-pagination.html
│   │   │       │   ├── table-pagination.spec.ts
│   │   │       │   └── table-pagination.ts
│   │   │       ├── table-toolbar
│   │   │       │   ├── table-toolbar.css
│   │   │       │   ├── table-toolbar.html
│   │   │       │   ├── table-toolbar.spec.ts
│   │   │       │   └── table-toolbar.ts
│   │   │       ├── tabs
│   │   │       │   ├── README.md
│   │   │       │   ├── tabs.component.spec.ts
│   │   │       │   ├── tabs.css
│   │   │       │   ├── tabs.html
│   │   │       │   └── tabs.ts
│   │   │       ├── toast
│   │   │       │   ├── toast.component.spec.ts
│   │   │       │   ├── toast-container.component.spec.ts
│   │   │       │   ├── toast-container.ts
│   │   │       │   ├── toast.css
│   │   │       │   ├── toast.html
│   │   │       │   └── toast.ts
│   │   │       ├── tooltip
│   │   │       │   ├── tooltip.component.spec.ts
│   │   │       │   ├── tooltip.css
│   │   │       │   ├── tooltip.html
│   │   │       │   └── tooltip.ts
│   │   │       └── user-menu
│   │   │           ├── user-menu.css
│   │   │           ├── user-menu.html
│   │   │           ├── user-menu.spec.ts
│   │   │           └── user-menu.ts
│   │   ├── config
│   │   │   └── layout.config.ts
│   │   ├── core
│   │   │   └── openapi
│   │   │       ├── api
│   │   │       │   ├── api.ts
│   │   │       │   ├── authentication.service.ts
│   │   │       │   ├── borrower.service.ts
│   │   │       │   ├── company.service.ts
│   │   │       │   ├── default.service.ts
│   │   │       │   ├── file.service.ts
│   │   │       │   ├── inOutBalance.service.ts
│   │   │       │   ├── loan.service.ts
│   │   │       │   ├── payment.service.ts
│   │   │       │   ├── reports.service.ts
│   │   │       │   └── user.service.ts
│   │   │       ├── api.module.ts
│   │   │       ├── configuration.ts
│   │   │       ├── encoder.ts
│   │   │       ├── git_push.sh
│   │   │       ├── index.ts
│   │   │       ├── model
│   │   │       │   ├── basicLoanAndPersonDto.ts
│   │   │       │   ├── basicLoanDto.ts
│   │   │       │   ├── borrowerClientWithActiveLoansDto.ts
│   │   │       │   ├── companyDto.ts
│   │   │       │   ├── createBorrowerDto.ts
│   │   │       │   ├── inOutBalanceDto.ts
│   │   │       │   ├── inOutBalanceType.ts
│   │   │       │   ├── loanAndPaymentDto.ts
│   │   │       │   ├── loanDto.ts
│   │   │       │   ├── loanStatus.ts
│   │   │       │   ├── loanType.ts
│   │   │       │   ├── loginDto.ts
│   │   │       │   ├── loginResponse.ts
│   │   │       │   ├── models.ts
│   │   │       │   ├── paymentByDayReportRequestDto.ts
│   │   │       │   ├── paymentByDayReportResponseDto.ts
│   │   │       │   ├── paymentDetailsResponseDto.ts
│   │   │       │   ├── paymentDto.ts
│   │   │       │   ├── paymentResponseDto.ts
│   │   │       │   ├── paymentStatus.ts
│   │   │       │   ├── permissionDto.ts
│   │   │       │   ├── personDto.ts
│   │   │       │   ├── pointDto.ts
│   │   │       │   ├── reniecPersonalInformationDto.ts
│   │   │       │   ├── roleDto.ts
│   │   │       │   ├── saveCompanyDto.ts
│   │   │       │   ├── saveLoanDto.ts
│   │   │       │   ├── savePaymentDto.ts
│   │   │       │   ├── saveRoleDto.ts
│   │   │       │   ├── saveUserDto.ts
│   │   │       │   ├── simplePaymentDto.ts
│   │   │       │   ├── simplePayments.ts
│   │   │       │   ├── tokenDto.ts
│   │   │       │   ├── userDto.ts
│   │   │       │   └── userToRegister.ts
│   │   │       ├── param.ts
│   │   │       ├── README.md
│   │   │       └── variables.ts
│   │   ├── features
│   │   │   ├── auth
│   │   │   │   └── login
│   │   │   │       ├── login.component.spec.ts
│   │   │   │       ├── login.html
│   │   │   │       └── login.ts
│   │   │   └── dashboard
│   │   │       ├── dashboard.html
│   │   │       ├── dashboard.spec.ts
│   │   │       └── dashboard.ts
│   │   ├── interceptors
│   │   │   ├── auth.interceptor.spec.ts
│   │   │   ├── auth.interceptor.ts
│   │   │   ├── http-notification.interceptor.spec.ts
│   │   │   ├── http-notification.interceptor.ts
│   │   │   ├── README.md
│   │   │   ├── token-retry.interceptor.spec.ts
│   │   │   └── token-retry.interceptor.ts
│   │   ├── layout
│   │   │   ├── bottom-navigation
│   │   │   │   ├── bottom-navigation.css
│   │   │   │   ├── bottom-navigation.html
│   │   │   │   ├── bottom-navigation.spec.ts
│   │   │   │   └── bottom-navigation.ts
│   │   │   ├── main-layout
│   │   │   │   ├── main-layout.html
│   │   │   │   ├── main-layout.spec.ts
│   │   │   │   └── main-layout.ts
│   │   │   ├── navbar
│   │   │   │   ├── navbar.html
│   │   │   │   ├── navbar.spec.ts
│   │   │   │   └── navbar.ts
│   │   │   └── sidenav
│   │   │       ├── sidenav.component.spec.ts
│   │   │       ├── sidenav.css
│   │   │       ├── sidenav.html
│   │   │       └── sidenav.ts
│   │   └── services
│   │       ├── auth.service.spec.ts
│   │       ├── auth.service.ts
│   │       ├── toast.service.spec.ts
│   │       └── toast.service.ts
│   ├── index.html
│   ├── main.ts
│   ├── stories
│   │   ├── apps-menu.stories.ts
│   │   ├── bottom-navigation.stories.ts
│   │   ├── data-table.stories.ts
│   │   ├── datepicker.stories.ts
│   │   ├── dropdown.stories.ts
│   │   ├── login.stories.ts
│   │   ├── modal.stories.ts
│   │   ├── multiselect.stories.ts
│   │   ├── notification-button.stories.ts
│   │   ├── search-bar.stories.ts
│   │   ├── sidenav.stories.ts
│   │   ├── story-helpers.ts
│   │   ├── tabs.stories.ts
│   │   └── user-menu.stories.ts
│   ├── styles
│   │   ├── components
│   │   │   ├── _alerts.css
│   │   │   ├── _avatar.css
│   │   │   ├── _badges.css
│   │   │   ├── _buttons.css
│   │   │   ├── _cards.css
│   │   │   ├── _feedback.css
│   │   │   ├── _forms.css
│   │   │   ├── _index.css
│   │   │   ├── _interactive.css
│   │   │   ├── _modals.css
│   │   │   ├── _navigation.css
│   │   │   └── _tables.css
│   │   ├── tokens
│   │   │   ├── _borders.css
│   │   │   ├── _colors.css
│   │   │   ├── _index.css
│   │   │   ├── _layout.css
│   │   │   ├── _shadows.css
│   │   │   ├── _spacing.css
│   │   │   ├── _transitions.css
│   │   │   └── _typography.css
│   │   └── utilities
│   │       ├── _helpers.css
│   │       └── _index.css
│   ├── styles.css
│   ├── styles.css.backup
│   └── test-setup.ts
├── .storybook
│   ├── main.ts
│   ├── preview.ts
│   ├── tsconfig.doc.json
│   ├── tsconfig.json
│   └── typings.d.ts
├── tests
│   └── example.spec.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.spec.json
├── vitest.config.ts
└── .vscode
    ├── extensions.json
    ├── launch.json
    ├── settings.json
    └── tasks.json

49 directories, 237 files


```

> **Nota:** Código generado en `src/app/core/openapi/**` se ignora siempre (no modificar, se sobreescribe automáticamente) solo leer en el caso de que se quiera consultar el http rest query entrada o salida.

---

## Diseño y Estilos

- **Tailwind CSS v4** para el 90% del styling.
- **CSS variables** (tokens) para colores, spacing, tipografía, borders, sombras, transiciones y layout.
- **Solo CSS separado** para animaciones complejas o posicionamiento dinámico.
- **Dark mode:** Activado por la clase `.dark` en el HTML; todos los tokens de color cambian automáticamente.
- **Ejemplo de variables:**
  ```css
  color: var(--color-primary);
  background: var(--color-bg-primary);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-lg);
  ```
- **Tokens principales en `src/styles/tokens/`:**
  - `_colors.css` (colores semánticos, escala de grises, dark mode)
  - `_spacing.css` (espaciado 0-32)
  - `_typography.css` (tamaños, pesos, line-heights)
  - `_borders.css` (radius, widths)
  - `_shadows.css` (sm-2xl)
  - `_transitions.css` (duraciones, timings)
  - `_layout.css` (z-index, containers)

---

## Componentes UI

**Resumen:** 17 UI + 4 Layout. Todos con accesibilidad, variantes, dark mode y stories.

- Form Controls: Dropdown, MultiSelect, Datepicker
- Data Display: Table, TableToolbar, TablePagination, DataTable
- Navegación: Tabs, Sidenav, BottomNavigation, AppsMenu, UserMenu, SearchBar
- Feedback/Overlay: Modal, Toast, Tooltip, NotificationButton
- Layout: Accordion, MainLayout, Navbar

> Ver detalles y props en cada archivo de componente y en Storybook.

---

## Testing & Calidad

- **Unit tests:** Vitest (`npm test`)
- **E2E:** Playwright (`./tests/`)
- **Lint:** ESLint + Prettier (`npm run lint`)
- **Cobertura:** `npm run coverage`
- **Siempre que actualices código:**
  - Agrega/modifica unit tests en vitest relacionados.
  - Actualiza y revisa las historias de Storybook.
  - Ejecuta `ng lint --fix` y `npx prettier --write .` para mantener el formato y calidad.

---

## Servicios & Interceptores

- **ToastService:** Notificaciones con signals.
- **AuthService:** Autenticación y gestión de tokens.
- **Interceptors:** auth, token-retry, http-notification.

---

## Storybook

- Historias en `src/stories/`, helpers en `story-helpers.ts`.
- Todas las UI deben tener historias con comparación Light/Dark.

---

## Recursos

- [Angular 20](https://angular.dev)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Storybook Angular](https://storybook.js.org/docs/angular)
- [Vitest](https://vitest.dev)
- [Playwright](https://playwright.dev)

---

## Workflow GitHub

### Issues

- Labels: `feature`, `bug`, `enhancement`, `docs`
- Estructura: descripción, tareas (checkboxes), criterios de aceptación, archivos

### PRs

1. Branch: `feature/nombre-descriptivo` desde master
2. Desarrollo + tests + lint + prettier
3. Commit: `<tipo>: descripción\n\n- cambios\n\nCloses #N`
4. PR: resumen, checklist, resultados tests

### Commits

Tipos: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `style`

---

## Testing Vitest

### Mocks

```typescript
import { vi } from 'vitest';

const mockService = {
  getData: vi.fn().mockReturnValue(of(mockData)),
};

// En tests
vi.spyOn(component.output, 'emit');
expect(component.output.emit).toHaveBeenCalledWith(data);
```

### Providers

```typescript
// HttpClient (si componente o hijos lo usan)
import { provideHttpClient } from '@angular/common/http';
providers: [provideHttpClient()];

// Router
import { provideRouter } from '@angular/router';
providers: [provideRouter([])];
```

---

## Interfaces UI

**⚠️ SIEMPRE leer interfaces antes de crear mocks:**

- `NotificationButton` → `Notification` (usa `time`, no `timestamp`)
- `AppsMenu` → `AppMenuItem` (usa `id`, `label`, `href`)
- `UserMenu` → `UserMenuItem` (usa `id`, `label`, `action`)

**Verificar:**

```typescript
// 1. Leer archivo .ts del componente
// 2. Ver interface exportada
// 3. Usar campos exactos
```

---

## Signals + Servicios

```typescript
// Estado
currentData = signal<Type | null>(null);
isLoading = signal<boolean>(false);
error = signal<string | null>(null);

// Carga
loadData(): void {
  this.isLoading.set(true);
  this.service.getData()
    .pipe(
      tap((data) => {
        this.currentData.set(data);
        this.isLoading.set(false);
      }),
      catchError((err) => {
        this.error.set('Error message');
        this.isLoading.set(false);
        return of(null);
      })
    ).subscribe();
}

// Getter con fallback
get displayValue(): string {
  return this.currentData()?.value || this.inputValue() || 'default';
}
```

---

## Storybook

```typescript
const meta: Meta<Component> = {
  title: 'Categoría/Nombre',
  component: Component,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [provideZonelessChangeDetection() /* mocks */],
    }),
  ],
  args: {
    /* defaults */
  },
};
```

Stories: `Default`, `DarkMode`, `Error`, `Loading`, `Empty`

---

## Checklist Pre-Commit

```bash
# Ejecutar siempre
npm test && npm run lint && npx prettier --write .
```

- [ ] Tests pasan
- [ ] Lint sin errores
- [ ] Prettier ejecutado
- [ ] Tests unitarios actualizados
- [ ] Storybook actualizado (si aplica)
- [ ] Sin modificar `src/app/core/openapi/**`

---

## Flujo de Trabajo

1. **Planificación:** Issue GitHub → Verificar interfaces → Crear branch
2. **Implementación:** Componente → Template → Compilar
3. **Testing:** Tests → `npm test` → Corregir tipos
4. **Docs:** Storybook stories → Verificar variantes
5. **Calidad:** lint → prettier → Revisión
6. **Git:** add → commit → push → PR

---

**Para buenas practicas y creacion de cualquier recurso de angular, consulta el MCP Angular 20.**
