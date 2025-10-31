# CRUD Pattern Guide

Basado en `features/companies/`. Copiar y reemplazar `Entity` por tu entidad.

## Estructura

```
features/{entity}/
├── {entity}-list/
│   ├── {entity}-list.ts
│   └── {entity}-list.html
└── {entity}-form/
    ├── {entity}-form.ts
    └── {entity}-form.html
```

## Routing

```typescript
// app.routes.ts
{
  path: '{entity}',
  children: [
    { path: '', component: EntityListComponent },
    { path: ':id', component: EntityListComponent }, // Modal edit
  ],
}
```

## List Component

```typescript
// {entity}-list.ts
import { Component, signal, computed } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TableToolbarComponent, TableComponent, ModalComponent } from '@ui';
import { EntityApiService } from '@core/openapi';
import { forkJoin } from 'rxjs';

export class EntityListComponent {
  // State
  allEntities = signal<EntityDto[]>([]);
  loading = signal(false);
  showModal = signal(false);
  editingEntity = signal<EntityDto | null>(null);
  showDeleteConfirm = signal(false);
  deletingEntity = signal<EntityDto | null>(null);
  searchTerm = signal('');
  selectedEntities = signal<Set<string>>(new Set());

  // Computed
  filteredEntities = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.allEntities().filter(e =>
      e.name.toLowerCase().includes(term) || e.id.includes(term)
    );
  });
  hasSelection = computed(() => this.selectedEntities().size > 0);

  // Table config
  columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'id', label: 'ID', sortable: true },
  ];

  rowActions = [
    { label: 'Edit', variant: 'secondary', inline: true,
      onClick: (row) => this.router.navigate(['/entities', row.id]) },
    { label: 'Delete', variant: 'danger', inline: true,
      onClick: (row) => { this.deletingEntity.set(row); this.showDeleteConfirm.set(true); } },
  ];

  primaryAction = {
    label: 'New Entity',
    onClick: () => { this.editingEntity.set(null); this.showModal.set(true); }
  };

  bulkActions = [{ label: 'Delete Selected', variant: 'outline' }];

  constructor(
    private entityService: EntityApiService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.loadEntities();
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id && this.allEntities().length) {
        const entity = this.allEntities().find(e => e.id === id);
        entity ? (this.editingEntity.set(entity), this.showModal.set(true))
               : this.router.navigate(['/entities']);
      }
    });
  }

  loadEntities() {
    this.loading.set(true);
    this.entityService.getAll().subscribe({
      next: (data) => {
        this.allEntities.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onFormSave() {
    this.showModal.set(false);
    this.editingEntity.set(null);
    this.loadEntities();
    this.router.navigate(['/entities']);
  }

  onFormCancel() {
    this.showModal.set(false);
    this.editingEntity.set(null);
    this.router.navigate(['/entities']);
  }

  confirmDelete() {
    const selected = this.selectedEntities();
    const single = this.deletingEntity();

    const requests = selected.size > 0
      ? Array.from(selected).map(id => this.entityService.delete(id))
      : [this.entityService.delete(single!.id)];

    forkJoin(requests).subscribe(() => {
      this.showDeleteConfirm.set(false);
      this.deletingEntity.set(null);
      this.selectedEntities.set(new Set());
      this.loadEntities();
    });
  }

  get deleteMessage() {
    const count = this.selectedEntities().size;
    return count > 0
      ? `Delete ${count} entities?`
      : `Delete <strong>${this.deletingEntity()?.name}</strong>?`;
  }
}
```

## List Template

