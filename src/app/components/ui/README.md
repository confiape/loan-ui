# Componentes UI - Documentación

Componentes UI reutilizables y completamente funcionales construidos con Angular 20, Signals y Tailwind CSS v4.

## 📦 Componentes Disponibles

### ✅ Componentes Funcionales (Listos para Usar)

1. **Dropdown** - Menú desplegable con selección única
2. **MultiSelect** - Selector múltiple con checkboxes
3. **Modal** - Diálogo modal con backdrop
4. **Accordion** - Acordeón expandible/colapsable

### 🚧 Componentes Pendientes

5. **Tooltip** - Tooltip al hover
6. **DatePicker** - Selector de fecha

---

## 🎯 Dropdown Component

Menú desplegable funcional con soporte para dark mode.

### Características

- ✅ Click fuera para cerrar
- ✅ Items con divider
- ✅ Items deshabilitados
- ✅ 3 variantes: primary, secondary, outline
- ✅ Posicionamiento: top / bottom
- ✅ Animaciones suaves

### Uso Básico

```typescript
import { DropdownComponent, DropdownItem } from '@app/components/ui/dropdown/dropdown.component';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [DropdownComponent],
  template: `
    <app-dropdown
      [items]="items()"
      placeholder="Selecciona una opción"
      variant="primary"
      (selectionChange)="onSelect($event)"
    />
  `,
})
export class MyComponent {
  items = signal<DropdownItem[]>([
    { label: 'Dashboard', value: 'dashboard' },
    { label: 'Settings', value: 'settings' },
    { label: 'Disabled', value: 'disabled', disabled: true },
    { label: '---', value: '', divider: true },
    { label: 'Logout', value: 'logout' },
  ]);

  onSelect(item: DropdownItem) {
    console.log('Selected:', item);
  }
}
```

### API

**Inputs:**

- `items: DropdownItem[]` - (Requerido) Array de items
- `placeholder: string` - Texto cuando no hay selección (default: "Select an option")
- `disabled: boolean` - Deshabilitar dropdown (default: false)
- `position: 'bottom' | 'top'` - Posición del menú (default: 'bottom')
- `variant: 'primary' | 'secondary' | 'outline'` - Estilo del botón (default: 'outline')

**Outputs:**

- `selectionChange: DropdownItem` - Emite cuando se selecciona un item

**Interface:**

```typescript
interface DropdownItem {
  label: string;
  value: any;
  icon?: string;
  disabled?: boolean;
  divider?: boolean;
}
```

---

## 🎯 MultiSelect Component

Selector múltiple con checkboxes y límite de selecciones.

### Características

- ✅ Checkboxes para múltiples selecciones
- ✅ Botones "Select All" / "Clear All"
- ✅ Límite máximo de selecciones
- ✅ Muestra contador de selecciones
- ✅ Items deshabilitados
- ✅ Scroll cuando hay muchos items

### Uso Básico

```typescript
import {
  MultiSelectComponent,
  MultiSelectItem,
} from '@app/components/ui/multiselect/multiselect.component';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [MultiSelectComponent],
  template: `
    <app-multiselect
      [items]="frameworks()"
      placeholder="Selecciona frameworks"
      [maxSelections]="3"
      [showSelectAll]="true"
      (selectionChange)="onSelectionChange($event)"
    />
  `,
})
export class MyComponent {
  frameworks = signal<MultiSelectItem[]>([
    { label: 'React', value: 'react' },
    { label: 'Angular', value: 'angular' },
    { label: 'Vue', value: 'vue' },
    { label: 'Svelte', value: 'svelte' },
  ]);

  onSelectionChange(items: MultiSelectItem[]) {
    console.log('Selected items:', items);
  }
}
```

### API

**Inputs:**

- `items: MultiSelectItem[]` - (Requerido) Array de items
- `placeholder: string` - Texto cuando no hay selección (default: "Select options")
- `disabled: boolean` - Deshabilitar componente (default: false)
- `maxSelections: number | null` - Límite máximo de selecciones (default: null = sin límite)
- `showCheckboxes: boolean` - Mostrar checkboxes (default: true)
- `showSelectAll: boolean` - Mostrar botones Select/Clear All (default: true)

**Outputs:**

- `selectionChange: MultiSelectItem[]` - Emite cuando cambia la selección

**Interface:**

```typescript
interface MultiSelectItem {
  label: string;
  value: any;
  disabled?: boolean;
}
```

---

## 🎯 Modal Component

Modal/Dialog completamente funcional con animaciones.

### Características

- ✅ Backdrop con blur
- ✅ Cerrar con ESC
- ✅ Cerrar al hacer click fuera
- ✅ 5 tamaños: sm, md, lg, xl, full
- ✅ Bloquea scroll del body
- ✅ Footer personalizable con proyección de contenido
- ✅ Animaciones suaves de entrada/salida

