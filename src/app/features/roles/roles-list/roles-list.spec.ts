import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { RolesListComponent } from './roles-list';
import { UserApiService, RoleDto, PermissionDto } from '../../../core/openapi';
import { routes } from '../../../app.routes';

describe('RolesListComponent', () => {
  let component: RolesListComponent;
  let fixture: ComponentFixture<RolesListComponent>;
  let userService: UserApiService;

  const mockPermissions: PermissionDto[] = [{ name: 'View Dashboard' }, { name: 'Manage Users' }];

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
    {
      id: 'r3',
      name: 'Viewer',
      permissions: [],
      roles: [],
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolesListComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter(routes),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RolesListComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserApiService);

    // Mock service methods
    vi.spyOn(userService, 'getAllRoles').mockReturnValue(
      of(mockRoles) as unknown as ReturnType<typeof userService.getAllRoles>,
    );
    vi.spyOn(userService, 'getAllPermissions').mockReturnValue(
      of(mockPermissions) as unknown as ReturnType<typeof userService.getAllPermissions>,
    );

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load roles on init', () => {
    expect(userService.getAllRoles).toHaveBeenCalled();
    expect(component.service.items()).toEqual(mockRoles);
  });

  it('should load permissions on init', () => {
    expect(userService.getAllPermissions).toHaveBeenCalled();
    expect(component.service.allPermissions()).toEqual(mockPermissions);
  });

  it('should filter roles by search term', () => {
    component.service.searchTerm.set('Admin');
    const filtered = component.service.filteredItems();
    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe('Admin');
  });

  it('should filter roles by ID', () => {
    component.service.searchTerm.set('r2');
    const filtered = component.service.filteredItems();
    expect(filtered.length).toBe(1);
    expect(filtered[0].id).toBe('r2');
  });

  it('should return all roles when search term is empty', () => {
    component.service.searchTerm.set('');
    const filtered = component.service.filteredItems();
    expect(filtered.length).toBe(mockRoles.length);
  });

  it('should detect selection', () => {
    expect(component.service.hasSelection()).toBeFalsy();

    component.service.selectedItems.set(new Set(['r1']));
    expect(component.service.hasSelection()).toBeTruthy();
  });

  it('should show delete confirm modal for single role', () => {
    component.rowActions[1].onClick?.(mockRoles[0]);
    expect(component.service.showDeleteConfirm()).toBeTruthy();
    expect(component.service.deletingItem()).toEqual(mockRoles[0]);
  });

  it('should show form modal when creating new role', () => {
    component.primaryAction.onClick?.();
    expect(component.service.showModal()).toBeTruthy();
    expect(component.service.editingItem()).toBeNull();
  });

  it('should close form modal on cancel', () => {
    component.service.showModal.set(true);
    component.service.editingItem.set(mockRoles[0]);

    component.service.onFormCancel();

    expect(component.service.showModal()).toBeFalsy();
    expect(component.service.editingItem()).toBeNull();
  });

  it('should reload roles after form save', () => {
    const reloadSpy = vi.spyOn(component.service, 'loadItems');
    component.service.showModal.set(true);

    component.service.onFormSave();

    expect(component.service.showModal()).toBeFalsy();
    expect(component.service.editingItem()).toBeNull();
    expect(reloadSpy).toHaveBeenCalled();
  });

  it('should generate correct delete message for single role', () => {
    component.service.deletingItem.set(mockRoles[0]);
    component.service.selectedItems.set(new Set());

    const message = component.service.deleteMessage();
    expect(message).toContain('Admin');
  });

  it('should generate correct delete message for multiple roles', () => {
    component.service.selectedItems.set(new Set(['r1', 'r2']));

    const message = component.service.deleteMessage();
    expect(message).toContain('2 roles');
  });

  it('should delete single role', () => {
    vi.spyOn(userService, 'deleteRole').mockReturnValue(
      of({}) as unknown as ReturnType<typeof userService.deleteRole>,
    );
    component.service.deletingItem.set(mockRoles[0]);

    component.service.confirmDelete();

    expect(userService.deleteRole).toHaveBeenCalledWith('r1');
  });

  it('should delete multiple roles', () => {
    vi.spyOn(userService, 'deleteRole').mockReturnValue(
      of({}) as unknown as ReturnType<typeof userService.deleteRole>,
    );
    component.service.selectedItems.set(new Set(['r1', 'r2']));

    component.service.confirmDelete();

    expect(userService.deleteRole).toHaveBeenCalledTimes(2);
    expect(userService.deleteRole).toHaveBeenCalledWith('r1');
    expect(userService.deleteRole).toHaveBeenCalledWith('r2');
  });

  it('should format table data with permissions count', () => {
    const tableData = component.tableData;
    expect(tableData[0].permissionsCount).toBe(2);
    expect(tableData[1].permissionsCount).toBe(1);
    expect(tableData[2].permissionsCount).toBe(0);
  });

  it('should have correct table columns', () => {
    expect(component.columns).toEqual([
      { key: 'name', label: 'Name', sortable: true },
      { key: 'permissionsCount', label: 'Permissions', sortable: false },
      { key: 'id', label: 'ID', sortable: true },
    ]);
  });

  it('should have correct row actions', () => {
    expect(component.rowActions.length).toBe(2);
    expect(component.rowActions[0].label).toBe('Edit');
    expect(component.rowActions[1].label).toBe('Delete');
  });
});
