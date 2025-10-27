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
npm test                     # Unit tests (Vitest)
npm run coverage             # Coverage report
npm run lint                 # ESLint + Prettier
npm run analyze              # Coverage + SonarQube

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

### IMPORTANT: Generated Code Exclusion
**ALWAYS IGNORE** the following directories when analyzing, modifying, or reviewing code:
- ❌ `src/app/core/openapi/**` - Auto-generated OpenAPI client code
- ❌ `src/app/core/api/openapi/**` - Auto-generated API services

**Why ignore?**
- These files are auto-generated from OpenAPI specifications
- Any manual changes will be overwritten on next generation
- They follow their own patterns and conventions
- Not relevant for Angular best practices analysis

**What to focus on instead:**
- ✅ Components in `src/app/components/ui/`
- ✅ Layout components in `src/app/layout/`
- ✅ Features in `src/app/features/`
- ✅ Services in `src/app/services/`
- ✅ Interceptors in `src/app/interceptors/`
- ✅ Configuration files (`*.config.ts`, `*.routes.ts`)

### Application Structure
```
loan-ui/
├── src/
│   ├── app/
│   │   ├── components/ui/         # UI components
│   │   ├── config/                # Centralized config (layout.config.ts)
│   │   ├── features/              # Feature modules
│   │   ├── layout/                # Layout components (main-layout, navbar, sidenav)
│   │   ├── app.ts                 # Root component
│   │   ├── app.config.ts          # App configuration
│   │   └── app.routes.ts          # Routes
│   ├── stories/                   # Storybook stories
│   │   └── story-helpers.ts       # Helper functions
│   ├── styles/                    # Design system (modular)
│   │   ├── tokens/                # Design tokens (CSS variables)
│   │   │   ├── _colors.css        # Color palette
│   │   │   ├── _spacing.css       # Spacing scale
│   │   │   ├── _typography.css    # Font sizes, weights, line heights
│   │   │   ├── _borders.css       # Border radius and widths
│   │   │   ├── _shadows.css       # Shadow definitions
│   │   │   ├── _transitions.css   # Animation timings
│   │   │   ├── _layout.css        # Z-index, containers
│   │   │   └── _index.css         # Tokens index
│   │   ├── components/            # Component styles
│   │   │   ├── _buttons.css       # Button variants
│   │   │   ├── _forms.css         # Form elements
│   │   │   ├── _cards.css         # Card components
│   │   │   ├── _badges.css        # Badge variants
│   │   │   ├── _alerts.css        # Alert messages
│   │   │   ├── _navigation.css    # Navbar, sidebar, breadcrumb, pagination
│   │   │   ├── _tables.css        # Table styles
│   │   │   ├── _modals.css        # Modal and tooltip
│   │   │   ├── _interactive.css   # Dropdown, accordion
│   │   │   ├── _feedback.css      # Progress, spinner
│   │   │   ├── _avatar.css        # Avatar components
│   │   │   └── _index.css         # Components index
│   │   ├── utilities/             # Utility classes
│   │   │   ├── _helpers.css       # Helper utilities
│   │   │   └── _index.css         # Utilities index
│   │   └── themes/                # Theme variations (reserved)
│   └── styles.css                 # Main stylesheet (imports)
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

### Architecture Overview

The styling system is organized following Angular and CSS best practices with a **modular architecture**:

```
src/styles/
├── tokens/         # Design tokens (CSS variables)
├── components/     # Component-specific styles
├── utilities/      # Utility classes
└── themes/         # Theme variations (reserved for future use)
```

**Main Entry Point:** [src/styles.css](src/styles.css) - imports all modules

### Tailwind CSS v4 with PostCSS
- Configured via [.postcssrc.json](.postcssrc.json)
- Uses `@tailwindcss/postcss` plugin
- Global import in [src/styles.css](src/styles.css): `@import "tailwindcss";`

### Design Tokens (CSS Variables)

All design tokens are organized in separate files within `src/styles/tokens/`:

1. **[_colors.css](src/styles/tokens/_colors.css)** - Complete color palette with light/dark mode variants
   - Semantic colors: primary, secondary, success, error, warning, info, dark
   - Gray scale: 50-900
   - Text, border, background colors
   - Component-specific colors

2. **[_spacing.css](src/styles/tokens/_spacing.css)** - Spacing scale (0-32)
   - Based on 4px/8px grid system
   - Variables: `--spacing-{n}` (0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 16, 20, 24, 32)

3. **[_typography.css](src/styles/tokens/_typography.css)** - Typography system
   - Font sizes: xs to 6xl
   - Line heights: none to loose
   - Font weights: thin to black

4. **[_borders.css](src/styles/tokens/_borders.css)** - Border system
   - Border radius: none to full
   - Border widths: 0, 1px, 2px, 4px, 8px

5. **[_shadows.css](src/styles/tokens/_shadows.css)** - Shadow definitions
   - Shadow scale: sm, base, md, lg, xl, 2xl, inner, none

6. **[_transitions.css](src/styles/tokens/_transitions.css)** - Animation tokens
   - Durations: 75ms to 1000ms
   - Timing functions: linear, ease, ease-in, ease-out, ease-in-out

7. **[_layout.css](src/styles/tokens/_layout.css)** - Layout tokens
   - Z-index scale: 0, 10, 20, 30, 40, 50
   - Container max widths: sm, md, lg, xl, 2xl

### Component Styles

All component styles are organized in `src/styles/components/` using `@layer components`:

- **[_buttons.css](src/styles/components/_buttons.css)** - Button variants (solid, outline), sizes, modifiers
- **[_forms.css](src/styles/components/_forms.css)** - Labels, inputs, checkboxes, floating labels
- **[_cards.css](src/styles/components/_cards.css)** - Card layouts and elements
- **[_badges.css](src/styles/components/_badges.css)** - Badge variants and pills
- **[_alerts.css](src/styles/components/_alerts.css)** - Alert messages with icons
- **[_navigation.css](src/styles/components/_navigation.css)** - Navbar, sidebar, breadcrumb, pagination
- **[_tables.css](src/styles/components/_tables.css)** - Table styles with hover and striped rows
- **[_modals.css](src/styles/components/_modals.css)** - Modal dialogs and tooltips
- **[_interactive.css](src/styles/components/_interactive.css)** - Dropdowns and accordions
- **[_feedback.css](src/styles/components/_feedback.css)** - Progress bars and spinners
- **[_avatar.css](src/styles/components/_avatar.css)** - Avatar components with status

### Utility Classes

Custom utilities in `src/styles/utilities/` using `@layer utilities`:

- **[_helpers.css](src/styles/utilities/_helpers.css)** - Helper classes
  - Scrollbar utilities
  - Responsive containers
  - Shadow utilities
  - Background and text color utilities
  - Border utilities
  - Border radius utilities
  - Transition utilities

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

Comprehensive design system organized in modular files with 600+ CSS variables.

**Color Variants**: `primary`, `secondary`, `success`, `error`, `warning`, `info`, `dark`

**Available Component Classes:**
- **Buttons**: `.btn`, `.btn-{variant}`, `.btn-outline-{variant}`, sizes: `xs`, `sm`, `md`, `lg`, `xl`
- **Forms**: `.form-label`, `.form-input`, `.form-checkbox`, `.floating-input`
- **Cards**: `.card`, `.card-title`, `.card-text`, `.card-btn`
- **Badges/Alerts**: `.badge-{variant}`, `.alert-{variant}`
- **Navigation**: `.navbar`, `.breadcrumb`, `.sidebar`, `.pagination`
- **Tables**: `.table`, `.table-header`, `.table-row`, `.table-cell`
- **Interactive**: `.dropdown`, `.accordion`, `.modal`, `.tooltip`
- **Feedback**: `.spinner`, `.progress-bar`, `.progress-fill`
- **Avatar**: `.avatar`, `.avatar-sm`, `.avatar-lg`, `.avatar-dot`

**Key CSS Variable Examples:**
```css
/* Colors - see src/styles/tokens/_colors.css */
var(--color-primary), var(--color-success), var(--color-error)
var(--color-text-primary), var(--color-bg-primary), var(--color-border)

