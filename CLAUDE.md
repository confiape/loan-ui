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

---

## Estructura Principal

```
loan-ui/
├── src/
│   ├── app/
│   │   ├── components/ui/      # Componentes UI
│   │   ├── config/             # Config centralizada
│   │   ├── layout/             # Layouts
│   │   ├── services/           # Servicios core
│   │   ├── interceptors/       # HTTP interceptors
│   │   ├── app.ts              # Root component
│   │   ├── app.config.ts       # Configuración
│   │   └── app.routes.ts       # Rutas
│   ├── stories/                # Storybook
│   ├── styles/                 # Design system (tokens, componentes, utilidades)
│   └── styles.css              # Main stylesheet
├── .storybook/                 # Storybook config
└── CLAUDE.md                   # Esta guía
```

> **Nota:** Código generado en `src/app/core/openapi/**` y `src/app/core/api/openapi/**` se ignora siempre (no modificar ni analizar, se sobreescribe automáticamente).

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
  - Agrega/modifica unit tests relacionados.
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

**Para detalles avanzados, consulta el MCP Angular 20.**
