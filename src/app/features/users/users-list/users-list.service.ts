import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Validators } from '@angular/forms';
import { BaseCrudService } from '../../../core/services/base-crud.service';
import { UserApiService } from '../../../core/openapi/api/user.service';
import { CompanyApiService } from '../../../core/openapi/api/company.service';
import { UserDto, SaveUserDto } from '../../../core/openapi/model/models';
import { TableColumnMetadata, FormFieldMetadata } from '../../../core/models/form-metadata';
import { uniqueValueValidator } from '../../../core/validators/async-validators';

/**
 * Service for managing users list with CRUD operations
 */
@Injectable()
export class UsersListService extends BaseCrudService<UserDto, SaveUserDto> {
  private userApi = inject(UserApiService);
  private companyApi = inject(CompanyApiService);
  private router = inject(Router);

  constructor() {
    super({
      enablePagination: true,
      defaultPageSize: 10,
      enableRouterNavigation: true,
    });
  }

  // ==================== DATA OPERATIONS ====================
  loadAllItems(): Observable<UserDto[]> {
    return this.userApi.getAllUsers();
  }

  saveItem(formData: any): Observable<UserDto> {
    // Transform flat form data into SaveUserDto structure
    const saveUserDto: SaveUserDto = {
      user: {
        id: this.editingItem()?.id || null,
        email: formData.email,
        isActive: formData.isActive ?? true,
        password: formData.password || null,
        picture: null,
      },
      createPersonDto: {
        name: formData.name,
        dni: formData.dni,
        phoneNumber: formData.phoneNumber,
        birthday: formData.birthday || null,
        address: formData.address || null,
        notes: formData.notes || null,
      },
      rolesId: formData.rolesId || [],
      permissionsId: formData.permissionsId || [],
      companyIds: formData.companyIds || [],
    };

    return this.userApi.saveUser(saveUserDto);
  }

  deleteItem(id: string): Observable<unknown> {
    return this.userApi.deleteUser(id);
  }

  matchesSearch(item: UserDto, term: string): boolean {
    const searchTerm = term.toLowerCase();
    return (
      item.email.toLowerCase().includes(searchTerm) ||
      item.person.name.toLowerCase().includes(searchTerm) ||
      item.person.dni.toLowerCase().includes(searchTerm) ||
      item.id.toLowerCase().includes(searchTerm)
    );
  }

  // ==================== METADATA ====================
  getTableColumns(): TableColumnMetadata<UserDto>[] {
    return [
      {
        key: 'email',
        label: 'Email',
        sortable: true
      },
      {
        key: 'name',
        label: 'Name',
        sortable: true,
        valueGetter: (user) => user.person.name
      },
      {
        key: 'dni',
        label: 'DNI',
        sortable: true,
        valueGetter: (user) => user.person.dni
      },
      {
        key: 'isActive',
        label: 'Active',
        sortable: true,
        valueGetter: (user) => user.isActive ? 'Yes' : 'No'
      },
      {
        key: 'rolesCount',
        label: 'Roles',
        sortable: false,
        valueGetter: (user) => user.roles?.length || 0,
      },
      {
        key: 'companiesCount',
        label: 'Companies',
        sortable: false,
        valueGetter: (user) => user.companies?.length || 0,
      },
      {
        key: 'id',
        label: 'ID',
        sortable: true
      },
    ];
  }

