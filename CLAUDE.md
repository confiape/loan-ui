# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Angular 20 application named "loan-ui" - a loan management UI with a semantic component design system built on Tailwind CSS v4. The application uses Angular's zoneless change detection and standalone components architecture.

## Development Commands

### Start Development Server
```bash
npm start
# or
ng serve
```
Development server runs on `http://localhost:4200/` with automatic reload.

### Build
```bash
npm run build        # Production build
npm run watch        # Development build with watch mode
```
Production builds output to `dist/` directory.

### Testing
```bash
npm test            # Run all tests with Karma
ng test             # Same as above
```

### Storybook
```bash
npm run storybook           # Start Storybook dev server on port 6006
npm run build-storybook     # Build static Storybook for deployment
```
Storybook is configured for component development and documentation. Stories are located in [src/stories/](src/stories/).

### Prettier Formatting
Prettier is configured in [package.json](package.json):
- Print width: 100
- Single quotes
- Angular parser for HTML files

### Angular CLI Scaffolding
```bash
ng generate component component-name    # Generate component
ng generate --help                      # See all schematics
```

## Architecture

### Angular Configuration
- **Version**: Angular 20.3.0
- **Change Detection**: Zoneless (`provideZonelessChangeDetection`)
- **Routing**: Configured via `provideRouter` in [src/app/app.config.ts](src/app/app.config.ts)
- **Components**: Standalone components (no NgModules)
- **TypeScript**: Strict mode enabled with all strictness flags

### Application Structure
- **Entry Point**: [src/main.ts](src/main.ts) - bootstraps the App component
- **Root Component**: [src/app/app.ts](src/app/app.ts) - uses signals for reactive state
- **Routes**: Defined in [src/app/app.routes.ts](src/app/app.routes.ts) (currently empty)
- **Config**: Application config in [src/app/app.config.ts](src/app/app.config.ts)
- **Components**: UI components in [src/app/components/ui/](src/app/components/ui/)
- **Stories**: Storybook stories in [src/stories/](src/stories/)

### TypeScript Configuration
The project uses strict TypeScript settings ([tsconfig.json](tsconfig.json)):
- All strict compiler options enabled
- `isolatedModules: true`
- `experimentalDecorators: true`
- Target: ES2022
- Angular strict templates and injection parameters

### Build Configuration
Angular application builder settings ([angular.json](angular.json)):
- **Builder**: `@angular/build:application` (new application builder)
- **Source Root**: `src/`
- **Prefix**: `app`
- **Assets**: Files from `public/` directory
- **Styles**: Global styles from [src/styles.css](src/styles.css)
- **Bundle Budgets**:
  - Initial: 500kB warning, 1MB error
  - Component styles: 4kB warning, 8kB error

## Styling System

### Tailwind CSS v4 with PostCSS
- Tailwind CSS v4 configured via [.postcssrc.json](.postcssrc.json)
- Uses `@tailwindcss/postcss` plugin
- Global import in [src/styles.css](src/styles.css): `@import "tailwindcss";`

### Dark Mode
Custom dark mode variant defined as:
```css
@custom-variant dark (&:where(.dark, .dark *));
```
Apply `.dark` class to any parent element to enable dark mode for descendants.

### Semantic Component System
The application uses a comprehensive semantic component system in [src/styles.css](src/styles.css) with semantic color naming:

**Color Variants**: `primary`, `secondary`, `success`, `error`, `warning`, `info`, `dark`

**Component Categories**:
- **Buttons**: `.btn`, `.btn-{variant}`, `.btn-outline-{variant}`, `.btn-pill`
  - Sizes: `.btn-xs`, `.btn-sm`, `.btn-md`, `.btn-lg`, `.btn-xl`
- **Forms**: `.form-label`, `.form-input`, `.form-input-{success|error}`, `.form-checkbox`, `.floating-input`
- **Cards**: `.card`, `.card-link`, `.card-title`, `.card-text`, `.card-btn`
- **Badges**: `.badge`, `.badge-{variant}`, `.badge-pill`
- **Alerts**: `.alert`, `.alert-{variant}`, `.alert-icon`
- **Navigation**: `.navbar`, `.navbar-brand`, `.navbar-link`, `.breadcrumb`, `.breadcrumb-item`, `.sidebar`
- **Tables**: `.table`, `.table-header`, `.table-row`, `.table-cell`
- **Progress**: `.progress-bar`, `.progress-fill`, `.progress-fill-{variant}`
- **UI Elements**: `.spinner`, `.pagination`, `.tabs`, `.timeline`, `.toast`, `.tooltip`, `.dropdown`, `.accordion`, `.avatar`, `.rating`
- **Typography**: `.heading-{1-6}`, `.text-lead`, `.text-large`, `.text-default`, `.text-small`, `.text-tiny`, `.link`, `.text-bold`
- **List Groups**: `.list-group`, `.list-group-item`, `.list-group-item-active`

