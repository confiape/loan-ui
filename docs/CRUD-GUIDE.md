# CRUD Guide - Quick Start

Guía práctica para crear un CRUD completo en **3 pasos**. Para entender la arquitectura técnica, ver [CRUD-ARCHITECTURE.md](./CRUD-ARCHITECTURE.md).

---

## TL;DR

```bash
# 1. Crear servicio (100 líneas)
# 2. Crear componente (10 líneas)
# 3. Agregar ruta (3 líneas)
# Total: ~15 minutos
```

---

## Prerequisitos

- DTOs generados en `src/app/core/openapi/model/`
- API service generado en `src/app/core/openapi/api/`

---

## Paso 1: Crear el Servicio

**Archivo**: `src/app/features/{entity}/{entity}-list/{entity}-list.service.ts`

### Template Básico

```typescript
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Validators } from '@angular/forms';
import { BaseCrudService } from '../../../core/services/base-crud.service';
import { EntityApiService } from '../../../core/openapi/api/entity.service';
import { EntityDto, SaveEntityDto } from '../../../core/openapi/model/models';
import { TableColumnMetadata, FormFieldMetadata } from '../../../core/models/form-metadata';

@Injectable()
export class EntityListService extends BaseCrudService<EntityDto, SaveEntityDto> {
  private entityApi = inject(EntityApiService);
  protected router = inject(Router);
  protected enableRouterNavigation = true;

  // 1. CARGAR DATOS
  protected fetchAllItems(): Observable<EntityDto[]> {
    return this.entityApi.getAll();
  }

  // 2. GUARDAR (crear o actualizar)
  protected performSave(dto: SaveEntityDto): Observable<EntityDto> {
    return this.entityApi.save(dto);
  }

  // 3. ELIMINAR
  protected performDelete(id: string): Observable<unknown> {
    return this.entityApi.delete(id);
  }

  // 4. COLUMNAS DE LA TABLA
  getTableColumns(): TableColumnMetadata<EntityDto>[] {
    return [
      { key: 'name', label: 'Name', sortable: true },
      { key: 'email', label: 'Email', sortable: true },
      { key: 'id', label: 'ID', sortable: true },
    ];
  }

  // 5. CAMPOS DEL FORMULARIO
  getFormFields(): FormFieldMetadata[] {
    return [
      {
        key: 'name',
        label: 'Name',
        type: 'text',
        validators: [Validators.required, Validators.minLength(2)],
        placeholder: 'Enter name',
      },
      {
        key: 'email',
        label: 'Email',
        type: 'email',
        validators: [Validators.required, Validators.email],
        placeholder: 'name@example.com',
      },
    ];
  }

  // 6. RUTA BASE
  getRouteBasePath(): string {
    return '/entities';
  }

  // 7. HOOKS (opcional)
  protected override onAfterFormSave(): void {
    this.router.navigate(['/entities']);
  }

  protected override onAfterFormCancel(): void {
    this.router.navigate(['/entities']);
  }
}
```

---

## Paso 2: Crear el Componente

**Archivo**: `src/app/features/{entity}/{entity}-list-v2/{entity}-list-v2.ts`

```typescript
import { Component, inject } from '@angular/core';
import { GenericCrudListComponent } from '../../../components/generic-crud';
import { EntityListService } from '../entity-list/entity-list.service';

@Component({
  selector: 'app-entity-list-v2',
  standalone: true,
  imports: [GenericCrudListComponent],
  providers: [EntityListService],
  template: `<app-generic-crud-list [service]="service" />`,
})
export class EntityListV2Component {
  service = inject(EntityListService);
}
```

**¡Eso es todo! 10 líneas.**

---

## Paso 3: Agregar Ruta

**Archivo**: `src/app/app.routes.ts`

```typescript
import { EntityListV2Component } from './features/entities/entity-list-v2/entity-list-v2';

export const routes: Routes = [
  // ... otras rutas
  {
    path: 'entities',
    children: [
      { path: '', component: EntityListV2Component },
      { path: ':id', component: EntityListV2Component }, // Para edit modal
    ],
  },
];
```

---

## ✅ ¡Listo!

Navega a `/entities` y verás:
- ✅ Tabla con datos
- ✅ Búsqueda y filtros
- ✅ Botón "New Entity"
- ✅ Botones Edit/Delete por fila
- ✅ Modal para crear/editar
- ✅ Validaciones
- ✅ Loading states

