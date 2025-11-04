import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { UsersListComponent } from './users-list';
import { UserApiService, CompanyApiService, UserDto, PermissionDto, RoleDto, CompanyDto } from '../../../core/openapi';
import { routes } from '../../../app.routes';

describe('UsersListComponent', () => {
  let component: UsersListComponent;
  let fixture: ComponentFixture<UsersListComponent>;
  let userService: UserApiService;
  let companyService: CompanyApiService;

  const mockPermissions: PermissionDto[] = [
    { name: 'View Dashboard' },
    { name: 'Manage Users' }
  ];

  const mockRoles: RoleDto[] = [
    {
      id: 'r1',
      name: 'Admin',
      permissions: [mockPermissions[0], mockPermissions[1]],
      roles: [],
    },
    {
      id: 'r2',
      name: 'Manager',
      permissions: [mockPermissions[0]],
      roles: [],
    },
  ];

  const mockCompanies: CompanyDto[] = [
    { id: 'c1', name: 'Company A' },
    { id: 'c2', name: 'Company B' },
  ];

  const mockUsers: UserDto[] = [
    {
      id: 'u1',
      email: 'john@example.com',
      isActive: true,
      person: {
        name: 'John Doe',
        dni: '12345678',
        phoneNumber: '+1234567890',
        birthday: '1990-01-01T00:00:00Z',
        address: '123 Main St',
        notes: 'Test user 1',
      },
      roles: [mockRoles[0]],
      permissions: [mockPermissions[0], mockPermissions[1]],
      companies: [mockCompanies[0]],
      avatar: null,
      background: null,
    },
    {
      id: 'u2',
      email: 'jane@example.com',
      isActive: false,
      person: {
        name: 'Jane Smith',
        dni: '87654321',
        phoneNumber: '+0987654321',
        birthday: '1985-06-15T00:00:00Z',
        address: '456 Oak Ave',
        notes: null,
      },
      roles: [mockRoles[1]],
      permissions: [mockPermissions[0]],
      companies: [mockCompanies[0], mockCompanies[1]],
      avatar: null,
      background: null,
    },
    {
      id: 'u3',
      email: 'bob@example.com',
      isActive: true,
      person: {
        name: 'Bob Johnson',
        dni: '11223344',
        phoneNumber: '+1122334455',
        birthday: null,
        address: null,
        notes: null,
      },
      roles: [],
      permissions: [],
      companies: [],
      avatar: null,
      background: null,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersListComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter(routes),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersListComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserApiService);
    companyService = TestBed.inject(CompanyApiService);

    // Mock service methods
    vi.spyOn(userService, 'getAllUsers').mockReturnValue(
      of(mockUsers) as unknown as ReturnType<typeof userService.getAllUsers>,
    );
    vi.spyOn(userService, 'getAllRoles').mockReturnValue(
      of(mockRoles) as unknown as ReturnType<typeof userService.getAllRoles>,
    );
    vi.spyOn(userService, 'getAllPermissions').mockReturnValue(
      of(mockPermissions) as unknown as ReturnType<typeof userService.getAllPermissions>,
    );
    vi.spyOn(companyService, 'getAllCompanies').mockReturnValue(
      of(mockCompanies) as unknown as ReturnType<typeof companyService.getAllCompanies>,
    );

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    expect(userService.getAllUsers).toHaveBeenCalled();
    expect(component.service.items()).toEqual(mockUsers);
  });

  it('should filter users by email', () => {
    component.service.searchTerm.set('john@example.com');
    const filtered = component.service.filteredItems();
    expect(filtered.length).toBe(1);
    expect(filtered[0].email).toBe('john@example.com');
  });

  it('should filter users by name', () => {
    component.service.searchTerm.set('Jane');
    const filtered = component.service.filteredItems();
    expect(filtered.length).toBe(1);
    expect(filtered[0].person.name).toBe('Jane Smith');
  });

  it('should filter users by DNI', () => {
    component.service.searchTerm.set('87654321');
    const filtered = component.service.filteredItems();
    expect(filtered.length).toBe(1);
    expect(filtered[0].person.dni).toBe('87654321');
  });

  it('should filter users by ID', () => {
    component.service.searchTerm.set('u3');
    const filtered = component.service.filteredItems();
    expect(filtered.length).toBe(1);
    expect(filtered[0].id).toBe('u3');
  });

  it('should return all users when search term is empty', () => {
    component.service.searchTerm.set('');
    const filtered = component.service.filteredItems();
    expect(filtered.length).toBe(mockUsers.length);
  });

  it('should detect selection', () => {
    expect(component.service.hasSelection()).toBeFalsy();

    component.service.selectedItems.set(new Set(['u1']));
    expect(component.service.hasSelection()).toBeTruthy();
  });

  it('should show delete confirm modal for single user', () => {
    component.service.onDeleteItem(mockUsers[0]);
    expect(component.service.showDeleteConfirm()).toBeTruthy();
    expect(component.service.deletingItem()).toEqual(mockUsers[0]);
  });

  it('should show form modal when creating new user', () => {
    component.service.onNewItem();
    expect(component.service.showModal()).toBeTruthy();
    expect(component.service.editingItem()).toBeNull();
  });

  it('should close form modal on cancel', () => {
    component.service.showModal.set(true);
    component.service.editingItem.set(mockUsers[0]);

    component.service.onFormCancel();

    expect(component.service.showModal()).toBeFalsy();
    expect(component.service.editingItem()).toBeNull();
  });

  it('should reload users after form save', () => {
    const reloadSpy = vi.spyOn(component.service, 'loadItems');
    component.service.showModal.set(true);

    component.service.onFormSave();

    expect(component.service.showModal()).toBeFalsy();
    expect(component.service.editingItem()).toBeNull();
    expect(reloadSpy).toHaveBeenCalled();
  });

  it('should generate correct delete message for single user', () => {
    component.service.deletingItem.set(mockUsers[0]);
    component.service.selectedItems.set(new Set());

    const message = component.service.deleteMessage();
    expect(message).toContain('John Doe');
  });

  it('should generate correct delete message for multiple users', () => {
    component.service.selectedItems.set(new Set(['u1', 'u2']));

    const message = component.service.deleteMessage();
    expect(message).toContain('2 users');
  });

  it('should delete single user', () => {
    vi.spyOn(userService, 'deleteUser').mockReturnValue(
      of({}) as unknown as ReturnType<typeof userService.deleteUser>,
    );
    component.service.deletingItem.set(mockUsers[0]);

    component.service.confirmDelete();

    expect(userService.deleteUser).toHaveBeenCalledWith('u1');
  });

  it('should delete multiple users', () => {
    vi.spyOn(userService, 'deleteUser').mockReturnValue(
      of({}) as unknown as ReturnType<typeof userService.deleteUser>,
    );
    component.service.selectedItems.set(new Set(['u1', 'u2']));

    component.service.confirmDelete();

    expect(userService.deleteUser).toHaveBeenCalledTimes(2);
    expect(userService.deleteUser).toHaveBeenCalledWith('u1');
    expect(userService.deleteUser).toHaveBeenCalledWith('u2');
  });

  it('should have correct table columns', () => {
    const columns = component.service.getTableColumns();
    expect(columns.length).toBe(7);
    expect(columns[0]).toMatchObject({ key: 'email', label: 'Email', sortable: true });
    expect(columns[1]).toMatchObject({ key: 'name', label: 'Name', sortable: true });
    expect(columns[2]).toMatchObject({ key: 'dni', label: 'DNI', sortable: true });
    expect(columns[3]).toMatchObject({ key: 'isActive', label: 'Active', sortable: true });
    expect(columns[4]).toMatchObject({ key: 'rolesCount', label: 'Roles', sortable: false });
    expect(columns[5]).toMatchObject({ key: 'companiesCount', label: 'Companies', sortable: false });
    expect(columns[6]).toMatchObject({ key: 'id', label: 'ID', sortable: true });
  });

  it('should format isActive as Yes/No', () => {
    const columns = component.service.getTableColumns();
    const activeColumn = columns.find(c => c.key === 'isActive');

    expect(activeColumn?.valueGetter).toBeDefined();
    expect(activeColumn?.valueGetter!(mockUsers[0])).toBe('Yes');
    expect(activeColumn?.valueGetter!(mockUsers[1])).toBe('No');
  });

  it('should display roles count correctly', () => {
    const columns = component.service.getTableColumns();
    const rolesColumn = columns.find(c => c.key === 'rolesCount');

    expect(rolesColumn?.valueGetter).toBeDefined();
    expect(rolesColumn?.valueGetter!(mockUsers[0])).toBe(1);
    expect(rolesColumn?.valueGetter!(mockUsers[1])).toBe(1);
    expect(rolesColumn?.valueGetter!(mockUsers[2])).toBe(0);
  });

  it('should display companies count correctly', () => {
    const columns = component.service.getTableColumns();
    const companiesColumn = columns.find(c => c.key === 'companiesCount');

    expect(companiesColumn?.valueGetter).toBeDefined();
    expect(companiesColumn?.valueGetter!(mockUsers[0])).toBe(1);
    expect(companiesColumn?.valueGetter!(mockUsers[1])).toBe(2);
    expect(companiesColumn?.valueGetter!(mockUsers[2])).toBe(0);
  });

  it('should have correct form fields', () => {
    const fields = component.service.getFormFields();
    expect(fields.length).toBe(14);

    // User credentials
    expect(fields[0].key).toBe('email');
    expect(fields[1].key).toBe('password');
    expect(fields[2].key).toBe('isActive');

    // Person data
    expect(fields[3].key).toBe('name');
    expect(fields[4].key).toBe('dni');
    expect(fields[5].key).toBe('phoneNumber');
    expect(fields[6].key).toBe('birthday');
    expect(fields[7].key).toBe('address');
    expect(fields[8].key).toBe('notes');

    // Relationships
    expect(fields[9].key).toBe('rolesId');
    expect(fields[10].key).toBe('permissionsId');
    expect(fields[11].key).toBe('companyIds');
  });

  it('should check email availability correctly', (done) => {
    component.service.isEmailAvailable('new@example.com').subscribe(available => {
      expect(available).toBe(true);
      done();
    });
  });

  it('should detect duplicate email', (done) => {
    component.service.isEmailAvailable('john@example.com').subscribe(available => {
      expect(available).toBe(false);
      done();
    });
  });

  it('should allow same email when editing user', (done) => {
    component.service.editingItem.set(mockUsers[0]);
    component.service.isEmailAvailable('john@example.com').subscribe(available => {
      expect(available).toBe(true);
      done();
    });
  });

  it('should check DNI availability correctly', (done) => {
    component.service.isDniAvailable('99999999').subscribe(available => {
      expect(available).toBe(true);
      done();
    });
  });

  it('should detect duplicate DNI', (done) => {
    component.service.isDniAvailable('12345678').subscribe(available => {
      expect(available).toBe(false);
      done();
    });
  });

  it('should allow same DNI when editing user', (done) => {
    component.service.editingItem.set(mockUsers[0]);
    component.service.isDniAvailable('12345678').subscribe(available => {
      expect(available).toBe(true);
      done();
    });
  });

  it('should get correct item display name', () => {
    const displayName = component.service.getItemDisplayName(mockUsers[0]);
    expect(displayName).toBe('John Doe (john@example.com)');
  });

  it('should return correct route base path', () => {
    expect(component.service.getRouteBasePath()).toBe('/users');
  });

  it('should return correct item type names', () => {
    expect(component.service.getItemTypeName()).toBe('user');
    expect(component.service.getItemTypePluralName()).toBe('users');
  });
});