**Important**: Always use semantic class names (e.g., `.btn-success` for positive actions, `.btn-error` for destructive actions) rather than color-based names.

### Styling Approach
- Use the predefined semantic component classes from [src/styles.css](src/styles.css)
- All components support dark mode via the `.dark` class
- Extend with Tailwind utility classes as needed
- Use `@apply` in the components layer for new reusable components

## Development Guidelines

### Component Development
- Create standalone components only (no NgModules)
- Use signals for reactive state (e.g., `signal()`, `computed()`)
- Import dependencies directly in the component decorator's `imports` array
- Use semantic HTML with ARIA attributes for accessibility
- **ALWAYS create Storybook stories** for new UI components in [src/stories/](src/stories/)
- Follow the component structure: `.ts`, `.html`, `.css` files (no inline templates/styles)

### UI Components Library

The project includes a growing library of reusable UI components in [src/app/components/ui/](src/app/components/ui/):

#### Dropdown Component
Location: [src/app/components/ui/dropdown/](src/app/components/ui/dropdown/)

**Features:**
- ✅ Full keyboard navigation (Arrow keys, Enter, Escape, Home, End)
- ✅ WCAG accessibility compliant (ARIA attributes, roles)
- ✅ Search/filter functionality
- ✅ Clearable selection
- ✅ Loading state with spinner
- ✅ Disabled items and dividers
- ✅ Icon support
- ✅ Multiple sizes (sm, md, lg)
- ✅ Multiple variants (primary, secondary, outline)
- ✅ Position control (auto, top, bottom)
- ✅ Dark mode support

**Usage:**
```typescript
import { DropdownComponent, DropdownItem } from '@/components/ui/dropdown/dropdown.component';

// In component
items: DropdownItem[] = [
  { label: 'Option 1', value: 1, icon: '🏠' },
  { label: 'Option 2', value: 2 },
  { divider: true, label: '', value: 'div' },
  { label: 'Disabled', value: 3, disabled: true }
];
```

```html
<app-dropdown
  [items]="items"
  [searchable]="true"
  [clearable]="true"
  [size]="'md'"
  [variant]="'primary'"
  placeholder="Select option"
  (selectionChange)="onSelect($event)"
  (searchChange)="onSearch($event)"
/>
```

**Storybook:** See [src/stories/dropdown.stories.ts](src/stories/dropdown.stories.ts) for 17+ examples

### Template Files
- Component templates use `.html` extension (not inline)
- Style files use `.css` extension
- Prettier parses HTML files with the Angular parser

### Routing
- Routes are defined in [src/app/app.routes.ts](src/app/app.routes.ts)
- Use the `Routes` type from `@angular/router`
- Lazy loading can be configured with `loadComponent`

### Error Handling
- Global error listeners are provided via `provideBrowserGlobalErrorListeners()`
- Add component-level error handling as needed

### State Management
- Use Angular signals for reactive state
- No external state management library is currently configured
- RxJS is available for reactive programming patterns

### Storybook Guidelines

When creating new UI components, **ALWAYS create corresponding Storybook stories**:

1. **Location**: Create stories in [src/stories/](src/stories/) with naming: `component-name.stories.ts`

2. **Story Structure**:
```typescript
import type { Meta, StoryObj } from '@storybook/angular';
import { fn } from 'storybook/test';
import { YourComponent } from '../app/components/ui/your-component/your-component.component';

const meta: Meta<YourComponent> = {
  title: 'UI/YourComponent',
  component: YourComponent,
  tags: ['autodocs'],
  argTypes: {
    // Define controls
  },
  args: {
    // Default args with fn() for actions
  },
};

export default meta;
type Story = StoryObj<YourComponent>;

export const Default: Story = {
  args: { /* ... */ }
};
```

3. **Story Coverage**: Create stories for:
   - Default/basic usage
   - All variants and sizes
   - Different states (disabled, loading, error, etc.)
   - Edge cases (empty, long content, etc.)
   - Feature combinations

4. **Best Practices**:
   - Use `autodocs` tag for automatic documentation
   - Add `argTypes` for interactive controls
   - Use `fn()` from `storybook/test` for action logging
   - Group related stories with descriptive names
   - Add `parameters` for layout or other config when needed

## Dynamic Theming System

The application includes a complete **dynamic theming system** using CSS variables:

