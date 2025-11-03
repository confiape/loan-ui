import { Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { FormFieldMetadata, TableColumnMetadata } from '../models/form-metadata';

/**
 * Generic CRUD service interface
 * Implement this interface to create a CRUD service for any entity
 *
 * @template TDto - The entity DTO type (must have id: string)
 * @template TSaveDto - The DTO for create/update operations (defaults to TDto)
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class CompaniesService implements ICrudService<CompanyDto, SaveCompanyDto> {
 *   constructor(private companyApi: CompanyApiService, private router: Router) {}
 *
 *   loadAllItems(): Observable<CompanyDto[]> {
 *     return this.companyApi.getAllCompanies();
 *   }
 *
 *   saveItem(dto: SaveCompanyDto): Observable<CompanyDto> {
 *     return dto.id ? this.companyApi.updateCompany(dto) : this.companyApi.createCompany(dto);
 *   }
 *
 *   // ... implement other methods
 * }
 * ```
 */
export interface ICrudService<TDto extends { id: string }, TSaveDto = TDto> {
  // ==================== STATE SIGNALS ====================
  /**
   * All items loaded from API
   */
  items: Signal<TDto[]>;

  /**
   * Loading state indicator
   */
  loading: Signal<boolean>;

  /**
   * Show/hide form modal
   */
  showModal: Signal<boolean>;

  /**
   * Currently editing item (null for create mode)
   */
  editingItem: Signal<TDto | null>;

  /**
   * Show/hide delete confirmation modal
   */
  showDeleteConfirm: Signal<boolean>;

  /**
   * Search term for filtering
   */
  searchTerm: Signal<string>;

  /**
   * Set of selected item IDs
   */
  selectedItems: Signal<Set<string>>;

  /**
   * Current page number (1-based, if pagination enabled)
   */
  currentPage: Signal<number>;

  /**
   * Items per page (if pagination enabled)
   */
  pageSize: Signal<number>;

  // ==================== COMPUTED SIGNALS ====================
  /**
   * Filtered items based on search term
   */
  filteredItems: Signal<TDto[]>;

  /**
   * Check if any items are selected
   */
  hasSelection: Signal<boolean>;

  /**
   * Delete confirmation message
   */
  deleteMessage: Signal<string>;

  // ==================== DATA OPERATIONS (IMPLEMENT THESE) ====================
  /**
   * Load all items from the API
   */
  loadAllItems(): Observable<TDto[]>;

  /**
   * Save item (create if no id, update if has id)
   */
  saveItem(dto: TSaveDto): Observable<TDto>;

  /**
   * Delete a single item by ID
   */
  deleteItem(id: string): Observable<unknown>;

  /**
   * Check if an item matches the search term
   */
  matchesSearch(item: TDto, term: string): boolean;

  // ==================== METADATA (IMPLEMENT THESE) ====================
  /**
   * Get table columns configuration
   */
  getTableColumns(): TableColumnMetadata<TDto>[];

  /**
   * Get form fields configuration
   */
  getFormFields(): FormFieldMetadata[];

  /**
   * Get the singular name of the item type (e.g., "company", "role")
   */
  getItemTypeName(): string;

  /**
   * Get the plural name of the item type (e.g., "companies", "roles")
   */
  getItemTypePluralName(): string;

  /**
   * Get the display name for an item (used in delete confirmation)
   */
  getItemDisplayName(item: TDto): string;

  /**
   * Get the route base path for router navigation (e.g., '/companies', '/roles')
   */
  getRouteBasePath(): string;

  // ==================== PUBLIC METHODS (USE THESE IN COMPONENTS) ====================
  /**
   * Load all items from the API
   */
  loadItems(): void;

  /**
   * Update search term
   */
  onSearch(term: string): void;

  /**
   * Open modal for creating new item
   */
  onNewItem(): void;

  /**
   * Open modal for editing existing item
   */
  onEditItem(item: TDto): void;

  /**
   * Open modal for editing (bypasses router navigation)
   */
  openEditModal(item: TDto): void;

  /**
   * Open delete confirmation for single item
   */
  onDeleteItem(item: TDto): void;

  /**
   * Open delete confirmation for bulk delete
   */
  onBulkDelete(): void;

  /**
   * Execute delete operation (single or bulk)
   */
  confirmDelete(): void;

  /**
   * Cancel delete operation
   */
  cancelDelete(): void;

  /**
   * Handle form save (close modal and reload)
   */
  onFormSave(): void;

  /**
   * Handle form cancel (close modal)
   */
  onFormCancel(): void;

  /**
   * Update selected items
   */
  onSelectionChange(selected: Set<string>): void;

  /**
   * Select all or deselect all
   */
  onSelectAll(selectAll: boolean): void;

  /**
   * Change page (if pagination is enabled)
   */
  onPageChange(page: number): void;

  /**
   * Get the items to display in the table
   */
  getTableData(): TDto[];
}
