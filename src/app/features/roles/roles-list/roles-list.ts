import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import {
  TableToolbarComponent,
  ToolbarAction,
} from '../../../components/ui/table-toolbar/table-toolbar';
import { TableComponent, TableColumn } from '../../../components/ui/table/table';
import { TablePaginationComponent } from '../../../components/ui/table-pagination/table-pagination';
import { ModalComponent } from '../../../components/ui/modal/modal';
import { RoleDto } from '../../../core/openapi';
import { RolesFormComponent } from '../roles-form/roles-form';
import { RolesListService } from './roles-list.service';
import {
  createStandardRowActions,
  createPrimaryAction,
  createBulkActions,
} from '../../../core/utils/crud-helpers';

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
  providers: [RolesListService],
  templateUrl: './roles-list.html',
})
export class RolesListComponent implements OnInit {
  service = inject(RolesListService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  // Table config
  columns: TableColumn<RoleDto>[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'permissionsCount', label: 'Permissions', sortable: false },
    { key: 'id', label: 'ID', sortable: true },
  ];

  rowActions = createStandardRowActions<RoleDto>(
    (role) => this.service.onEditItem(role),
    (role) => this.service.onDeleteItem(role),
  );

  primaryAction: ToolbarAction = createPrimaryAction('New Role', () => this.service.onNewItem());

  bulkActions: ToolbarAction[] = createBulkActions();

  ngOnInit() {
    this.service.loadItems();
    this.service.loadPermissions();

    // Watch route params to open modal when ID is in URL
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        // Wait for roles to load if not already loaded
        if (this.service.items().length === 0) {
          // Roles will load and then this will trigger again
          return;
        }
        const role = this.service.items().find((r) => r.id === id);
        if (role) {
          this.service.editingItem.set(role);
          this.service.showModal.set(true);
        } else {
          // Role not found, navigate back to list
          this.router.navigate(['/roles']);
        }
      } else {
        // No ID in route, close modal if open
        if (this.service.showModal() && this.service.editingItem()) {
          this.service.showModal.set(false);
          this.service.editingItem.set(null);
        }
      }
    });
  }

  onBulkAction(action: ToolbarAction): void {
    if (action.label === 'Delete Selected') {
      this.service.onBulkDelete();
    }
  }

  // Format data for table display
  get tableData() {
    return this.service.getTableData().map((role) => ({
      ...role,
      permissionsCount: role.permissions?.length || 0,
    }));
  }
}
