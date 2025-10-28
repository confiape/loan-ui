# Tabs Component

A professional, accessible tabs component with support for both static content and Angular Router integration.

## Features

- ✅ **5 Visual Variants**: default, pills, underline, boxed, segmented
- ✅ **Router Support**: Integrate with Angular Router for SPA navigation
- ✅ **Static Content**: Display content without routing
- ✅ **Horizontal & Vertical**: Support both orientations
- ✅ **Keyboard Navigation**: Full WCAG AAA accessibility
- ✅ **Dark Mode**: Perfect dark mode support
- ✅ **Badges**: Show counters or labels on tabs
- ✅ **Icons**: Add icons to tabs

## Basic Usage (Static Content)

```typescript
import { TabsComponent, TabItem } from './components/ui/tabs/tabs.component';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [TabsComponent],
  template: ` <app-tabs [tabs]="tabs" variant="pills" /> `,
})
export class ExampleComponent {
  tabs: TabItem[] = [
    {
      id: 'tab1',
      label: 'Profile',
      icon: '👤',
      content: 'Profile content here...',
    },
    {
      id: 'tab2',
      label: 'Settings',
      icon: '⚙️',
      content: 'Settings content here...',
    },
    {
      id: 'tab3',
      label: 'Messages',
      icon: '💬',
      badge: 5,
      badgeVariant: 'primary',
      content: 'You have 5 new messages.',
    },
  ];
}
```

## Router Mode Usage

### Step 1: Define Routes

```typescript
// app.routes.ts
import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard.component';
import { ProfileComponent } from './pages/profile.component';
import { SettingsComponent } from './pages/settings.component';

export const routes: Routes = [
  {
    path: 'admin',
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'settings', component: SettingsComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
```

### Step 2: Use Tabs with Router

```typescript
import { Component } from '@angular/core';
import { TabsComponent, TabItem } from './components/ui/tabs/tabs.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [TabsComponent],
  template: `
    <div class="admin-layout">
      <h1>Admin Panel</h1>

      <!-- Tabs with Router -->
      <app-tabs [tabs]="adminTabs" [useRouter]="true" variant="underline" />

      <!-- Content will be rendered via router-outlet inside tabs component -->
    </div>
  `,
})
export class AdminLayoutComponent {
  adminTabs: TabItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      route: '/admin/dashboard',
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: '👤',
      route: '/admin/profile',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      route: '/admin/settings',
    },
  ];
}
```

### Step 3: Navigate Programmatically

```typescript
import { Router } from '@angular/router';

constructor(private router: Router) {}

navigateToSettings() {
  this.router.navigate(['/admin/settings']);
  // The tabs component will automatically sync the active tab
}
```

## Component API

### Inputs

| Input         | Type                                                            | Default        | Description                            |
| ------------- | --------------------------------------------------------------- | -------------- | -------------------------------------- |
| `tabs`        | `TabItem[]`                                                     | **required**   | Array of tab items                     |
| `variant`     | `'default' \| 'pills' \| 'underline' \| 'boxed' \| 'segmented'` | `'default'`    | Visual variant                         |
| `orientation` | `'horizontal' \| 'vertical'`                                    | `'horizontal'` | Tab orientation                        |
| `useRouter`   | `boolean`                                                       | `false`        | Enable Angular Router integration      |
| `activeTabId` | `string`                                                        | `''`           | Initially active tab ID (content mode) |
| `justified`   | `boolean`                                                       | `false`        | Evenly distribute tabs                 |
| `fullWidth`   | `boolean`                                                       | `false`        | Tabs take full width                   |

### Outputs

| Output       | Type                    | Description                 |
| ------------ | ----------------------- | --------------------------- |
| `tabChanged` | `EventEmitter<TabItem>` | Emitted when tab is changed |

### TabItem Interface

```typescript
interface TabItem {
  id: string; // Unique identifier
  label: string; // Tab label text
  content?: string; // Static content (content mode only)
  route?: string; // Router path (router mode only)
  disabled?: boolean; // Disable the tab
  icon?: string; // Icon (emoji or text)
  badge?: string | number; // Badge content
  badgeVariant?: 'primary' | 'success' | 'error' | 'warning' | 'info'; // Badge color
}
```

