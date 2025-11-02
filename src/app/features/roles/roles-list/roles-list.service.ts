import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BaseCrudService } from '../../../core/services/base-crud.service';
import { UserApiService } from '../../../core/openapi/api/user.service';
import { RoleDto, PermissionDto } from '../../../core/openapi/model/models';

/**
 * Service for managing roles list with CRUD operations
 */
@Injectable()
export class RolesListService extends BaseCrudService<RoleDto> {
  private userApi = inject(UserApiService);
  private router = inject(Router);

  /**
   * All available permissions (loaded separately)
   */
  allPermissions = signal<PermissionDto[]>([]);

  constructor() {
    super({
      enablePagination: true, // Roles uses pagination
      defaultPageSize: 10,
      enableRouterNavigation: true, // Roles uses router navigation
    });
  }

  protected loadAllItems(): Observable<RoleDto[]> {
    return this.userApi.getAllRoles();
  }

  protected deleteItem(id: string): Observable<unknown> {
    return this.userApi.deleteRole(id);
  }

  protected matchesSearch(item: RoleDto, term: string): boolean {
    return item.name.toLowerCase().includes(term) || item.id.toLowerCase().includes(term);
  }

  protected getItemTypeName(): string {
    return 'role';
  }

  protected getItemTypePluralName(): string {
    return 'roles';
  }

  protected getItemDisplayName(item: RoleDto): string {
    return item.name;
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
}
