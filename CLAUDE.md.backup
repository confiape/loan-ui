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

#### 1. Location and Naming
Create stories in [src/stories/](src/stories/) with naming: `component-name.stories.ts`

#### 2. Story Structure with Light/Dark Comparison

**IMPORTANTE**: Todos los stories DEBEN incluir comparación Light/Dark mode usando las funciones helper de [src/stories/story-helpers.ts](src/stories/story-helpers.ts)

**Para componentes simples (dropdown, multiselect, buttons, etc.):**
```typescript
import type { Meta, StoryObj } from '@storybook/angular';
import { fn } from '@storybook/test';
import { YourComponent } from '../app/components/ui/your-component/your-component.component';
import { createLightDarkComparison } from './story-helpers';

const meta: Meta<YourComponent> = {
  title: 'UI/YourComponent',
  component: YourComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',  // IMPORTANTE para comparación lado a lado
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline'],
      description: 'Visual style variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Component size',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the component is disabled',
    },
  },
  args: {
    // Usa fn() de @storybook/test para action logging
    onChange: fn(),
    onClick: fn(),
  },
};

export default meta;
type Story = StoryObj<YourComponent>;

// Story con comparación Light/Dark
export const Default: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    placeholder: 'Enter value',
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-your-component',
      `[variant]="variant"
        [size]="size"
        [placeholder]="placeholder"
        (onChange)="onChange($event)"`
    ),
  }),
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'md',
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-your-component',
      `[variant]="variant"
        [size]="size"`
    ),
  }),
};
```

**Para componentes complejos con templates custom (modals, dialogs, etc.):**
```typescript
import { wrapInLightDarkComparison } from './story-helpers';

export const ComplexStory: Story = {
  render: (args) => ({
    props: args,
    template: wrapInLightDarkComparison(`
      <app-modal [isOpen]="true" [title]="'Modal Title'">
        <p>Modal content goes here</p>
        <div modal-footer>
          <button class="btn btn-primary">Confirm</button>
        </div>
      </app-modal>
    `),
    moduleMetadata: {
      imports: [ModalComponent],
    },
  }),
};
```

#### 3. Helper Functions Disponibles

El archivo [src/stories/story-helpers.ts](src/stories/story-helpers.ts) provee funciones reutilizables:

**`createLightDarkComparison(componentTag, bindings)`**
- Para componentes simples
- Crea grid 2 columnas: Light mode (izquierda) + Dark mode (derecha)
- Parámetros:
  - `componentTag`: Selector del componente (ej: `'app-dropdown'`)
  - `bindings`: String con los bindings de Angular (ej: `'[items]="items" [variant]="variant"'`)
- Retorna: Template string HTML listo para usar

**`wrapInLightDarkComparison(template)`**
- Para componentes complejos con templates personalizados
- Envuelve cualquier template HTML en el grid Light/Dark
- Parámetros:
  - `template`: Template HTML completo
- Retorna: Template string HTML envuelto

**`createLightDarkRender(componentTag, bindings)`**
- Shorthand para crear render functions
- Retorna función render completa lista para usar
- Uso: `render: createLightDarkRender('app-component', '[prop]="prop"')`

**`generateBindings(props)`**
- Helper para generar bindings automáticamente desde objeto
- Menos usado, para casos avanzados

#### 4. Características del Sistema Light/Dark

Cada story mostrará:
- **Columna Izquierda**: Light Mode
  - Fondo claro (`#f9fafb`)
  - Label "Light Mode" en la parte superior
- **Columna Derecha**: Dark Mode
  - Fondo oscuro (`#1f2937`)
  - Clase `.dark` aplicada
  - Label "Dark Mode" en la parte superior
- **Divisor**: Línea negra de 2px entre ambos modos
- **Layout**: Fullscreen para mejor visualización
- **Responsivo**: Grid adaptable

#### 5. Story Coverage

Create stories for:
- ✅ Default/basic usage
- ✅ All variants (primary, secondary, outline, etc.)
- ✅ All sizes (xs, sm, md, lg, xl)
- ✅ Different states (disabled, loading, error, success)
- ✅ Edge cases (empty, long content, overflow)
- ✅ Feature combinations (icons + badges, searchable + clearable, etc.)
- ✅ Accessibility demos (keyboard navigation)
- ✅ Complex examples (real-world use cases)