### Color System
- All colors are defined as CSS variables in [src/styles.css](src/styles.css)
- Variables automatically change based on light/dark mode via the `.dark` class
- Colors can be changed dynamically at runtime using JavaScript/TypeScript
- Main color categories: `primary`, `success`, `error`, `warning`, `info`, `secondary`, `dark`

### Live Theme Demo
[src/app/app.html](src/app/app.html) contains an interactive demo showing:
- **Two-column layout**: Left (light mode) vs Right (dark mode with `.dark` class)
- **Color controls**: Interactive color pickers to change theme colors in real-time
- **Component showcase**: Buttons, badges, alerts, forms, cards, progress bars in both themes

### Changing Colors Dynamically
```typescript
// Change a single color
document.documentElement.style.setProperty('--color-primary', '#ff0000');

// Or use the built-in methods in app.ts
onColorChange(variable: string, value: string, isDark: boolean)
```

### Adding New Colors
1. Add variables to `:root` and `.dark` sections in [src/styles.css](src/styles.css)
2. Use `var(--color-name)` in component styles
3. Add to color picker configuration in [src/app/app.ts](src/app/app.ts) if needed

## Design System - Complete Reference

Este proyecto incluye un sistema de diseño completo y profesional listo para reutilizar en cualquier proyecto desde cero.

### 1. Sistema de Colores

#### Paleta de Colores Semánticos
Cada color tiene una escala completa (50-900) siguiendo el estándar de Flowbite/Tailwind:

**Primary (Blue)**
- Variables: `--color-primary-50` hasta `--color-primary-900`
- Atajos: `--color-primary`, `--color-primary-hover`, `--color-primary-light`

**Success (Green)**
- Variables: `--color-success-50` hasta `--color-success-900`
- Atajos: `--color-success`, `--color-success-hover`, `--color-success-light`

**Error (Red)**
- Variables: `--color-error-50` hasta `--color-error-900`
- Atajos: `--color-error`, `--color-error-hover`, `--color-error-light`

**Warning (Yellow)**
- Variables: `--color-warning-50` hasta `--color-warning-900`
- Atajos: `--color-warning`, `--color-warning-hover`, `--color-warning-light`

**Info (Cyan)**
- Variables: `--color-info-50` hasta `--color-info-900`
- Atajos: `--color-info`, `--color-info-hover`, `--color-info-light`

**Gray (Neutral)**
- Variables: `--color-gray-50` hasta `--color-gray-900`

#### Colores de Contexto
- **Texto**: `--color-text-primary`, `--color-text-secondary`, `--color-text-tertiary`, `--color-text-muted`
- **Fondos**: `--color-bg-primary`, `--color-bg-secondary`, `--color-bg-tertiary`, `--color-bg-hover`
- **Bordes**: `--color-border-light`, `--color-border`, `--color-border-dark`

### 2. Sistema de Espaciado

Escala consistente de espaciado (padding/margin):
```css
--spacing-0: 0          /* 0px */
--spacing-1: 0.25rem    /* 4px */
--spacing-2: 0.5rem     /* 8px */
--spacing-3: 0.75rem    /* 12px */
--spacing-4: 1rem       /* 16px */
--spacing-5: 1.25rem    /* 20px */
--spacing-6: 1.5rem     /* 24px */
--spacing-8: 2rem       /* 32px */
--spacing-10: 2.5rem    /* 40px */
--spacing-12: 3rem      /* 48px */
--spacing-16: 4rem      /* 64px */
--spacing-20: 5rem      /* 80px */
--spacing-24: 6rem      /* 96px */
--spacing-32: 8rem      /* 128px */
```

**Uso**: `padding: var(--spacing-4);` o usa las clases de Tailwind (`p-4`, `m-6`, etc.)

### 3. Sistema Tipográfico

#### Tamaños de Fuente
```css
--font-size-xs: 0.75rem     /* 12px */
--font-size-sm: 0.875rem    /* 14px */
--font-size-base: 1rem      /* 16px */
--font-size-lg: 1.125rem    /* 18px */
--font-size-xl: 1.25rem     /* 20px */
--font-size-2xl: 1.5rem     /* 24px */
--font-size-3xl: 1.875rem   /* 30px */
--font-size-4xl: 2.25rem    /* 36px */
--font-size-5xl: 3rem       /* 48px */
--font-size-6xl: 3.75rem    /* 60px */
```

#### Alturas de Línea
```css
--line-height-none: 1
--line-height-tight: 1.25
--line-height-snug: 1.375
--line-height-normal: 1.5
--line-height-relaxed: 1.625
--line-height-loose: 2
```