```html
<!-- {entity}-list.html -->
<div class="p-6">
  <div class="mb-6">
    <h1 class="text-2xl font-bold text-[var(--color-text-primary)]">Entities</h1>
  </div>

  <div class="mb-4">
    <app-table-toolbar
      searchPlaceholder="Search..."
      [primaryAction]="primaryAction"
      [bulkActions]="hasSelection() ? bulkActions : []"
      (searchChange)="searchTerm.set($event)"
      (bulkActionClick)="showDeleteConfirm.set(true)"
    />
  </div>

  <app-table
    [columns]="columns"
    [data]="filteredEntities()"
    [rowActions]="rowActions"
    [selectable]="true"
    [selectedItems]="selectedEntities()"
    [loading]="loading()"
    (selectionChange)="selectedEntities.set($event)"
  />

  <app-modal
    [isOpen]="showModal()"
    [title]="editingEntity() ? 'Edit' : 'New'"
    (closed)="onFormCancel()"
  >
    <app-entity-form
      [entity]="editingEntity()"
      (save)="onFormSave($event)"
      (cancel)="onFormCancel()"
    />
  </app-modal>

  <app-modal
    [isOpen]="showDeleteConfirm()"
    title="Delete"
    size="sm"
    (closed)="showDeleteConfirm.set(false)"
  >
    <div class="p-4">
      <p [innerHTML]="deleteMessage"></p>
      <div class="flex gap-3 justify-end mt-4">
        <button class="btn btn-secondary" (click)="showDeleteConfirm.set(false)">Cancel</button>
        <button class="btn btn-error" (click)="confirmDelete()">Delete</button>
      </div>
    </div>
  </app-modal>
</div>
```

## Form Component

```typescript
// {entity}-form.ts
import { Component, input, output, effect, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { EntityApiService } from '@core/openapi';

export class EntityFormComponent {
  entity = input<EntityDto | null>(null);
  save = output<EntityDto>();
  cancel = output<void>();

  loading = signal(false);
  error = signal<string | null>(null);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
  });

  constructor(private fb: FormBuilder, private service: EntityApiService) {
    effect(() => {
      const e = this.entity();
      e ? this.form.patchValue(e) : this.form.reset();
    });
  }

  onSubmit() {
    if (this.form.invalid) return this.form.markAllAsTouched();

    this.loading.set(true);
    const value = this.form.value;
    const current = this.entity();

    const request = current
      ? this.service.update({ id: current.id, ...value })
      : this.service.create(value);

    request.subscribe({
      next: (res) => {
        this.loading.set(false);
        this.save.emit(res);
      },
      error: () => {
        this.error.set('Operation failed');
        this.loading.set(false);
      },
    });
  }

  get nameControl() { return this.form.get('name'); }
  get isEditMode() { return this.entity() !== null; }
}
```

## Form Template

```html
<!-- {entity}-form.html -->
<form [formGroup]="form" (ngSubmit)="onSubmit()" class="p-6">
  @if (error()) {
    <div class="alert alert-error mb-4">{{ error() }}</div>
  }

  <div class="space-y-4">
    <div>
      <label class="form-label">Name <span class="text-[var(--color-error)]">*</span></label>
      <app-base-input
        formControlName="name"
        placeholder="Enter name"
        [class.form-input-error]="nameControl?.invalid && nameControl?.touched"
      />
      @if (nameControl?.invalid && nameControl?.touched) {
        <div class="text-sm text-[var(--color-error)] mt-1">
          @if (nameControl?.errors?.['required']) { <span>Required</span> }
          @if (nameControl?.errors?.['minlength']) { <span>Min 2 chars</span> }
        </div>
      }
    </div>
  </div>

  <div class="flex gap-3 justify-end mt-6 pt-4 border-t">
    <button type="button" class="btn btn-secondary" (click)="cancel.emit()" [disabled]="loading()">
      Cancel
    </button>
    <button type="submit" class="btn btn-primary" [disabled]="loading() || form.invalid">
      {{ loading() ? 'Saving...' : (isEditMode ? 'Update' : 'Create') }}
    </button>
  </div>
</form>
```

## Checklist

- [ ] Files: list.ts/html, form.ts/html, routes
- [ ] List: signals (all, loading, modals, selection), computed (filtered, hasSelection)
- [ ] Form: input/output, effect para sync, create/update logic
- [ ] Templates: toolbar + table + 2 modals (form, delete)
- [ ] CRUD: load, create, update, delete (single/bulk), search