#### 6. Best Practices

1. **SIEMPRE usa las helper functions** - No crear templates manualmente
2. **Layout fullscreen** - Añade `layout: 'fullscreen'` en parameters
3. **AutoDocs** - Usa tag `autodocs` para documentación automática
4. **ArgTypes** - Define controles interactivos para todas las props importantes
5. **Action Logging** - Usa `fn()` de `@storybook/test` para eventos
6. **Nombres descriptivos** - Usa nombres claros (ej: `WithIconsAndBadges`, `DisabledState`)
7. **Agrupa stories** - Organiza por categorías (Basic, With Icons, States, Complex)
8. **Prueba ambos modos** - Siempre verifica que se vea bien en Light y Dark mode
9. **Documenta props** - Añade `description` en cada argType
10. **Sample data** - Define data de ejemplo reutilizable al inicio del file

#### 7. Ejemplos de Stories Completos

**Ver estos archivos como referencia:**
- ✅ [src/stories/dropdown.stories.ts](src/stories/dropdown.stories.ts) - 17 stories, componente simple
- ✅ [src/stories/multiselect.stories.ts](src/stories/multiselect.stories.ts) - 21 stories, componente con múltiples features
- ✅ [src/stories/modal.stories.ts](src/stories/modal.stories.ts) - 17 stories, componente complejo con wrapper
- ⏳ [src/stories/tabs.stories.ts](src/stories/tabs.stories.ts) - 40+ stories, múltiples variantes

#### 8. Template de Story Mínimo

```typescript
import type { Meta, StoryObj } from '@storybook/angular';
import { YourComponent } from '../app/components/ui/your-component/your-component.component';
import { createLightDarkComparison } from './story-helpers';

const meta: Meta<YourComponent> = {
  title: 'UI/YourComponent',
  component: YourComponent,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<YourComponent>;

export const Default: Story = {
  args: { /* props */ },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison('app-your-component', `[prop]="prop"`),
  }),
};
```

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

## Component Development Workflow

### Workflow Completo: Crear un Componente UI desde Cero

Sigue este proceso paso a paso para crear componentes UI profesionales y completos:

#### Paso 1: Generar Estructura del Componente

```bash
ng generate component components/ui/component-name --standalone
```

Esto crea:
- `src/app/components/ui/component-name/component-name.component.ts`
- `src/app/components/ui/component-name/component-name.component.html`
- `src/app/components/ui/component-name/component-name.component.css`
- `src/app/components/ui/component-name/component-name.component.spec.ts`

#### Paso 2: Implementar el Componente TypeScript

**Estructura recomendada:**

```typescript
import { Component, signal, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

// Define interfaces para props y tipos
export interface ComponentNameItem {
  id: string;
  label: string;
  value: any;
  icon?: string;
  disabled?: boolean;
}

export type ComponentVariant = 'primary' | 'secondary' | 'outline' | 'success' | 'error';
export type ComponentSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-component-name',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './component-name.component.html',
  styleUrl: './component-name.component.css',
})
export class ComponentNameComponent {
  // ==========================================
  // INPUTS (usando Angular signals input())
  // ==========================================

  items = input<ComponentNameItem[]>([]);
  variant = input<ComponentVariant>('primary');
  size = input<ComponentSize>('md');
  disabled = input<boolean>(false);
  placeholder = input<string>('');

  // ==========================================
  // OUTPUTS (usando Angular signals output())
  // ==========================================

  selectionChange = output<ComponentNameItem>();
  itemClick = output<ComponentNameItem>();

  // ==========================================
  // STATE (usando signals)
  // ==========================================

  isOpen = signal<boolean>(false);
  selectedItem = signal<ComponentNameItem | null>(null);
  focusedIndex = signal<number>(-1);

  // ==========================================
  // COMPUTED (valores derivados)
  // ==========================================

  componentClasses = computed(() => {
    const variant = this.variant();
    const size = this.size();
    const disabled = this.disabled();

    return {
      [`component-${variant}`]: true,
      [`component-${size}`]: true,
      'component-disabled': disabled,
    };
  });

  filteredItems = computed(() => {
    return this.items().filter(item => !item.disabled);
  });

  // ==========================================
  // METHODS
  // ==========================================

  toggleOpen() {
    if (!this.disabled()) {
      this.isOpen.update(v => !v);
    }
  }

  selectItem(item: ComponentNameItem) {
    if (!item.disabled) {
      this.selectedItem.set(item);
      this.selectionChange.emit(item);
      this.isOpen.set(false);
    }
  }

  // Keyboard navigation
  handleKeyDown(event: KeyboardEvent) {
    switch(event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.focusNext();
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.focusPrevious();
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.selectFocused();
        break;
      case 'Escape':
        this.isOpen.set(false);
        break;
    }
  }

  private focusNext() {
    const items = this.filteredItems();
    const currentIndex = this.focusedIndex();
    const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
    this.focusedIndex.set(nextIndex);
  }

  private focusPrevious() {
    const items = this.filteredItems();
    const currentIndex = this.focusedIndex();
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
    this.focusedIndex.set(prevIndex);
  }

  private selectFocused() {
    const items = this.filteredItems();
    const index = this.focusedIndex();
    if (index >= 0 && index < items.length) {
      this.selectItem(items[index]);
    }
  }
}
```

