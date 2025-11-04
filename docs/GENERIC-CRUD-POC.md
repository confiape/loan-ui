# Generic CRUD - Proof of Concept (POC)

## Overview

This document describes the implementation of a generic CRUD system for Angular 20 that allows creating new CRUD features by simply implementing a service interface and providing metadata, without needing to manually create list and form components.

## Architecture

### Core Components

#### 1. **ICrudService Interface** (`src/app/core/services/crud.interface.ts`)

The main contract that all CRUD services must implement. It defines:

- **State Signals**: For managing CRUD state (items, loading, modal visibility, etc.)
- **Data Operations**: Methods to load, save, and delete items
- **Metadata Methods**: Methods to provide table columns and form fields configuration
- **Public Methods**: For handling user interactions (search, edit, delete, etc.)

```typescript
interface ICrudService<TDto, TSaveDto> {
  // State
  items: Signal<TDto[]>;
  loading: Signal<boolean>;
  showModal: Signal<boolean>;
  // ...

  // Data operations (implement these)
  loadAllItems(): Observable<TDto[]>;
  saveItem(dto: TSaveDto): Observable<TDto>;
  deleteItem(id: string): Observable<unknown>;

  // Metadata (implement these)
  getTableColumns(): TableColumnMetadata<TDto>[];
  getFormFields(): FormFieldMetadata[];
  getRouteBasePath(): string;

  // Public methods (already implemented in BaseCrudService)
  loadItems(): void;
  onEditItem(item: TDto): void;
  onDeleteItem(item: TDto): void;
  // ...
}
```

#### 2. **BaseCrudService** (`src/app/core/services/base-crud.service.ts`)

Abstract class that implements `ICrudService` and provides:

- Complete state management with signals
- Pagination support
- Search/filter functionality
- Selection management (bulk operations)
- Router navigation support
- Confirmation dialogs

Services extend this class and only need to implement the abstract methods for data operations and metadata.

#### 3. **GenericCrudListComponent** (`src/app/components/generic-crud/generic-crud-list`)

Reusable list component that:

- Receives an `ICrudService` implementation as input
- Generates table columns from metadata
- Handles toolbar, search, pagination
- Manages modals for create/edit and delete confirmation
- Integrates with router for URL-based navigation

#### 4. **GenericCrudFormComponent** (`src/app/components/generic-crud/generic-crud-form`)

Reusable form component that:

- Generates form fields dynamically from metadata
- Supports multiple field types: text, number, email, password, textarea, select, multiselect, date, checkbox, radio
- Handles validation with Angular validators
- Loads options dynamically for select/multiselect fields
- Displays error messages and help text

### Metadata Types

#### TableColumnMetadata

```typescript
interface TableColumnMetadata<T> {
  key: string; // Property name
  label: string; // Column header
  sortable?: boolean; // Enable sorting
  valueGetter?: (item: T) => any; // Custom value extraction
  formatter?: (value: any) => string; // Custom formatting
}
```

#### FormFieldMetadata

```typescript
interface FormFieldMetadata {
  key: string; // Field name
  label: string; // Field label
  type: FormFieldType; // Field type (text, select, etc.)
  validators?: ValidatorFn[]; // Angular sync validators
  asyncValidators?: AsyncValidatorFn[]; // Angular async validators (e.g., uniqueness)
  options?: SelectOption[]; // Static options
  loadOptions?: () => Observable<SelectOption[]>; // Dynamic options
  valueTransformer?: (item: any) => any; // Transform DTO to form value
  helpText?: string; // Help text
  placeholder?: string; // Placeholder
}
```

## Implementation Example: Companies CRUD

### Step 1: Create the Service

```typescript
// companies-list.service.ts
@Injectable()
export class CompaniesListService extends BaseCrudService<CompanyDto, SaveCompanyDto> {
  private companyApi = inject(CompanyApiService);
  private router = inject(Router);

  constructor() {
    super({
      enablePagination: true,
      defaultPageSize: 10,
      enableRouterNavigation: true,
    });
  }

  // Implement data operations
  loadAllItems(): Observable<CompanyDto[]> {
    return this.companyApi.getAllCompanies();
  }

  saveItem(dto: SaveCompanyDto): Observable<CompanyDto> {
    if ((dto as any).id) {
      return this.companyApi.updateCompany(dto as CompanyDto);
    } else {
      return this.companyApi.createCompany(dto);
    }
  }

  deleteItem(id: string): Observable<unknown> {
    return this.companyApi.deleteCompany(id);
  }

  matchesSearch(item: CompanyDto, term: string): boolean {
    return item.name.toLowerCase().includes(term) || item.id.toLowerCase().includes(term);
  }

  // Provide table metadata
  getTableColumns(): TableColumnMetadata<CompanyDto>[] {
    return [
      { key: 'name', label: 'Name', sortable: true },
      { key: 'id', label: 'ID', sortable: true },
    ];
  }

  // Provide form metadata
  getFormFields(): FormFieldMetadata[] {
    return [
      {
        key: 'name',
        label: 'Company Name',
        type: 'text',
        placeholder: 'Enter company name',
        validators: [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(15),
          Validators.pattern(/^[a-zA-Z0-9\s-]+$/),
        ],
        helpText: 'Company name must be 2-15 characters, alphanumeric only',
      },
    ];
  }

  getItemTypeName(): string {
    return 'company';
  }
  getItemTypePluralName(): string {
    return 'companies';
  }
  getItemDisplayName(item: CompanyDto): string {
    return item.name;
  }
  getRouteBasePath(): string {
    return '/companies';
  }

  // Router navigation hooks
  protected override onEditWithRouter(item: CompanyDto): void {
    this.router.navigate(['/companies', item.id]);
  }

  protected override onAfterFormSave(): void {
    this.router.navigate(['/companies']);
  }

  protected override onAfterFormCancel(): void {
    this.router.navigate(['/companies']);
  }
}
```