### Uso Básico

```typescript
import { ModalComponent } from '@app/components/ui/modal/modal.component';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [ModalComponent],
  template: `
    <button (click)="isOpen.set(true)" class="btn btn-primary">Abrir Modal</button>

    <app-modal
      [isOpen]="isOpen()"
      title="Mi Modal"
      size="md"
      [closeOnBackdropClick]="true"
      [closeOnEscape]="true"
      (closed)="isOpen.set(false)"
    >
      <!-- Contenido del modal -->
      <p>Este es el contenido del modal</p>

      <!-- Footer (opcional) -->
      <div modal-footer>
        <button (click)="isOpen.set(false)" class="btn btn-outline-secondary">Cancelar</button>
        <button (click)="save()" class="btn btn-primary">Guardar</button>
      </div>
    </app-modal>
  `,
})
export class MyComponent {
  isOpen = signal(false);

  save() {
    console.log('Guardando...');
    this.isOpen.set(false);
  }
}
```

### API

**Inputs:**

- `isOpen: boolean` - (Requerido) Control de visibilidad
- `title: string` - Título del modal (default: '')
- `size: 'sm' | 'md' | 'lg' | 'xl' | 'full'` - Tamaño del modal (default: 'md')
- `showCloseButton: boolean` - Mostrar botón X (default: true)
- `closeOnBackdropClick: boolean` - Cerrar al click fuera (default: true)
- `closeOnEscape: boolean` - Cerrar con ESC (default: true)

**Outputs:**

- `closed: void` - Emite cuando se cierra el modal
- `opened: void` - Emite cuando se abre el modal

**Proyección de Contenido:**

- Contenido principal: `<ng-content></ng-content>`
- Footer: `<ng-content select="[modal-footer]"></ng-content>`

---

## 🎯 Accordion Component

Acordeón expandible/colapsable con animaciones.

### Características

- ✅ Modo simple o múltiple
- ✅ Items con estado inicial abierto/cerrado
- ✅ Items deshabilitados
- ✅ Animaciones opcionales
- ✅ Iconos rotativos

### Uso Básico

```typescript
import {
  AccordionComponent,
  AccordionItem,
} from '@app/components/ui/accordion/accordion.component';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [AccordionComponent],
  template: `
    <app-accordion
      [items]="faqs()"
      [allowMultiple]="false"
      [animated]="true"
      (itemToggled)="onToggle($event)"
    />
  `,
})
export class MyComponent {
  faqs = signal<AccordionItem[]>([
    {
      id: '1',
      title: '¿Qué es Angular?',
      content: 'Angular es un framework de desarrollo web...',
      isOpen: true,
    },
    {
      id: '2',
      title: '¿Qué son los Signals?',
      content: 'Signals son la nueva forma reactiva de Angular...',
    },
  ]);

  onToggle(item: AccordionItem) {
    console.log('Toggled:', item);
  }
}
```

### API

**Inputs:**

- `items: AccordionItem[]` - (Requerido) Array de items
- `allowMultiple: boolean` - Permitir múltiples items abiertos (default: false)
- `animated: boolean` - Habilitar animaciones (default: true)

**Outputs:**

- `itemToggled: AccordionItem` - Emite cuando se abre/cierra un item

**Interface:**

```typescript
interface AccordionItem {
  id: string;
  title: string;
  content: string;
  isOpen?: boolean;
  disabled?: boolean;
}
```

---

## 🎨 Temas y Estilos

Todos los componentes:

- ✅ Soportan dark mode automáticamente
- ✅ Usan variables CSS del design system
- ✅ Son completamente responsive
- ✅ Incluyen animaciones suaves
- ✅ Siguen las mejores prácticas de accesibilidad

### Dark Mode

```html
<!-- Light mode -->
<app-dropdown [items]="items()" />

<!-- Dark mode -->
<div class="dark">
  <app-dropdown [items]="items()" />
</div>
```

## 📝 Notas

- Todos los componentes son **standalone**
- Usan **Angular Signals** para estado reactivo
- Son **completamente tipados** con TypeScript
- Incluyen **animaciones CSS** opcionales
- **No tienen dependencias externas** (solo Angular + Tailwind)

## 🚀 Próximos Componentes

- [ ] **Tooltip** - Tooltip con posicionamiento inteligente
- [ ] **DatePicker** - Selector de fecha con calendario
- [ ] **TimePicker** - Selector de hora
- [ ] **Autocomplete** - Input con autocompletado
- [ ] **Tabs** - Pestañas interactivas
- [ ] **Toast/Notifications** - Notificaciones toast
- [ ] **Context Menu** - Menú contextual (click derecho)
- [ ] **Tree View** - Vista de árbol jerárquica
