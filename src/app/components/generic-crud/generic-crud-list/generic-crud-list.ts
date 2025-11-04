import { Component, OnInit, inject, input, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { TableToolbarComponent, ToolbarAction } from '../../ui/table-toolbar/table-toolbar';
import { ModalComponent } from '../../ui/modal/modal';
import { TableComponent, TableColumn, TableRowAction } from '../../ui/table/table';
import { TablePaginationComponent } from '../../ui/table-pagination/table-pagination';
import { GenericCrudFormComponent } from '../generic-crud-form/generic-crud-form';
import { ICrudService } from '../../../core/services/crud.interface';
import { TableColumnMetadata } from '../../../core/models/form-metadata';
import {
  createStandardRowActions,
  createPrimaryAction,
  createBulkActions,
} from '../../../core/utils/crud-helpers';

/**
 * Generic CRUD list component
 * Displays a table with toolbar, pagination, and modal form
 *
 * @example
 * ```typescript
 * @Component({
 *   selector: 'app-companies-list',
 *   standalone: true,
 *   imports: [GenericCrudListComponent],
 *   providers: [CompaniesListService],
 *   template: `<app-generic-crud-list [service]="service" />`
 * })
 * export class CompaniesListComponent {
 *   service = inject(CompaniesListService);
 * }
 * ```
 */
@Component({
  selector: 'app-generic-crud-list',
  standalone: true,
  imports: [
    CommonModule,
    TableToolbarComponent,
    ModalComponent,
    GenericCrudFormComponent,
    TableComponent,
    TablePaginationComponent,
  ],
  templateUrl: './generic-crud-list.html',
})
export class GenericCrudListComponent<TDto extends { id: string }> implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Input: CRUD service (required)
  service = input.required<ICrudService<TDto, unknown>>();

  // Input: Test ID prefix for E2E testing (optional)
  testIdPrefix = input<string>('crud');

  // Table configuration
  columns: TableColumn<TDto>[] = [];
  rowActions: TableRowAction[] = [];
  primaryAction!: ToolbarAction;
  bulkActions: ToolbarAction[] = [];

  // Form state
  formLoading = false;
  formError: string | null = null;

  // Track current route param ID
  private currentRouteId = signal<string | null>(null);

  constructor() {
    // Watch for changes in items and route ID to open modal
    effect(() => {
      const items = this.service().items();
      const routeId = this.currentRouteId();
      const srv = this.service();

      if (routeId && items.length > 0) {
        const item = items.find((i) => i.id === routeId);
        if (item) {
          // Only open modal if not already showing this item
          const currentEditingId = srv.editingItem()?.id;
          const isModalOpen = srv.showModal();

          if (!isModalOpen || currentEditingId !== item.id) {
            // Use openEditModal to bypass router navigation and directly open modal
            srv.openEditModal(item);
          }
        } else {
          // Item not found, navigate back to list
          this.router.navigate([srv.getRouteBasePath()]);
        }
      } else if (!routeId) {
        // No ID in route, close modal if open
        if (srv.showModal() && srv.editingItem()) {
          srv.onFormCancel();
        }
      }
    });
  }

  ngOnInit(): void {
    this.setupTableConfig();
    this.service().loadItems();

    // Subscribe to route params and update signal
    this.route.params.subscribe((params) => {
      this.currentRouteId.set(params['id'] || null);
    });
  }

  /**
   * Setup table configuration from service metadata
   */
  private setupTableConfig(): void {
    const columnMetadata = this.service().getTableColumns();

    // Convert TableColumnMetadata to TableColumn
    this.columns = columnMetadata.map((col) => this.convertColumnMetadata(col));

    // Setup row actions
    this.rowActions = createStandardRowActions<TDto>(
      (item) => this.service().onEditItem(item),
      (item) => this.service().onDeleteItem(item),
    );

    // Setup toolbar actions
    const itemTypeName = this.service().getItemTypeName();
    this.primaryAction = createPrimaryAction(
      `New ${itemTypeName.charAt(0).toUpperCase() + itemTypeName.slice(1)}`,
      () => this.service().onNewItem(),
    );
    this.bulkActions = createBulkActions();
  }

  /**
   * Convert TableColumnMetadata to TableColumn
   */
  private convertColumnMetadata(metadata: TableColumnMetadata<TDto>): TableColumn<TDto> {
    const column: TableColumn<TDto> = {
      key: metadata.key,
      label: metadata.label,
      sortable: metadata.sortable,
    };

    // If valueGetter is provided, wrap it
    if (metadata.valueGetter) {
      column.customTemplate = (item: TDto) => {
        const value = metadata.valueGetter!(item);
        return metadata.formatter ? metadata.formatter(value) : String(value);
      };
    } else if (metadata.formatter) {
      column.customTemplate = (item: TDto) => {
        const value = item[metadata.key as keyof TDto];
        return metadata.formatter!(value);
      };
    }

    return column;
  }

  /**
   * Handle bulk action
   */
  onBulkAction(action: ToolbarAction): void {
    if (action.label === 'Delete Selected') {
      this.service().onBulkDelete();
    }
  }

  /**
   * Handle form save
   */
  onFormSave(dto: unknown): void {
    this.formLoading = true;
    this.formError = null;

    this.service()
      .saveItem(dto)
      .subscribe({
        next: () => {
          this.formLoading = false;
          this.service().onFormSave();
        },
        error: (error: unknown) => {
          console.error('Error saving item:', error);
          const errorObj = error as { error?: { message?: string } };
          this.formError = errorObj.error?.message || 'Failed to save. Please try again.';
          this.formLoading = false;
        },
      });
  }

  /**
   * Handle form cancel
   */
  onFormCancel(): void {
    this.formError = null;
    this.service().onFormCancel();
  }

  /**
   * Get modal title
   */
  get modalTitle(): string {
    const itemTypeName = this.service().getItemTypeName();
    const isEdit = this.service().editingItem() !== null;
    const capitalizedName = itemTypeName.charAt(0).toUpperCase() + itemTypeName.slice(1);
    return isEdit ? `Edit ${capitalizedName}` : `New ${capitalizedName}`;
  }
}