### Step 2: Create the Component (Simple!)

```typescript
// companies-list-v2.ts
@Component({
  selector: 'app-companies-list-v2',
  standalone: true,
  imports: [GenericCrudListComponent],
  providers: [CompaniesListService],
  template: `<app-generic-crud-list [service]="service" />`,
})
export class CompaniesListV2Component {
  service = inject(CompaniesListService);
}
```

That's it! The component is just 10 lines of code. All functionality (table, toolbar, modals, forms, pagination, search, etc.) is handled automatically by the generic components.

## Features

### ✅ Implemented

- [x] Generic list component with table, toolbar, and pagination
- [x] Generic form component with dynamic field generation
- [x] Support for multiple field types (text, number, email, password, textarea, select, multiselect, date, checkbox, radio)
- [x] Dynamic options loading for select/multiselect fields
- [x] Validation with error messages
- [x] Router navigation support (e.g., `/companies/:id`)
- [x] Search/filter functionality
- [x] Bulk selection and operations
- [x] Delete confirmation
- [x] Full TypeScript type safety
- [x] Signal-based reactive state management
- [x] Working example with Companies CRUD

### ✅ Advanced Features (Added for Roles)

1. **Value Transformers**:
   - ✅ `valueTransformer` function in FormFieldMetadata
   - ✅ Automatically transforms complex objects to form values
   - ✅ Example: Transform `permissions: PermissionDto[]` to `permissionsId: string[]`

2. **Dynamic Options Loading**:
   - ✅ `loadOptions()` function loads select/multiselect options from API
   - ✅ Works with complex entities (Roles with permissions and parent roles)
   - ✅ Options are loaded once when form opens
   - ✅ Loading indicators displayed while options are being fetched

3. **Async Validation**:
   - ✅ `asyncValidators` support in FormFieldMetadata
   - ✅ `uniqueValueValidator()` helper for checking unique values
   - ✅ Debounced validation to avoid excessive API calls
   - ✅ Example: Validate role name uniqueness in real-time

4. **Circular Reference Prevention**:
   - ✅ Parent roles multiselect automatically filters out current role being edited
   - ✅ Prevents self-referential relationships in hierarchical data

### 🚧 Remaining Limitations & TODOs

1. **Complex Forms**:
   - Field dependencies not yet supported (e.g., enable field B only if field A has value)
   - Conditional field visibility not implemented
   - Nested forms not supported

2. **Advanced Features**:
   - Custom field components not supported
   - File upload fields need implementation
   - Rich text editor fields need implementation

3. **TableColumn Type Safety**:
   - `TableColumn.key` is `string` but should be `keyof TDto`
   - `customTemplate` could be better typed
   - This is a limitation of the existing table component

4. **Provider Injection**:
   - ✅ **Works**: Providing service in component and passing to generic list
   - ✅ **Type Safe**: Full TypeScript support with generics
   - ❌ **Cannot**: Change provider dynamically at runtime (Angular limitation)
   - ✅ **Can**: Create multiple components with different services

## Benefits

### Before (Manual Implementation)

**CompaniesListComponent** (100+ lines):

- Manual table definition
- Manual toolbar configuration
- Manual modal management
- Manual form integration
- Manual route handling
- Repetitive code for every CRUD

### After (Generic Implementation)

**CompaniesListV2Component** (10 lines):

```typescript
@Component({
  selector: 'app-companies-list-v2',
  standalone: true,
  imports: [GenericCrudListComponent],
  providers: [CompaniesListService],
  template: `<app-generic-crud-list [service]="service" />`,
})
export class CompaniesListV2Component {
  service = inject(CompaniesListService);
}
```

All functionality is provided by metadata in the service!

### Advantages

