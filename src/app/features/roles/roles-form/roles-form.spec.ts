import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RolesFormComponent } from './roles-form';
import { RoleDto, PermissionDto } from '../../../core/openapi';

describe('RolesFormComponent', () => {
  let component: RolesFormComponent;
  let fixture: ComponentFixture<RolesFormComponent>;

  const mockPermissions: PermissionDto[] = [{ name: 'View Dashboard' }, { name: 'Manage Users' }];

  const mockRoles: RoleDto[] = [
    { id: 'r1', name: 'Admin', permissions: [], roles: [] },
    { id: 'r2', name: 'Manager', permissions: [], roles: [] },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolesFormComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RolesFormComponent);
    component = fixture.componentInstance;

    // Set inputs
    fixture.componentRef.setInput('allPermissions', mockPermissions);
    fixture.componentRef.setInput('allRoles', mockRoles);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values in create mode', () => {
    expect(component.form.value).toEqual({
      name: '',
      permissionsId: [],
      rolesId: [],
    });
  });

  it('should initialize form with role data in edit mode', () => {
    const mockRole: RoleDto = {
      id: 'r3',
      name: 'Editor',
      permissions: [mockPermissions[0]],
      roles: [mockRoles[0]],
    };

    fixture.componentRef.setInput('role', mockRole);
    fixture.detectChanges();

    expect(component.form.value.name).toBe('Editor');
    expect(component.form.value.permissionsId).toEqual(['View Dashboard']);
    expect(component.form.value.rolesId).toEqual(['r1']);
  });

  it('should validate required name field', () => {
    const nameControl = component.nameControl;

    nameControl.setValue('');
    expect(nameControl.hasError('required')).toBeTruthy();

    nameControl.setValue('Admin');
    expect(nameControl.hasError('required')).toBeFalsy();
  });

  it('should validate name minimum length', () => {
    const nameControl = component.nameControl;

    nameControl.setValue('A');
    expect(nameControl.hasError('minlength')).toBeTruthy();

    nameControl.setValue('Admin');
    expect(nameControl.hasError('minlength')).toBeFalsy();
  });

  it('should validate name pattern', () => {
    const nameControl = component.nameControl;

    nameControl.setValue('Invalid@Role!');
    expect(nameControl.hasError('pattern')).toBeTruthy();

    nameControl.setValue('Valid-Role_123');
    expect(nameControl.hasError('pattern')).toBeFalsy();
  });

  it('should mark form as invalid when name is empty', () => {
    component.form.patchValue({ name: '' });
    expect(component.form.invalid).toBeTruthy();
  });

  it('should mark form as valid when name is provided', () => {
    component.form.patchValue({ name: 'Admin' });
    expect(component.form.valid).toBeTruthy();
  });

  it('should return correct edit mode state', () => {
    expect(component.isEditMode).toBeFalsy();

    const mockRole: RoleDto = {
      id: 'r3',
      name: 'Editor',
      permissions: [],
      roles: [],
    };

    fixture.componentRef.setInput('role', mockRole);
    fixture.detectChanges();

    expect(component.isEditMode).toBeTruthy();
  });

  it('should transform permissions to MultiSelectItem format', () => {
    const items = component.permissionItems;
    expect(items).toEqual([
      { label: 'View Dashboard', value: 'View Dashboard' },
      { label: 'Manage Users', value: 'Manage Users' },
    ]);
  });

  it('should transform roles to MultiSelectItem format', () => {
    const items = component.roleItems;
    expect(items).toEqual([
      { label: 'Admin', value: 'r1' },
      { label: 'Manager', value: 'r2' },
    ]);
  });

  it('should exclude current role from role items in edit mode', () => {
    const mockRole: RoleDto = {
      id: 'r1',
      name: 'Admin',
      permissions: [],
      roles: [],
    };

    fixture.componentRef.setInput('role', mockRole);
    fixture.detectChanges();

    const items = component.roleItems;
    expect(items.length).toBe(1);
    expect(items[0].value).toBe('r2');
  });

  it('should emit cancelForm event', () => {
    const cancelSpy = vi.fn();
    component.cancelForm.subscribe(cancelSpy);

    component.onCancel();
    expect(cancelSpy).toHaveBeenCalled();
  });

  it('should not submit invalid form', () => {
    component.form.patchValue({ name: '' });
    component.onSubmit();

    expect(component.loading()).toBeFalsy();
  });
});
