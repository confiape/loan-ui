import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Validators } from '@angular/forms';
import { BaseCrudService } from '../../../core/services/base-crud.service';
import { UserApiService } from '../../../core/openapi/api/user.service';
import { RoleDto, PermissionDto, SaveRoleDto } from '../../../core/openapi/model/models';
import { TableColumnMetadata, FormFieldMetadata } from '../../../core/models/form-metadata';
import { uniqueValueValidator } from '../../../core/validators/async-validators';

/**
 * Service for managing roles list with CRUD operations
 */
@Injectable()
export class RolesListService extends BaseCrudService<RoleDto, SaveRoleDto> {
  private userApi = inject(UserApiService);
  private router = inject(Router);

  /**
   * All available permissions (loaded separately)
   */
  allPermissions = signal<PermissionDto[]>([]);

  constructor() {
    super({
      enablePagination: true,
      defaultPageSize: 10,
      enableRouterNavigation: true,
    });
  }

  // ==================== DATA OPERATIONS ====================
  loadAllItems(): Observable<RoleDto[]> {
    return this.userApi.getAllRoles();
  }

  saveItem(dto: SaveRoleDto): Observable<RoleDto> {
    return this.userApi.saveRole(dto);
  }

  deleteItem(id: string): Observable<unknown> {
    return this.userApi.deleteRole(id);
  }

  matchesSearch(item: RoleDto, term: string): boolean {
    return item.name.toLowerCase().includes(term) || item.id.toLowerCase().includes(term);
  }

  // ==================== METADATA ====================
  getTableColumns(): TableColumnMetadata<RoleDto>[] {
    return [
      { key: 'name', label: 'Name', sortable: true },
      {
        key: 'permissionsCount',
        label: 'Permissions',
        sortable: false,
        valueGetter: (role) => role.permissions?.length || 0,
      },
      { key: 'id', label: 'ID', sortable: true },
    ];
  }

  getFormFields(): FormFieldMetadata[] {
    return [
      {
        key: 'name',
        label: 'Role Name',
        type: 'text',
        placeholder: 'Enter role name',
        validators: [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
          Validators.pattern(/^[a-zA-Z0-9\s\-_]+$/),
        ],
        asyncValidators: [
          uniqueValueValidator(
            (name) => this.isRoleNameAvailable(name),
            this.editingItem()?.name, // Exclude current name when editing
          ),
        ],
        helpText: 'Role name must be 2-100 characters, alphanumeric only',
      },
      {
        key: 'permissionsId',
        label: 'Permissions',
        type: 'multiselect',
        placeholder: 'Select permissions',
        loadOptions: () => {
          // Load permissions dynamically
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
        helpText: 'Select the permissions for this role',
      },
      {
        key: 'rolesId',
        label: 'Parent Roles',
        type: 'multiselect',
        placeholder: 'Select parent roles',
        loadOptions: () => {
          // Load all roles dynamically and filter out the current role being edited
          return this.userApi.getAllRoles().pipe(
            map((roles) => {
              const currentEditingId = this.editingItem()?.id;
              return roles
                .filter((r) => r.id !== currentEditingId) // Prevent circular reference
                .map((r) => ({
                  label: r.name,
                  value: r.id,
                }));
            }),
          );
        },
        valueTransformer: (item: RoleDto) => {
          // Transform roles array to array of role IDs
          return item.roles?.map((r) => r.id) || [];
        },
        helpText: 'Select parent roles to inherit permissions from (cannot select itself)',
      },
    ];
  }

  getItemTypeName(): string {
    return 'role';
  }

  getItemTypePluralName(): string {
    return 'roles';
  }

  getItemDisplayName(item: RoleDto): string {
    return item.name;
  }

  getRouteBasePath(): string {
    return '/roles';
  }

  /**
   * Load permissions (specific to roles CRUD)
   */
  loadPermissions(): void {
    this.userApi.getAllPermissions().subscribe({
      next: (data) => {
        this.allPermissions.set(data);
      },
      error: (err) => console.error('Error loading permissions:', err),
    });
  }

  // ==================== ROUTER NAVIGATION HOOKS ====================
  /**
   * Navigate to /roles/:id for editing
   */
  protected override onEditWithRouter(item: RoleDto): void {
    this.router.navigate(['/roles', item.id]);
  }

  /**
   * Navigate back to /roles after save
   */
  protected override onAfterFormSave(): void {
    this.router.navigate(['/roles']);
  }

  /**
   * Navigate back to /roles after cancel
   */
  protected override onAfterFormCancel(): void {
    this.router.navigate(['/roles']);
  }

  /**
   * Check if a role name is available (not already used by another role)
   * @param name - Role name to check
   * @returns Observable<boolean> - true if available, false if taken
   */
  isRoleNameAvailable(name: string): Observable<boolean> {
    const currentItems = this.items();
    const currentEditingId = this.editingItem()?.id;

    // Check if name exists in current items (excluding the one being edited)
    const nameExists = currentItems.some(
      (role) => role.name.toLowerCase() === name.toLowerCase() && role.id !== currentEditingId,
    );

    return of(!nameExists);
  }
}
