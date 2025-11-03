import { signal, computed, Signal } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { ICrudService } from './crud.interface';
import { FormFieldMetadata, TableColumnMetadata } from '../models/form-metadata';

/**
 * Configuration options for BaseCrudService
 */
export interface CrudConfig {
  /**
   * Enable pagination functionality
   * @default false
   */
  enablePagination?: boolean;

  /**
   * Default page size when pagination is enabled
   * @default 10
   */
  defaultPageSize?: number;

  /**
   * Enable router navigation for edit mode (e.g., /items/:id)
   * @default false
   */
  enableRouterNavigation?: boolean;
}

/**
 * Base service for CRUD operations with common state management and logic
 * Implements ICrudService interface
 *
 * @template TDto - The data transfer object type for the entity (must have id: string)
 * @template TSaveDto - The DTO for create/update operations (defaults to TDto)
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class CompaniesListService extends BaseCrudService<CompanyDto, SaveCompanyDto> {
 *   constructor(private companyApi: CompanyApiService) {
 *     super({ enablePagination: true, enableRouterNavigation: true });
 *   }
 *
 *   protected loadAllItems(): Observable<CompanyDto[]> {
 *     return this.companyApi.getAllCompanies();
 *   }
 *
 *   saveItem(dto: SaveCompanyDto): Observable<CompanyDto> {
 *     return dto.id ? this.companyApi.updateCompany(dto) : this.companyApi.createCompany(dto);
 *   }
 *
 *   protected deleteItem(id: string): Observable<void> {
 *     return this.companyApi.deleteCompany(id);
 *   }
 *
 *   protected matchesSearch(item: CompanyDto, term: string): boolean {
 *     return item.name.toLowerCase().includes(term) ||
 *            item.id.toLowerCase().includes(term);
 *   }
 *
 *   getTableColumns(): TableColumnMetadata<CompanyDto>[] {
 *     return [
 *       { key: 'name', label: 'Name', sortable: true },
 *       { key: 'id', label: 'ID', sortable: true }
 *     ];
 *   }
 *
 *   getFormFields(): FormFieldMetadata[] {
 *     return [
 *       { key: 'name', label: 'Name', type: 'text', validators: [Validators.required] }
 *     ];
 *   }
 *
 *   getRouteBasePath(): string {
 *     return '/companies';
 *   }
 * }
 * ```
 */
