import {
  Component,
  input,
  output,
  signal,
  computed,
  HostListener,
  ElementRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface MultiSelectItem {
  label: string;
  value: unknown;
  icon?: string;
  disabled?: boolean;
  group?: string;
}

@Component({
  selector: 'app-multiselect',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './multiselect.html',
  styleUrl: './multiselect.css',
})
export class MultiSelectComponent {
  // Inputs
  items = input.required<MultiSelectItem[]>();
  placeholder = input<string>('Select options');
  disabled = input<boolean>(false);
  maxSelections = input<number | null>(null);
  showCheckboxes = input<boolean>(true);
  showSelectAll = input<boolean>(true);
  searchable = input<boolean>(true);
  showBadges = input<boolean>(true);
  variant = input<'primary' | 'secondary' | 'outline'>('outline');
  size = input<'sm' | 'md' | 'lg'>('md');
  position = input<'bottom' | 'top' | 'auto'>('auto');
  loading = input<boolean>(false);
  clearable = input<boolean>(true);

  // Outputs
  selectionChange = output<MultiSelectItem[]>();
  searchChange = output<string>();

  // State
  isOpen = signal(false);
  selectedItems = signal<MultiSelectItem[]>([]);
  searchQuery = signal('');
  highlightedIndex = signal(-1);

  // Computed
  buttonClass = computed(() => {
    const base = 'btn multiselect-toggle';
    const variantClass =
      this.variant() === 'outline' ? 'btn-outline-primary' : `btn-${this.variant()}`;
    const sizeClass = `btn-${this.size()}`;
    const openClass = this.isOpen() ? 'active' : '';
    return `${base} ${variantClass} ${sizeClass} ${openClass}`;
  });

  filteredItems = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.items();

    return this.items().filter((item) => {
      return item.label.toLowerCase().includes(query);
    });
  });

  displayText = computed(() => {
    const count = this.selectedItems().length;
    if (count === 0) {
      return this.placeholder();
    }
    if (count === 1) {
      return this.selectedItems()[0].label;
    }
    return `${count} selected`;
  });

  isAllSelected = computed(() => {
    const selectableItems = this.items().filter((item) => !item.disabled);
    return selectableItems.length > 0 && this.selectedItems().length === selectableItems.length;
  });

  statsText = computed(() => {
    const selected = this.selectedItems().length;
    const total = this.items().length;
    const shown = this.filteredItems().length;

    if (shown === total) {
      return `${selected} of ${total} selected`;
    }
    return `${selected} of ${total} selected (${shown} shown)`;
  });

  private readonly elementRef = inject(ElementRef);

  // Click outside to close
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside && this.isOpen()) {
      this.close();
    }
  }

  // Keyboard navigation
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (!this.isOpen()) {
      // Open dropdown with Enter or Space
      if (
        (event.key === 'Enter' || event.key === ' ') &&
        this.elementRef.nativeElement.contains(event.target)
      ) {
        event.preventDefault();
        this.open();
      }
      return;
    }

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        this.close();
        break;

      case 'ArrowDown':
        event.preventDefault();
        this.highlightNext();
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.highlightPrevious();
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        this.toggleHighlighted();
        break;

      case 'Home':
        event.preventDefault();
        this.highlightFirst();
        break;

      case 'End':
        event.preventDefault();
        this.highlightLast();
        break;
    }
  }

  toggle() {
    if (this.disabled() || this.loading()) return;
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    if (this.disabled() || this.loading()) return;
    this.isOpen.set(true);
    this.highlightedIndex.set(-1);

    // Focus search input if searchable
    if (this.searchable()) {
      setTimeout(() => {
        const searchInput = this.elementRef.nativeElement.querySelector('.multiselect-search');
        searchInput?.focus();
      }, 50);
    }
  }

  close() {
    this.isOpen.set(false);
    this.searchQuery.set('');
    this.highlightedIndex.set(-1);
  }

  toggleItem(item: MultiSelectItem, event?: Event) {
    if (event) {
      event.stopPropagation();
    }

    if (item.disabled) return;

    const currentSelections = this.selectedItems();
    const index = currentSelections.findIndex((i) => i.value === item.value);

    if (index > -1) {
      // Remove item
      const newSelections = currentSelections.filter((i) => i.value !== item.value);
      this.selectedItems.set(newSelections);
      this.selectionChange.emit(newSelections);
    } else {
      // Add item (check max selections)
      const max = this.maxSelections();
      if (max === null || currentSelections.length < max) {
        const newSelections = [...currentSelections, item];
        this.selectedItems.set(newSelections);
        this.selectionChange.emit(newSelections);
      }
    }
  }

  removeBadge(item: MultiSelectItem, event: Event) {
    event.stopPropagation();
    this.toggleItem(item);
  }

  isSelected(item: MultiSelectItem): boolean {
    return this.selectedItems().some((i) => i.value === item.value);
  }

  selectAll() {
    const selectableItems = this.filteredItems().filter((item) => !item.disabled);
    const max = this.maxSelections();

    const itemsToSelect = max === null ? selectableItems : selectableItems.slice(0, max);

    this.selectedItems.set(itemsToSelect);
    this.selectionChange.emit(itemsToSelect);
  }

  clearAll() {
    this.selectedItems.set([]);
    this.selectionChange.emit([]);
  }

  onSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
    this.searchChange.emit(value);
    this.highlightedIndex.set(-1);
  }

  clearSearch() {
    this.searchQuery.set('');
    this.highlightedIndex.set(-1);
  }

  // Keyboard navigation helpers
  private highlightNext() {
    const items = this.getSelectableItems();
    if (items.length === 0) return;

    let newIndex = this.highlightedIndex() + 1;
    if (newIndex >= items.length) newIndex = 0;

    this.highlightedIndex.set(newIndex);
    this.scrollToHighlighted();
  }

  private highlightPrevious() {
    const items = this.getSelectableItems();
    if (items.length === 0) return;

    let newIndex = this.highlightedIndex() - 1;
    if (newIndex < 0) newIndex = items.length - 1;

    this.highlightedIndex.set(newIndex);
    this.scrollToHighlighted();
  }

  private highlightFirst() {
    const items = this.getSelectableItems();
    if (items.length > 0) {
      this.highlightedIndex.set(0);
      this.scrollToHighlighted();
    }
  }

  private highlightLast() {
    const items = this.getSelectableItems();
    if (items.length > 0) {
      this.highlightedIndex.set(items.length - 1);
      this.scrollToHighlighted();
    }
  }

  private toggleHighlighted() {
    const items = this.getSelectableItems();
    const index = this.highlightedIndex();

    if (index >= 0 && index < items.length) {
      this.toggleItem(items[index]);
    }
  }

  private getSelectableItems(): MultiSelectItem[] {
    return this.filteredItems().filter((item) => !item.disabled);
  }

  private scrollToHighlighted() {
    setTimeout(() => {
      const highlighted = this.elementRef.nativeElement.querySelector(
        '.multiselect-item.highlighted',
      );
      highlighted?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }, 0);
  }

  isItemHighlighted(item: MultiSelectItem): boolean {
    const items = this.getSelectableItems();
    const itemIndex = items.indexOf(item);
    return itemIndex === this.highlightedIndex();
  }
}