/* Spacing - see src/styles/tokens/_spacing.css */
var(--spacing-2)    /* 8px */
var(--spacing-4)    /* 16px */

/* Typography - see src/styles/tokens/_typography.css */
var(--font-size-sm), var(--font-size-base), var(--font-size-lg)
var(--font-weight-medium), var(--line-height-normal)

/* Borders & Shadows - see src/styles/tokens/_borders.css and _shadows.css */
var(--border-radius-md), var(--shadow-lg)
var(--border-width-1), var(--border-width-2)

/* Transitions - see src/styles/tokens/_transitions.css */
var(--transition-duration-150), var(--transition-timing-ease)

/* Layout - see src/styles/tokens/_layout.css */
var(--z-50), var(--container-lg)
```

**Styling Rules:**
- ✅ ALWAYS use CSS variables from design tokens
- ❌ NEVER use hardcoded colors (`#fff`, `rgb()`, etc.)
- ✅ Use semantic class names (`.btn-success` not `.btn-green`)
- ✅ Extend with Tailwind utilities as needed
- ✅ Follow modular architecture when adding new styles

### Style Organization Best Practices

When adding new styles to the design system:

1. **Adding Design Tokens (Variables):**
   - Add to appropriate file in `src/styles/tokens/`
   - Follow existing naming conventions
   - Document both light and dark mode values in `_colors.css`