#### Pesos de Fuente
```css
--font-weight-thin: 100
--font-weight-light: 300
--font-weight-normal: 400
--font-weight-medium: 500
--font-weight-semibold: 600
--font-weight-bold: 700
--font-weight-extrabold: 800
--font-weight-black: 900
```

#### Clases de Tipografía Semánticas
```html
<!-- Encabezados -->
<h1 class="heading-1">Título Principal</h1>    <!-- 3rem/48px, extrabold -->
<h2 class="heading-2">Título Sección</h2>      <!-- 2.25rem/36px, bold -->
<h3 class="heading-3">Subtítulo</h3>           <!-- 1.875rem/30px, bold -->
<h4 class="heading-4">Encabezado</h4>          <!-- 1.5rem/24px, bold -->
<h5 class="heading-5">Sub-encabezado</h5>      <!-- 1.25rem/20px, bold -->
<h6 class="heading-6">Título Pequeño</h6>      <!-- 1.125rem/18px, bold -->

<!-- Texto de cuerpo -->
<p class="text-lead">Texto introductorio destacado</p>     <!-- 18px, normal -->
<p class="text-large">Texto grande</p>                     <!-- 18px, semibold -->
<p class="text-default">Texto por defecto</p>              <!-- 16px, normal -->
<p class="text-small">Texto pequeño</p>                    <!-- 14px, normal -->
<p class="text-tiny">Texto muy pequeño</p>                 <!-- 12px, normal -->

<!-- Enlaces -->
<a href="#" class="link">Enlace</a>                        <!-- Con hover underline -->
<span class="text-bold">Texto en negrita</span>
```

### 4. Bordes y Radios

#### Border Radius
```css
--border-radius-none: 0
--border-radius-sm: 0.125rem    /* 2px */
--border-radius-base: 0.25rem   /* 4px */
--border-radius-md: 0.375rem    /* 6px */
--border-radius-lg: 0.5rem      /* 8px */
--border-radius-xl: 0.75rem     /* 12px */
--border-radius-2xl: 1rem       /* 16px */
--border-radius-3xl: 1.5rem     /* 24px */
--border-radius-full: 9999px    /* Completamente redondo */
```

**Clases**: `.rounded-none`, `.rounded`, `.rounded-lg`, `.rounded-full`, etc.

#### Anchos de Borde
```css
--border-width-0: 0
--border-width-1: 1px
--border-width-2: 2px
--border-width-4: 4px
--border-width-8: 8px
```

**Clases**: `.border`, `.border-t`, `.border-b`, `.border-l`, `.border-r`

### 5. Sombras

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
--shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1)
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1)
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25)
--shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)
--shadow-none: none
```

**Clases**: `.shadow-sm`, `.shadow`, `.shadow-md`, `.shadow-lg`, `.shadow-xl`, `.shadow-2xl`, `.shadow-inner`, `.shadow-none`

### 6. Transiciones

#### Duraciones
```css
--transition-duration-75: 75ms
--transition-duration-100: 100ms
--transition-duration-150: 150ms
--transition-duration-200: 200ms
--transition-duration-300: 300ms
--transition-duration-500: 500ms
```

#### Timing Functions
```css
--transition-timing-linear: linear
--transition-timing-ease: ease
--transition-timing-ease-in: ease-in
--transition-timing-ease-out: ease-out
--transition-timing-ease-in-out: ease-in-out
```

**Clases**: `.transition`, `.transition-fast`, `.transition-slow`

### 7. Z-Index

```css
--z-0: 0
--z-10: 10
--z-20: 20
--z-30: 30
--z-40: 40    /* Modals backdrop */
--z-50: 50    /* Modals, tooltips */
--z-auto: auto
```

### 8. Contenedores Responsivos

```css
--container-sm: 640px
--container-md: 768px
--container-lg: 1024px
--container-xl: 1280px
--container-2xl: 1536px
```

**Clases**: `.container-sm`, `.container-md`, `.container-lg`, `.container-xl`, `.container-2xl`

**Ejemplo**:
```html
<div class="container-lg">
  <!-- Contenido centrado con max-width de 1024px -->