**Puntos clave:**
- ✅ Usa `input()` para props (reemplaza `@Input()`)
- ✅ Usa `output()` para events (reemplaza `@Output()`)
- ✅ Usa `signal()` para estado interno
- ✅ Usa `computed()` para valores derivados
- ✅ Define interfaces y tipos TypeScript
- ✅ Implementa keyboard navigation completo
- ✅ Agrupa código en secciones claras (Inputs, Outputs, State, Computed, Methods)

#### Paso 3: Implementar el Template HTML

**Estructura recomendada:**

```html
<div
  class="component-wrapper"
  [ngClass]="componentClasses()"
  [attr.data-variant]="variant()"
  [attr.data-size]="size()"
>
  <!-- Button/Trigger -->
  <button
    type="button"
    class="component-trigger"
    [disabled]="disabled()"
    [attr.aria-expanded]="isOpen()"
    [attr.aria-haspopup]="true"
    [attr.aria-label]="placeholder()"
    (click)="toggleOpen()"
    (keydown)="handleKeyDown($event)"
  >
    @if (selectedItem(); as item) {
      <span class="component-selected">
        @if (item.icon) {
          <span class="component-icon">{{ item.icon }}</span>
        }
        <span class="component-label">{{ item.label }}</span>
      </span>
    } @else {
      <span class="component-placeholder">{{ placeholder() }}</span>
    }

    <span class="component-arrow" [class.open]="isOpen()">▼</span>
  </button>

  <!-- Dropdown Menu -->
  @if (isOpen()) {
    <div
      class="component-menu"
      role="listbox"
      [attr.aria-label]="'Options list'"
    >
      @for (item of items(); track item.id) {
        @if (!item.disabled) {
          <div
            class="component-item"
            role="option"
            [class.selected]="selectedItem()?.id === item.id"
            [class.focused]="$index === focusedIndex()"
            [attr.aria-selected]="selectedItem()?.id === item.id"
            (click)="selectItem(item)"
          >
            @if (item.icon) {
              <span class="component-item-icon">{{ item.icon }}</span>
            }
            <span class="component-item-label">{{ item.label }}</span>
          </div>
        } @else {
          <div class="component-item component-item-disabled">
            @if (item.icon) {
              <span class="component-item-icon">{{ item.icon }}</span>
            }
            <span class="component-item-label">{{ item.label }}</span>
          </div>
        }
      }

      @empty {
        <div class="component-empty">No items available</div>
      }
    </div>
  }
</div>
```

**Puntos clave:**
- ✅ Usa sintaxis moderna `@if`, `@for`, `@else`, `@empty`
- ✅ Implementa ARIA attributes completos (roles, aria-label, aria-expanded, etc.)
- ✅ Usa `[ngClass]` y `computed()` para clases dinámicas
- ✅ Estructura semántica clara
- ✅ Manejo de estados (selected, focused, disabled, empty)

