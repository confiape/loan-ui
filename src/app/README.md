# Estructura de Carpetas - App

Esta aplicación sigue las mejores prácticas de Angular para una estructura escalable y mantenible.

## 📁 Estructura

```
src/app/
├── components/          # Componentes UI reutilizables
│   └── ui/             # Componentes de interfaz de usuario
│       ├── dropdown/   # Componente dropdown interactivo
│       ├── multiselect/# Componente multiselect
│       ├── modal/      # Componente modal/dialog
│       ├── accordion/  # Componente accordion expandible
│       ├── tooltip/    # Componente tooltip
│       └── datepicker/ # Componente selector de fecha
│
├── core/               # Funcionalidad core (singleton)
│   ├── services/       # Servicios singleton (API, auth, etc.)
│   ├── guards/         # Route guards
│   ├── interceptors/   # HTTP interceptors
│   └── models/         # Interfaces y tipos globales
│
├── features/           # Módulos de características
│   └── [feature-name]/ # Cada feature tiene su propia carpeta
│       ├── components/ # Componentes específicos del feature
│       ├── services/   # Servicios específicos del feature
│       └── models/     # Modelos específicos del feature
│
├── shared/             # Código compartido
│   ├── directives/     # Directivas reutilizables
│   ├── pipes/          # Pipes personalizados
│   └── utils/          # Funciones de utilidad
│
├── app.ts              # Componente raíz
├── app.html            # Template del componente raíz
├── app.css             # Estilos del componente raíz
├── app.config.ts       # Configuración de la app
└── app.routes.ts       # Definición de rutas

```

## 📋 Convenciones

### Componentes UI (`components/ui/`)
- **Propósito**: Componentes reutilizables de interfaz de usuario
- **Características**:
  - Standalone components
  - Sin lógica de negocio
  - Altamente configurables vía `@Input()` y `@Output()`
  - Soportan dark mode automáticamente
  - Siguen el design system

**Ejemplo de uso**:
```typescript
import { DropdownComponent } from './components/ui/dropdown/dropdown.component';

@Component({
  selector: 'app-my-feature',
  standalone: true,
  imports: [DropdownComponent],
  template: `
    <app-dropdown
      [items]="items"
      (selectionChange)="onSelect($event)">
    </app-dropdown>
  `
})
```

### Core (`core/`)
- **Propósito**: Servicios singleton y funcionalidad core
- **Regla**: Solo se importa una vez en `app.config.ts`
- **Incluye**:
  - Servicios de autenticación
  - Servicios de API
  - Guards para rutas
  - Interceptors HTTP
  - Modelos/interfaces globales

### Features (`features/`)
- **Propósito**: Módulos de características de la aplicación
- **Estructura por feature**:
  ```
  features/loans/
  ├── components/
  │   ├── loan-list/
  │   └── loan-detail/
  ├── services/
  │   └── loan.service.ts
  └── models/
      └── loan.model.ts
  ```

### Shared (`shared/`)
- **Propósito**: Código compartido entre features
- **Incluye**:
  - Directivas (ej: `appHighlight`)
  - Pipes (ej: `currencyFormat`)
  - Utilidades (ej: `dateUtils`, `validators`)

## 🎯 Mejores Prácticas

1. **Componentes Standalone**: Todos los componentes son standalone (no NgModules)
2. **Signals**: Usar signals para estado reactivo
3. **OnPush**: Usar `ChangeDetectionStrategy.OnPush` cuando sea posible
4. **Smart vs Presentational**:
   - **Smart**: En `features/`, manejan lógica y estado
   - **Presentational**: En `components/ui/`, solo presentan datos
5. **Lazy Loading**: Cargar features bajo demanda
6. **Naming**:
   - Componentes: `*.component.ts`
   - Servicios: `*.service.ts`
   - Guards: `*.guard.ts`
   - Pipes: `*.pipe.ts`

## 🔄 Flujo de Datos

```
Features (Smart Components)
    ↓
    ├─→ Core Services (API, State)
    ↓
    └─→ UI Components (Presentational)
```

## 📦 Imports

```typescript
// ✅ Correcto - Import específico
import { DropdownComponent } from '@app/components/ui/dropdown/dropdown.component';
import { LoanService } from '@app/core/services/loan.service';

// ❌ Incorrecto - Barrel imports pueden causar problemas circulares
import { DropdownComponent } from '@app/components';
```

## 🚀 Agregar un Nuevo Componente

```bash
# Usando Angular CLI
ng generate component components/ui/nombre-componente --standalone

# Usando Angular CLI con ruta específica
ng generate component features/loans/components/loan-card --standalone
```

## 📝 Notas

- Todos los componentes UI están en `components/ui/` y son completamente reutilizables
- Los componentes usan el design system definido en `src/styles.css`
- Modo oscuro se activa agregando clase `.dark` al contenedor padre