2. **Adding Component Styles:**
   - Create new file in `src/styles/components/` if needed
   - Use `@layer components { ... }`
   - Import in `src/styles/components/_index.css`
   - Always use CSS variables, never hardcoded values

3. **Adding Utility Classes:**
   - Add to `src/styles/utilities/_helpers.css`
   - Use `@layer utilities { ... }`
   - Follow Tailwind naming conventions when possible

4. **File Naming Convention:**
   - Use underscore prefix: `_filename.css`
   - Index files: `_index.css` for module exports
   - Descriptive names: `_buttons.css`, `_colors.css`

## Testing

### Unit Tests (Vitest)
```bash
npm test                     # Run tests
npm run coverage             # Coverage report
```

**Test Pattern:**
```typescript
await TestBed.configureTestingModule({
  imports: [Component],
  providers: [provideZonelessChangeDetection()],
}).compileComponents();
```

**Config:** [vitest.config.ts](vitest.config.ts) - JSDOM environment, v8 coverage

### E2E Tests (Playwright)
**Config:** [playwright.config.ts](playwright.config.ts) | **Tests:** `./tests/`

### Code Quality
```bash
npm run lint                 # ESLint + Prettier
npm run analyze              # Coverage + SonarQube
```

**ESLint Rules:**
- Angular + TypeScript + Prettier integration
- `@typescript-eslint/no-explicit-any: 'error'`
- Component prefix: 'app-'
- Template accessibility checks

## Layout Architecture

**Main Layout:** [main-layout/](src/app/layout/main-layout/) - Navbar + Sidenav + Content
**Navbar:** Search, apps menu, notifications, user menu
**Sidenav:** Collapsible, nested navigation, router-integrated

**Centralized Config:** [layout.config.ts](src/app/config/layout.config.ts)
```typescript
export const SIDENAV_ITEMS: SidenavItem[] = [...];     // Menu navigation
export const APPS_MENU_ITEMS: AppMenuItem[] = [...];   // Apps grid
export const USER_MENU_ITEMS: UserMenuItem[] = [...];  // User options
export const MOCK_NOTIFICATIONS: Notification[] = [...]; // Notifications
```

## Development Guidelines

### File Naming Conventions (CRITICAL)

**ALWAYS use MODERN nomenclature (without `.component`):**

✅ **CORRECT:**
```
my-component/
├── my-component.ts          # Component class
├── my-component.html        # Template
├── my-component.css         # Styles (only if complex)
```

