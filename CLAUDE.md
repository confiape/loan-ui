# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Angular 20 application named "loan-ui" - a loan management UI with a semantic component design system built on Tailwind CSS v4. The application uses Angular's zoneless change detection and standalone components architecture.

## Development Commands

```bash
# Development
npm start                    # Dev server (http://localhost:4200)
ng serve                     # Same as above
npm run build                # Production build
npm run watch                # Development build with watch mode

# Testing
npm test                     # Run all tests with Karma

# Storybook
npm run storybook            # Start Storybook (http://localhost:6006)
npm run build-storybook      # Build static Storybook

# Angular CLI
ng generate component components/ui/nombre --standalone
ng generate service services/nombre
ng generate --help           # See all schematics
```

### Prettier Configuration
- Print width: 100
- Single quotes
- Angular parser for HTML files

## Architecture

### Angular Configuration
- **Version**: Angular 20.3.0
- **Change Detection**: Zoneless (`provideZonelessChangeDetection`)
- **Routing**: Configured via `provideRouter` in [src/app/app.config.ts](src/app/app.config.ts)
- **Components**: Standalone components (no NgModules)
- **TypeScript**: Strict mode enabled with all strictness flags

### Application Structure
```
loan-ui/
├── src/
│   ├── app/
│   │   ├── components/ui/         # UI components
│   │   ├── app.ts                 # Root component
│   │   ├── app.config.ts          # App configuration
│   │   └── app.routes.ts          # Routes
│   ├── stories/                   # Storybook stories
│   │   └── story-helpers.ts       # Helper functions
│   └── styles.css                 # Design system (600+ CSS variables)
├── .storybook/                    # Storybook config
└── CLAUDE.md                      # This file
```

### TypeScript Configuration
Strict settings enabled ([tsconfig.json](tsconfig.json)):
- All strict compiler options enabled
- `isolatedModules: true`
- `experimentalDecorators: true`
- Target: ES2022

### Build Configuration
Angular application builder ([angular.json](angular.json)):
- **Builder**: `@angular/build:application`
- **Bundle Budgets**: Initial 500kB warning / 1MB error

## Styling System

### Tailwind CSS v4 with PostCSS
- Configured via [.postcssrc.json](.postcssrc.json)
- Uses `@tailwindcss/postcss` plugin
- Global import in [src/styles.css](src/styles.css): `@import "tailwindcss";`

### Dark Mode & Theming
All colors are CSS variables that automatically change with the `.dark` class:

```css
/* Custom dark mode variant */
@custom-variant dark (&:where(.dark, .dark *));
```

**Usage:**
```html
<div class="dark">
  <!-- All children use dark mode colors -->
</div>
```

**Dynamic color changes:**
```typescript
// Change colors at runtime
document.documentElement.style.setProperty('--color-primary', '#ff0000');
```

**Live demo:** [src/app/app.html](src/app/app.html) contains interactive color picker demo

### Semantic Component System

Comprehensive design system in [src/styles.css](src/styles.css) with 600+ CSS variables.

**Color Variants**: `primary`, `secondary`, `success`, `error`, `warning`, `info`, `dark`

**Key Components:**
- **Buttons**: `.btn`, `.btn-{variant}`, `.btn-outline-{variant}`, sizes: `xs`, `sm`, `md`, `lg`, `xl`
- **Forms**: `.form-label`, `.form-input`, `.form-checkbox`, `.floating-input`
- **Cards**: `.card`, `.card-title`, `.card-text`, `.card-btn`
- **Badges/Alerts**: `.badge-{variant}`, `.alert-{variant}`
- **Navigation**: `.navbar`, `.breadcrumb`, `.sidebar`, `.pagination`
- **Tables**: `.table`, `.table-header`, `.table-row`, `.table-cell`
- **UI Elements**: `.spinner`, `.tabs`, `.toast`, `.tooltip`, `.dropdown`, `.accordion`, `.modal`
- **Typography**: `.heading-{1-6}`, `.text-{lead|large|small|tiny}`, `.link`

**Key CSS Variables:**
```css
/* Colors */
var(--color-primary), var(--color-success), var(--color-error)
var(--color-text-primary), var(--color-bg-primary), var(--color-border)

/* Spacing */
var(--spacing-2)    /* 8px */
var(--spacing-4)    /* 16px */

/* Typography */
var(--font-size-sm), var(--font-size-base), var(--font-size-lg)

/* Borders & Shadows */
var(--border-radius-md), var(--shadow-lg)

/* Transitions */
var(--transition-duration-150), var(--transition-timing-ease)
```

**Styling Rules:**
- ✅ ALWAYS use CSS variables from design system
- ❌ NEVER use hardcoded colors (`#fff`, `rgb()`, etc.)
- ✅ Use semantic class names (`.btn-success` not `.btn-green`)
- ✅ Extend with Tailwind utilities as needed

