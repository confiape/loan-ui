# CLAUDE.md - loan-ui

Angular 20 application with semantic design system on Tailwind CSS v4. Zoneless, standalone components.

## CRITICAL RULES

### NEVER EDIT GENERATED CODE

**NEVER** modify files in `src/app/core/openapi/**` - Auto-generated from OpenAPI specs. Any changes will be overwritten.

## Quick Reference

### Commands

```bash
npm start                     # Dev server :4200
npm run build                 # Production build
npm test                      # Unit tests (Vitest)
npm run lint                  # ESLint + Prettier
npm run storybook             # Storybook :6006
ng generate component components/ui/name --standalone
```

### File Structure

```
src/app/
├── components/ui/           # Reusable UI components
├── features/                # Feature modules
├── layout/                  # Layout (navbar, sidenav)
├── config/layout.config.ts  # Centralized nav config
└── core/openapi/            # AUTO-GENERATED - DO NOT EDIT
```

## Angular 20 Standards

### Nomenclature (CRITICAL)

- ✅ `component-name.ts` (NOT `.component.ts`)
- ✅ `component-name.html` (NOT `.component.html`)
- ✅ `component-name.css` (NOT `.component.css`)
- ✅ Folder matches name: `user-menu/user-menu.ts`
- ✅ kebab-case files, camelCase variables, PascalCase classes

### Angular Features (Use MCP for details)

```typescript
// Modern Angular 20 patterns - consult MCP for specifics
import { Component, input, output, signal, computed } from '@angular/core';

export class MyComponent {
  // Inputs/Outputs (signals)
  variant = input<string>('primary');
  onChange = output<string>();

  // State & computed
  isOpen = signal(false);
  label = computed(() => (this.isOpen() ? 'Close' : 'Open'));

  // Template uses @if, @for, @else, @empty
}
```

**Consult Angular MCP** for:

- Signal patterns and reactivity
- Template syntax (@if/@for vs *ngIf/*ngFor)
- Dependency injection with `inject()`
- Change detection strategies

## Styling Policy

### Prefer Tailwind (90% of cases)

```html
<!-- Good - Use Tailwind -->
<div class="flex items-center gap-4 p-6 bg-white rounded-lg shadow-md">
  <button class="btn btn-primary">Submit</button>
</div>
```

### Predefined Component Classes (Use These First)

**Buttons** - `src/styles/components/_buttons.css`

```html
<!-- Solid buttons -->
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-success">Success</button>
<button class="btn btn-error">Error</button>
<button class="btn btn-warning">Warning</button>
<button class="btn btn-info">Info</button>
<button class="btn btn-dark">Dark</button>

<!-- Outline buttons -->
<button class="btn btn-outline-primary">Outline</button>

<!-- Sizes -->
<button class="btn btn-primary btn-xs">Extra Small</button>
<button class="btn btn-primary btn-sm">Small</button>
<button class="btn btn-primary btn-md">Medium</button>
<button class="btn btn-primary btn-lg">Large</button>
<button class="btn btn-primary btn-xl">Extra Large</button>

<!-- Pill modifier -->
<button class="btn btn-primary btn-pill">Rounded</button>
```

**Forms** - `src/styles/components/_forms.css`

```html
<!-- Label + Input -->
<label class="form-label">Email</label>
<input type="email" class="form-input" placeholder="name@example.com" />

<!-- Input states -->
<input class="form-input form-input-success" placeholder="Valid" />
<input class="form-input form-input-error" placeholder="Invalid" />

<!-- Checkbox -->
<input type="checkbox" class="form-checkbox" />

<!-- Floating label -->
<div class="relative">
  <input type="text" class="floating-input" placeholder=" " />
  <label class="floating-label">Floating label</label>
</div>
```

**Cards** - `src/styles/components/_cards.css`

```html
<div class="card">
  <h5 class="card-title">Card Title</h5>
  <p class="card-text">Card description text here.</p>
  <button class="card-btn">Read more</button>
</div>

<!-- Clickable card -->
<a href="#" class="card-link">
  <h5 class="card-title">Link Card</h5>
  <p class="card-text">This entire card is clickable.</p>
</a>
```

**Badges** - `src/styles/components/_badges.css`

```html
<span class="badge badge-primary">Primary</span>
<span class="badge badge-success">Success</span>
<span class="badge badge-error">Error</span>
<span class="badge badge-warning">Warning</span>
<span class="badge badge-info">Info</span>
<span class="badge badge-dark">Dark</span>

<!-- Pill badge -->
<span class="badge badge-primary badge-pill">Rounded</span>
```

**Alerts** - `src/styles/components/_alerts.css`

```html
<div class="alert alert-primary">
  <svg class="alert-icon">...</svg>
  <span>Primary alert message</span>
</div>

<div class="alert alert-success">Success message</div>
<div class="alert alert-error">Error message</div>
<div class="alert alert-warning">Warning message</div>
<div class="alert alert-info">Info message</div>
```

### CSS Files (10% - Complex cases only)

Create `.css` file ONLY for:

- Complex animations (`@keyframes`)
- Dynamic positioning (tooltips, modals)
- 50+ lines of styling
- Intricate pseudo-selectors

```css
/* When CSS needed - ONLY use CSS variables */
.dropdown-menu {
  background: var(--color-bg-primary);
  border: var(--border-width-1) solid var(--color-border);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-lg);
}
```

**Delete CSS file** if < 10 lines - use Tailwind instead!

### Design Tokens (organized in `src/styles/tokens/`)

```css
/* Colors */ var(--color-primary), var(--color-text-primary)
/* Spacing */ var(--spacing-2) /* 8px */, var(--spacing-4) /* 16px */
/* Typography */ var(--font-size-base), var(--font-weight-medium)
/* Borders */ var(--border-radius-md), var(--shadow-lg)
```

**Rule:** NEVER hardcode colors/spacing - always use variables!

## Storybook (MANDATORY for UI)

### Story Helpers (`src/stories/story-helpers.ts`)

**Always use these helpers to create Light/Dark comparisons automatically:**

**1. `createLightDarkComparison()` - Most Common**

```typescript
import { Meta, StoryObj } from '@storybook/angular';
import { createLightDarkComparison } from './story-helpers';