  getFormFields(): FormFieldMetadata[] {
    const isEditing = !!this.editingItem();

    return [
      // ========== USER CREDENTIALS ==========
      {
        key: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'user@example.com',
        validators: [
          Validators.required,
          Validators.email,
        ],
        asyncValidators: [
          uniqueValueValidator(
            (email) => this.isEmailAvailable(email),
            this.editingItem()?.email,
          ),
        ],
        valueTransformer: (user: UserDto) => user.email,
        helpText: 'User email address (must be unique)',
      },
      {
        key: 'password',
        label: isEditing ? 'New Password (leave empty to keep current)' : 'Password',
        type: 'password',
        placeholder: isEditing ? 'Leave empty to keep current password' : 'Enter password',
        validators: isEditing ? [] : [Validators.required, Validators.minLength(6)],
        valueTransformer: () => '', // Always empty for security
        helpText: isEditing
          ? 'Leave empty to keep current password, or enter new password (min 6 characters)'
          : 'Minimum 6 characters',
      },
      {
        key: 'isActive',
        label: 'Active',
        type: 'checkbox',
        valueTransformer: (user: UserDto) => user.isActive,
        helpText: 'Enable or disable user access',
      },

      // ========== PERSON DATA ==========
      {
        key: 'name',
        label: 'Full Name',
        type: 'text',
        placeholder: 'John Doe',
        validators: [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
        ],
        valueTransformer: (user: UserDto) => user.person.name,
        helpText: 'Person full name',
      },
      {
        key: 'dni',
        label: 'DNI',
        type: 'text',
        placeholder: '12345678',
        validators: [
          Validators.required,
          Validators.pattern(/^[0-9]{8}$/),
        ],
        asyncValidators: [
          uniqueValueValidator(
            (dni) => this.isDniAvailable(dni),
            this.editingItem()?.person.dni,
          ),
        ],
        valueTransformer: (user: UserDto) => user.person.dni,
        helpText: 'Document number (8 digits, must be unique)',
      },
      {
        key: 'phoneNumber',
        label: 'Phone Number',
        type: 'text',
        placeholder: '+1234567890',
        validators: [
          Validators.required,
          Validators.pattern(/^\+?[0-9\s\-()]+$/),
        ],
        valueTransformer: (user: UserDto) => user.person.phoneNumber,
        helpText: 'Contact phone number',
      },
      {
        key: 'birthday',
        label: 'Birthday',
        type: 'date',
        validators: [],
        valueTransformer: (user: UserDto) => {
          if (user.person.birthday) {
            // Convert from ISO string to YYYY-MM-DD format for date input
            return user.person.birthday.split('T')[0];
          }
          return '';
        },
        helpText: 'Date of birth (optional)',
      },
      {
        key: 'address',
        label: 'Address',
        type: 'textarea',
        placeholder: 'Street, City, Country',
        validators: [Validators.maxLength(500)],
        valueTransformer: (user: UserDto) => user.person.address || '',
        helpText: 'Physical address (optional)',
      },
      {
        key: 'notes',
        label: 'Notes',
        type: 'textarea',
        placeholder: 'Additional notes...',
        validators: [Validators.maxLength(1000)],
        valueTransformer: (user: UserDto) => user.person.notes || '',
        helpText: 'Additional information (optional)',
      },

      // ========== ROLES, PERMISSIONS, COMPANIES ==========
      {
        key: 'rolesId',
        label: 'Roles',
        type: 'multiselect',
        placeholder: 'Select roles',
        loadOptions: () => {
          return this.userApi.getAllRoles().pipe(
            map((roles) =>
              roles.map((r) => ({
                label: r.name,
                value: r.id,
              })),
            ),
          );
        },
        valueTransformer: (user: UserDto) => {
          return user.roles?.map((r) => r.id) || [];
        },
        helpText: 'Assign roles to the user',
      },
      {
        key: 'permissionsId',
        label: 'Permissions',
        type: 'multiselect',
        placeholder: 'Select permissions',
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
        valueTransformer: (user: UserDto) => {
          return user.permissions?.map((p) => p.name) || [];
        },
        helpText: 'Additional permissions for the user',
      },
      {
        key: 'companyIds',
        label: 'Companies',
        type: 'multiselect',
        placeholder: 'Select companies',
        loadOptions: () => {
          return this.companyApi.getAllCompanies().pipe(
            map((companies) =>
              companies.map((c) => ({
                label: c.name,
                value: c.id,
              })),
            ),
          );
        },
        valueTransformer: (user: UserDto) => {
          return user.companies?.map((c) => c.id) || [];
        },
        helpText: 'Companies the user belongs to',
      },
    ];
  }

  getItemTypeName(): string {
    return 'user';
  }

  getItemTypePluralName(): string {
    return 'users';
  }

  getItemDisplayName(item: UserDto): string {
    return `${item.person.name} (${item.email})`;
  }

  getRouteBasePath(): string {
    return '/users';
  }

  // ==================== ROUTER NAVIGATION HOOKS ====================
  protected override onEditWithRouter(item: UserDto): void {
    this.router.navigate(['/users', item.id]);
  }

  protected override onAfterFormSave(): void {
    this.router.navigate(['/users']);
  }

  protected override onAfterFormCancel(): void {
    this.router.navigate(['/users']);
  }

  // ==================== VALIDATION HELPERS ====================

  /**
   * Check if an email is available (not already used by another user)
   */
  isEmailAvailable(email: string): Observable<boolean> {
    const currentItems = this.items();
    const currentEditingId = this.editingItem()?.id;

    const emailExists = currentItems.some(
      (user) =>
        user.email.toLowerCase() === email.toLowerCase() &&
        user.id !== currentEditingId,
    );

    return of(!emailExists);
  }

  /**
   * Check if a DNI is available (not already used by another user)
   */
  isDniAvailable(dni: string): Observable<boolean> {
    const currentItems = this.items();
    const currentEditingId = this.editingItem()?.id;

    const dniExists = currentItems.some(
      (user) =>
        user.person.dni === dni &&
        user.id !== currentEditingId,
    );

    return of(!dniExists);
  }
}
