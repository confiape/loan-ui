import { Component, input, output, signal, computed, effect } from '@angular/core';
import { NgClass } from '@angular/common';

export interface SidenavItem {
  label: string;
  icon?: string;
  value: string;
  badge?: string | number;
  children?: SidenavItem[];
  disabled?: boolean;
  divider?: boolean;
}

export type SidenavPosition = 'left' | 'right';
export type SidenavVariant = 'default' | 'bordered' | 'pills';

@Component({
  selector: 'app-sidenav',
  imports: [NgClass],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.css',
  standalone: true,
})
export class SidenavComponent {
  // Inputs
  items = input<SidenavItem[]>([]);
  position = input<SidenavPosition>('left');
  variant = input<SidenavVariant>('default');
  collapsed = input<boolean>(false);
  collapsible = input<boolean>(false);
  showToggle = input<boolean>(true);
  width = input<string>('16rem'); // 256px
  collapsedWidth = input<string>('4rem'); // 64px
  header = input<string>('');
  footer = input<string>('');
  selectedValue = input<string>('');
  logo = input<string>('');
  logoCollapsed = input<string>('');

  // Outputs
  itemClick = output<SidenavItem>();
  toggleChange = output<boolean>();
  selectionChange = output<SidenavItem>();

  // State
  isCollapsed = signal(false);
  expandedItems = signal<Set<string>>(new Set());
  hoveredItem = signal<string | null>(null);
  selectedItem = signal<string>('');

  // Computed
  currentWidth = computed(() => {
    return this.isCollapsed() ? this.collapsedWidth() : this.width();
  });

  sidenavClasses = computed(() => {
    const classes = ['sidenav'];
    classes.push(`sidenav-${this.position()}`, `sidenav-variant-${this.variant()}`);
    if (this.isCollapsed()) {
      classes.push('sidenav-collapsed');
    }
    return classes.join(' ');
  });

  constructor() {
    // Sync collapsed state from input
    effect(() => {
      this.isCollapsed.set(this.collapsed());
    });

    // Sync selected value from input
    effect(() => {
      this.selectedItem.set(this.selectedValue());
    });
  }

  // Methods
  toggleCollapse(): void {
    if (!this.collapsible()) return;

    const newState = !this.isCollapsed();
    this.isCollapsed.set(newState);
    this.toggleChange.emit(newState);

    // Collapse all expanded items when collapsing sidenav
    if (newState) {
      this.expandedItems.set(new Set());
    }
  }

  onItemClick(item: SidenavItem, event: Event): void {
    if (item.disabled) {
      event.preventDefault();
      return;
    }

    // If item has children, toggle expansion instead
    if (item.children && item.children.length > 0) {
      event.preventDefault();
      this.toggleItemExpansion(item.value);
      return;
    }

    this.selectedItem.set(item.value);
    this.itemClick.emit(item);
    this.selectionChange.emit(item);
  }

  toggleItemExpansion(value: string): void {
    const expanded = this.expandedItems();
    const newExpanded = new Set(expanded);

    if (newExpanded.has(value)) {
      newExpanded.delete(value);
    } else {
      newExpanded.add(value);
    }

    this.expandedItems.set(newExpanded);
  }

  isItemExpanded(value: string): boolean {
    return this.expandedItems().has(value);
  }

  isItemSelected(value: string): boolean {
    return this.selectedItem() === value;
  }

  isItemHovered(value: string): boolean {
    return this.hoveredItem() === value;
  }

  onItemMouseEnter(value: string): void {
    this.hoveredItem.set(value);
  }

  onItemMouseLeave(): void {
    this.hoveredItem.set(null);
  }

  getItemClasses(item: SidenavItem): string {
    const classes = ['sidenav-item'];

    if (this.isItemSelected(item.value)) {
      classes.push('sidenav-item-active');
    }

    if (item.disabled) {
      classes.push('sidenav-item-disabled');
    }

    if (item.children && item.children.length > 0) {
      classes.push('sidenav-item-parent');
    }

    return classes.join(' ');
  }

  getChildItemClasses(item: SidenavItem): string {
    const classes = ['sidenav-item', 'sidenav-item-child'];

    if (this.isItemSelected(item.value)) {
      classes.push('sidenav-item-active');
    }

    if (item.disabled) {
      classes.push('sidenav-item-disabled');
    }

    return classes.join(' ');
  }

  // Keyboard navigation
  onKeyDown(event: KeyboardEvent, item: SidenavItem): void {
    if (item.disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.onItemClick(item, event);
        break;
      case 'ArrowRight':
        if (item.children && item.children.length > 0 && !this.isItemExpanded(item.value)) {
          event.preventDefault();
          this.toggleItemExpansion(item.value);
        }
        break;
      case 'ArrowLeft':
        if (item.children && item.children.length > 0 && this.isItemExpanded(item.value)) {
          event.preventDefault();
          this.toggleItemExpansion(item.value);
        }
        break;
    }
  }
}
