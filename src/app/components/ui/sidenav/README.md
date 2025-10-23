# Sidenav Component

Un componente de navegación lateral (sidenav) completamente funcional y accesible, integrado con el sistema de diseño de la aplicación.

## Características

### Funcionalidades Principales

- ✅ **Navegación jerárquica** - Soporte para items con hijos (submenús)
- ✅ **Colapsable** - Puede colapsar/expandir con animaciones suaves
- ✅ **Posicionamiento** - Izquierda o derecha
- ✅ **Variantes de estilo** - Default, bordered, pills
- ✅ **Badges** - Soporte para badges en items
- ✅ **Iconos** - Iconos SVG o emoji en cada item
- ✅ **Divisores** - Separadores visuales entre grupos de items
- ✅ **Items deshabilitados** - Soporte para items no clickeables
- ✅ **Tooltips** - Mostrar labels en modo colapsado
- ✅ **Dark mode** - Soporte completo para modo oscuro
- ✅ **Responsive** - Adaptable a diferentes tamaños de pantalla

### Accesibilidad (WCAG)

- ✅ **Roles ARIA** - navigation, menu, menuitem
- ✅ **Atributos ARIA** - aria-expanded, aria-current, aria-disabled
- ✅ **Navegación por teclado** - Enter, Space, Arrow keys
- ✅ **Focus visible** - Outlines claros para navegación por teclado
- ✅ **Screen reader friendly** - Labels descriptivos

### Performance

- ✅ **Angular Signals** - Reactive state management
- ✅ **Zoneless** - Compatible con zoneless change detection
- ✅ **CSS Variables** - Theming dinámico
- ✅ **Optimized rendering** - Computed values y track by

## Instalación

El componente ya está incluido en el proyecto. Simplemente impórtalo:

```typescript
import { SidenavComponent, SidenavItem } from '@/components/ui/sidenav/sidenav';
```

## Uso Básico

```typescript
import { Component } from '@angular/core';
import { SidenavComponent, SidenavItem } from '@/components/ui/sidenav/sidenav';

@Component({
  selector: 'app-root',
  imports: [SidenavComponent],
  template: `
    <app-sidenav
      [items]="navItems"
      [header]="'My App'"
      [collapsible]="true"
      [selectedValue]="'dashboard'"
      (selectionChange)="onItemSelected($event)"
    />
  `
})
export class AppComponent {
  navItems: SidenavItem[] = [
    {
      label: 'Dashboard',
      icon: '📊',
      value: 'dashboard'
    },
    {
      label: 'Users',
      icon: '👥',
      value: 'users'
    },
    {
      label: 'Settings',
      icon: '⚙️',
      value: 'settings'
    }
  ];

  onItemSelected(item: SidenavItem) {
    console.log('Selected:', item);
  }
}
```

### Posicionamiento Fixed (para aplicaciones reales)

Por defecto, el sidenav usa `position: relative` para mejor compatibilidad con Storybook. Si necesitas que sea `position: fixed` en tu aplicación real, agrega la clase CSS:

```html
<app-sidenav class="sidenav-fixed" [items]="navItems" />
```

O modifica el CSS directamente en `sidenav.css` si prefieres que siempre sea fixed.

## API

### Inputs

| Input | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `items` | `SidenavItem[]` | `[]` | Array de items de navegación |
| `position` | `'left' \| 'right'` | `'left'` | Posición del sidenav |
| `variant` | `'default' \| 'bordered' \| 'pills'` | `'default'` | Variante visual |
| `collapsed` | `boolean` | `false` | Si el sidenav está colapsado |
| `collapsible` | `boolean` | `false` | Si el sidenav puede colapsarse |
| `showToggle` | `boolean` | `true` | Mostrar botón de colapsar |
| `width` | `string` | `'16rem'` | Ancho cuando está expandido |
| `collapsedWidth` | `string` | `'4rem'` | Ancho cuando está colapsado |
| `header` | `string` | `''` | Texto del header |
| `footer` | `string` | `''` | Contenido del footer (HTML) |
| `selectedValue` | `string` | `''` | Valor del item seleccionado |
| `logo` | `string` | `''` | Logo (HTML/SVG) |
| `logoCollapsed` | `string` | `''` | Logo para modo colapsado |

### Outputs

| Output | Tipo | Descripción |
|--------|------|-------------|
| `itemClick` | `SidenavItem` | Emitido al hacer click en un item |
| `toggleChange` | `boolean` | Emitido al cambiar estado colapsado |
| `selectionChange` | `SidenavItem` | Emitido al seleccionar un item |

### SidenavItem Interface

```typescript
export interface SidenavItem {
  label: string;          // Texto del item
  icon?: string;          // Icono (emoji o SVG HTML)
  value: string;          // Identificador único
  badge?: string | number; // Badge opcional
  children?: SidenavItem[]; // Items hijos (submenu)
  disabled?: boolean;     // Si está deshabilitado
  divider?: boolean;      // Si es un divisor
}
```

## Ejemplos

### Con Submenús

```typescript
items: SidenavItem[] = [
  {
    label: 'Products',
    icon: '📦',
    value: 'products',
    children: [
      {
        label: 'All Products',
        value: 'products-all'
      },
      {
        label: 'Categories',
        value: 'products-categories'
      }
    ]
  }
];
```

### Con Badges