const meta: Meta<MyComponent> = {
  title: 'UI/MyComponent',
  component: MyComponent,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' }, // REQUIRED!
};

export default meta;
type Story = StoryObj<MyComponent>;

// Simple component
export const Default: Story = {
  args: { variant: 'primary', size: 'md' },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison('app-my-component', `[variant]="variant" [size]="size"`),
  }),
};
```

**2. `createVariantComparison()` - For Multiple Variants Grid**

```typescript
import { createVariantComparison } from './story-helpers';

// Show all variants in grid (Light + Dark)
export const AllVariants: Story = {
  render: () => ({
    props: {},
    template: createVariantComparison(
      'app-button',
      ['Primary', 'Secondary', 'Success', 'Error', 'Warning'],
      'size="md"', // Common bindings for all
    ),
  }),
};
```

**3. `wrapInLightDarkComparison()` - For Complex Templates**

```typescript
import { wrapInLightDarkComparison } from './story-helpers';

// When you need custom template (modals, complex layouts)
export const ComplexExample: Story = {
  args: { isOpen: true },
  render: (args) => ({
    props: args,
    template: wrapInLightDarkComparison(`
      <div class="p-8">
        <app-my-component [isOpen]="isOpen">
          <div class="custom-content">Complex content here</div>
        </app-my-component>
      </div>
    `),
  }),
};
```

**4. `createLightDarkRender()` - Shorthand Helper**

```typescript
import { createLightDarkRender } from './story-helpers';

export const Shorthand: Story = {
  args: { variant: 'primary' },
  render: createLightDarkRender('app-my-component', `[variant]="variant"`),
};
```

### Story Structure Requirements

**Meta Configuration:**

```typescript
const meta: Meta<MyComponent> = {
  title: 'UI/ComponentName', // Category/ComponentName
  component: MyComponent,
  tags: ['autodocs'], // Auto-generate documentation
  parameters: {
    layout: 'fullscreen', // REQUIRED for Light/Dark comparison
  },
  argTypes: {
    // Optional: control types
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
  },
  args: {
    onClick: fn(), // Mock functions with fn()
  },
};
```

**Story Coverage (Minimum 5-10 stories):**

```typescript
// 1. Default/Basic
export const Default: Story = { ... };

// 2. All Variants
export const AllVariants: Story = { ... };

// 3. All Sizes
export const Sizes: Story = { ... };

// 4. States
export const Disabled: Story = { args: { disabled: true } };
export const Loading: Story = { args: { loading: true } };
export const WithError: Story = { args: { error: 'Error message' } };