## Development Guidelines

### Component Development Essentials
- Create standalone components only (no NgModules)
- Use Angular signals: `input()`, `output()`, `signal()`, `computed()`
- Use modern template syntax: `@if`, `@for`, `@else`, `@empty`
- Import dependencies in component's `imports` array
- Implement ARIA attributes and keyboard navigation
- **ALWAYS create Storybook stories** for UI components
- File structure: `.ts`, `.html`, `.css` (no inline templates/styles)

**Angular Signals Pattern:**
```typescript
// Inputs/Outputs
variant = input<string>('primary');
onChange = output<string>();

// State & Computed
isOpen = signal(false);
displayValue = computed(() => this.isOpen() ? 'Open' : 'Closed');

// Updates
this.isOpen.set(true);
this.isOpen.update(v => !v);
this.onChange.emit('value');
```

### UI Components Library

Reusable components in [src/app/components/ui/](src/app/components/ui/):

**Available Components:**
- **Dropdown** - Full keyboard nav, search, clearable, loading states
- **MultiSelect** - Multi-selection with badges, search, select all
- **Modal** - Dialog with backdrop, focus trap, keyboard close
- **Tabs** - Multiple variants (pills, underline, vertical, justified)
- **Sidenav** - Collapsible navigation with icons

**All components include:**
- ✅ Full keyboard navigation
- ✅ WCAG accessibility (ARIA)
- ✅ Multiple variants & sizes
- ✅ Dark mode support
- ✅ Storybook stories

**Reference:** See existing components for implementation patterns. Copy and modify for new components.

### Storybook Guidelines

**CRITICAL:** All UI components MUST have stories with Light/Dark comparison using helpers from [src/stories/story-helpers.ts](src/stories/story-helpers.ts).

**Basic Story Template:**
```typescript
import type { Meta, StoryObj } from '@storybook/angular';
import { fn } from '@storybook/test';
import { YourComponent } from '../app/components/ui/your-component/your-component.component';
import { createLightDarkComparison } from './story-helpers';

const meta: Meta<YourComponent> = {
  title: 'UI/YourComponent',
  component: YourComponent,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },  // Required!
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  args: { onChange: fn() },
};

export default meta;
type Story = StoryObj<YourComponent>;

export const Default: Story = {
  args: { variant: 'primary', size: 'md' },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-your-component',
      `[variant]="variant" [size]="size"`
    ),
  }),
};
```

**Helper Functions:**
- `createLightDarkComparison(tag, bindings)` - For simple components
- `wrapInLightDarkComparison(template)` - For complex templates
- `createLightDarkRender(tag, bindings)` - Shorthand for render functions

**Story Coverage Checklist:**
- ✅ Default/basic usage
- ✅ All variants (primary, secondary, outline, etc.)
- ✅ All sizes (xs, sm, md, lg, xl)
- ✅ States (disabled, loading, error, success)
- ✅ Edge cases (empty, long content, overflow)
- ✅ Feature combinations
- ✅ Keyboard navigation demos

**Examples:** See [dropdown.stories.ts](src/stories/dropdown.stories.ts), [multiselect.stories.ts](src/stories/multiselect.stories.ts), [modal.stories.ts](src/stories/modal.stories.ts)

## Component Development Workflow

### Step-by-Step Process

#### 1. Generate Component
```bash
ng generate component components/ui/component-name --standalone
```

#### 2. Implement Component
- Define TypeScript interfaces and types
- Use `input()` for props, `output()` for events
- Use `signal()` for internal state, `computed()` for derived values
- Organize code in sections: Inputs → Outputs → State → Computed → Methods
- Implement keyboard navigation
- See [dropdown.component.ts](src/app/components/ui/dropdown/dropdown.component.ts) for reference

#### 3. Build Template
- Use modern syntax: `@if`, `@for`, `@else`, `@empty`
- Add complete ARIA attributes (`role`, `aria-label`, `aria-expanded`, etc.)
- Use semantic HTML structure
- See [dropdown.component.html](src/app/components/ui/dropdown/dropdown.component.html) for reference

#### 4. Style with Design System
- Use ONLY CSS variables (never hardcoded colors)
- Organize in sections with clear comments
- Implement variants, sizes, and states
- Add focus states and transitions
- See [dropdown.component.css](src/app/components/ui/dropdown/dropdown.component.css) for reference

#### 5. Create Storybook Stories
- Use `createLightDarkComparison()` helper
- Create 5-10+ stories covering all cases
- Add `layout: 'fullscreen'` parameter
- Use `fn()` for action logging
- See [dropdown.stories.ts](src/stories/dropdown.stories.ts) for reference

