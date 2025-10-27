import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableToolbarComponent, ToolbarAction, FilterOption } from '../table-toolbar/table-toolbar';
import { TableComponent, TableColumn, TableRowAction, SortState } from '../table/table';
import { TablePaginationComponent } from '../table-pagination/table-pagination';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, TableToolbarComponent, TableComponent, TablePaginationComponent],
  templateUrl: './data-table.html',
  styleUrl: './data-table.css',
})
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class DataTableComponent<T = any> {
  // ==================== INPUTS ====================
  // Data
  data = input.required<T[]>();
  columns = input.required<TableColumn<T>[]>();

  // Toolbar
  showToolbar = input<boolean>(true);
  searchPlaceholder = input<string>('Search');
  showSearch = input<boolean>(true);
  showActions = input<boolean>(true);
  showFilters = input<boolean>(true);
  primaryAction = input<ToolbarAction | null>(null);
  bulkActions = input<ToolbarAction[]>([]);
  filterGroups = input<{ label: string; options: FilterOption[] }[]>([]);

  // Table
  rowActions = input<TableRowAction[]>([]);
  striped = input<boolean>(false);
  hoverable = input<boolean>(true);
  bordered = input<boolean>(false);
  compact = input<boolean>(false);
  loading = input<boolean>(false);
  emptyMessage = input<string>('No data available');

  // Pagination
  showPagination = input<boolean>(true);
  pageSize = input<number>(10);
  showPaginationInfo = input<boolean>(true);
  showPageNumbers = input<boolean>(true);
  maxVisiblePages = input<number>(5);

  // ==================== OUTPUTS ====================
  searchChange = output<string>();
  primaryActionClick = output<void>();
  bulkActionClick = output<ToolbarAction>();
  filterChange = output<{ groupIndex: number; option: FilterOption }>();
  rowClick = output<T>();
  actionClick = output<{ action: TableRowAction; row: T }>();
  sortChange = output<SortState>();
  pageChange = output<number>();

  // ==================== STATE ====================
  currentPage = signal<number>(1);
  searchQuery = signal<string>('');
  sortState = signal<SortState>({ column: '', direction: null });

  // ==================== COMPUTED ====================
  filteredData = computed(() => {
    const data = this.data();
    const query = this.searchQuery().toLowerCase();

    if (!query) return data;

    return data.filter((row) => {
      return this.columns().some((column) => {
        const value = this.getNestedValue(row, column.key);
        return value?.toString().toLowerCase().includes(query);
      });
    });
  });

  sortedData = computed(() => {
    const data = [...this.filteredData()];
    const state = this.sortState();

    if (!state.column || !state.direction) return data;

    return data.sort((a, b) => {
      const aVal = this.getNestedValue(a, state.column);
      const bVal = this.getNestedValue(b, state.column);

      if (aVal === bVal) return 0;

      const comparison = (aVal as string | number) > (bVal as string | number) ? 1 : -1;
      return state.direction === 'asc' ? comparison : -comparison;
    });
  });

  paginatedData = computed(() => {
    if (!this.showPagination()) return this.sortedData();

    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return this.sortedData().slice(start, end);
  });

  totalItems = computed(() => this.filteredData().length);

  // ==================== METHODS ====================
  onSearchChange(query: string): void {
    this.searchQuery.set(query);
    this.currentPage.set(1); // Reset to first page on search
    this.searchChange.emit(query);
  }

  onPrimaryActionClick(): void {
    this.primaryActionClick.emit();
  }

  onBulkActionClick(action: ToolbarAction): void {
    this.bulkActionClick.emit(action);
  }

  onFilterChange(event: { groupIndex: number; option: FilterOption }): void {
    this.filterChange.emit(event);
  }

  onRowClick(row: T): void {
    this.rowClick.emit(row);
  }

  onActionClick(event: { action: TableRowAction; row: T }): void {
    this.actionClick.emit(event);
  }

  onSortChange(state: SortState): void {
    this.sortState.set(state);
    this.sortChange.emit(state);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.pageChange.emit(page);
  }

  private getNestedValue(obj: T, path: string): unknown {
    return path.split('.').reduce((acc: unknown, part: string) => {
      if (acc && typeof acc === 'object' && part in acc) {
        return (acc as Record<string, unknown>)[part];
      }
      return undefined;
    }, obj as unknown);
  }
}