// 5. Edge Cases
export const EmptyState: Story = { args: { items: [] } };
export const LongContent: Story = { args: { label: 'Very long text...' } };
export const Overflow: Story = { args: { items: [...100 items] } };
```

**Best Practices:**

- Always use `parameters: { layout: 'fullscreen' }` for Light/Dark helpers
- Use `fn()` from `@storybook/test` for event handlers
- Create stories for all variants, sizes, and states
- Test edge cases (empty, overflow, long text)
- Use argTypes for interactive controls

## Testing

### Unit Tests (Vitest)

```typescript
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

await TestBed.configureTestingModule({
  imports: [MyComponent],
  providers: [provideZonelessChangeDetection()],
}).compileComponents();
```

**MUST pass** before creating PR!

### E2E Tests (Playwright)

```bash
npm run test:e2e:ui    # Modo UI (recomendado para desarrollo)
npm run test:e2e       # Headless (CI)
```

**If developing E2E tests**: Read `docs/testing/PLAYWRIGHT.md` first

### Development Guides

**If implementing a CRUD**: Read `docs/CRUD-GUIDE.md` first for:

- Component structure (list, form)
- Form validation patterns
- data-testid for E2E testing
- Signals and state management

## Component Checklist

Before considering work complete:

**Files & Naming:**

- [ ] Modern naming: `.ts`, `.html`, `.css` (not `.component.*`)
- [ ] CSS file only if 50+ lines or complex
- [ ] Tailwind used for 90% of styling

**Angular 20:**

- [ ] Standalone component
- [ ] Signals: `input()`, `output()`, `signal()`, `computed()`
- [ ] Modern templates: `@if`, `@for`, `@empty`
- [ ] Used MCP for Angular best practices

**Styling:**

- [ ] Only CSS variables (no hardcoded values)
- [ ] Works in light & dark mode
- [ ] Responsive design

**Accessibility:**

- [ ] Keyboard navigation
- [ ] ARIA attributes
- [ ] Focus states visible

**Quality:**

- [ ] Storybook stories created
- [ ] Unit tests pass
- [ ] Prettier + lint pass
- [ ] User tested and approved

**Git:**

- [ ] GitHub issue created
- [ ] Branch from updated master
- [ ] PR created with issue reference

## Available UI Components

Reusable components in `src/app/components/ui/`:

- **Dropdown** - Search, keyboard nav, loading
- **MultiSelect** - Multi-select, badges, search
- **Modal** - Backdrop, focus trap, sizes
- **Tabs** - Pills, underline, vertical variants
- **Accordion** - Single/multiple expand
- **Sidenav** - Collapsible nested nav
- Plus: AppsMenu, UserMenu, NotificationButton, SearchBar, Toast, Tooltip

Import from: `src/app/components/ui/index.ts`

**All include:** Keyboard nav, ARIA, dark mode, Storybook stories

## Key Files

- **Layout Config**: `src/app/config/layout.config.ts` - Centralized menus
- **Design Tokens**: `src/styles/tokens/` - CSS variables by category
- **Story Helpers**: `src/stories/story-helpers.ts`
- **Reference Components**: `src/app/components/ui/dropdown/`, `multiselect/`, `modal/`

## Reference Materials

- **Angular Docs**: Use MCP `mcp__angular-cli__search_documentation` for current patterns
- **Angular Best Practices**: Use MCP `mcp__angular-cli__get_best_practices` before coding
- **Tailwind v4**: https://tailwindcss.com/docs
- **CRUD Guides**:
  - `docs/CRUD-GUIDE.md` - Quick start guide (how to create a CRUD)
  - `docs/CRUD-ARCHITECTURE.md` - Technical architecture (how it works)
  - `docs/GENERIC-CRUD-POC.md` - Complete POC documentation
- **Playwright Guide**: `docs/testing/PLAYWRIGHT-GUIDE.md` - How to write E2E tests
- **Project Components**: Copy existing components as templates

---

**Remember:**

1. Always start with Angular MCP for best practices
2. If implementing CRUD:
   - Quick start: Read `docs/CRUD-GUIDE.md`
   - Understanding: Read `docs/CRUD-ARCHITECTURE.md`
3. If writing E2E tests: Read `docs/testing/PLAYWRIGHT-GUIDE.md` first
4. Always follow GitHub workflow (issue -> branch -> tests -> PR)
5. Never edit `src/app/core/openapi/**`
6. Prefer Tailwind over CSS files
7. All UI components need Storybook stories
8. Tests must pass before PR
