# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Angular 20 application named "loan-ui" - a loan management UI with a semantic component design system built on Tailwind CSS v4. The application uses Angular's zoneless change detection and standalone components architecture.

---

## Table of Contents

- [Quick Reference](#quick-reference) ⚡ Start here
- [Core Conventions](#core-conventions) ⚠️ CRITICAL - Must follow
- [Development Commands](#development-commands)
- [Architecture](#architecture)
- [Styling System](#styling-system)
- [Component Development Workflow](#component-development-workflow)
- [Testing](#testing)
- [Services & Interceptors](#services--interceptors)
- [Complete Component Library](#complete-component-library)
- [Storybook Guidelines](#storybook-guidelines)
- [Resources & References](#resources--references)
- [Appendix: Design System Details](#appendix-design-system-details)

---

## Quick Reference

### Most Used Commands
```bash
npm start          # Dev server (http://localhost:4200)
npm test           # Run 500 tests (~5 seconds)
npm run storybook  # Component library (http://localhost:6006)
npm run lint       # ESLint + Prettier
npm run build      # Production build
```

### The 4 Golden Rules

1**🎨 Tailwind first, CSS only if complex** → 90% Tailwind, 10% CSS files
2**⚡ Signals, not decorators** → `input()`, `output()`, `signal()`
3**🆕 Modern syntax** → `@if`, `@for` (not `*ngIf`, `*ngFor`)

---

## Core Conventions ⚠️ CRITICAL - MUST FOLLOW

### 🔴 Absolute Rules (Non-Negotiable)

#### 1. Styling Policy

**Prefer Tailwind CSS in templates. Use separate CSS files ONLY for complex cases.**

**Create a `.css` file ONLY for:**
- Complex animations with `@keyframes`
- Intricate hover/focus states that can't be done with Tailwind
- Dynamic positioning (tooltips, dropdowns, modals)
- Complex pseudo-selectors (`:nth-child`, `::before`, `::after`)
- Component-specific z-index management
- Grid/flex layouts with 10+ lines of CSS

**CSS File Checklist:**
- [ ] Can this be done with Tailwind classes? → Use Tailwind
- [ ] Does it have complex animations? → CSS file OK
- [ ] Is it dynamic positioning? → CSS file OK
- [ ] Is it more than 50 lines? → CSS file OK
- [ ] Is it less than 10 lines? → Use Tailwind instead


#### 2. Generated Code Exclusion

**ALWAYS IGNORE** the following directories when analyzing, modifying, or reviewing code:
- ❌ `src/app/core/openapi/**` - Auto-generated OpenAPI client code
- ❌ `src/app/core/api/openapi/**` - Auto-generated API services

**Why ignore?**
- These files are auto-generated from OpenAPI specifications
- Any manual changes will be overwritten on next generation
- They follow their own patterns and conventions
- Not relevant for Angular best practices analysis

---

## Development Commands

```bash
# Development
npm start                    # Dev server (http://localhost:4200)
ng serve                     # Same as above
npm run build                # Production build
npm run watch                # Development build with watch mode

# Testing
npm test                     # Unit tests (Vitest) - 500 tests
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

---

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
│   │   ├── components/ui/         # 17 UI components
│   │   ├── config/                # Centralized config (layout.config.ts)
│   │   ├── core/openapi/          # Auto-generated (IGNORE)
│   │   ├── features/              # Feature modules (auth, dashboard)
│   │   ├── interceptors/          # 3 HTTP interceptors
│   │   ├── layout/                # 4 layout components
│   │   ├── services/              # 2 core services
│   │   ├── app.ts                 # Root component
│   │   ├── app.config.ts          # App configuration
│   │   └── app.routes.ts          # Routes
│   ├── stories/                   # Storybook stories (17 files)
│   │   └── story-helpers.ts       # Helper functions
│   ├── styles/                    # Design system (modular)
│   │   ├── tokens/                # Design tokens (CSS variables)
│   │   ├── components/            # Component styles
│   │   ├── utilities/             # Utility classes
│   │   └── themes/                # Theme variations (reserved)
│   └── styles.css                 # Main stylesheet
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

---

## Styling System

### Stack
- **Tailwind CSS v4** (90% of styling - utility classes in HTML)
- **CSS Variables** (600+ design tokens)
- **PostCSS** for processing

### Philosophy
1. **Tailwind First**: Use utility classes in HTML
2. **CSS Variables for Tokens**: Colors, spacing, typography
3. **Separate CSS Only for**: Animations, complex positioning, 50+ lines

### Design Tokens Location
- **Colors**: `src/styles/tokens/_colors.css` (200+ variables)
  - Semantic colors: primary, secondary, success, error, warning, info, dark
  - Gray scale: 50-900
  - Text, border, background colors
  - Light/dark mode support
- **Spacing**: `src/styles/tokens/_spacing.css` (15 scales: 0-32)
- **Typography**: `src/styles/tokens/_typography.css` (sizes xs-6xl, weights, line-heights)
- **Borders**: `src/styles/tokens/_borders.css` (radius, widths)
- **Shadows**: `src/styles/tokens/_shadows.css` (sm-2xl)
- **Transitions**: `src/styles/tokens/_transitions.css` (durations, timings)
- **Layout**: `src/styles/tokens/_layout.css` (z-index, containers)

### Usage Example
```html
<!-- ✅ Tailwind classes (preferred) -->
<div class="flex items-center gap-4 p-4 bg-white rounded-lg shadow-md">
  <button class="btn btn-primary">Click me</button>
</div>
```

```css
/* ✅ CSS variables (when needed) */
.custom-component {
  color: var(--color-primary);
  padding: var(--spacing-4);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-lg);
}
```

**Styling Rules:**
- ✅ ALWAYS use CSS variables from design tokens
- ❌ NEVER use hardcoded colors (`#fff`, `rgb()`, etc.)
- ✅ Use semantic class names (`.btn-success` not `.btn-green`)
- ✅ Extend with Tailwind utilities as needed
- ✅ Follow modular architecture when adding new styles

**Full details**: See [Appendix: Design System Details](#appendix-design-system-details)

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

---

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
# Only keep .css if needed for complex styling (see CSS policy)
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
Add section to this CLAUDE.md under "Complete Component Library" with:
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

---

## Testing

### Unit Tests (Vitest)

**Current Status:**
- ✅ **500 tests** passing
- ✅ **30 test suites** complete
- ✅ **100% components** tested
- ⚡ **~5 seconds** total execution time

```bash
npm test                     # Run all tests
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

---

## Services & Interceptors

### Core Services

The application uses 2 core services with signal-based state management:

#### 1. ToastService (`src/app/services/toast.service.ts`)
Signal-based notification system.

**Features:**
- Multiple toasts simultaneously
- Auto-dismiss with configurable timeouts
- 4 types: success, error, warning, info
- 6 positions: top/bottom + left/center/right

**Methods:**
```typescript
toastService.success('Operation completed!', 'Success');
toastService.error('Something went wrong', 'Error');
toastService.warning('Be careful!', 'Warning');
toastService.info('FYI: Important information', 'Info');
toastService.dismiss(toastId);
toastService.clear(); // Dismiss all
```

**State:**
```typescript
toastService.toasts$(); // Signal<Toast[]> - readonly
```

#### 2. AuthService (`src/app/services/auth.service.ts`)
Authentication and token management.

**Features:**
- Token storage with signals
- Login/Logout flow
- Automatic token refresh
- Authentication verification
- Integration with interceptors

**Methods:**
```typescript
authService.getToken();          // Current token
authService.setToken(token);     // Store token
authService.clearToken();        // Remove token
authService.checkAuthentication(); // Verify auth
authService.refreshToken();      // Refresh expired token
authService.logout();            // Logout user
authService.navigateToLogin();   // Redirect to login
```

**State:**
```typescript
authService.token$();            // Signal<string | null>
authService.isAuthenticated$();  // Signal<boolean>
```

### HTTP Interceptors

The application uses 3 functional HTTP interceptors for authentication and user feedback:

#### 1. authInterceptor (`src/app/interceptors/auth.interceptor.ts`)
Adds Bearer token to authenticated requests.

**Features:**
- Automatically adds `Authorization: Bearer {token}` header
- Whitelist of public endpoints (login, logout, auth)
- Verifies authentication before sending requests
- Redirects to login if user is not authenticated

**Public endpoints (no token required):**
- `/api/auth/login`
- `/api/auth/logout`
- `/api/auth/**`

#### 2. tokenRetryInterceptor (`src/app/interceptors/token-retry.interceptor.ts`)
Handles token expiration and automatic refresh.

**Features:**
- Intercepts 401/403 errors (unauthorized)
- Automatically refreshes access token
- Retries original request with new token
- Shows error toast if refresh fails
- Prevents retry for certain endpoints (login, register)

**Endpoints that will NOT retry:**
- `/api/auth/login`
- `/api/auth/register`
- `/api/auth/refresh`

#### 3. httpNotificationInterceptor (`src/app/interceptors/http-notification.interceptor.ts`)
Provides automatic user feedback for HTTP operations.

**Features:**
- Shows success toast for successful mutations (POST/PUT/PATCH/DELETE)
- Shows error toast for any HTTP error
- Extracts error message from server response
- Automatic feedback without manual toast calls

**Example:**
```typescript
// Automatic success toast after POST
this.http.post('/api/users', userData).subscribe();
// → Shows: "Operación exitosa" ✅

// Automatic error toast on failure
this.http.get('/api/users/999').subscribe();
// → Shows: "Error message from server" ❌
```

### Integration Example

```typescript
@Component({...})
export class MyComponent {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  performAction() {
    // authInterceptor adds token automatically
    // httpNotificationInterceptor shows success/error toast automatically
    // tokenRetryInterceptor handles token refresh if needed
    this.http.post('/api/action', data).subscribe({
      next: () => console.log('Success!'),
      error: (err) => console.error('Error:', err)
    });
  }
}
```

---

## Complete Component Library

### Overview
**Total: 17 UI Components + 4 Layout Components = 21 Components**

**All components include:**
- ✅ Full keyboard navigation
- ✅ WCAG accessibility (ARIA)
- ✅ Multiple variants & sizes
- ✅ Dark mode support
- ✅ Storybook stories
- ✅ Modern file naming (no `.component`)
- ✅ Angular 20 signals

**Barrel Export:** Import from `src/app/components/ui/index.ts`

---

### 📝 Form Controls (3 components)

#### Dropdown
**File:** [src/app/components/ui/dropdown/dropdown.ts](src/app/components/ui/dropdown/)

Single selection dropdown with advanced features.

**Features:**
- Searchable options
- Clearable selection
- Loading state
- Disabled options
- Grouped options
- Custom icons
- Keyboard navigation (Arrow keys, Enter, Escape)

**Storybook:** [dropdown.stories.ts](src/stories/dropdown.stories.ts) - 17 stories

#### MultiSelect
**File:** [src/app/components/ui/multiselect/multiselect.ts](src/app/components/ui/multiselect/)

Multi-selection dropdown with badges.

**Features:**
- Multiple selections
- Selected items as badges
- Select all / Clear all
- Searchable options
- Grouped options
- Max selections limit
- Keyboard navigation

**Storybook:** [multiselect.stories.ts](src/stories/multiselect.stories.ts) - 21 stories

#### Datepicker
**File:** [src/app/components/ui/datepicker/datepicker.ts](src/app/components/ui/datepicker/)

Advanced date picker with multiple modes.

**Features:**
- Single date selection
- Date range selection
- Multiple dates selection
- Time picker integration
- Month/year picker
- Min/max date validation
- Disabled dates
- Custom date format
- Keyboard navigation

**Storybook:** [datepicker.stories.ts](src/stories/datepicker.stories.ts)

---

### 🗂️ Data Display (4 components)

#### Table
**File:** [src/app/components/ui/table/table.ts](src/app/components/ui/table/)

Flexible table with sorting and custom templates.

**Features:**
- Column sorting (asc/desc)
- Custom cell templates
- Row actions (edit, delete, etc.)
- Striped rows
- Hoverable rows
- Empty state
- Loading state

**Storybook:** [table.stories.ts](src/stories/table.stories.ts)

#### TableToolbar
**File:** [src/app/components/ui/table-toolbar/table-toolbar.ts](src/app/components/ui/table-toolbar/)

Toolbar for tables with search and actions.

**Features:**
- Search input
- Primary actions
- Bulk actions
- Filter chips
- Responsive layout

**Storybook:** [table-toolbar.stories.ts](src/stories/table-toolbar.stories.ts)

#### TablePagination
**File:** [src/app/components/ui/table-pagination/table-pagination.ts](src/app/components/ui/table-pagination/)

Pagination with page info and navigation.

**Features:**
- Page navigation (prev/next)
- Page numbers with ellipsis
- Items per page selector
- Total items info
- Configurable visible pages

**Storybook:** [table-pagination.stories.ts](src/stories/table-pagination.stories.ts)

#### DataTable
**File:** [src/app/components/ui/data-table/data-table.ts](src/app/components/ui/data-table/)

Complete table integration: Toolbar + Table + Pagination.

**Features:**
- All-in-one solution
- Integrated search, sort, and pagination
- Configurable columns
- Bulk actions
- Export functionality

**Storybook:** [data-table.stories.ts](src/stories/data-table.stories.ts)

---

### 🧭 Navigation (6 components)

#### Tabs
**File:** [src/app/components/ui/tabs/tabs.ts](src/app/components/ui/tabs/)

Tabs with multiple variants and router integration.

**Features:**
- 5 variants: default, pills, underline, boxed, segmented
- Horizontal and vertical orientation
- Router integration
- Badges on tabs
- Icons support
- Disabled tabs
- Keyboard navigation (Arrow keys, Home, End)

**Storybook:** [tabs.stories.ts](src/stories/tabs.stories.ts) - 40+ stories

#### Sidenav
**File:** [src/app/components/ui/sidenav/sidenav.ts](src/app/components/ui/sidenav/)

Collapsible sidebar with nested navigation.

**Features:**
- Collapsible sidebar
- Nested menu items
- Router link integration
- Active state highlighting
- Icons support
- 3 variants: default, bordered, pills
- Keyboard navigation

**Storybook:** [sidenav.stories.ts](src/stories/sidenav.stories.ts)

#### BottomNavigation
**File:** [src/app/layout/bottom-navigation/bottom-navigation.ts](src/app/layout/bottom-navigation/)

Mobile-first bottom navigation bar.

**Features:**
- Router link integration
- Active state
- Icons and labels
- Fixed position
- Mobile optimized

**Storybook:** [bottom-navigation.stories.ts](src/stories/bottom-navigation.stories.ts)

#### AppsMenu
**File:** [src/app/components/ui/apps-menu/apps-menu.ts](src/app/components/ui/apps-menu/)

Grid of applications launcher.

**Features:**
- Grid layout
- App icons and labels
- Click outside to close
- ESC key to close
- Dropdown positioning

**Storybook:** [apps-menu.stories.ts](src/stories/apps-menu.stories.ts)

#### UserMenu
**File:** [src/app/components/ui/user-menu/user-menu.ts](src/app/components/ui/user-menu/)

User menu with avatar and options.

**Features:**
- Avatar with image or initials
- User name and email
- Menu items with icons
- Dividers
- Click outside to close
- ESC key to close

**Storybook:** [user-menu.stories.ts](src/stories/user-menu.stories.ts)

#### SearchBar
**File:** [src/app/components/ui/search-bar/search-bar.ts](src/app/components/ui/search-bar/)

Search input with submit and clear.

**Features:**
- Search icon
- Clear button
- Submit on Enter
- Loading state
- Responsive design

**Storybook:** [search-bar.stories.ts](src/stories/search-bar.stories.ts)

---

### 💬 Feedback & Overlays (4 components)

#### Modal
**File:** [src/app/components/ui/modal/modal.ts](src/app/components/ui/modal/)

Modal dialog with backdrop and focus trap.

**Features:**
- 5 sizes: sm, md, lg, xl, full
- 5 variants: default, success, error, warning, info
- Backdrop with blur
- Focus trap
- ESC key to close
- Loading state
- Custom footer actions

**Storybook:** [modal.stories.ts](src/stories/modal.stories.ts) - 17 stories

#### Toast
**File:** [src/app/components/ui/toast/toast.ts](src/app/components/ui/toast/)

Temporary notification messages.

**Features:**
- 4 types: success, error, warning, info
- Auto-dismiss with timeout
- Dismissible manually
- Progress bar
- Icons

**Related:** ToastContainer and ToastService

**Storybook:** [toast.stories.ts](src/stories/toast.stories.ts)

#### Tooltip
**File:** [src/app/components/ui/tooltip/tooltip.ts](src/app/components/ui/tooltip/)

Tooltips with dynamic positioning.

**Features:**
- 4 positions: top, bottom, left, right
- Show delay configurable
- Hover trigger
- Dark theme

**Storybook:** [tooltip.stories.ts](src/stories/tooltip.stories.ts)

#### NotificationButton
**File:** [src/app/components/ui/notification-button/notification-button.ts](src/app/components/ui/notification-button/)

Notification button with badge and dropdown.

**Features:**
- Badge with count
- Unread notifications highlight
- Mark as read
- Max display count
- Click outside to close
- Empty state

**Storybook:** [notification-button.stories.ts](src/stories/notification-button.stories.ts)

---

### 📦 Layout (1 component)

#### Accordion
**File:** [src/app/components/ui/accordion/accordion.ts](src/app/components/ui/accordion/)

Expandable panels with single or multiple mode.

**Features:**
- Single mode (only one open at a time)
- Multiple mode (multiple open)
- Animated transitions
- Disabled panels
- Icons

**Storybook:** [accordion.stories.ts](src/stories/accordion.stories.ts)

---

### 🏗️ Layout Components (4 components)

#### MainLayout
**File:** [src/app/layout/main-layout/main-layout.ts](src/app/layout/main-layout/)

Main application layout with navbar, sidenav, and content.

**Features:**
- Responsive layout
- Mobile menu toggle
- RouterOutlet for content
- ToastContainer integration

#### Navbar
**File:** [src/app/layout/navbar/navbar.ts](src/app/layout/navbar/)

Top navigation bar.

**Features:**
- App title/logo
- Search bar
- Apps menu
- Notifications
- User menu

#### Sidenav (listed above in Navigation)

#### BottomNavigation (listed above in Navigation)

---

### Layout Configuration

**Centralized Config:** [src/app/config/layout.config.ts](src/app/config/layout.config.ts)

All navigation items are configured in one place:

```typescript
export const SIDENAV_ITEMS: SidenavItem[] = [...];        // 7 items with children
export const APPS_MENU_ITEMS: AppMenuItem[] = [...];      // 6 apps
export const USER_MENU_ITEMS: UserMenuItem[] = [...];     // 5 items with dividers
export const MOCK_NOTIFICATIONS: Notification[] = [...];  // 4 notifications
export const BOTTOM_NAV_ITEMS: BottomNavItem[] = [...];   // 4 items for mobile
```

---

## Storybook Guidelines

**CRITICAL:** All UI components MUST have stories with Light/Dark comparison using helpers from [src/stories/story-helpers.ts](src/stories/story-helpers.ts).

### Basic Story Template

```typescript
import type { Meta, StoryObj } from '@storybook/angular';
import { fn } from '@storybook/test';
import { YourComponent } from '../app/components/ui/your-component/your-component'; // ✅ NO .component
import { createLightDarkComparison } from './story-helpers';

const meta: Meta<YourComponent> = {
  title: 'UI/YourComponent',
  component: YourComponent,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },  // ⚠️ Required!
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

### Helper Functions
- `createLightDarkComparison(tag, bindings)` - For simple components
- `wrapInLightDarkComparison(template)` - For complex templates
- `createLightDarkRender(tag, bindings)` - Shorthand for render functions

### Story Coverage Checklist
- ✅ Default/basic usage
- ✅ All variants (primary, secondary, outline, etc.)
- ✅ All sizes (xs, sm, md, lg, xl)
- ✅ States (disabled, loading, error, success)
- ✅ Edge cases (empty, long content, overflow)
- ✅ Feature combinations
- ✅ Keyboard navigation demos

### Examples
- [dropdown.stories.ts](src/stories/dropdown.stories.ts) - 17 stories
- [multiselect.stories.ts](src/stories/multiselect.stories.ts) - 21 stories
- [modal.stories.ts](src/stories/modal.stories.ts) - 17 stories
- [tabs.stories.ts](src/stories/tabs.stories.ts) - 40+ stories

---

## Resources & References

### Official Documentation
- **Angular 20**: https://angular.dev
- **Tailwind CSS v4**: https://tailwindcss.com/docs
- **Storybook Angular**: https://storybook.js.org/docs/angular
- **Angular Signals**: https://angular.dev/guide/signals
- **Vitest**: https://vitest.dev
- **Playwright**: https://playwright.dev

### Key Project Files

**Application:**
- **App Config**: [src/app/app.config.ts](src/app/app.config.ts) - Providers and configuration
- **Routes**: [src/app/app.routes.ts](src/app/app.routes.ts) - Application routes
- **Layout Config**: [src/app/config/layout.config.ts](src/app/config/layout.config.ts) - Navigation items
- **Root Component**: [src/app/app.ts](src/app/app.ts) - Root component with theming demo

**Testing:**
- **Vitest Config**: [vitest.config.ts](vitest.config.ts)
- **Playwright Config**: [playwright.config.ts](playwright.config.ts)

**Styling:**
- **Main Stylesheet**: [src/styles.css](src/styles.css) - Entry point
- **Design Tokens**: [src/styles/tokens/](src/styles/tokens/) - CSS variables
- **PostCSS Config**: [.postcssrc.json](.postcssrc.json)

**Storybook:**
- **Story Helpers**: [src/stories/story-helpers.ts](src/stories/story-helpers.ts)
- **Storybook Config**: [.storybook/](.storybook/)

### Component Reference Examples
- **Dropdown**: [src/app/components/ui/dropdown/](src/app/components/ui/dropdown/)
- **MultiSelect**: [src/app/components/ui/multiselect/](src/app/components/ui/multiselect/)
- **Modal**: [src/app/components/ui/modal/](src/app/components/ui/modal/)
- **Tabs**: [src/app/components/ui/tabs/](src/app/components/ui/tabs/)
- **Datepicker**: [src/app/components/ui/datepicker/](src/app/components/ui/datepicker/)

### Quick Tips

1. **Preview colors**: Open [src/app/app.html](src/app/app.html) for interactive color picker demo
2. **View CSS variables**: Check [src/styles/tokens/](src/styles/tokens/) files
3. **Add design tokens**: Edit appropriate file in `src/styles/tokens/` (e.g., `_colors.css`)
4. **Create component quickly**: Copy [dropdown/](src/app/components/ui/dropdown/) and modify
5. **Debug Storybook**: Verify `layout: 'fullscreen'` in parameters
6. **Test dark mode**: Add class `.dark` to any parent element

---

## Appendix: Design System Details

### Complete Token Organization

**Main Entry Point:** [src/styles.css](src/styles.css) - imports all modules

```
src/styles/
├── tokens/         # Design tokens (CSS variables)
│   ├── _colors.css        # 200+ color variables
│   ├── _spacing.css       # 15 spacing scales
│   ├── _typography.css    # Font system
│   ├── _borders.css       # Border system
│   ├── _shadows.css       # Shadow definitions
│   ├── _transitions.css   # Animation tokens
│   ├── _layout.css        # Z-index, containers
│   └── _index.css         # Tokens index
├── components/     # Component-specific styles
│   ├── _buttons.css       # Button variants
│   ├── _forms.css         # Form elements
│   ├── _cards.css         # Card components
│   ├── _badges.css        # Badge variants
│   ├── _alerts.css        # Alert messages
│   ├── _navigation.css    # Navigation components
│   ├── _tables.css        # Table styles
│   ├── _modals.css        # Modal and dialogs
│   ├── _interactive.css   # Dropdowns, accordions
│   ├── _feedback.css      # Progress, spinners
│   ├── _avatar.css        # Avatar components
│   └── _index.css         # Components index
├── utilities/      # Utility classes
│   ├── _helpers.css       # Helper utilities
│   └── _index.css         # Utilities index
└── themes/         # Theme variations (reserved)
```

### Design Tokens Details

#### 1. Colors (`_colors.css`)
- **Semantic colors**: primary, secondary, success, error, warning, info, dark
- **Gray scale**: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900
- **Text colors**: primary, secondary, disabled, inverse
- **Border colors**: default, light, dark
- **Background colors**: primary, secondary, tertiary
- **Component-specific colors**: button, input, card, modal, etc.
- **Light/Dark mode**: Automatic switching with `.dark` class

#### 2. Spacing (`_spacing.css`)
Based on 4px/8px grid system:
- `--spacing-0`: 0px
- `--spacing-1`: 4px
- `--spacing-2`: 8px
- `--spacing-3`: 12px
- `--spacing-4`: 16px
- `--spacing-5`: 20px
- `--spacing-6`: 24px
- `--spacing-7`: 28px
- `--spacing-8`: 32px
- `--spacing-10`: 40px
- `--spacing-12`: 48px
- `--spacing-16`: 64px
- `--spacing-20`: 80px
- `--spacing-24`: 96px
- `--spacing-32`: 128px

#### 3. Typography (`_typography.css`)
**Font Sizes:**
- xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl

**Line Heights:**
- none, tight, snug, normal, relaxed, loose

**Font Weights:**
- thin (100), extralight (200), light (300), normal (400), medium (500), semibold (600), bold (700), extrabold (800), black (900)

#### 4. Borders (`_borders.css`)
**Border Radius:**
- none, sm, base, md, lg, xl, 2xl, 3xl, full

**Border Widths:**
- 0, 1px, 2px, 4px, 8px

#### 5. Shadows (`_shadows.css`)
- sm, base, md, lg, xl, 2xl, inner, none

#### 6. Transitions (`_transitions.css`)
**Durations:**
- 75ms, 100ms, 150ms, 200ms, 300ms, 500ms, 700ms, 1000ms

**Timing Functions:**
- linear, ease, ease-in, ease-out, ease-in-out

#### 7. Layout (`_layout.css`)
**Z-index Scale:**
- 0, 10, 20, 30, 40, 50

**Container Max Widths:**
- sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)

### Component Styles (`src/styles/components/`)

All component styles use `@layer components`:

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

### Utility Classes (`src/styles/utilities/`)

Custom utilities using `@layer utilities`:

- **[_helpers.css](src/styles/utilities/_helpers.css)** - Helper classes
  - Scrollbar utilities
  - Responsive containers
  - Shadow utilities
  - Background and text color utilities
  - Border utilities
  - Border radius utilities
  - Transition utilities

### Semantic Component Classes

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

### CSS Variable Examples

```css
/* Colors */
var(--color-primary)
var(--color-success)
var(--color-error)
var(--color-text-primary)
var(--color-bg-primary)
var(--color-border)

/* Spacing */
var(--spacing-2)    /* 8px */
var(--spacing-4)    /* 16px */
var(--spacing-6)    /* 24px */

/* Typography */
var(--font-size-sm)
var(--font-size-base)
var(--font-size-lg)
var(--font-weight-medium)
var(--line-height-normal)

/* Borders & Shadows */
var(--border-radius-md)
var(--border-width-1)
var(--shadow-lg)

/* Transitions */
var(--transition-duration-150)
var(--transition-timing-ease)

/* Layout */
var(--z-50)
var(--container-lg)
```

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

---

**Last Updated**: November 2024
**Maintainers**: Development Team
**License**: MIT