❌ **INCORRECT (Old Angular CLI style):**
```
my-component/
├── my-component.component.ts      # ❌ Remove .component
├── my-component.component.html    # ❌ Remove .component
├── my-component.component.css     # ❌ Remove .component
```

**Rules:**
- ❌ NEVER use `.component.ts` - use `.ts` instead
- ❌ NEVER use `.component.html` - use `.html` instead
- ❌ NEVER use `.component.css` - use `.css` instead
- ✅ Use kebab-case for file names: `user-menu.ts`, not `UserMenu.ts`
- ✅ Folder name must match component name: `user-menu/user-menu.ts`

### Component Styling Policy (CRITICAL)

**Prefer Tailwind CSS in templates. Use separate CSS files ONLY for complex cases.**

#### When to use Tailwind (90% of cases):

✅ **Use Tailwind classes directly in HTML:**
```html
<div class="flex items-center gap-2 p-4 bg-white rounded-lg shadow-md">
  <button class="btn btn-primary">Click me</button>
</div>
```

✅ **DO NOT create a CSS file for:**
- Simple layouts (flex, grid, padding, margin)
- Background colors, borders, shadows
- Text styling (size, weight, color)
- Basic responsive design
- Spacing and sizing

❌ **If your CSS file only has comments or 1-5 lines:**
```css
/* This is bad - DELETE this file */
.container {
  padding: var(--spacing-4);
}
```
**Solution:** Use `class="p-4"` in HTML instead

#### When to use separate CSS files (10% of cases):

✅ **Create a `.css` file ONLY for:**
- Complex animations with `@keyframes`
- Intricate hover/focus states that can't be done with Tailwind
- Dynamic positioning (tooltips, dropdowns, modals)
- Complex pseudo-selectors (`:nth-child`, `::before`, `::after`)
- Component-specific z-index management
- Grid/flex layouts with 10+ lines of CSS

✅ **Examples of JUSTIFIED CSS files:**
- `dropdown.css` (312 lines) - Positioning, animations, states
- `modal.css` (338 lines) - Backdrop, sizes, transitions
- `datepicker.css` (522 lines) - Calendar grid, date selection
- `tooltip.css` (87 lines) - Dynamic positioning

❌ **Examples of UNJUSTIFIED CSS files (use Tailwind instead):**
- Single padding/margin rules
- Basic color/background changes
- Simple borders and shadows
- Container width/height

#### CSS File Checklist:

Before creating a `.css` file, ask:
- [ ] Can this be done with Tailwind classes? → Use Tailwind
- [ ] Does it have complex animations? → CSS file OK
- [ ] Is it dynamic positioning? → CSS file OK
- [ ] Is it more than 50 lines? → CSS file OK
- [ ] Is it less than 10 lines? → Use Tailwind instead

### Component Development Essentials
- Create standalone components only (no NgModules)
- Use Angular signals: `input()`, `output()`, `signal()`, `computed()`
- Use modern template syntax: `@if`, `@for`, `@else`, `@empty`
- Import dependencies in component's `imports` array
- Implement ARIA attributes and keyboard navigation
- **ALWAYS create Storybook stories** for UI components
- File structure: `.ts`, `.html`, `.css` (no inline templates/styles)
- **File naming:** Use `.ts` NOT `.component.ts`
- **Styling:** Prefer Tailwind, use `.css` only for complex cases

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
- **Dropdown** - Keyboard nav, search, clearable, loading
- **MultiSelect** - Multi-selection, badges, search, select all
- **Modal** - Backdrop, focus trap, keyboard close
- **Tabs** - Multiple variants (pills, underline, vertical, justified)
- **Sidenav** - Collapsible, nested navigation, router links
- **Accordion** - Expandible panels, single/multiple mode
- **AppsMenu** - Grid de apps con iconos
- **UserMenu** - Avatar, opciones de usuario
- **NotificationButton** - Badge de notificaciones, dropdown
- **SearchBar** - Búsqueda con sugerencias
- **Toast** - Notificaciones temporales
- **Tooltip** - Tooltips con posicionamiento

