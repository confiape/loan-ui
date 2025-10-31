import { Component, input, output, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface TableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  customTemplate?: (row: T) => string;
}

export interface TableRowAction {
  label: string;
  icon?: string;
  variant?: 'default' | 'danger' | 'secondary';
  onClick?: (row: unknown) => void;
  inline?: boolean; // If true, show as button instead of in dropdown
}

export type SortDirection = 'asc' | 'desc' | null;

export interface SortState {
  column: string;
  direction: SortDirection;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.html',
  styleUrl: './table.css',
})
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class TableComponent<T = any> {
  private sanitizer = inject(DomSanitizer);

  // ==================== INPUTS ====================
  columns = input.required<TableColumn<T>[]>();
  data = input.required<T[]>();
  rowActions = input<TableRowAction[]>([]);
  striped = input<boolean>(false);
  hoverable = input<boolean>(true);
  bordered = input<boolean>(false);
  compact = input<boolean>(false);
  loading = input<boolean>(false);
  emptyMessage = input<string>('No data available');

  // Selection inputs
  selectable = input<boolean>(false);
  selectedItems = input<Set<string>>(new Set());
  rowIdKey = input<string>('id'); // Key to use for row identification

  // ==================== OUTPUTS ====================
  rowClick = output<T>();
  actionClick = output<{ action: TableRowAction; row: T }>();
  sortChange = output<SortState>();
  selectionChange = output<Set<string>>();
  selectAll = output<boolean>();

  // ==================== STATE ====================
  sortState = signal<SortState>({ column: '', direction: null });

  // ==================== COMPUTED ====================
  sortedData = computed(() => {
    const state = this.sortState();
    const data = [...this.data()];

    if (!state.column || !state.direction) {
      return data;
    }

    return data.sort((a, b) => {
      const aVal = this.getNestedValue(a, state.column);
      const bVal = this.getNestedValue(b, state.column);

      if (aVal === bVal) return 0;

      const comparison = (aVal as string | number) > (bVal as string | number) ? 1 : -1;
      return state.direction === 'asc' ? comparison : -comparison;
    });
  });

  // ==================== METHODS ====================
  onSort(column: TableColumn<T>): void {
    if (!column.sortable) return;

    const currentState = this.sortState();
    let newDirection: SortDirection = 'asc';

    if (currentState.column === column.key) {
      if (currentState.direction === 'asc') {
        newDirection = 'desc';
      } else if (currentState.direction === 'desc') {
        newDirection = null;
      }
    }

    const newState: SortState = {
      column: newDirection ? column.key : '',
      direction: newDirection,
    };

    this.sortState.set(newState);
    this.sortChange.emit(newState);
  }

  onRowClick(row: T): void {
    this.rowClick.emit(row);
  }

  onActionClick(action: TableRowAction, row: T): void {
    if (action.onClick) {
      action.onClick(row);
    }
    this.actionClick.emit({ action, row });
  }

  getCellValue(row: T, column: TableColumn<T>): string {
    if (column.customTemplate) {
      return column.customTemplate(row);
    }
    return this.getNestedValue(row, column.key)?.toString() ?? '';
  }

  private getNestedValue(obj: T, path: string): unknown {
    return path.split('.').reduce((acc: unknown, part: string) => {
      if (acc && typeof acc === 'object' && part in acc) {
        return (acc as Record<string, unknown>)[part];
      }
      return undefined;
    }, obj as unknown);
  }

  getSortIcon(column: TableColumn<T>): string {
    if (!column.sortable) return '';

    const state = this.sortState();
    if (state.column !== column.key) return 'sort';

    return state.direction === 'asc' ? 'sort-asc' : 'sort-desc';
  }

  // ==================== SELECTION METHODS ====================
  isSelected(row: T): boolean {
    const id = this.getRowId(row);
    return this.selectedItems().has(id);
  }

  isAllSelected(): boolean {
    const items = this.sortedData();
    if (items.length === 0) return false;
    return items.every((row) => this.isSelected(row));
  }

  isIndeterminate(): boolean {
    const items = this.sortedData();
    const selectedCount = items.filter((row) => this.isSelected(row)).length;
    return selectedCount > 0 && selectedCount < items.length;
  }

  onSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.selectAll.emit(checked);
  }

  onSelectRow(row: T, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const id = this.getRowId(row);
    const selected = new Set(this.selectedItems());

    if (checked) {
      selected.add(id);
    } else {
      selected.delete(id);
    }

    this.selectionChange.emit(selected);
  }

  private getRowId(row: T): string {
    const key = this.rowIdKey();
    return this.getNestedValue(row, key)?.toString() ?? '';
  }

  // ==================== ACTION METHODS ====================
  getInlineActions(): TableRowAction[] {
    return this.rowActions().filter((action) => action.inline);
  }

  getDropdownActions(): TableRowAction[] {
    return this.rowActions().filter((action) => !action.inline);
  }

  hasInlineActions(): boolean {
    return this.getInlineActions().length > 0;
  }

  hasDropdownActions(): boolean {
    return this.getDropdownActions().length > 0;
  }

  getActionButtonClass(action: TableRowAction): string {
    const baseClass = 'btn btn-xs';

    switch (action.variant) {
      case 'danger':
        return `${baseClass} btn-outline-error`;
      case 'secondary':
        return `${baseClass} btn-secondary`;
      default:
        return `${baseClass} btn-secondary`;
    }
  }

  getSafeIcon(icon?: string): SafeHtml | null {
    if (!icon) return null;
    return this.sanitizer.bypassSecurityTrustHtml(icon);
  }
}