---

## Tipos de Campos Disponibles

### Campos de Texto

```typescript
{ key: 'name', label: 'Name', type: 'text' }
{ key: 'email', label: 'Email', type: 'email' }
{ key: 'password', label: 'Password', type: 'password' }
{ key: 'age', label: 'Age', type: 'number' }
{ key: 'bio', label: 'Bio', type: 'textarea' }
```

### Campos de Selección

```typescript
// Select simple con opciones estáticas
{
  key: 'status',
  label: 'Status',
  type: 'select',
  options: [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ],
}

// Select con opciones dinámicas (API)
{
  key: 'companyId',
  label: 'Company',
  type: 'select',
  loadOptions: () => this.companyApi.getAll().pipe(
    map(companies => companies.map(c => ({
      label: c.name,
      value: c.id
    })))
  ),
}

// MultiSelect
{
  key: 'tagsId',
  label: 'Tags',
  type: 'multiselect',
  loadOptions: () => this.tagApi.getAll().pipe(
    map(tags => tags.map(t => ({ label: t.name, value: t.id })))
  ),
}
```

### Otros Campos

```typescript
{ key: 'birthDate', label: 'Birth Date', type: 'date' }
{ key: 'isActive', label: 'Active', type: 'checkbox' }
{
  key: 'gender',
  label: 'Gender',
  type: 'radio',
  options: [
    { label: 'Male', value: 'M' },
    { label: 'Female', value: 'F' },
  ],
}
```

---

## Validaciones

### Validaciones Síncronas

```typescript
import { Validators } from '@angular/forms';

{
  key: 'name',
  validators: [
    Validators.required,           // Requerido
    Validators.minLength(2),       // Mínimo 2 caracteres
    Validators.maxLength(100),     // Máximo 100 caracteres
    Validators.email,              // Email válido
    Validators.pattern(/^[A-Z]/),  // Regex personalizado
    Validators.min(18),            // Valor mínimo
    Validators.max(120),           // Valor máximo
  ],
}
```

### Validaciones Asíncronas (Unicidad)

```typescript
import { uniqueValueValidator } from '../../../core/validators/async-validators';

// En el servicio, agregar método:
isNameAvailable(name: string): Observable<boolean> {
  const exists = this.items().some(
    item => item.name.toLowerCase() === name.toLowerCase() &&
            item.id !== this.editingItem()?.id
  );
  return of(!exists);
}

// En getFormFields():
{
  key: 'name',
  label: 'Name',
  type: 'text',
  validators: [Validators.required],
  asyncValidators: [
    uniqueValueValidator(
      (name) => this.isNameAvailable(name),
      this.editingItem()?.name  // Excluir nombre actual al editar
    )
  ],
  helpText: 'Must be unique',
}
```

---

## Value Transformers

Para campos complejos que necesitan transformación DTO → Form:

```typescript
// Ejemplo: RoleDto tiene permissions: PermissionDto[]
// Pero el form necesita permissionsId: string[]

{
  key: 'permissionsId',
  label: 'Permissions',
  type: 'multiselect',
  loadOptions: () => this.permissionApi.getAll().pipe(
    map(permissions => permissions.map(p => ({
      label: p.name,
      value: p.name
    })))
  ),
  valueTransformer: (role: RoleDto) => {
    // Transforma PermissionDto[] a string[]
    return role.permissions?.map(p => p.name) || [];
  },
}

// Al guardar, transforma de vuelta en performSave():
protected performSave(dto: SaveRoleDto): Observable<RoleDto> {
  // dto.permissionsId = ['READ', 'WRITE']
  // API espera: { permissions: ['READ', 'WRITE'] }
  return this.roleApi.save(dto);
}
```

---

## Columnas Personalizadas

### Columna Simple

```typescript
{ key: 'name', label: 'Name', sortable: true }
```

### Columna con Formato

```typescript
{
  key: 'createdAt',
  label: 'Created',
  formatter: (item: EntityDto) => {
    return new Date(item.createdAt).toLocaleDateString();
  }
}
```

### Columna Computada

```typescript
{
  key: 'permissionsCount',
  label: 'Permissions',
  formatter: (role: RoleDto) => {
    return role.permissions?.length.toString() || '0';
  }
}
```