**Barrel Export:** Import from `src/app/components/ui/index.ts`

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

**⚠️ IMPORTANT: After generation, RENAME files immediately:**
```bash
# Angular CLI generates with old nomenclature, rename to modern style:
cd src/app/components/ui/component-name/
mv component-name.component.ts component-name.ts
mv component-name.component.html component-name.html
# Only keep .css if needed for complex styling (see CSS policy below)
```

#### 2. Implement Component
- Define TypeScript interfaces and types
- Use `input()` for props, `output()` for events
- Use `signal()` for internal state, `computed()` for derived values
- Organize code in sections: Inputs → Outputs → State → Computed → Methods
- Implement keyboard navigation
- **Update imports:** Change `templateUrl` and `styleUrl` to match renamed files
- See [dropdown.ts](src/app/components/ui/dropdown/dropdown.ts) for reference

#### 3. Build Template
- Use modern syntax: `@if`, `@for`, `@else`, `@empty`
- Add complete ARIA attributes (`role`, `aria-label`, `aria-expanded`, etc.)
- Use semantic HTML structure
- **Use Tailwind classes** for 90% of styling
- See [dropdown.html](src/app/components/ui/dropdown/dropdown.html) for reference

#### 4. Style with Design System
- **Prefer Tailwind classes in HTML** (90% of cases)
- Only create `.css` file if component has:
  - Complex animations (`@keyframes`)
  - Dynamic positioning (dropdowns, tooltips, modals)
  - More than 50 lines of styling
- If using CSS file:
  - Use ONLY CSS variables (never hardcoded colors)
  - Organize in sections with clear comments
  - Implement variants, sizes, and states
  - Add focus states and transitions
- **Delete `.css` file if it has less than 10 lines** - use Tailwind instead
- See [dropdown.css](src/app/components/ui/dropdown/dropdown.css) for complex example

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

**File Structure & Naming:**
- [ ] Files use modern naming: `.ts`, `.html`, `.css` (NOT `.component.*`)
- [ ] Folder name matches component name (kebab-case)
- [ ] `.css` file only exists if component has 50+ lines of complex styling
- [ ] If CSS file exists, it's documented WHY (animations, positioning, etc.)
- [ ] Template uses Tailwind classes for 90% of styling

**Angular 20 Best Practices:**
- [ ] Component uses `standalone: true`
- [ ] Uses Angular signals (`input`, `output`, `signal`, `computed`)
- [ ] Template uses modern syntax (`@if`, `@for`, `@empty`)
- [ ] Uses `inject()` for dependency injection (not constructor)
- [ ] No old decorators (`@Input`, `@Output`, `@ViewChild` - use signals)

**Styling & Design System:**
- [ ] ALL CSS variables from design system (no hardcoded colors)
- [ ] Tailwind classes used where possible
- [ ] Works in Light & Dark mode
- [ ] If CSS file exists: organized sections, comments, variables only

**Accessibility & UX:**
- [ ] Keyboard navigation implemented
- [ ] Complete ARIA attributes
- [ ] Focus states visible
- [ ] Semantic HTML structure

**Storybook & Documentation:**
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

**Design System (Modular):**
- **Main Stylesheet**: [src/styles.css](src/styles.css) - Entry point with imports
- **Design Tokens**: [src/styles/tokens/](src/styles/tokens/) - CSS variables organized by category
  - [_colors.css](src/styles/tokens/_colors.css) - Color palette
  - [_spacing.css](src/styles/tokens/_spacing.css) - Spacing scale
  - [_typography.css](src/styles/tokens/_typography.css) - Typography tokens
  - [_borders.css](src/styles/tokens/_borders.css) - Border system
  - [_shadows.css](src/styles/tokens/_shadows.css) - Shadow definitions
  - [_transitions.css](src/styles/tokens/_transitions.css) - Animation tokens
  - [_layout.css](src/styles/tokens/_layout.css) - Layout tokens
- **Component Styles**: [src/styles/components/](src/styles/components/) - Semantic component classes
- **Utilities**: [src/styles/utilities/](src/styles/utilities/) - Helper classes