export abstract class BaseCrudService<TDto extends { id: string }, TSaveDto = TDto>
  implements ICrudService<TDto, TSaveDto>
{
  // ==================== CONFIGURATION ====================
  protected config: Required<CrudConfig>;

  // ==================== STATE SIGNALS ====================
  /**
   * All items loaded from the API
   */
  items = signal<TDto[]>([]);

  /**
   * Loading state indicator
   */
  loading = signal<boolean>(false);

  /**
   * Show/hide form modal
   */
  showModal = signal<boolean>(false);

  /**
   * Currently editing item (null for create mode)
   */
  editingItem = signal<TDto | null>(null);

  /**
   * Show/hide delete confirmation modal
   */
  showDeleteConfirm = signal<boolean>(false);

  /**
   * Item to be deleted (for single delete)
   */
  deletingItem = signal<TDto | null>(null);

  /**
   * Search term for filtering
   */
  searchTerm = signal<string>('');

  /**
   * Set of selected item IDs
   */
  selectedItems = signal<Set<string>>(new Set());

  /**
   * Current page number (1-based)
   */
  currentPage = signal<number>(1);

  /**
   * Items per page
   */
  pageSize: Signal<number>;

  // ==================== COMPUTED SIGNALS ====================
  /**
   * Filtered items based on search term
   */
  filteredItems = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const allItems = this.items();

    if (!term) return allItems;

    return allItems.filter((item) => this.matchesSearch(item, term));
  });

  /**
   * Paginated items (if pagination is enabled)
   */
  paginatedItems = computed(() => {
    if (!this.config.enablePagination) {
      return this.filteredItems();
    }

    const filtered = this.filteredItems();
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return filtered.slice(start, end);
  });

  /**
   * Check if any items are selected
   */
  hasSelection = computed(() => this.selectedItems().size > 0);

  /**
   * Delete confirmation message
   */
  deleteMessage = computed(() => {
    const selectedCount = this.selectedItems().size;
    if (selectedCount > 0) {
      const itemName = this.getItemTypeName();
      return `Are you sure you want to delete ${selectedCount} ${selectedCount === 1 ? itemName : this.getItemTypePluralName()}? This action cannot be undone.`;
    }
    const item = this.deletingItem();
    if (!item) {
      return '';
    }
    return `Are you sure you want to delete <strong class="font-semibold">${this.getItemDisplayName(item)}</strong>? This action cannot be undone.`;
  });

  // ==================== CONSTRUCTOR ====================
  constructor(config: CrudConfig = {}) {
    this.config = {
      enablePagination: config.enablePagination ?? false,
      defaultPageSize: config.defaultPageSize ?? 10,
      enableRouterNavigation: config.enableRouterNavigation ?? false,
    };

    this.pageSize = signal(this.config.defaultPageSize);
  }

  // ==================== ABSTRACT METHODS ====================
  /**
   * Load all items from the API
   */
  abstract loadAllItems(): Observable<TDto[]>;

  /**
   * Save item (create if no id, update if has id)
   * Implement this to handle both create and update operations
   */
  abstract saveItem(dto: TSaveDto): Observable<TDto>;

  /**
   * Delete a single item by ID
   */
  abstract deleteItem(id: string): Observable<unknown>;

  /**
   * Check if an item matches the search term
   */
  abstract matchesSearch(item: TDto, term: string): boolean;

  /**
   * Get table columns configuration
   */
  abstract getTableColumns(): TableColumnMetadata<TDto>[];

  /**
   * Get form fields configuration
   */
  abstract getFormFields(): FormFieldMetadata[];

  /**
   * Get the singular name of the item type (e.g., "company", "role")
   */
  abstract getItemTypeName(): string;

  /**
   * Get the plural name of the item type (e.g., "companies", "roles")
   */
  abstract getItemTypePluralName(): string;

  /**
   * Get the display name for an item (used in delete confirmation)
   */
  abstract getItemDisplayName(item: TDto): string;

  /**
   * Get the route base path for router navigation (e.g., '/companies', '/roles')
   */
  abstract getRouteBasePath(): string;

  // ==================== OPTIONAL HOOKS ====================
  /**
   * Hook called when edit is triggered with router navigation
   * Override this to implement custom router navigation (e.g., /items/:id)
   * @param item - The item to edit
   */
  protected onEditWithRouter?(item: TDto): void;

  /**
   * Hook called after form is saved
   * Override this to implement custom navigation after save
   */
  protected onAfterFormSave?(): void;

  /**
   * Hook called after form is cancelled
   * Override this to implement custom navigation after cancel
   */
  protected onAfterFormCancel?(): void;

  // ==================== PUBLIC METHODS ====================
  /**
   * Load all items from the API
   */
  loadItems(): void {
    this.loading.set(true);
    this.loadAllItems().subscribe({
      next: (data) => {
        this.items.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error(`Error loading ${this.getItemTypePluralName()}:`, error);
        this.loading.set(false);
      },
    });
  }

  /**
   * Update search term
   */
  onSearch(term: string): void {
    this.searchTerm.set(term);
    if (this.config.enablePagination) {
      this.currentPage.set(1); // Reset to first page on search
    }
  }

  /**
   * Open modal for creating new item
   */
  onNewItem(): void {
    this.editingItem.set(null);
    this.showModal.set(true);
  }

  /**
   * Open modal for editing existing item
   */
  onEditItem(item: TDto): void {
    if (this.config.enableRouterNavigation) {
      // If router navigation is enabled and hook is defined, use it
      if (this.onEditWithRouter) {
        this.onEditWithRouter(item);
      }
      // Note: Component should handle router navigation and modal opening
    } else {
      // Otherwise, open modal directly
      this.editingItem.set(item);
      this.showModal.set(true);
    }
  }

  /**
   * Open modal for editing (used by generic component for router-based navigation)
   * This bypasses the router navigation and directly opens the modal
   */
  openEditModal(item: TDto): void {
    this.editingItem.set(item);
    this.showModal.set(true);
  }

  /**
   * Open delete confirmation for single item
   */
  onDeleteItem(item: TDto): void {
    this.deletingItem.set(item);
    this.showDeleteConfirm.set(true);
  }

  /**
   * Open delete confirmation for bulk delete
   */
  onBulkDelete(): void {
    this.showDeleteConfirm.set(true);
  }

  /**
   * Execute delete operation (single or bulk)
   */
  confirmDelete(): void {
    const selected = this.selectedItems();
    const singleItem = this.deletingItem();

    if (selected.size > 0) {
      // Bulk delete
      const deleteRequests = Array.from(selected).map((id) => this.deleteItem(id));

      forkJoin(deleteRequests).subscribe({
        next: () => {
          this.showDeleteConfirm.set(false);
          this.selectedItems.set(new Set());
          this.deletingItem.set(null);
          this.loadItems();
        },
        error: (error) => {
          console.error(`Error deleting ${this.getItemTypePluralName()}:`, error);
          this.showDeleteConfirm.set(false);
        },
      });
    } else if (singleItem) {
      // Single delete
      this.deleteItem(singleItem.id).subscribe({
        next: () => {
          this.showDeleteConfirm.set(false);
          this.deletingItem.set(null);
          this.loadItems();
        },
        error: (error) => {
          console.error(`Error deleting ${this.getItemTypeName()}:`, error);
          this.showDeleteConfirm.set(false);
        },
      });
    }
  }

  /**
   * Cancel delete operation
   */
  cancelDelete(): void {
    this.showDeleteConfirm.set(false);
    this.deletingItem.set(null);
  }

  /**
   * Handle form save (close modal and reload)
   */
  onFormSave(): void {
    this.showModal.set(false);
    this.editingItem.set(null);
    this.loadItems();

    // Call hook if defined
    if (this.onAfterFormSave) {
      this.onAfterFormSave();
    }
  }

  /**
   * Handle form cancel (close modal)
   */
  onFormCancel(): void {
    this.showModal.set(false);
    this.editingItem.set(null);

    // Call hook if defined
    if (this.onAfterFormCancel) {
      this.onAfterFormCancel();
    }
  }

  /**
   * Update selected items
   */
  onSelectionChange(selected: Set<string>): void {
    this.selectedItems.set(selected);
  }

  /**
   * Select all or deselect all
   */
  onSelectAll(selectAll: boolean): void {
    if (selectAll) {
      const allIds = new Set(this.filteredItems().map((item) => item.id));
      this.selectedItems.set(allIds);
    } else {
      this.selectedItems.set(new Set());
    }
  }

  /**
   * Change page (if pagination is enabled)
   */
  onPageChange(page: number): void {
    if (!this.config.enablePagination) return;

    this.currentPage.set(page);
    this.selectedItems.set(new Set()); // Reset selection on page change
  }

  /**
   * Get the items to display in the table
   */
  getTableData(): TDto[] {
    return this.config.enablePagination ? this.paginatedItems() : this.filteredItems();
  }
}