## Variants

### Default

Tabs with background on active tab (traditional style)

```html
<app-tabs [tabs]="tabs" variant="default" />
```

### Pills

Rounded pill-style buttons

```html
<app-tabs [tabs]="tabs" variant="pills" />
```

### Underline

Clean underline indicator (modern style)

```html
<app-tabs [tabs]="tabs" variant="underline" />
```

### Boxed

Tabs with borders (classic style)

```html
<app-tabs [tabs]="tabs" variant="boxed" />
```

### Segmented

iOS-style segmented control

```html
<app-tabs [tabs]="tabs" variant="segmented" />
```

## Orientation

### Horizontal (default)

```html
<app-tabs [tabs]="tabs" orientation="horizontal" />
```

### Vertical

```html
<app-tabs [tabs]="tabs" orientation="vertical" />
```

Perfect for sidebars and settings panels.

## Advanced Examples

### With Badges and Icons

```typescript
tabs: TabItem[] = [
  {
    id: 'inbox',
    label: 'Inbox',
    icon: '📥',
    badge: 12,
    badgeVariant: 'primary',
    route: '/mail/inbox'
  },
  {
    id: 'important',
    label: 'Important',
    icon: '⭐',
    badge: 3,
    badgeVariant: 'error',
    route: '/mail/important'
  },
  {
    id: 'sent',
    label: 'Sent',
    icon: '📤',
    route: '/mail/sent'
  },
];
```

### Disabled Tabs

```typescript
tabs: TabItem[] = [
  { id: 'tab1', label: 'Active', content: 'Content 1' },
  { id: 'tab2', label: 'Disabled', content: 'Content 2', disabled: true },
  { id: 'tab3', label: 'Active', content: 'Content 3' },
];
```

### Justified Layout

```html
<app-tabs [tabs]="tabs" [justified]="true" variant="underline" />
```

All tabs will be evenly distributed across the available width.

## Keyboard Navigation

- **Arrow Keys** (←/→ or ↑/↓): Navigate between tabs
- **Home**: Jump to first tab
- **End**: Jump to last tab
- **Enter** or **Space**: Activate focused tab
- **Tab**: Move focus in/out of tab list

Disabled tabs are automatically skipped during keyboard navigation.

## Accessibility

The component follows WCAG AAA guidelines:

- Proper ARIA roles (`tablist`, `tab`, `tabpanel`)
- ARIA attributes (`aria-selected`, `aria-controls`, `aria-labelledby`)
- Keyboard navigation support
- Focus management
- Screen reader support
- High contrast mode support

## Styling

The component uses CSS variables from the design system. All colors, spacing, and transitions are customizable via CSS variables.

### Dark Mode

Dark mode is automatically applied when `.dark` class is present on any parent element:

```html
<div class="dark">
  <app-tabs [tabs]="tabs" variant="pills" />
</div>
```

## Best Practices

### Router Mode

1. **Always provide routes**: Every tab should have a `route` property
2. **Configure routes first**: Set up your Angular routes before using router mode
3. **Use meaningful paths**: Routes should be descriptive and RESTful
4. **Handle redirects**: Set up default redirects for parent routes

### Content Mode

1. **Keep content concise**: For long content, consider using router mode
2. **Use semantic HTML**: Structure content properly inside tabs
3. **Consider lazy loading**: For heavy content, use router mode with lazy-loaded modules

### Performance

1. **Use router mode for SPAs**: Better performance with code splitting
2. **Limit number of tabs**: 5-7 tabs maximum for optimal UX
3. **Use badges sparingly**: Too many badges can be overwhelming

## Examples

See [tabs.stories.ts](../../../stories/tabs.stories.ts) for comprehensive examples including:

- All variants
- Router integration
- Badges and icons
- Disabled states
- Vertical orientation
- Keyboard navigation demos