**Application:**
- **Layout Config**: [src/app/config/layout.config.ts](src/app/config/layout.config.ts) - Centralized menu items
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
- [modal.stories.ts](src/stories/modal.stories.ts) - 17 stories
- [tabs.stories.ts](src/stories/tabs.stories.ts) - 40+ stories
- [sidenav.stories.ts](src/stories/sidenav.stories.ts), [apps-menu.stories.ts](src/stories/apps-menu.stories.ts), [user-menu.stories.ts](src/stories/user-menu.stories.ts), [notification-button.stories.ts](src/stories/notification-button.stories.ts), [search-bar.stories.ts](src/stories/search-bar.stories.ts)

## Notas Importantes

### Estado del Proyecto
- ✅ Sistema de diseño modular con 600+ variables CSS organizadas
- ✅ 13 componentes UI completos + 3 layout components
- ✅ Vitest + Playwright testing
- ✅ ESLint + Prettier + SonarQube integration
- ✅ Storybook con comparación Light/Dark automática
- ✅ Configuración centralizada (layout.config.ts)
- ✅ Angular 20 con signals y sintaxis moderna
- ✅ Tailwind CSS v4 con PostCSS
- ✅ TypeScript strict mode
- ✅ Standalone components (no NgModules)

### Convenciones del Proyecto (CRITICAL - MUST FOLLOW)

#### Nomenclatura de Archivos
- ❌ **NUNCA** usar `.component.ts` - usar `.ts`
- ❌ **NUNCA** usar `.component.html` - usar `.html`
- ❌ **NUNCA** usar `.component.css` - usar `.css`
- ✅ **SIEMPRE** usar kebab-case: `user-menu.ts`, no `UserMenu.ts`
- ✅ camelCase para variables, PascalCase para clases/interfaces

#### Política de Estilos
- ✅ **PREFERIR Tailwind** en HTML (90% de casos)
- ❌ **NO crear `.css`** para estilos simples (padding, colors, borders)
- ✅ **Crear `.css` SOLO si:**
  - Tiene animaciones complejas (`@keyframes`)
  - Posicionamiento dinámico (dropdowns, modals)
  - Más de 50 líneas de estilos
- ✅ Si existe `.css`: SOLO variables CSS, NUNCA hardcoded

#### Angular 20 Standards
- ✅ **Standalone**: Todos los componentes son standalone (no NgModules)
- ✅ **Signals**: Usar `input()`, `output()`, `signal()`, `computed()`
- ❌ **No decorators**: No usar `@Input()`, `@Output()`, `@ViewChild()`
- ✅ **Templates**: Sintaxis moderna (`@if`, `@for`) no directivas (`*ngIf`, `*ngFor`)
- ✅ **DI**: Usar `inject()`, no constructor injection

#### Otros Standards
- **Idioma**: Español en contenido de ejemplo, inglés en código
- **Imports**: Usar rutas relativas, no alias
- **Storybook**: SIEMPRE crear stories con comparación Light/Dark
- **Accessibility**: SIEMPRE implementar ARIA attributes y keyboard navigation
- **Generated Code**: IGNORAR `src/app/core/openapi/**` (auto-generated)

### Tips Rápidos

1. **Preview colores**: Abre [src/app/app.html](src/app/app.html) para demo interactivo con color pickers
2. **Ver variables CSS**: Revisa archivos en [src/styles/tokens/](src/styles/tokens/)
3. **Agregar nuevos tokens**: Edita el archivo apropiado en `src/styles/tokens/` (ej: `_colors.css` para colores)
4. **Agregar componente style**: Crea archivo en `src/styles/components/` e importa en `_index.css`
5. **Crear componente rápido**: Copia [dropdown/](src/app/components/ui/dropdown/) y modifica
6. **Debug Storybook**: Verifica `layout: 'fullscreen'` en parameters
7. **Test dark mode**: Añade clase `.dark` a cualquier elemento padre

---

**Última actualización**: Octubre 2024
**Mantenedores**: Claude Code AI
**Licencia**: MIT