1. **DRY (Don't Repeat Yourself)**: No repetitive list/form components
2. **Type Safety**: Full TypeScript support with generics
3. **Consistency**: All CRUDs look and behave the same way
4. **Maintainability**: Changes to UI propagate to all CRUDs
5. **Testability**: Test generic components once, all CRUDs benefit
6. **Rapid Development**: New CRUDs in minutes instead of hours

## Async Validators

The system includes a helper function for creating async validators for uniqueness checks:

```typescript
import { uniqueValueValidator } from '../../../core/validators/async-validators';

// In your service's getFormFields():
{
  key: 'name',
  label: 'Name',
  type: 'text',
  asyncValidators: [
    uniqueValueValidator(
      (value) => this.isNameAvailable(value),
      this.editingItem()?.name, // Exclude current value when editing
      500 // Optional debounce time in ms (default: 500)
    )
  ]
}

// Helper method in your service:
isNameAvailable(name: string): Observable<boolean> {
  // Check if name is unique
  const exists = this.items().some(
    (item) => item.name.toLowerCase() === name.toLowerCase() &&
              item.id !== this.editingItem()?.id
  );
  return of(!exists);
}
```

The validator:

- Debounces input to avoid excessive checks
- Skips validation for empty values (let `required` validator handle that)
- Excludes current value when editing
- Returns `{ notUnique: true }` error if value is taken
- Gracefully handles errors (doesn't block form on API failure)

## File Structure

```
src/app/
├── core/
│   ├── models/
│   │   └── form-metadata.ts           # TableColumnMetadata, FormFieldMetadata
│   ├── validators/
│   │   └── async-validators.ts        # Async validator helpers
│   └── services/
│       ├── crud.interface.ts          # ICrudService interface
│       └── base-crud.service.ts       # BaseCrudService implementation
└── components/
    └── generic-crud/
        ├── index.ts
        ├── generic-crud-list/
        │   ├── generic-crud-list.ts
        │   └── generic-crud-list.html
        └── generic-crud-form/
            ├── generic-crud-form.ts
            └── generic-crud-form.html
```

## Next Steps

To continue developing this POC:

1. **Enhance FormFieldMetadata**:
   - Add support for field dependencies
   - Add conditional visibility
   - Add custom validation messages

2. **Improve Options Loading**:
   - Support for related data providers
   - Better integration with services that need to load additional data

3. **Complete Roles Example**:
   - Implement multiselect for permissions
   - Implement multiselect for parent roles
   - Show how to load related data

4. **Add Storybook Stories**:
   - Document generic components usage
   - Show all field types
   - Provide interactive examples

5. **Add Unit Tests**:
   - Test generic components
   - Test form generation
   - Test table rendering

## Conclusion

This POC successfully demonstrates a generic CRUD system that:

- ✅ Reduces boilerplate code by 90%
- ✅ Maintains full type safety
- ✅ Provides consistent UX across all CRUDs
- ✅ Allows easy customization through metadata
- ✅ Integrates seamlessly with existing Angular patterns

The system is production-ready for simple CRUDs and can be enhanced to support more complex use cases as needed.

## Example Usage

### Simple CRUD: Companies

See `src/app/features/companies/companies-list-v2/` for a working example with a simple entity.

**Features demonstrated:**

- Single text field
- Basic validation
- Router navigation
- Pagination

### Complex CRUD: Roles

See `src/app/features/roles/roles-list-v2/` for a working example with a complex entity.

**Features demonstrated:**

- Text field with validation
- MultiSelect with dynamic options (permissions)
- MultiSelect with dynamic options (parent roles)
- Value transformers (transform `PermissionDto[]` to `string[]`)
- Custom table column with computed value (`permissionsCount`)
- Async validation for unique role names
- Circular reference prevention in parent roles
- Loading indicators while fetching options

**Key Code Snippet from RolesListService:**

```typescript
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
          this.editingItem()?.name, // Exclude current name when editing
        ),
      ],
    },
    {
      key: 'permissionsId',
      label: 'Permissions',
      type: 'multiselect',
      loadOptions: () => {
        return this.userApi.getAllPermissions().pipe(
          map((permissions) =>
            permissions.map((p) => ({
              label: p.name,
              value: p.name,
            })),
          ),
        );
      },
      valueTransformer: (item: RoleDto) => {
        // Transform permissions array to array of permission names
        return item.permissions?.map((p) => p.name) || [];
      },
    },
    {
      key: 'rolesId',
      label: 'Parent Roles',
      type: 'multiselect',
      loadOptions: () => {
        return this.userApi.getAllRoles().pipe(
          map((roles) => {
            const currentEditingId = this.editingItem()?.id;
            return roles
              .filter((r) => r.id !== currentEditingId) // Prevent circular reference
              .map((r) => ({ label: r.name, value: r.id }));
          }),
        );
      },
      valueTransformer: (item: RoleDto) => {
        return item.roles?.map((r) => r.id) || [];
      },
    },
  ];
}

// Helper method for async validation
isRoleNameAvailable(name: string): Observable<boolean> {
  const currentItems = this.items();
  const currentEditingId = this.editingItem()?.id;

  const nameExists = currentItems.some(
    (role) => role.name.toLowerCase() === name.toLowerCase() && role.id !== currentEditingId,
  );

  return of(!nameExists);
}
```

This demonstrates how the generic system handles complex scenarios with minimal code.