</div>
```

### 9. Componentes Completos

Todos los componentes están documentados en la sección "Semantic Component System" arriba. Incluyen:

- **Botones**: 7 variantes de color + outline + 5 tamaños
- **Forms**: Inputs, labels, checkboxes, floating labels, validación
- **Cards**: Card, card-link, títulos, botones
- **Badges**: Variantes de color + pill
- **Alerts**: Con iconos y variantes semánticas
- **Navigation**: Navbar, breadcrumb, sidebar, tabs
- **Tables**: Headers, rows, cells, hover states
- **Progress**: Barras de progreso con variantes
- **UI Elements**: Spinners, pagination, tooltips, dropdowns, accordions
- **List Groups**: Listas interactivas
- **Timeline**: Línea de tiempo con iconos

### 10. Modo Oscuro (Dark Mode)

**Todo el sistema funciona automáticamente en modo oscuro**:

```html
<!-- Light mode por defecto -->
<div class="card">...</div>

<!-- Dark mode -->
<div class="dark">
  <div class="card">...</div>  <!-- Se ve oscuro automáticamente -->
</div>
```

Todas las variables CSS tienen versiones para light y dark mode definidas en [src/styles.css](src/styles.css).

### 11. Cómo Empezar un Proyecto desde Cero

#### Paso 1: Copiar el Sistema de Diseño
Copia estos archivos a tu nuevo proyecto:
- [src/styles.css](src/styles.css) - Sistema completo de diseño
- [.postcssrc.json](.postcssrc.json) - Configuración de Tailwind CSS v4

#### Paso 2: Usar los Componentes
```html
<!-- Ejemplo de página típica -->
<div class="container-xl">
  <!-- Header -->
  <header class="mb-8">
    <h1 class="heading-1">Mi Aplicación</h1>
    <p class="text-lead">Descripción de la aplicación</p>
  </header>

  <!-- Contenido principal -->
  <main class="space-y-6">
    <!-- Card con formulario -->
    <div class="card">
      <h2 class="heading-3 mb-4">Formulario de Contacto</h2>

      <form class="space-y-4">
        <div>
          <label class="form-label">Nombre</label>
          <input type="text" class="form-input" placeholder="Tu nombre">
        </div>

        <div>
          <label class="form-label">Email</label>
          <input type="email" class="form-input" placeholder="tu@email.com">
        </div>

        <div class="flex gap-3">
          <button type="submit" class="btn btn-primary">Enviar</button>
          <button type="button" class="btn btn-outline-secondary">Cancelar</button>
        </div>
      </form>
    </div>

    <!-- Tabla -->
    <div class="card">
      <h3 class="heading-4 mb-4">Usuarios</h3>
      <table class="table">
        <thead class="table-header">
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr class="table-row">
            <td class="table-cell">John Doe</td>
            <td class="table-cell">john@example.com</td>
            <td class="table-cell">
              <span class="badge badge-success">Activo</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</div>
```

#### Paso 3: Personalizar Colores
Modifica las variables CSS en `:root` para cambiar los colores base:
```css
:root {
  --color-primary: #tu-color;
  --color-success: #tu-color;
  /* etc. */
}
```

### 12. Mejores Prácticas

1. **Usa clases semánticas**: Prefiere `.btn-success` sobre `.btn-green`
2. **Respeta el espaciado**: Usa la escala de espaciado definida
3. **Modo oscuro**: Siempre prueba tus componentes en ambos modos
4. **Variables CSS**: Usa `var(--variable)` para todos los colores y tamaños
5. **Accesibilidad**: Añade atributos ARIA donde sea necesario
6. **Responsive**: Usa las clases de Tailwind para breakpoints (`md:`, `lg:`, etc.)

## Component Development Workflow

When creating new UI components, follow this workflow:

1. **Create Component Files**:
   ```bash
   ng generate component components/ui/component-name
   ```

2. **Implement Component**:
   - Use Angular signals for state (`signal()`, `computed()`)
   - Add proper TypeScript types and interfaces
   - Use CSS variables from the design system
   - Implement ARIA attributes for accessibility
   - Support dark mode via CSS variables

3. **Create Storybook Stories**:
   - Create `src/stories/component-name.stories.ts`
   - Add multiple stories covering all use cases
   - Use `autodocs` tag for automatic documentation
   - Add interactive controls with `argTypes`

4. **Test in Storybook**:
   ```bash
   npm run storybook
   ```
   - Verify all variants work correctly
   - Test in both light and dark modes
   - Test keyboard navigation and accessibility
   - Test responsive behavior

5. **Document Component**:
   - Update this CLAUDE.md with component info
   - Add usage examples
   - List all features and props

## Notes
- The application currently shows a live theming demo with two-column comparison (light/dark)
- Spanish is used in the example content (loan application context: "Confiape Loan")
- All hardcoded colors have been replaced with CSS variables for maximum flexibility
- El sistema de diseño está completo y listo para producción
- **Storybook** is configured and ready for component development and documentation
- All UI components should be created in `src/app/components/ui/` with corresponding stories in `src/stories/`
