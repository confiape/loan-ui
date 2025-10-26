import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  variant?: 'default' | 'danger';
  onClick?: (row: any) => void;
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
export class TableComponent<T = any> {
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

  // ==================== OUTPUTS ====================
  rowClick = output<T>();
  actionClick = output<{ action: TableRowAction; row: T }>();
  sortChange = output<SortState>();

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

      const comparison = aVal > bVal ? 1 : -1;
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

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => acc?.[part], obj);
  }

  getSortIcon(column: TableColumn<T>): string {
    if (!column.sortable) return '';

    const state = this.sortState();
    if (state.column !== column.key) return 'sort';

    return state.direction === 'asc' ? 'sort-asc' : 'sort-desc';
  }
}
