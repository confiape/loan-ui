import { TableRowAction, TableColumn } from '../../components/ui/table/table';
import { ToolbarAction } from '../../components/ui/table-toolbar/table-toolbar';

/**
 * Icon library for common CRUD actions
 */
export const CrudIcons = {
  /**
   * Plus icon for create actions
   */
  add: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>',

  /**
   * Pencil icon for edit actions
   */
  edit: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>',

  /**
   * Trash icon for delete actions
   */
  delete:
    '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>',

  /**
   * Eye icon for view actions
   */
  view: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>',
};

/**
 * Create standard row actions for CRUD tables
 *
 * @param onEdit - Callback when edit is clicked
 * @param onDelete - Callback when delete is clicked
 * @param options - Optional configuration
 * @returns Array of TableRowAction
 *
 * @example
 * ```typescript
 * rowActions = createStandardRowActions(
 *   (item) => this.onEdit(item),
 *   (item) => this.onDelete(item)
 * );
 * ```
 */
export function createStandardRowActions<T>(
  onEdit: (item: T) => void,
  onDelete: (item: T) => void,
  options: {
    showEditIcon?: boolean;
    showDeleteIcon?: boolean;
    editLabel?: string;
    deleteLabel?: string;
  } = {},
): TableRowAction[] {
  return [
    {
      label: options.editLabel ?? 'Edit',
      icon: options.showEditIcon !== false ? CrudIcons.edit : undefined,
      variant: 'secondary',
      inline: true,
      onClick: (row) => onEdit(row as T),
    },
    {
      label: options.deleteLabel ?? 'Delete',
      icon: options.showDeleteIcon !== false ? CrudIcons.delete : undefined,
      variant: 'danger',
      inline: true,
      onClick: (row) => onDelete(row as T),
    },
  ];
}

/**
 * Create a primary toolbar action for creating new items
 *
 * @param label - Button label (e.g., "New Company")
 * @param onClick - Callback when clicked
 * @param showIcon - Whether to show the add icon
 * @returns ToolbarAction
 *
 * @example
 * ```typescript
 * primaryAction = createPrimaryAction('New Company', () => this.onNew());
 * ```
 */
export function createPrimaryAction(
  label: string,
  onClick: () => void,
  showIcon = true,
): ToolbarAction {
  return {
    label,
    icon: showIcon ? CrudIcons.add : undefined,
    variant: 'primary',
    onClick,
  };
}

/**
 * Create standard bulk actions (currently just delete)
 *
 * @param deleteLabel - Label for delete action (default: "Delete Selected")
 * @param showIcon - Whether to show the delete icon
 * @returns Array of ToolbarAction
 *
 * @example
 * ```typescript
 * bulkActions = createBulkActions();
 * ```
 */
export function createBulkActions(
  deleteLabel = 'Delete Selected',
  showIcon = true,
): ToolbarAction[] {
  return [
    {
      label: deleteLabel,
      icon: showIcon ? CrudIcons.delete : undefined,
      variant: 'outline',
    },
  ];
}

/**
 * Create a column with ID formatting (monospace font)
 *
 * @param label - Column label (default: "ID")
 * @param key - Object key (default: "id")
 * @param sortable - Whether the column is sortable
 * @returns TableColumn
 *
 * @example
 * ```typescript
 * columns = [
 *   { key: 'name', label: 'Name', sortable: true },
 *   createIdColumn(),
 * ];
 * ```
 */
export function createIdColumn<T>(label = 'ID', key = 'id', sortable = true): TableColumn<T> {
  return {
    key,
    label,
    sortable,
    customTemplate: (row) =>
      `<span class="font-mono">${(row as Record<string, unknown>)[key]}</span>`,
  };
}

/**
 * Helper to create a delete confirmation message
 *
 * @param selectedCount - Number of selected items
 * @param itemName - Singular name of the item type (e.g., "company")
 * @param pluralName - Plural name of the item type (e.g., "companies")
 * @param singleItemName - Name of the single item being deleted
 * @returns Formatted message string
 *
 * @example
 * ```typescript
 * get deleteMessage() {
 *   return createDeleteMessage(
 *     this.selectedItems.size,
 *     'company',
 *     'companies',
 *     this.deletingItem()?.name
 *   );
 * }
 * ```
 */
export function createDeleteMessage(
  selectedCount: number,
  itemName: string,
  pluralName: string,
  singleItemName?: string,
): string {
  if (selectedCount > 0) {
    const name = selectedCount === 1 ? itemName : pluralName;
    return `Are you sure you want to delete ${selectedCount} ${name}? This action cannot be undone.`;
  }
  return `Are you sure you want to delete <strong class="font-semibold">${singleItemName}</strong>? This action cannot be undone.`;
}