#### Paso 4: Implementar los Estilos CSS

**Usa el sistema de diseño:**

```css
/* component-name.component.css */

.component-wrapper {
  position: relative;
  display: inline-block;
  width: 100%;
}

/* ==========================================
   TRIGGER BUTTON
   ========================================== */

.component-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-2);
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-normal);
  border: var(--border-width-1) solid var(--color-border);
  border-radius: var(--border-radius-lg);
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all var(--transition-duration-150) var(--transition-timing-ease);
}

.component-trigger:hover:not(:disabled) {
  background-color: var(--color-bg-hover);
  border-color: var(--color-primary);
}

.component-trigger:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.component-trigger:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ==========================================
   VARIANTS
   ========================================== */

.component-primary .component-trigger {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.component-primary .component-trigger:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
}

.component-secondary .component-trigger {
  background-color: var(--color-secondary);
  color: white;
  border-color: var(--color-secondary);
}

.component-outline .component-trigger {
  background-color: transparent;
  border-color: var(--color-border);
  color: var(--color-text-primary);
}

/* ==========================================
   SIZES
   ========================================== */

.component-sm .component-trigger {
  padding: var(--spacing-2) var(--spacing-3);
  font-size: var(--font-size-sm);
}

.component-md .component-trigger {
  padding: var(--spacing-3) var(--spacing-4);
  font-size: var(--font-size-base);
}

.component-lg .component-trigger {
  padding: var(--spacing-4) var(--spacing-5);
  font-size: var(--font-size-lg);
}

/* ==========================================
   DROPDOWN MENU
   ========================================== */

.component-menu {
  position: absolute;
  top: calc(100% + var(--spacing-1));
  left: 0;
  right: 0;
  z-index: var(--z-50);
  max-height: 300px;
  overflow-y: auto;
  background-color: var(--color-bg-primary);
  border: var(--border-width-1) solid var(--color-border);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: var(--spacing-2);
}

.component-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-3) var(--spacing-4);
  cursor: pointer;
  border-radius: var(--border-radius-md);
  color: var(--color-text-primary);
  transition: all var(--transition-duration-150) var(--transition-timing-ease);
}

.component-item:hover {
  background-color: var(--color-bg-hover);
}

.component-item.focused {
  background-color: var(--color-bg-hover);
  outline: 2px solid var(--color-primary);
  outline-offset: -2px;
}

.component-item.selected {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  font-weight: var(--font-weight-semibold);
}

.component-item-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.component-empty {
  padding: var(--spacing-4);
  text-align: center;
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

/* ==========================================
   ICONS & LABELS
   ========================================== */

.component-icon,
.component-item-icon {
  display: inline-flex;
  font-size: 1.2em;
}

.component-arrow {
  transition: transform var(--transition-duration-150) var(--transition-timing-ease);
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.component-arrow.open {
  transform: rotate(180deg);
}

/* ==========================================
   DARK MODE
   ========================================== */

/* Todas las variables CSS ya se adaptan automáticamente con .dark */
/* Si necesitas estilos específicos para dark mode: */

:host-context(.dark) .component-trigger {
  /* Estilos específicos dark mode si es necesario */
}
```

**Puntos clave:**
- ✅ Usa TODAS las variables CSS del design system
- ✅ NO uses colores hardcoded (ej: `#fff`, `rgb()`)
- ✅ Organiza en secciones claras con comentarios
- ✅ Implementa variants, sizes, states
- ✅ Transiciones suaves
- ✅ Focus states para accesibilidad
- ✅ Dark mode funciona automáticamente via variables CSS

#### Paso 5: Crear Storybook Stories

Crea `src/stories/component-name.stories.ts`:

