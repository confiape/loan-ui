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

export interface DropdownItem {
  label: string;
  value: unknown;
  icon?: string;
  disabled?: boolean;
  divider?: boolean;
  group?: string;
}

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css',
})
export class DropdownComponent {
  // Inputs
  items = input.required<DropdownItem[]>();
  placeholder = input<string>('Select an option');
  disabled = input<boolean>(false);
  position = input<'bottom' | 'top' | 'auto'>('auto');
  variant = input<'primary' | 'secondary' | 'outline'>('outline');
  size = input<'sm' | 'md' | 'lg'>('md');
  searchable = input<boolean>(false);
  clearable = input<boolean>(false);
  loading = input<boolean>(false);

  // Outputs
  selectionChange = output<DropdownItem>();
  searchChange = output<string>();

  // State
  isOpen = signal(false);
  selectedItem = signal<DropdownItem | null>(null);
  searchQuery = signal('');
  highlightedIndex = signal(-1);

  // Computed
  buttonClass = computed(() => {
    const base = 'btn dropdown-toggle';
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
      if (item.divider) return false;
      return item.label.toLowerCase().includes(query);
    });
  });

  private elementRef = inject(ElementRef);

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
        event.preventDefault();
        this.selectHighlighted();
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
        const searchInput = this.elementRef.nativeElement.querySelector('.dropdown-search');
        searchInput?.focus();
      }, 50);
    }
  }

  close() {
    this.isOpen.set(false);
    this.searchQuery.set('');
    this.highlightedIndex.set(-1);
  }

  selectItem(item: DropdownItem) {
    if (item.disabled || item.divider) return;

    this.selectedItem.set(item);
    this.selectionChange.emit(item);
    this.close();
  }

  clearSelection(event: Event) {
    event.stopPropagation();
    this.selectedItem.set(null);
    this.selectionChange.emit(null as unknown as DropdownItem);
  }

  onSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
    this.searchChange.emit(value);
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

  private selectHighlighted() {
    const items = this.getSelectableItems();
    const index = this.highlightedIndex();

    if (index >= 0 && index < items.length) {
      this.selectItem(items[index]);
    }
  }

  private getSelectableItems(): DropdownItem[] {
    return this.filteredItems().filter((item) => !item.disabled && !item.divider);
  }

  private scrollToHighlighted() {
    setTimeout(() => {
      const highlighted = this.elementRef.nativeElement.querySelector('.dropdown-item.highlighted');
      highlighted?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }, 0);
  }

  isItemHighlighted(item: DropdownItem): boolean {
    const items = this.getSelectableItems();
    const itemIndex = items.indexOf(item);
    return itemIndex === this.highlightedIndex();
  }

  isItemSelected(item: DropdownItem): boolean {
    return this.selectedItem()?.value === item.value;
  }
}
