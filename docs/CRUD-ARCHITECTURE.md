# CRUD Architecture - Generic CRUD System

## Overview

This document explains the **technical architecture** of the Generic CRUD system. It describes how the components work together, data flows, and design decisions.

For a **practical guide** on creating a CRUD, see [CRUD-GUIDE.md](./CRUD-GUIDE.md).

---

## Table of Contents

- [System Architecture](#system-architecture)
- [Core Components](#core-components)
- [Data Flow](#data-flow)
- [State Management](#state-management)
- [Metadata-Driven Forms](#metadata-driven-forms)
- [Router Integration](#router-integration)
- [Advanced Features](#advanced-features)
- [Design Decisions](#design-decisions)

---

## System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Feature Component                        │
│  (CompaniesListV2Component - 10 lines)                      │
│  - Provides service via DI                                   │
│  - Renders GenericCrudListComponent                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              GenericCrudListComponent                        │
│  - Displays table with data                                  │
│  - Toolbar with search, filters, actions                     │
│  - Opens modal for create/edit                               │
│  - Handles delete confirmation                               │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              GenericCrudFormComponent                        │
│  - Dynamically generates form fields                         │
│  - Handles validation (sync + async)                         │
│  - Loads dynamic options (select/multiselect)                │
│  - Transforms values (DTO ↔ Form)                           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              BaseCrudService<TDto, TSaveDto>                 │
│  - State management (signals)                                │
│  - CRUD operations (load, save, delete)                      │
│  - Router navigation                                         │
│  - Modal state control                                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   OpenAPI Service                            │
│  - HTTP calls to backend API                                 │
│  - Auto-generated from OpenAPI spec                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Core Components

### 1. ICrudService Interface

**Location**: `src/app/core/services/crud.interface.ts`

**Purpose**: Defines the contract that all CRUD services must implement.

```typescript
export interface ICrudService<TDto extends { id: string }, TSaveDto = TDto> {
  // STATE (signals)
  items: Signal<TDto[]>; // List of items
  loading: Signal<boolean>; // Loading state
  showModal: Signal<boolean>; // Modal visibility
  editingItem: Signal<TDto | null>; // Current item being edited

  // DATA OPERATIONS (observables)
  loadAllItems(): Observable<TDto[]>;
  saveItem(dto: TSaveDto): Observable<TDto>;
  deleteItem(id: string): Observable<unknown>;

  // METADATA (arrays)
  getTableColumns(): TableColumnMetadata<TDto>[];
  getFormFields(): FormFieldMetadata[];
  getRouteBasePath(): string;

  // UI ACTIONS
  onEditItem(item: TDto): void;
  openEditModal(item: TDto): void;
}
```

**Key Design**: Separation between:

- **State** (signals) - reactive, synchronous
- **Operations** (observables) - async, side effects
- **Metadata** (arrays) - configuration

---

### 2. BaseCrudService

**Location**: `src/app/core/services/base-crud.service.ts`

**Purpose**: Abstract base class that implements `ICrudService` with common functionality.

#### Responsibilities:

1. **State Management**:

```typescript
protected _items = signal<TDto[]>([]);
protected _loading = signal(false);
protected _showModal = signal(false);
protected _editingItem = signal<TDto | null>(null);

// Public read-only signals
public items = this._items.asReadonly();
public loading = this._loading.asReadonly();
```

2. **CRUD Lifecycle**:

```typescript
// Load all items
loadAllItems(): Observable<TDto[]> {
  this._loading.set(true);
  return this.fetchAllItems().pipe(
    tap((data) => {
      this._items.set(data);
      this._loading.set(false);
    })
  );
}

// Save item (create or update)
saveItem(dto: TSaveDto): Observable<TDto> {
  this._loading.set(true);
  return this.performSave(dto).pipe(
    tap((savedItem) => {
      this.updateItemsAfterSave(savedItem);
      this._loading.set(false);
      this.onAfterFormSave();
    })
  );
}
```

3. **Router Integration**:

```typescript
onEditItem(item: TDto): void {
  if (this.enableRouterNavigation) {
    this.router.navigate([this.getRouteBasePath(), item.id]);
  } else {
    this.openEditModal(item);
  }
}
```

#### Hooks (Lifecycle):

```typescript
protected onAfterFormSave(): void {}   // Override to navigate after save
protected onAfterFormCancel(): void {} // Override to navigate after cancel
```

---

### 3. GenericCrudListComponent

**Location**: `src/app/components/generic-crud/generic-crud-list/`

**Purpose**: Reusable list view with table, toolbar, and modals.

#### Key Features:

1. **Table Rendering**:

```typescript
<app-table
  [columns]="tableColumns()"
  [data]="service().items()"
  [loading]="service().loading()"
  (rowAction)="onRowAction($event)"
/>
```

2. **Toolbar Integration**:

```typescript
<app-table-toolbar
  [totalItems]="service().items().length"
  [primaryAction]="primaryAction"
  [bulkActions]="bulkActions"
  [selectedCount]="selectedItems().length"
/>
```

3. **Modal Management**:

```typescript
@if (service().showModal()) {
  <app-modal [title]="modalTitle()" (close)="onCloseModal()">
    <app-generic-crud-form
      [service]="service()"
      [fields]="formFields()"
      [item]="service().editingItem()"
    />
  </app-modal>
}
```

4. **Route-based Modal Opening**:

```typescript
constructor() {
  effect(() => {
    const items = this.service().items();
    const routeId = this.currentRouteId();

    if (routeId && items.length > 0) {
      const item = items.find((i) => i.id === routeId);
      if (item && !this.service().showModal()) {
        this.service().openEditModal(item);
      }
    }
  });
}
```

---

### 4. GenericCrudFormComponent

**Location**: `src/app/components/generic-crud/generic-crud-form/`

**Purpose**: Dynamic form generator based on metadata.

#### Key Features:

1. **Dynamic Form Building**:

```typescript
private buildForm(): void {
  const group: Record<string, any> = {};

  this.fields().forEach((field) => {
    const validators = field.validators || [];
    const asyncValidators = field.asyncValidators || [];

    group[field.key] = [
      { value: defaultValue, disabled: field.disabled },
      validators,
      asyncValidators.length > 0 ? asyncValidators : null,
    ];
  });

  this.form = this.fb.group(group);
}
```

2. **Value Transformers**:

```typescript
constructor() {
  effect(() => {
    const currentItem = this.item();
    if (currentItem) {
      const transformedValues: any = {};

      this.fields().forEach((field) => {
        if (field.valueTransformer) {
          transformedValues[field.key] = field.valueTransformer(currentItem);
        } else {
          transformedValues[field.key] = currentItem[field.key];
        }
      });

      this.form.patchValue(transformedValues);
    }
  });
}
```

3. **Dynamic Options Loading**:

```typescript
private loadAllOptions(): void {
  const fieldsWithOptions = this.fields().filter(
    (f) => (f.type === 'select' || f.type === 'multiselect') && f.loadOptions
  );

  this._loadingOptions.set(true);

  forkJoin(
    fieldsWithOptions.map((field) => field.loadOptions!())
  ).subscribe((results) => {
    results.forEach((options, index) => {
      this._optionsMap.set(fieldsWithOptions[index].key, options);
    });
    this._loadingOptions.set(false);
  });
}
```

4. **Field Type Rendering**:

The component supports 8+ field types:

- `text`, `email`, `password`, `number` → `<input>`
- `textarea` → `<textarea>`
- `date` → `<input type="date">`
- `checkbox` → `<input type="checkbox">`
- `radio` → Multiple `<input type="radio">`
- `select` → `<select>`
- `multiselect` → `<app-multiselect>`

---

## Data Flow

### 1. Loading Items

```
User navigates to /companies
         ↓
CompaniesListV2Component renders
         ↓
GenericCrudListComponent initializes
         ↓
Calls service().loadAllItems()
         ↓
BaseCrudService.loadAllItems()
  → _loading.set(true)
  → fetchAllItems() [abstract, implemented by CompaniesListService]
         ↓
CompaniesApiService.getAll() HTTP call
         ↓
Response arrives
         ↓
BaseCrudService updates:
  → _items.set(data)
  → _loading.set(false)
         ↓
Signals trigger re-render
         ↓
Table displays data
```

### 2. Editing Item

```
User clicks "Edit" button
         ↓
GenericCrudListComponent.onRowAction()
         ↓
Calls service().onEditItem(item)
         ↓
BaseCrudService.onEditItem()
  → router.navigate(['/companies', item.id])
         ↓
Route changes to /companies/:id
         ↓
Effect in GenericCrudListComponent detects route change
         ↓
Calls service().openEditModal(item)
  → _editingItem.set(item)
  → _showModal.set(true)
         ↓
Modal with GenericCrudFormComponent renders
         ↓
Form fields load via getFormFields()
         ↓
If fields have loadOptions(), fetch dynamic options
         ↓
Value transformers apply to populate form
         ↓
User edits and submits
         ↓
GenericCrudFormComponent.onSubmit()
         ↓
Calls service().saveItem(dto)
         ↓
BaseCrudService.saveItem()
  → performSave() [abstract, implemented by CompaniesListService]
         ↓
CompaniesApiService.save() HTTP call
         ↓
Response arrives
         ↓
BaseCrudService updates:
  → Updates/adds item in _items array
  → _showModal.set(false)
  → _editingItem.set(null)
  → onAfterFormSave() → navigates to /companies
         ↓
Table shows updated data
```

### 3. Creating Item

```
User clicks "New Company" button
         ↓
GenericCrudListComponent calls service().onNewItem()
         ↓
BaseCrudService.onNewItem()
  → _editingItem.set(null)
  → _showModal.set(true)
         ↓
Modal with empty form renders
         ↓
User fills form and submits
         ↓
(Same flow as editing, but creates new item)
```

---

## State Management

### Signal-Based Architecture

All state is managed with Angular signals for fine-grained reactivity:

```typescript
// Private writable signals
private _items = signal<TDto[]>([]);
private _loading = signal(false);
private _showModal = signal(false);
private _editingItem = signal<TDto | null>(null);

// Public read-only signals
public items = this._items.asReadonly();
public loading = this._loading.asReadonly();
public showModal = this._showModal.asReadonly();
public editingItem = this._editingItem.asReadonly();
```

**Benefits**:

- ✅ No need for manual change detection
- ✅ Fine-grained updates (only affected components re-render)
- ✅ Predictable state changes
- ✅ Easy debugging (clear signal updates)

### No NgRx/Redux Needed

This system deliberately avoids state management libraries because:

1. State is **local to the feature** (not global)
2. State is **simple** (list + modal state)
3. Signals provide **sufficient reactivity**
4. Less boilerplate = faster development

---

## Metadata-Driven Forms

### TableColumnMetadata

```typescript
interface TableColumnMetadata<T> {
  key: keyof T | string; // Property key or custom identifier
  label: string; // Column header
  sortable?: boolean; // Enable sorting
  customTemplate?: TemplateRef<any>; // Custom cell rendering
  formatter?: (value: any) => string; // Value formatting
  width?: string; // Column width (CSS)
}
```

**Example**:

```typescript
getTableColumns(): TableColumnMetadata<RoleDto>[] {
  return [
    { key: 'name', label: 'Role Name', sortable: true },
    {
      key: 'permissionsCount',
      label: 'Permissions',
      formatter: (role: RoleDto) => role.permissions?.length.toString() || '0'
    },
    { key: 'id', label: 'ID', sortable: true },
  ];
}
```

### FormFieldMetadata

```typescript
interface FormFieldMetadata {
  key: string; // Form control name
  label: string; // Field label
  type: FormFieldType; // Field type
  validators?: ValidatorFn[]; // Sync validators
  asyncValidators?: AsyncValidatorFn[]; // Async validators
  options?: SelectOption[]; // Static options
  loadOptions?: () => Observable<SelectOption[]>; // Dynamic options
  valueTransformer?: (item: any) => any; // DTO → Form value
  placeholder?: string;
  helpText?: string;
  readonly?: boolean;
  disabled?: boolean;
}
```

**Example**:

```typescript
getFormFields(): FormFieldMetadata[] {
  return [
    {
      key: 'name',
      label: 'Company Name',
      type: 'text',
      validators: [Validators.required, Validators.minLength(2)],
      asyncValidators: [
        uniqueValueValidator(
          (name) => this.isNameAvailable(name),
          this.editingItem()?.name
        )
      ],
      placeholder: 'Enter company name',
      helpText: 'Must be unique'
    },
    {
      key: 'industryId',
      label: 'Industry',
      type: 'select',
      loadOptions: () => this.api.getIndustries().pipe(
        map(industries => industries.map(i => ({
          label: i.name,
          value: i.id
        })))
      )
    }
  ];
}
```

---

## Router Integration

### URL-Based Modal State

The system uses router navigation to control modals:

**URLs**:

- `/companies` → List view, modal closed
- `/companies/new` → List view, modal open (new item)
- `/companies/123` → List view, modal open (edit item 123)

**Benefits**:

1. ✅ **Shareable URLs**: Users can share direct links to edit forms
2. ✅ **Browser navigation**: Back/forward buttons work
3. ✅ **Bookmarkable**: Can bookmark edit pages
4. ✅ **State persistence**: Refresh keeps modal state

### How It Works

1. **Opening Modal via Router**:

```typescript
onEditItem(item: TDto): void {
  if (this.enableRouterNavigation) {
    this.router.navigate([this.getRouteBasePath(), item.id]);
  }
}
```

2. **Effect Watches Route Params**:

```typescript
private currentRouteId = signal<string | null>(null);

constructor() {
  this.route.paramMap.subscribe((params) => {
    this.currentRouteId.set(params.get('id'));
  });

  effect(() => {
    const routeId = this.currentRouteId();
    const items = this.service().items();

    if (routeId && items.length > 0) {
      const item = items.find(i => i.id === routeId);
      if (item) {
        this.service().openEditModal(item);
      }
    }
  });
}
```

3. **Closing Modal Navigates Back**:

```typescript
onCloseModal(): void {
  this.service().closeModal();
  this.router.navigate([this.service().getRouteBasePath()]);
}
```

---

## Advanced Features

### 1. Async Validators

**File**: `src/app/core/validators/async-validators.ts`

```typescript
export function uniqueValueValidator(
  checkFn: (value: string) => Observable<boolean>,
  currentValue?: string | null,
  debounceMs = 500,
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value || control.value === currentValue) {
      return of(null);
    }

    return of(control.value).pipe(
      debounceTime(debounceMs), // Wait 500ms after typing stops
      switchMap((value) => checkFn(value)), // Check if unique
      map((isUnique) => (isUnique ? null : { notUnique: true })),
      catchError(() => of(null)), // Don't block on error
      first(),
    );
  };
}
```

**Usage**:

```typescript
{
  key: 'name',
  asyncValidators: [
    uniqueValueValidator(
      (name) => this.isNameAvailable(name),
      this.editingItem()?.name
    )
  ]
}
```

### 2. Value Transformers

Transform complex DTO values to form-compatible values:

```typescript
{
  key: 'permissionsId',
  type: 'multiselect',
  valueTransformer: (role: RoleDto) => {
    // Transform PermissionDto[] to string[]
    return role.permissions?.map(p => p.name) || [];
  }
}
```

**Reverse transform on save**:

```typescript
saveItem(dto: SaveRoleDto): Observable<RoleDto> {
  // Form value: { permissionsId: ['READ', 'WRITE'] }
  // DTO needs: { permissions: ['READ', 'WRITE'] }
  return this.api.saveRole(dto);
}
```

### 3. Dynamic Options with Filtering

Load options and filter based on context:

```typescript
{
  key: 'parentRolesId',
  type: 'multiselect',
  loadOptions: () => {
    return this.api.getAllRoles().pipe(
      map(roles => {
        const currentEditingId = this.editingItem()?.id;
        return roles
          .filter(r => r.id !== currentEditingId) // Prevent circular reference
          .map(r => ({ label: r.name, value: r.id }));
      })
    );
  }
}
```

### 4. Loading Indicators

Automatic loading states for dynamic options:

```typescript
// In GenericCrudFormComponent
private _loadingOptions = signal(false);
public loadingOptions = this._loadingOptions.asReadonly();
```

```html
<!-- In template -->
<app-multiselect [items]="options" [disabled]="loadingOptions()" />
@if (loadingOptions()) {
<p class="text-blue-600">
  <svg class="animate-spin">...</svg>
  Loading options...
</p>
}
```

---

## Design Decisions

### Why Signals over RxJS Everywhere?

**Decision**: Use signals for state, observables for operations.

**Rationale**:

- Signals are **synchronous** and perfect for UI state
- Observables are **asynchronous** and perfect for HTTP calls
- Mixing both gives best of both worlds

```typescript
// STATE: Signals (synchronous, reactive)
items = signal<TDto[]>([]);

// OPERATIONS: Observables (asynchronous, cancellable)
loadAllItems(): Observable<TDto[]> {
  return this.api.getAll().pipe(
    tap(data => this.items.set(data)) // Update signal from observable
  );
}
```

### Why Metadata over Props?

**Decision**: Use `getFormFields()` and `getTableColumns()` instead of component inputs.

**Alternative (rejected)**:

```typescript
// ❌ Too verbose
<app-generic-crud-form
  [nameField]="{ label: 'Name', validators: [...] }"
  [emailField]="{ label: 'Email', validators: [...] }"
  [phoneField]="{ label: 'Phone', validators: [...] }"
/>
```

**Chosen approach**:

```typescript
// ✅ Clean and scalable
getFormFields(): FormFieldMetadata[] {
  return [
    { key: 'name', label: 'Name', validators: [...] },
    { key: 'email', label: 'Email', validators: [...] },
    { key: 'phone', label: 'Phone', validators: [...] },
  ];
}
```

### Why Abstract Class over Interface + Service?

**Decision**: Use `BaseCrudService` abstract class.

**Alternative (rejected)**:

```typescript
// ❌ Too much boilerplate per CRUD
class CompaniesListService implements ICrudService {
  items = signal<CompanyDto[]>([]);
  loading = signal(false);
  showModal = signal(false);
  // ... repeat 100+ lines of boilerplate
}
```

**Chosen approach**:

```typescript
// ✅ Only implement what's unique
class CompaniesListService extends BaseCrudService<CompanyDto, SaveCompanyDto> {
  protected fetchAllItems() { return this.api.getAll(); }
  protected performSave(dto) { return this.api.save(dto); }
  getFormFields() { return [...]; }
  getTableColumns() { return [...]; }
}
```

### Why Component Composition over Monolith?

**Decision**: Separate `GenericCrudListComponent` and `GenericCrudFormComponent`.

**Rationale**:

- Forms can be reused standalone (e.g., in wizards)
- Tables can be reused without forms
- Easier to test in isolation
- Clearer separation of concerns

### Why `any` Types in Metadata?

**Decision**: Use `any` for `valueTransformer` and some metadata properties.

**Alternative (rejected)**:

```typescript
// ❌ Too complex, doesn't add real value
interface FormFieldMetadata<TDto, TFormValue> {
  valueTransformer?: (item: TDto) => TFormValue;
}
```

**Rationale**:

- This is a **generic** system working with **any** DTO
- The `any` types are **encapsulated** in the generic layer
- Concrete services (Companies, Roles) are **type-safe**
- Runtime behavior is safe (Angular forms handle validation)

**Mitigation**:

```typescript
// Concrete service is type-safe
class CompaniesListService extends BaseCrudService<CompanyDto, SaveCompanyDto> {
  getFormFields(): FormFieldMetadata[] {
    return [
      {
        key: 'name',
        valueTransformer: (company: CompanyDto) => company.name, // Type-safe here
      },
    ];
  }
}
```

---

## Performance Considerations

### Current Performance Characteristics

| Aspect               | Performance | Notes                                                  |
| -------------------- | ----------- | ------------------------------------------------------ |
| **Initial Load**     | ✅ Good     | Single API call, signals update efficiently            |
| **Form Rendering**   | ✅ Good     | Built once, signals track changes                      |
| **Table Rendering**  | ⚠️ OK       | Fine for < 1000 rows, consider virtual scroll for more |
| **Options Loading**  | ✅ Good     | Loaded once per form open, cached in signal            |
| **Async Validation** | ✅ Good     | Debounced 500ms, prevents excessive calls              |

### Optimization Strategies (if needed)

1. **For Large Tables (> 1000 rows)**:

```typescript
// Add virtual scrolling
import { ScrollingModule } from '@angular/cdk/scrolling';

<cdk-virtual-scroll-viewport itemSize="50" class="h-[600px]">
  <div *cdkVirtualFor="let item of items()">
    <!-- row -->
  </div>
</cdk-virtual-scroll-viewport>
```

2. **For Expensive Validations**:

```typescript
// Cache validation results
private validationCache = new Map<string, boolean>();

isNameAvailable(name: string): Observable<boolean> {
  if (this.validationCache.has(name)) {
    return of(this.validationCache.get(name)!);
  }

  return this.api.checkAvailability(name).pipe(
    tap(result => this.validationCache.set(name, result))
  );
}
```

3. **For Frequently Accessed Options**:

```typescript
// Use shareReplay for options that don't change
private industries$ = this.api.getIndustries().pipe(
  shareReplay({ bufferSize: 1, refCount: true })
);

getFormFields(): FormFieldMetadata[] {
  return [{
    key: 'industryId',
    loadOptions: () => this.industries$.pipe(
      map(industries => industries.map(i => ({ label: i.name, value: i.id })))
    )
  }];
}
```

---

## Testing Strategy

### Unit Tests

**Test the generic components once**, all CRUDs benefit:

```typescript
describe('GenericCrudFormComponent', () => {
  it('should build form from metadata', () => {
    // Test form building logic
  });

  it('should apply value transformers', () => {
    // Test transformers
  });

  it('should load dynamic options', () => {
    // Test loadOptions
  });

  it('should validate async validators', () => {
    // Test async validation
  });
});
```

### Integration Tests

**Test concrete services**:

```typescript
describe('CompaniesListService', () => {
  it('should load companies', () => {
    service.loadAllItems().subscribe((items) => {
      expect(items.length).toBeGreaterThan(0);
    });
  });

  it('should save company', () => {
    const dto: SaveCompanyDto = { name: 'Test Corp' };
    service.saveItem(dto).subscribe((saved) => {
      expect(saved.name).toBe('Test Corp');
    });
  });
});
```

### E2E Tests

**Test user workflows** (see `docs/testing/PLAYWRIGHT.md`):

```typescript
test('should create new company', async ({ page }) => {
  await page.goto('/companies');
  await page.click('[data-testid="btn-new"]');
  await page.fill('[data-testid="input-name"]', 'Acme Corp');
  await page.click('[data-testid="btn-submit"]');
  await expect(page.locator('text=Acme Corp')).toBeVisible();
});
```

---

## Extending the System

### Adding New Field Types

1. Update `FormFieldType`:

```typescript
export type FormFieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'textarea'
  | 'date'
  | 'checkbox'
  | 'radio'
  | 'select'
  | 'multiselect'
  | 'file'
  | 'color'
  | 'range'; // New types
```

2. Add template in `generic-crud-form.html`:

```html
@if (field.type === 'file') {
<label class="form-label">{{ field.label }}</label>
<input type="file" [formControlName]="field.key" class="form-input" />
}
```

### Adding Custom Validators

Create reusable validators in `src/app/core/validators/`:

```typescript
// custom-validators.ts
export function phoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valid = /^\+?[\d\s-]+$/.test(control.value);
    return valid ? null : { invalidPhone: true };
  };
}
```

Use in metadata:

```typescript
{
  key: 'phone',
  validators: [phoneValidator()]
}
```

### Adding Global Error Handling

Create an HTTP interceptor:

```typescript
@Injectable()
export class CrudErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error) => {
        // Show toast notification
        this.toastService.error(error.message);
        return throwError(() => error);
      }),
    );
  }
}
```

---

## Security Considerations

### Client-Side Validation is NOT Security

**Important**: All validations (sync and async) are **user experience** features, not security.

**Always validate on the server**:

```csharp
// Backend (C#)
public async Task<RoleDto> SaveRole(SaveRoleDto dto) {
    // ✅ Server-side validation
    if (await _db.Roles.AnyAsync(r => r.Name == dto.Name && r.Id != dto.Id)) {
        throw new ValidationException("Role name already exists");
    }

    // ... save
}
```

### CSRF Protection

Ensure your API uses CSRF tokens or same-site cookies:

```typescript
// OpenAPI service includes Authorization header
headers: localVarHeaders.set('Authorization', 'Bearer ' + token);
```

### Input Sanitization

Angular automatically sanitizes HTML, but be careful with:

- Dynamic templates
- `innerHTML` bindings
- File uploads

---

## Conclusion

This architecture provides:

- ✅ **Minimal boilerplate**: 10 lines per CRUD
- ✅ **Type safety**: Generics ensure correctness
- ✅ **Flexibility**: Metadata-driven forms adapt to any entity
- ✅ **Maintainability**: Changes propagate to all CRUDs
- ✅ **Performance**: Signals provide efficient reactivity
- ✅ **Testability**: Test generic components once

The system is **production-ready** for most use cases and scales well up to ~20-30 CRUDs with datasets of ~1000 items each.

For questions or improvements, see [CRUD-GUIDE.md](./CRUD-GUIDE.md) or contact the team.