```typescript
import type { Meta, StoryObj } from '@storybook/angular';
import { fn } from '@storybook/test';
import { ComponentNameComponent, ComponentNameItem } from '../app/components/ui/component-name/component-name.component';
import { createLightDarkComparison } from './story-helpers';

const meta: Meta<ComponentNameComponent> = {
  title: 'UI/ComponentName',
  component: ComponentNameComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline'],
      description: 'Visual style variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Component size',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the component is disabled',
    },
  },
  args: {
    selectionChange: fn(),
    itemClick: fn(),
  },
};

export default meta;
type Story = StoryObj<ComponentNameComponent>;

// Sample data
const basicItems: ComponentNameItem[] = [
  { id: '1', label: 'Option 1', value: 1 },
  { id: '2', label: 'Option 2', value: 2 },
  { id: '3', label: 'Option 3', value: 3 },
];

const itemsWithIcons: ComponentNameItem[] = [
  { id: 'home', label: 'Home', value: 'home', icon: '🏠' },
  { id: 'profile', label: 'Profile', value: 'profile', icon: '👤' },
  { id: 'settings', label: 'Settings', value: 'settings', icon: '⚙️' },
];

// Stories
export const Default: Story = {
  args: {
    items: basicItems,
    variant: 'primary',
    size: 'md',
    placeholder: 'Select an option',
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-component-name',
      `[items]="items"
        [variant]="variant"
        [size]="size"
        [placeholder]="placeholder"
        (selectionChange)="selectionChange($event)"`
    ),
  }),
};

export const WithIcons: Story = {
  args: {
    items: itemsWithIcons,
    variant: 'outline',
    size: 'md',
    placeholder: 'Choose an option',
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-component-name',
      `[items]="items"
        [variant]="variant"
        [size]="size"
        [placeholder]="placeholder"`
    ),
  }),
};

export const Disabled: Story = {
  args: {
    items: basicItems,
    disabled: true,
    placeholder: 'Disabled component',
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-component-name',
      `[items]="items"
        [disabled]="disabled"
        [placeholder]="placeholder"`
    ),
  }),
};

// ... más stories para todas las variantes, tamaños, estados
```

#### Paso 6: Probar en Storybook

```bash
npm run storybook
```

**Checklist de pruebas:**
- ✅ Todos los variants se ven correctos (primary, secondary, outline, etc.)
- ✅ Todos los sizes funcionan (sm, md, lg)
- ✅ Light mode y Dark mode se ven bien lado a lado
- ✅ Keyboard navigation funciona (Arrow keys, Enter, Escape, Tab)
- ✅ Estados disabled, loading, error se muestran correctamente
- ✅ Responsive design funciona en diferentes tamaños
- ✅ No hay colores hardcoded (todo usa variables CSS)
- ✅ Transiciones son suaves
- ✅ Focus states son visibles

#### Paso 7: Documentar el Componente

Actualiza este CLAUDE.md agregando una sección en "UI Components Library":

```markdown
#### ComponentName Component
Location: [src/app/components/ui/component-name/](src/app/components/ui/component-name/)

**Features:**
- ✅ Full keyboard navigation
- ✅ WCAG accessibility compliant
- ✅ Multiple variants (primary, secondary, outline)
- ✅ Multiple sizes (sm, md, lg)
- ✅ Dark mode support
- ✅ Icon support
- ✅ Disabled state

**Usage:**
\`\`\`typescript
import { ComponentNameComponent, ComponentNameItem } from '@/components/ui/component-name/component-name.component';

items: ComponentNameItem[] = [
  { id: '1', label: 'Option 1', value: 1, icon: '🏠' },
];
\`\`\`

\`\`\`html
<app-component-name
  [items]="items"
  [variant]="'primary'"
  [size]="'md'"
  (selectionChange)="onSelect($event)"
/>
\`\`\`

**Storybook:** See [src/stories/component-name.stories.ts](src/stories/component-name.stories.ts)
```

#### Paso 8: Crear README (Opcional)

Crea `src/app/components/ui/component-name/README.md` con documentación completa del componente.

### Checklist Final

Antes de considerar el componente completo, verifica:

- [ ] Componente usa standalone: true
- [ ] Usa Angular signals (input, output, signal, computed)
- [ ] Template usa sintaxis moderna (@if, @for, @empty)
- [ ] TODAS las variables CSS son del design system
- [ ] NO hay colores hardcoded
- [ ] Keyboard navigation implementado
- [ ] ARIA attributes completos
- [ ] Funciona en Light y Dark mode
- [ ] Stories creados con helper functions
- [ ] Stories tienen layout: 'fullscreen'
- [ ] Mínimo 5-10 stories cubriendo casos principales
- [ ] Documentado en CLAUDE.md
- [ ] TypeScript interfaces definidas
- [ ] Props tienen descriptions en argTypes
- [ ] Eventos usan fn() para logging

