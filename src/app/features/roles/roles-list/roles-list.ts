import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableToolbarComponent } from '../../../components/ui/table-toolbar/table-toolbar';
import { TableComponent } from '../../../components/ui/table/table';
import { TablePaginationComponent } from '../../../components/ui/table-pagination/table-pagination';
import { ModalComponent } from '../../../components/ui/modal/modal';
import { UserApiService, RoleDto, PermissionDto } from '../../../core/openapi';
import { forkJoin } from 'rxjs';
import { RolesFormComponent } from '../roles-form/roles-form';

@Component({
  selector: 'app-roles-list',
  standalone: true,
  imports: [
    CommonModule,
    TableToolbarComponent,
    TableComponent,
    TablePaginationComponent,
    ModalComponent,
    RolesFormComponent,
  ],
  templateUrl: './roles-list.html',
})
export class RolesListComponent {
  private userService = inject(UserApiService);

  // State
  allRoles = signal<RoleDto[]>([]);
  allPermissions = signal<PermissionDto[]>([]);
  loading = signal(false);
  showModal = signal(false);
  editingRole = signal<RoleDto | null>(null);
  showDeleteConfirm = signal(false);
  deletingRole = signal<RoleDto | null>(null);
  searchTerm = signal('');
  selectedRoles = signal<Set<string>>(new Set());
  currentPage = signal(1);
  pageSize = signal(10);

  // Computed
  filteredRoles = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.allRoles();

    return this.allRoles().filter(
      (role) => role.name.toLowerCase().includes(term) || role.id.toLowerCase().includes(term),
    );
  });

  paginatedRoles = computed(() => {
    const filtered = this.filteredRoles();
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return filtered.slice(start, end);
  });

  hasSelection = computed(() => this.selectedRoles().size > 0);

  // Table config
  columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'permissionsCount', label: 'Permissions', sortable: false },
    { key: 'id', label: 'ID', sortable: true },
  ];

  rowActions = [
    {
      label: 'Edit',
      variant: 'secondary' as const,
      inline: true,
      onClick: (row: unknown) => {
        const roleRow = row as RoleDto;
        this.editingRole.set(roleRow);
        this.showModal.set(true);
      },
    },
    {
      label: 'Delete',
      variant: 'danger' as const,
      inline: true,
      onClick: (row: unknown) => {
        const roleRow = row as RoleDto;
        this.deletingRole.set(roleRow);
        this.showDeleteConfirm.set(true);
      },
    },
  ];

  primaryAction = {
    label: 'New Role',
    onClick: () => {
      this.editingRole.set(null);
      this.showModal.set(true);
    },
  };

  bulkActions = [{ label: 'Delete Selected', variant: 'outline' as const }];

  ngOnInit() {
    this.loadRoles();
    this.loadPermissions();
  }

  loadRoles() {
    this.loading.set(true);
    this.userService.getAllRoles().subscribe({
      next: (data) => {
        this.allRoles.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  loadPermissions() {
    this.userService.getAllPermissions().subscribe({
      next: (data) => {
        this.allPermissions.set(data);
      },
      error: (err) => console.error('Error loading permissions:', err),
    });
  }

  onFormSave() {
    this.showModal.set(false);
    this.editingRole.set(null);
    this.loadRoles();
  }

  onFormCancel() {
    this.showModal.set(false);
    this.editingRole.set(null);
  }

  confirmDelete() {
    const selected = this.selectedRoles();
    const single = this.deletingRole();

    const requests =
      selected.size > 0
        ? Array.from(selected).map((id) => this.userService.deleteRole(id))
        : single
          ? [this.userService.deleteRole(single.id)]
          : [];

    if (requests.length === 0) return;

    forkJoin(requests).subscribe({
      next: () => {
        this.showDeleteConfirm.set(false);
        this.deletingRole.set(null);
        this.selectedRoles.set(new Set());
        this.loadRoles();
      },
      error: (err) => {
        console.error('Error deleting role(s):', err);
        this.showDeleteConfirm.set(false);
      },
    });
  }

  get deleteMessage() {
    const count = this.selectedRoles().size;
    return count > 0
      ? `Delete ${count} role${count > 1 ? 's' : ''}?`
      : `Delete <strong>${this.deletingRole()?.name}</strong>?`;
  }

  // Format data for table display
  get tableData() {
    return this.paginatedRoles().map((role) => ({
      ...role,
      permissionsCount: role.permissions?.length || 0,
    }));
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    // Reset selection when changing pages
    this.selectedRoles.set(new Set());
  }
}
