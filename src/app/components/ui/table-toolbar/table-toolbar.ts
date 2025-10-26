import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface ToolbarAction {
  label: string;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  onClick?: () => void;
}

export interface FilterOption {
  id: string;
  label: string;
  count?: number;
  checked?: boolean;
}

@Component({
  selector: 'app-table-toolbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './table-toolbar.html',
  styleUrl: './table-toolbar.css',
})
export class TableToolbarComponent {
  // ==================== INPUTS ====================
  searchPlaceholder = input<string>('Search');
  showSearch = input<boolean>(true);
  showActions = input<boolean>(true);
  showFilters = input<boolean>(true);
  primaryAction = input<ToolbarAction | null>(null);
  bulkActions = input<ToolbarAction[]>([]);
  filterGroups = input<{ label: string; options: FilterOption[] }[]>([]);

  // ==================== OUTPUTS ====================
  searchChange = output<string>();
  primaryActionClick = output<void>();
  bulkActionClick = output<ToolbarAction>();
  filterChange = output<{ groupIndex: number; option: FilterOption }>();

  // ==================== METHODS ====================
  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchChange.emit(value);
  }

  onPrimaryActionClick(): void {
    const action = this.primaryAction();
    if (action?.onClick) {
      action.onClick();
    }
    this.primaryActionClick.emit();
  }

  onBulkActionClick(action: ToolbarAction): void {
    if (action.onClick) {
      action.onClick();
    }
    this.bulkActionClick.emit(action);
  }

  onFilterOptionChange(groupIndex: number, option: FilterOption): void {
    this.filterChange.emit({ groupIndex, option });
  }
}