## Quick Reference Cheat Sheet

### Comandos Más Usados

```bash
# Desarrollo
npm start                    # Dev server en http://localhost:4200
npm run storybook            # Storybook en http://localhost:6006
npm test                     # Run tests
npm run build                # Production build

# Generar componente
ng generate component components/ui/nombre --standalone

# Generar servicio
ng generate service services/nombre

# Ver ayuda Angular CLI
ng generate --help
```

### Estructura de Archivos

```
loan-ui/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   └── ui/                    # ← Componentes UI aquí
│   │   │       ├── dropdown/
│   │   │       ├── multiselect/
│   │   │       ├── modal/
│   │   │       ├── tabs/
│   │   │       └── sidenav/
│   │   ├── app.ts                     # Root component
│   │   ├── app.config.ts              # App configuration
│   │   └── app.routes.ts              # Routes
│   ├── stories/                       # ← Storybook stories aquí
│   │   ├── story-helpers.ts           # ← Helper functions
│   │   ├── dropdown.stories.ts
│   │   ├── multiselect.stories.ts
│   │   ├── modal.stories.ts
│   │   └── tabs.stories.ts
│   └── styles.css                     # ← Sistema de diseño completo
├── .storybook/                        # Configuración Storybook
├── CLAUDE.md                          # ← Este archivo
└── package.json
```

### Variables CSS Más Usadas

```css
/* Colores */
var(--color-primary)
var(--color-primary-hover)
var(--color-success)
var(--color-error)
var(--color-warning)
var(--color-text-primary)
var(--color-bg-primary)
var(--color-border)

/* Espaciado */
var(--spacing-2)    /* 8px */
var(--spacing-4)    /* 16px */
var(--spacing-6)    /* 24px */

/* Tipografía */
var(--font-size-sm)
var(--font-size-base)
var(--font-size-lg)

/* Bordes */
var(--border-radius-md)
var(--border-radius-lg)

/* Sombras */
var(--shadow-md)
var(--shadow-lg)

/* Transiciones */
var(--transition-duration-150)
var(--transition-timing-ease)
```

### Clases Semánticas Más Usadas

```html
<!-- Botones -->
<button class="btn btn-primary">Primary</button>
<button class="btn btn-outline-secondary">Outline</button>
<button class="btn btn-sm">Small</button>

<!-- Forms -->
<input class="form-input" type="text">
<label class="form-label">Label</label>

<!-- Cards -->
<div class="card">
  <h3 class="card-title">Title</h3>
  <p class="card-text">Content</p>
</div>

<!-- Badges -->
<span class="badge badge-success">Success</span>

<!-- Alerts -->
<div class="alert alert-error">
  <span class="alert-icon">⚠️</span>
  Error message
</div>

<!-- Typography -->
<h1 class="heading-1">Main Title</h1>
<p class="text-lead">Lead paragraph</p>
<a href="#" class="link">Link</a>
```

### Angular Signals Pattern

```typescript
// Input
variant = input<string>('primary');

// Output
onChange = output<string>();

// State
isOpen = signal(false);
items = signal<Item[]>([]);

// Computed
displayValue = computed(() => {
  return this.isOpen() ? 'Open' : 'Closed';
});

// Update
this.isOpen.set(true);           // Set value
this.isOpen.update(v => !v);     // Toggle
this.onChange.emit('value');      // Emit event
```

### Storybook Pattern

```typescript
import { createLightDarkComparison } from './story-helpers';

const meta: Meta<Component> = {
  title: 'UI/Component',
  component: Component,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export const Story: StoryObj = {
  args: { prop: 'value' },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-component',
      `[prop]="prop"`
    ),
  }),
};
```

## Recursos y Links Útiles

### Documentación Oficial
- **Angular 20**: https://angular.dev
- **Tailwind CSS v4**: https://tailwindcss.com/docs
- **Storybook Angular**: https://storybook.js.org/docs/angular
- **Angular Signals**: https://angular.dev/guide/signals