#### 6. Test in Storybook
```bash
npm run storybook
```

**Verify:**
- ✅ All variants/sizes work
- ✅ Light & Dark mode look correct
- ✅ Keyboard navigation works
- ✅ No hardcoded colors
- ✅ Smooth transitions
- ✅ Focus states visible

#### 7. Document
Add section to this CLAUDE.md under "UI Components Library" with:
- Features list
- Basic usage example
- Link to Storybook stories

### Component Checklist

Before considering a component complete:

- [ ] Component uses `standalone: true`
- [ ] Uses Angular signals (`input`, `output`, `signal`, `computed`)
- [ ] Template uses modern syntax (`@if`, `@for`, `@empty`)
- [ ] ALL CSS variables from design system (no hardcoded colors)
- [ ] Keyboard navigation implemented
- [ ] Complete ARIA attributes
- [ ] Works in Light & Dark mode
- [ ] Stories created with helper functions
- [ ] Stories have `layout: 'fullscreen'`
- [ ] Minimum 5-10 stories covering main cases
- [ ] Documented in CLAUDE.md
- [ ] TypeScript interfaces defined
- [ ] ArgTypes have descriptions

## Recursos y Links Útiles

### Documentación Oficial
- **Angular 20**: https://angular.dev
- **Tailwind CSS v4**: https://tailwindcss.com/docs
- **Storybook Angular**: https://storybook.js.org/docs/angular
- **Angular Signals**: https://angular.dev/guide/signals

### Archivos Clave del Proyecto
- **Design System**: [src/styles.css](src/styles.css) - 600+ CSS variables
- **Story Helpers**: [src/stories/story-helpers.ts](src/stories/story-helpers.ts)
- **Root Component**: [src/app/app.ts](src/app/app.ts) - Live theming demo
- **App Config**: [src/app/app.config.ts](src/app/app.config.ts)

### Componentes de Referencia
- **Dropdown**: [src/app/components/ui/dropdown/](src/app/components/ui/dropdown/)
- **MultiSelect**: [src/app/components/ui/multiselect/](src/app/components/ui/multiselect/)
- **Modal**: [src/app/components/ui/modal/](src/app/components/ui/modal/)
- **Tabs**: [src/app/components/ui/tabs/](src/app/components/ui/tabs/)
- **Sidenav**: [src/app/components/ui/sidenav/](src/app/components/ui/sidenav/)

### Stories de Referencia
- [dropdown.stories.ts](src/stories/dropdown.stories.ts) - 17 stories
- [multiselect.stories.ts](src/stories/multiselect.stories.ts) - 21 stories
- [modal.stories.ts](src/stories/modal.stories.ts) - 17 stories with wrapper
- [tabs.stories.ts](src/stories/tabs.stories.ts) - 40+ stories

## Notas Importantes

### Estado del Proyecto
- ✅ Sistema de diseño completo con 600+ variables CSS
- ✅ Dark mode funcionando en todos los componentes
- ✅ Storybook configurado con comparación Light/Dark automática
- ✅ 5 componentes UI completos (dropdown, multiselect, modal, tabs, sidenav)
- ✅ Helper functions para crear stories fácilmente
- ✅ Angular 20 con signals y sintaxis moderna
- ✅ Tailwind CSS v4 con PostCSS
- ✅ TypeScript strict mode
- ✅ Standalone components (no NgModules)

### Convenciones del Proyecto
- **Idioma**: Español en contenido de ejemplo, inglés en código
- **Nomenclatura**: camelCase para variables, kebab-case para archivos
- **Imports**: Usar rutas relativas, no alias
- **Standalone**: Todos los componentes son standalone
- **Signals**: Usar signals para estado, no decorators antiguos (`@Input()`, `@Output()`)
- **Templates**: Sintaxis moderna (`@if`, `@for`) no directivas (`*ngIf`, `*ngFor`)
- **Styles**: SIEMPRE usar variables CSS, NUNCA colores hardcoded
- **Storybook**: SIEMPRE crear stories con comparación Light/Dark
- **Accessibility**: SIEMPRE implementar ARIA attributes y keyboard navigation

### Tips Rápidos

1. **Preview colores**: Abre [src/app/app.html](src/app/app.html) para demo interactivo con color pickers
2. **Ver variables CSS**: Busca `:root {` en [src/styles.css](src/styles.css)
3. **Crear componente rápido**: Copia [dropdown/](src/app/components/ui/dropdown/) y modifica
4. **Debug Storybook**: Verifica `layout: 'fullscreen'` en parameters
5. **Test dark mode**: Añade clase `.dark` a cualquier elemento padre

---

**Última actualización**: Octubre 2024
**Mantenedores**: Claude Code AI
**Licencia**: MIT