### Columna con Ancho

```typescript
{ key: 'id', label: 'ID', width: '100px' }
```

---

## Ejemplos Reales

### CRUD Simple: Companies

```typescript
// companies-list.service.ts
getFormFields(): FormFieldMetadata[] {
  return [
    {
      key: 'name',
      label: 'Company Name',
      type: 'text',
      validators: [Validators.required, Validators.minLength(2)],
      placeholder: 'Enter company name',
    },
  ];
}

getTableColumns(): TableColumnMetadata<CompanyDto>[] {
  return [
    { key: 'name', label: 'Company', sortable: true },
    { key: 'id', label: 'ID', sortable: true },
  ];
}
```

**Resultado**: CRUD funcional en ~60 líneas.

### CRUD Complejo: Roles

```typescript
// roles-list.service.ts
getFormFields(): FormFieldMetadata[] {
  return [
    {
      key: 'name',
      label: 'Role Name',
      type: 'text',
      validators: [Validators.required, Validators.minLength(2)],
      asyncValidators: [
        uniqueValueValidator(
          (name) => this.isRoleNameAvailable(name),
          this.editingItem()?.name
        )
      ],
    },
    {
      key: 'permissionsId',
      label: 'Permissions',
      type: 'multiselect',
      loadOptions: () => this.userApi.getAllPermissions().pipe(
        map(perms => perms.map(p => ({ label: p.name, value: p.name })))
      ),
      valueTransformer: (role: RoleDto) => {
        return role.permissions?.map(p => p.name) || [];
      },
    },
    {
      key: 'rolesId',
      label: 'Parent Roles',
      type: 'multiselect',
      loadOptions: () => this.userApi.getAllRoles().pipe(
        map(roles => {
          const currentId = this.editingItem()?.id;
          return roles
            .filter(r => r.id !== currentId) // Prevenir referencia circular
            .map(r => ({ label: r.name, value: r.id }));
        })
      ),
      valueTransformer: (role: RoleDto) => {
        return role.roles?.map(r => r.id) || [];
      },
    },
  ];
}

isRoleNameAvailable(name: string): Observable<boolean> {
  const exists = this.items().some(
    role => role.name.toLowerCase() === name.toLowerCase() &&
            role.id !== this.editingItem()?.id
  );
  return of(!exists);
}
```

**Resultado**: CRUD con multiselects, validación async, y transformers en ~150 líneas.

---

## Customización

### Deshabilitar Navegación por Router

```typescript
export class EntityListService extends BaseCrudService<EntityDto, SaveEntityDto> {
  protected enableRouterNavigation = false; // Abre modal directamente
}
```

### Agregar Lógica Custom al Guardar

```typescript
protected override onAfterFormSave(): void {
  // Custom logic
  this.toastService.success('Entity saved!');
  this.analyticsService.track('entity_created');

  // Navegar
  this.router.navigate(['/entities']);
}
```

### Validación Personalizada

```typescript
// src/app/core/validators/custom-validators.ts
export function phoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valid = /^\+?[\d\s-]+$/.test(control.value);
    return valid ? null : { invalidPhone: true };
  };
}

// Usar en metadata:
{
  key: 'phone',
  validators: [phoneValidator()],
}
```

---

## Testing

### Unit Test del Servicio

```typescript
// entity-list.service.spec.ts
describe('EntityListService', () => {
  let service: EntityListService;
  let apiMock: jasmine.SpyObj<EntityApiService>;

  beforeEach(() => {
    apiMock = jasmine.createSpyObj('EntityApiService', ['getAll', 'save', 'delete']);

    TestBed.configureTestingModule({
      providers: [
        EntityListService,
        { provide: EntityApiService, use: apiMock },
      ],
    });

    service = TestBed.inject(EntityListService);
  });

  it('should load items', (done) => {
    const mockData = [{ id: '1', name: 'Test' }];
    apiMock.getAll.and.returnValue(of(mockData));

    service.loadAllItems().subscribe(() => {
      expect(service.items().length).toBe(1);
      done();
    });
  });
});
```

### E2E Test (Playwright)