### Archivos Clave del Proyecto
- **Design System**: [src/styles.css](src/styles.css) - Sistema completo de diseño
- **Story Helpers**: [src/stories/story-helpers.ts](src/stories/story-helpers.ts) - Funciones reutilizables
- **Root Component**: [src/app/app.ts](src/app/app.ts) - Componente raíz con demo de theming
- **App Config**: [src/app/app.config.ts](src/app/app.config.ts) - Configuración de la app

### Componentes de Referencia
- **Dropdown**: [src/app/components/ui/dropdown/](src/app/components/ui/dropdown/) - Componente completo con todas las features
- **MultiSelect**: [src/app/components/ui/multiselect/](src/app/components/ui/multiselect/) - Componente avanzado
- **Modal**: [src/app/components/ui/modal/](src/app/components/ui/modal/) - Componente complejo con wrapper
- **Tabs**: [src/app/components/ui/tabs/](src/app/components/ui/tabs/) - Múltiples variantes
- **Sidenav**: [src/app/components/ui/sidenav/](src/app/components/ui/sidenav/) - Navegación lateral

### Stories de Referencia
- ✅ [src/stories/dropdown.stories.ts](src/stories/dropdown.stories.ts) - 17 stories
- ✅ [src/stories/multiselect.stories.ts](src/stories/multiselect.stories.ts) - 21 stories
- ✅ [src/stories/modal.stories.ts](src/stories/modal.stories.ts) - 17 stories con wrapper component
- ⏳ [src/stories/tabs.stories.ts](src/stories/tabs.stories.ts) - 40+ stories (parcialmente actualizado)

## Notas Importantes

### Estado del Proyecto
- ✅ Sistema de diseño completo con 600+ variables CSS
- ✅ Dark mode funcionando en todos los componentes
- ✅ Storybook configurado con comparación Light/Dark automática
- ✅ 4 componentes UI completos (dropdown, multiselect, modal, tabs)
- ✅ Helper functions para crear stories fácilmente
- ✅ Angular 20 con signals y sintaxis moderna
- ✅ Tailwind CSS v4 con PostCSS
- ✅ TypeScript strict mode
- ✅ Standalone components (no NgModules)

### Próximos Pasos Recomendados
1. Completar actualización de tabs.stories.ts (faltan ~35 stories)
2. Crear más componentes UI (button, input, select, checkbox, radio, etc.)
3. Agregar tests unitarios para componentes
4. Crear página de documentación en la app principal
5. Agregar ejemplos de uso real en páginas de la app

### Convenciones del Proyecto
- **Idioma**: Español en contenido de ejemplo, inglés en código
- **Nomenclatura**: camelCase para variables, kebab-case para archivos
- **Imports**: Usar rutas relativas, no alias
- **Standalone**: Todos los componentes son standalone
- **Signals**: Usar signals para estado, no decorators antiguos
- **Templates**: Sintaxis moderna (@if, @for) en lugar de directivas (*ngIf, *ngFor)
- **Styles**: SIEMPRE usar variables CSS, NUNCA colores hardcoded
- **Storybook**: SIEMPRE crear stories con comparación Light/Dark
- **Accessibility**: SIEMPRE implementar ARIA attributes y keyboard navigation

### Tips y Trucos

**Tip 1: Preview rápido de colores**
Abre [src/app/app.html](src/app/app.html) en el navegador para ver demo interactivo con color pickers

**Tip 2: Ver todas las variables CSS**
Busca `:root {` en [src/styles.css](src/styles.css) para ver todas las variables disponibles

**Tip 3: Copiar componente existente**
La forma más rápida de crear un componente nuevo es copiar dropdown/ y modificarlo

**Tip 4: Debug Storybook**
Si un story no se ve, verifica:
- `layout: 'fullscreen'` en parameters
- Import correcto de helper functions
- Bindings correctos en el template

**Tip 5: Test dark mode**
En la app o Storybook, añade clase `.dark` a cualquier elemento padre para activar dark mode

---

**Última actualización**: Octubre 2024
**Mantenedores**: Claude Code AI
**Licencia**: MIT
