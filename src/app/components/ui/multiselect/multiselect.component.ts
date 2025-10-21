import { Component, input, output, signal, effect, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface MultiSelectItem {
  label: string;
  value: any;
  disabled?: boolean;
}

@Component({
  selector: 'app-multiselect',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './multiselect.component.html',
  styleUrl: './multiselect.component.css'
})
export class MultiSelectComponent {
  // Inputs
  items = input.required<MultiSelectItem[]>();
  placeholder = input<string>('Select options');
  disabled = input<boolean>(false);
  maxSelections = input<number | null>(null);
  showCheckboxes = input<boolean>(true);
  showSelectAll = input<boolean>(true);

  // Outputs
  selectionChange = output<MultiSelectItem[]>();

  // State
  isOpen = signal(false);
  selectedItems = signal<MultiSelectItem[]>([]);

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

  toggle() {
    if (!this.disabled()) {
      this.isOpen.update(value => !value);
    }
  }

  toggleItem(item: MultiSelectItem, event: Event) {
    event.stopPropagation();

    if (item.disabled) {
      return;
    }

    const currentSelections = this.selectedItems();
    const index = currentSelections.findIndex(i => i.value === item.value);

    if (index > -1) {
      // Remove item
      const newSelections = currentSelections.filter(i => i.value !== item.value);
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

  isSelected(item: MultiSelectItem): boolean {
    return this.selectedItems().some(i => i.value === item.value);
  }

  selectAll() {
    const selectableItems = this.items().filter(item => !item.disabled);
    const max = this.maxSelections();

    const itemsToSelect = max === null
      ? selectableItems
      : selectableItems.slice(0, max);

    this.selectedItems.set(itemsToSelect);
    this.selectionChange.emit(itemsToSelect);
  }

  clearAll() {
    this.selectedItems.set([]);
    this.selectionChange.emit([]);
  }

  get displayText(): string {
    const count = this.selectedItems().length;
    if (count === 0) {
      return this.placeholder();
    }
    if (count === 1) {
      return this.selectedItems()[0].label;
    }
    return `${count} selected`;
  }

  get isAllSelected(): boolean {
    const selectableItems = this.items().filter(item => !item.disabled);
    return selectableItems.length > 0 &&
           this.selectedItems().length === selectableItems.length;
  }
}