```typescript
items: SidenavItem[] = [
  {
    label: 'Inbox',
    icon: '📥',
    value: 'inbox',
    badge: 12
  },
  {
    label: 'Notifications',
    icon: '🔔',
    value: 'notifications',
    badge: 'New'
  }
];
```

### Con Divisores

```typescript
items: SidenavItem[] = [
  {
    label: 'Dashboard',
    icon: '📊',
    value: 'dashboard'
  },
  {
    label: '',
    value: 'divider-1',
    divider: true
  },
  {
    label: 'Settings',
    icon: '⚙️',
    value: 'settings'
  }
];
```

### Con Items Deshabilitados

```typescript
items: SidenavItem[] = [
  {
    label: 'Available',
    icon: '✅',
    value: 'available'
  },
  {
    label: 'Coming Soon',
    icon: '⏳',
    value: 'coming-soon',
    disabled: true
  }
];
```

### Colapsable

```html
<app-sidenav
  [items]="navItems"
  [collapsible]="true"
  [showToggle]="true"
  [collapsed]="false"
  (toggleChange)="onToggle($event)"
/>
```

### Posición Derecha

```html
<app-sidenav
  [items]="navItems"
  [position]="'right'"
/>
```

### Variantes

```html
<!-- Default -->
<app-sidenav [variant]="'default'" [items]="navItems" />

<!-- Bordered -->
<app-sidenav [variant]="'bordered'" [items]="navItems" />

<!-- Pills -->
<app-sidenav [variant]="'pills'" [items]="navItems" />
```

### Con Logo

```html
<app-sidenav
  [logo]="'<strong>💼</strong>'"
  [logoCollapsed]="'💼'"
  [header]="'Confiape'"
  [items]="navItems"
  [collapsible]="true"
/>
```

### Con Footer

```html
<app-sidenav
  [items]="navItems"
  [footer]="'<small>© 2025 My Company</small>'"
/>
```

### Ancho Personalizado

```html
<app-sidenav
  [items]="navItems"
  [width]="'20rem'"
  [collapsedWidth]="'5rem'"
  [collapsible]="true"
/>
```

## Navegación por Teclado

| Tecla | Acción |
|-------|--------|
| `Tab` | Navegar entre items |
| `Enter` / `Space` | Seleccionar item / Expandir submenu |
| `Arrow Right` | Expandir item con hijos |
| `Arrow Left` | Colapsar item con hijos |

## Estilos CSS

El componente usa variables CSS del sistema de diseño. Puedes personalizarlo modificando estas variables:

```css
/* En tu styles.css o en :root */
:root {
  --color-sidebar-bg: #ffffff;
  --color-sidebar-border: #e5e7eb;
  --color-sidebar-text: #111827;
  --color-sidebar-text-secondary: #6b7280;
  --color-sidebar-hover: #f3f4f6;
}

.dark {
  --color-sidebar-bg: #1f2937;
  --color-sidebar-border: #374151;
  --color-sidebar-text: #ffffff;
  --color-sidebar-text-secondary: #9ca3af;
  --color-sidebar-hover: #374151;
}
```

## Dark Mode

El componente soporta dark mode automáticamente. Solo añade la clase `.dark` a un elemento padre:

```html
<div class="dark">
  <app-sidenav [items]="navItems" />
</div>
```

## Responsive

En móviles (< 768px), el sidenav se oculta por defecto. Puedes añadir tu propia lógica para mostrarlo:

```typescript
isMobileMenuOpen = signal(false);

toggleMobileMenu() {
  this.isMobileMenuOpen.update(v => !v);
}
```

```html
<app-sidenav
  [items]="navItems"
  [class.sidenav-open]="isMobileMenuOpen()"
/>
```

## Integración con Router

```typescript
import { Router } from '@angular/router';

constructor(private router: Router) {}

onItemSelected(item: SidenavItem) {
  // Navegar usando el router
  this.router.navigate([item.value]);
}
```

## Storybook

Puedes ver todos los ejemplos en Storybook:

```bash
npm run storybook
```

Navega a "UI/Sidenav" para ver 15+ historias con diferentes configuraciones.

## Mejores Prácticas

1. **Usa valores únicos**: Asegúrate de que cada item tenga un `value` único
2. **Iconos consistentes**: Usa emojis o SVGs, pero mantén consistencia
3. **Badges informativos**: Usa badges para información importante (ej: contadores)
4. **Divisores con moderación**: No abuses de los divisores
5. **Accesibilidad**: Siempre proporciona labels descriptivos
6. **Jerarquía clara**: No anides submenús más de 2 niveles

## Troubleshooting

### El sidenav no se muestra

Verifica que el componente esté importado correctamente y que tenga items.

### Los iconos no se muestran

Asegúrate de pasar HTML válido o emojis en la propiedad `icon`.

### El modo colapsado no funciona

Verifica que `collapsible` esté en `true` y que `showToggle` también lo esté.

### Los tooltips no aparecen en modo colapsado

Asegúrate de que el sidenav tenga espacio suficiente para mostrar los tooltips (position: relative en el padre).

## Changelog

### v1.0.0 (2025-01-23)

- ✅ Componente inicial
- ✅ Soporte para navegación jerárquica
- ✅ Modo colapsable
- ✅ 3 variantes de estilo
- ✅ Accesibilidad completa
- ✅ Dark mode
- ✅ Navegación por teclado
- ✅ Storybook stories (15+ ejemplos)

## Licencia

Este componente es parte del proyecto loan-ui.
