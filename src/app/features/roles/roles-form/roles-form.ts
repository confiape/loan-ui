import { Component, input, output, effect, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { UserApiService, RoleDto, SaveRoleDto, PermissionDto } from '../../../core/openapi';
import { BaseInputComponent } from '../../../components/ui/base-input/base-input';
import {
  MultiSelectComponent,
  MultiSelectItem,
} from '../../../components/ui/multiselect/multiselect';

@Component({
  selector: 'app-roles-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BaseInputComponent, MultiSelectComponent],
  templateUrl: './roles-form.html',
})
export class RolesFormComponent {
  private userService = inject(UserApiService);
  private fb = inject(FormBuilder);

  // Inputs
  role = input<RoleDto | null>(null);
  allPermissions = input<PermissionDto[]>([]);
  allRoles = input<RoleDto[]>([]);

  // Outputs
  saveRole = output<RoleDto>();
  cancelForm = output<void>();

  // State
  loading = signal(false);
  error = signal<string | null>(null);

  // Form
  form = this.fb.group({
    name: [
      '',
      {
        validators: [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
          Validators.pattern(/^[a-zA-Z0-9\s\-_]+$/),
        ],
        updateOn: 'blur',
      },
    ],
    permissionsId: [[] as string[]],
    rolesId: [[] as string[]],
  });

  constructor() {
    effect(() => {
      const currentRole = this.role();
      if (currentRole) {
        this.form.patchValue({
          name: currentRole.name,
          permissionsId: currentRole.permissions?.map((p) => p.name) || [],
          rolesId: currentRole.roles?.map((r) => r.id) || [],
        });
      } else {
        this.form.reset({
          name: '',
          permissionsId: [],
          rolesId: [],
        });
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const formValue = this.form.value;
    const current = this.role();

    const saveDto: SaveRoleDto = {
      id: current?.id || null,
      name: formValue.name!,
      permissionsId: formValue.permissionsId || [],
      rolesId: formValue.rolesId || [],
    };

    this.userService.saveRole(saveDto).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.saveRole.emit(res);
      },
      error: (err) => {
        console.error('Error saving role:', err);
        this.error.set(err.error?.message || 'Failed to save role. Please try again.');
        this.loading.set(false);
      },
    });
  }

  onCancel() {
    this.cancelForm.emit();
  }

  // Getters for template
  get nameControl() {
    return this.form.get('name') as FormControl;
  }

  get isEditMode() {
    return this.role() !== null;
  }

  // Transform permissions to MultiSelectItem
  get permissionItems(): MultiSelectItem[] {
    return this.allPermissions().map((p) => ({
      label: p.name,
      value: p.name,
    }));
  }

  // Transform roles to MultiSelectItem (exclude current role to prevent circular references)
  get roleItems(): MultiSelectItem[] {
    const currentRoleId = this.role()?.id;
    return this.allRoles()
      .filter((r) => r.id !== currentRoleId)
      .map((r) => ({
        label: r.name,
        value: r.id,
      }));
  }
}