```typescript
// entity.spec.ts
import { test, expect } from '@playwright/test';

test('should create entity', async ({ page }) => {
  await page.goto('/entities');

  // Click "New Entity"
  await page.click('[data-testid="btn-new"]');

  // Fill form
  await page.fill('[data-testid="input-name"]', 'Test Entity');
  await page.fill('[data-testid="input-email"]', 'test@example.com');

  // Submit
  await page.click('[data-testid="btn-submit"]');

  // Verify
  await expect(page.locator('text=Test Entity')).toBeVisible();
});

test('should edit entity', async ({ page }) => {
  await page.goto('/entities');

  // Click edit on first row
  await page.click('button:has-text("Edit")');

  // Modify name
  await page.fill('[data-testid="input-name"]', 'Updated Name');
  await page.click('[data-testid="btn-submit"]');

  // Verify
  await expect(page.locator('text=Updated Name')).toBeVisible();
});
```

Ver [PLAYWRIGHT-GUIDE.md](./testing/PLAYWRIGHT-GUIDE.md) para más detalles.

---

## Troubleshooting

### Error: "effect() can only be used within an injection context"

**Problema**: Estás usando `effect()` en `ngOnInit()`.

**Solución**: Mueve `effect()` al constructor:

```typescript
// ❌ Incorrecto
ngOnInit() {
  effect(() => { ... });
}

// ✅ Correcto
constructor() {
  effect(() => { ... });
}
```

### Modal no se abre al editar

**Problema**: La navegación por router no abre el modal.

**Causa**: El efecto que escucha cambios de ruta no está funcionando.

**Solución**: Verifica que:
1. La ruta incluye `:id` parameter
2. `enableRouterNavigation = true` en el servicio
3. Items están cargados antes de navegar

### Validación async no funciona

**Problema**: Async validator no se ejecuta.

**Solución**: Verifica que:
1. Agregaste `asyncValidators` en metadata
2. El form control tiene el validator aplicado
3. El método retorna `Observable<boolean>`

```typescript
// Verificar que retorna Observable
isNameAvailable(name: string): Observable<boolean> {
  return of(true); // No solo: return true;
}
```

---

## Checklist de Implementación

Antes de considerar el CRUD completo:

**Servicio**:
- [ ] Extiende `BaseCrudService<TDto, TSaveDto>`
- [ ] Implementa `fetchAllItems()`
- [ ] Implementa `performSave()`
- [ ] Implementa `performDelete()`
- [ ] Define `getTableColumns()`
- [ ] Define `getFormFields()`
- [ ] Define `getRouteBasePath()`
- [ ] Hooks `onAfterFormSave()` y `onAfterFormCancel()` si necesario

**Componente**:
- [ ] Importa `GenericCrudListComponent`
- [ ] Provee el servicio
- [ ] Template: `<app-generic-crud-list [service]="service" />`

**Rutas**:
- [ ] Ruta base: `{ path: 'entities', component: ... }`
- [ ] Ruta edit: `{ path: ':id', component: ... }`

**Testing** (opcional pero recomendado):
- [ ] Unit tests del servicio
- [ ] E2E test de crear/editar/eliminar

**Validación**:
- [ ] Validaciones client-side en metadata
- [ ] **CRÍTICO**: Validaciones server-side en API

---

## Próximos Pasos

1. **Crear tu primer CRUD**: Sigue esta guía paso a paso
2. **Leer arquitectura**: Ver [CRUD-ARCHITECTURE.md](./CRUD-ARCHITECTURE.md) para entender cómo funciona
3. **Ver ejemplos**: Estudiar `features/companies/` y `features/roles/`
4. **Agregar tests**: Ver [PLAYWRIGHT-GUIDE.md](./testing/PLAYWRIGHT-GUIDE.md)

---

## Recursos

- **Arquitectura técnica**: [CRUD-ARCHITECTURE.md](./CRUD-ARCHITECTURE.md)
- **POC completo**: [GENERIC-CRUD-POC.md](./GENERIC-CRUD-POC.md)
- **Testing E2E**: [testing/PLAYWRIGHT-GUIDE.md](./testing/PLAYWRIGHT-GUIDE.md)
- **Ejemplo simple**: `src/app/features/companies/`
- **Ejemplo complejo**: `src/app/features/roles/`

---

**¿Dudas?** Consulta [CRUD-ARCHITECTURE.md](./CRUD-ARCHITECTURE.md) o pregunta al equipo.
