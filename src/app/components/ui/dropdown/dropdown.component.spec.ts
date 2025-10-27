import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DropdownComponent, DropdownItem } from './dropdown';

describe('DropdownComponent', () => {
  let component: DropdownComponent;
  let fixture: ComponentFixture<DropdownComponent>;
  let compiled: HTMLElement;

  const mockItems: DropdownItem[] = [
    { label: 'Option 1', value: 1 },
    { label: 'Option 2', value: 2 },
    { label: 'Option 3', value: 3 },
  ];

  const mockItemsWithIcons: DropdownItem[] = [
    { label: 'Home', value: 'home', icon: '🏠' },
    { label: 'Profile', value: 'profile', icon: '👤' },
    { label: 'Settings', value: 'settings', icon: '⚙️' },
  ];

  const mockItemsWithDisabled: DropdownItem[] = [
    { label: 'Enabled 1', value: 1, disabled: false },
    { label: 'Disabled', value: 2, disabled: true },
    { label: 'Enabled 2', value: 3, disabled: false },
  ];

  const mockItemsWithDividers: DropdownItem[] = [
    { label: 'Item 1', value: 1 },
    { label: 'divider', value: 'div1', divider: true },
    { label: 'Item 2', value: 2 },
  ];

  beforeEach(async () => {
    // Mock scrollIntoView for jsdom compatibility
    Element.prototype.scrollIntoView = vi.fn();

    await TestBed.configureTestingModule({
      imports: [DropdownComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(DropdownComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have default values', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      expect(component.placeholder()).toBe('Select an option');
      expect(component.disabled()).toBe(false);
      expect(component.position()).toBe('auto');
      expect(component.variant()).toBe('outline');
      expect(component.size()).toBe('md');
      expect(component.searchable()).toBe(false);
      expect(component.clearable()).toBe(false);
      expect(component.loading()).toBe(false);
    });

    it('should accept custom placeholder', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.componentRef.setInput('placeholder', 'Custom Placeholder');
      fixture.detectChanges();

      expect(component.placeholder()).toBe('Custom Placeholder');
    });

    it('should be closed by default', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      expect(component.isOpen()).toBe(false);
    });

    it('should have no selected item by default', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      expect(component.selectedItem()).toBeNull();
    });
  });

  describe('Rendering', () => {
    it('should render the dropdown toggle button', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      const button = compiled.querySelector('.dropdown-toggle');
      expect(button).toBeTruthy();
    });

    it('should display placeholder when no item selected', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.componentRef.setInput('placeholder', 'Select');
      fixture.detectChanges();

      const button = compiled.querySelector('.dropdown-toggle');
      expect(button?.textContent).toContain('Select');
    });

    it('should not render menu when closed', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      const menu = compiled.querySelector('.dropdown-menu');
      expect(menu).toBeFalsy();
    });

    it('should render menu when open', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      component.open();
      fixture.detectChanges();

      const menu = compiled.querySelector('.dropdown-menu');
      expect(menu).toBeTruthy();
    });

    it('should render all items in the menu', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      component.open();
      fixture.detectChanges();

      const items = compiled.querySelectorAll('.dropdown-item:not(.divider)');
      expect(items.length).toBe(3);
    });

    it('should render items with icons', () => {
      fixture.componentRef.setInput('items', mockItemsWithIcons);
      fixture.detectChanges();

      component.open();
      fixture.detectChanges();

      const icons = compiled.querySelectorAll('.dropdown-item-icon');
      expect(icons.length).toBe(3);
    });

    it('should render disabled items correctly', () => {
      fixture.componentRef.setInput('items', mockItemsWithDisabled);
      fixture.detectChanges();

      component.open();
      fixture.detectChanges();

      const disabledItem = compiled.querySelector('.dropdown-item.disabled');
      expect(disabledItem).toBeTruthy();
    });

    it('should render dividers', () => {
      fixture.componentRef.setInput('items', mockItemsWithDividers);
      fixture.detectChanges();

      component.open();
      fixture.detectChanges();

      const divider = compiled.querySelector('.dropdown-divider');
      expect(divider).toBeTruthy();
    });
  });

  describe('Variants', () => {
    it('should apply primary variant class', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.componentRef.setInput('variant', 'primary');
      fixture.detectChanges();

      const button = compiled.querySelector('.btn-primary');
      expect(button).toBeTruthy();
    });

    it('should apply secondary variant class', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.componentRef.setInput('variant', 'secondary');
      fixture.detectChanges();

      const button = compiled.querySelector('.btn-secondary');
      expect(button).toBeTruthy();
    });

    it('should apply outline variant class', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.componentRef.setInput('variant', 'outline');
      fixture.detectChanges();

      const button = compiled.querySelector('.btn-outline-primary');
      expect(button).toBeTruthy();
    });
  });

  describe('Sizes', () => {
    it('should apply small size class', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.componentRef.setInput('size', 'sm');
      fixture.detectChanges();

      const button = compiled.querySelector('.btn-sm');
      expect(button).toBeTruthy();
    });

    it('should apply medium size class', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.componentRef.setInput('size', 'md');
      fixture.detectChanges();

      const button = compiled.querySelector('.btn-md');
      expect(button).toBeTruthy();
    });

    it('should apply large size class', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.componentRef.setInput('size', 'lg');
      fixture.detectChanges();

      const button = compiled.querySelector('.btn-lg');
      expect(button).toBeTruthy();
    });
  });

  describe('Open/Close Behavior', () => {
    it('should open when toggle is called', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      component.toggle();
      fixture.detectChanges();

      expect(component.isOpen()).toBe(true);
    });

    it('should close when toggle is called while open', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      component.open();
      fixture.detectChanges();
      component.toggle();
      fixture.detectChanges();

      expect(component.isOpen()).toBe(false);
    });

    it('should open when open() is called', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      component.open();
      fixture.detectChanges();

      expect(component.isOpen()).toBe(true);
    });

    it('should close when close() is called', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      component.open();
      fixture.detectChanges();
      component.close();
      fixture.detectChanges();

      expect(component.isOpen()).toBe(false);
    });

    it('should not open when disabled', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      component.toggle();
      fixture.detectChanges();

      expect(component.isOpen()).toBe(false);
    });

    it('should not open when loading', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      component.toggle();
      fixture.detectChanges();

      expect(component.isOpen()).toBe(false);
    });

    it('should reset search query when closed', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.componentRef.setInput('searchable', true);
      fixture.detectChanges();

      component.open();
      component.searchQuery.set('test');
      fixture.detectChanges();

      component.close();
      fixture.detectChanges();

      expect(component.searchQuery()).toBe('');
    });

    it('should reset highlighted index when closed', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      component.open();
      component.highlightedIndex.set(2);
      fixture.detectChanges();

      component.close();
      fixture.detectChanges();

      expect(component.highlightedIndex()).toBe(-1);
    });
  });

  describe('Item Selection', () => {
    it('should select an item when clicked', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      component.selectItem(mockItems[0]);
      fixture.detectChanges();

      expect(component.selectedItem()).toEqual(mockItems[0]);
    });

    it('should emit selectionChange event when item is selected', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      const spy = vi.fn();
      component.selectionChange.subscribe(spy);

      component.selectItem(mockItems[1]);
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith(mockItems[1]);
    });

    it('should close dropdown after selecting an item', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      component.open();
      fixture.detectChanges();

      component.selectItem(mockItems[0]);
      fixture.detectChanges();

      expect(component.isOpen()).toBe(false);
    });

    it('should not select disabled items', () => {
      fixture.componentRef.setInput('items', mockItemsWithDisabled);
      fixture.detectChanges();

      const disabledItem = mockItemsWithDisabled[1];
      component.selectItem(disabledItem);
      fixture.detectChanges();

      expect(component.selectedItem()).toBeNull();
    });

    it('should not select dividers', () => {
      fixture.componentRef.setInput('items', mockItemsWithDividers);
      fixture.detectChanges();

      const dividerItem = mockItemsWithDividers[1];
      component.selectItem(dividerItem);
      fixture.detectChanges();

      expect(component.selectedItem()).toBeNull();
    });

    it('should display selected item label', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      component.selectItem(mockItems[0]);
      fixture.detectChanges();

      const button = compiled.querySelector('.dropdown-toggle');
      expect(button?.textContent).toContain('Option 1');
    });

    it('should show selected item icon if available', () => {
      fixture.componentRef.setInput('items', mockItemsWithIcons);
      fixture.detectChanges();

      component.selectItem(mockItemsWithIcons[0]);
      component.open();
      fixture.detectChanges();

      const icon = compiled.querySelector('.dropdown-item-icon');
      expect(icon?.textContent).toContain('🏠');
    });
  });

  describe('Clear Selection', () => {
    it('should show clear button when clearable is true and item is selected', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.componentRef.setInput('clearable', true);
      fixture.detectChanges();

      component.selectItem(mockItems[0]);
      fixture.detectChanges();

      const clearButton = compiled.querySelector('.dropdown-clear-icon');
      expect(clearButton).toBeTruthy();
    });

    it('should not show clear button when clearable is false', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.componentRef.setInput('clearable', false);
      fixture.detectChanges();

      component.selectItem(mockItems[0]);
      fixture.detectChanges();

      const clearButton = compiled.querySelector('.dropdown-clear-icon');
      expect(clearButton).toBeFalsy();
    });

    it('should clear selection when clear button is clicked', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.componentRef.setInput('clearable', true);
      fixture.detectChanges();

      component.selectItem(mockItems[0]);
      fixture.detectChanges();

      const mockEvent = new Event('click');
      component.clearSelection(mockEvent);
      fixture.detectChanges();

      expect(component.selectedItem()).toBeNull();
    });
  });

  describe('Search Functionality', () => {
    it('should show search input when searchable is true', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.componentRef.setInput('searchable', true);
      fixture.detectChanges();

      component.open();
      fixture.detectChanges();

      const searchInput = compiled.querySelector('.dropdown-search');
      expect(searchInput).toBeTruthy();
    });

    it('should not show search input when searchable is false', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.componentRef.setInput('searchable', false);
      fixture.detectChanges();

      component.open();
      fixture.detectChanges();

      const searchInput = compiled.querySelector('.dropdown-search');
      expect(searchInput).toBeFalsy();
    });

    it('should filter items based on search query', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.componentRef.setInput('searchable', true);
      fixture.detectChanges();

      component.searchQuery.set('Option 1');
      fixture.detectChanges();

      const filtered = component.filteredItems();
      expect(filtered.length).toBe(1);
      expect(filtered[0].label).toBe('Option 1');
    });

    it('should filter items case-insensitively', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.componentRef.setInput('searchable', true);
      fixture.detectChanges();

      component.searchQuery.set('option');
      fixture.detectChanges();

      const filtered = component.filteredItems();
      expect(filtered.length).toBe(3);
    });

    it('should filter out dividers in search results', () => {
      fixture.componentRef.setInput('items', mockItemsWithDividers);
      fixture.componentRef.setInput('searchable', true);
      fixture.detectChanges();

      component.searchQuery.set('Item');
      fixture.detectChanges();

      const filtered = component.filteredItems();
      const hasDividers = filtered.some((item) => item.divider);
      expect(hasDividers).toBe(false);
    });

    it('should emit searchChange event on search input', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.componentRef.setInput('searchable', true);
      fixture.detectChanges();

      const spy = vi.fn();
      component.searchChange.subscribe(spy);

      const mockEvent = {
        target: { value: 'test' },
      } as unknown as Event;

      component.onSearchInput(mockEvent);
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith('test');
    });

    it('should return all items when search query is empty', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      component.searchQuery.set('');
      fixture.detectChanges();

      const filtered = component.filteredItems();
      expect(filtered.length).toBe(mockItems.length);
    });
  });

  describe('Keyboard Navigation', () => {
    it('should open dropdown with Enter key', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      Object.defineProperty(event, 'target', { value: fixture.nativeElement, writable: false });
      component.onKeyDown(event);
      fixture.detectChanges();

      expect(component.isOpen()).toBe(true);
    });

    it('should close dropdown with Escape key', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      component.open();
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      component.onKeyDown(event);
      fixture.detectChanges();

      expect(component.isOpen()).toBe(false);
    });

    it('should highlight next item with ArrowDown', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      component.open();
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      component.onKeyDown(event);
      fixture.detectChanges();

      expect(component.highlightedIndex()).toBe(0);
    });

    it('should highlight previous item with ArrowUp', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      component.open();
      component.highlightedIndex.set(1);
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      component.onKeyDown(event);
      fixture.detectChanges();

      expect(component.highlightedIndex()).toBe(0);
    });

    it('should wrap to first item when ArrowDown on last item', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      component.open();
      component.highlightedIndex.set(2);
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      component.onKeyDown(event);
      fixture.detectChanges();

      expect(component.highlightedIndex()).toBe(0);
    });

    it('should highlight first item with Home key', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      component.open();
      component.highlightedIndex.set(2);
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'Home' });
      component.onKeyDown(event);
      fixture.detectChanges();

      expect(component.highlightedIndex()).toBe(0);
    });

    it('should highlight last item with End key', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      component.open();
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'End' });
      component.onKeyDown(event);
      fixture.detectChanges();

      expect(component.highlightedIndex()).toBe(2);
    });

    it('should select highlighted item with Enter key', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      component.open();
      component.highlightedIndex.set(1);
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      component.onKeyDown(event);
      fixture.detectChanges();

      expect(component.selectedItem()).toEqual(mockItems[1]);
    });
  });

  describe('Loading State', () => {
    it('should show loading spinner when loading is true', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      const spinner = compiled.querySelector('.spinner');
      expect(spinner).toBeTruthy();
    });

    it('should disable interactions when loading', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      component.toggle();
      fixture.detectChanges();

      expect(component.isOpen()).toBe(false);
    });
  });

  describe('Disabled State', () => {
    it('should disable button when disabled is true', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const button = compiled.querySelector('.dropdown-toggle') as HTMLButtonElement;
      expect(button?.disabled).toBe(true);
    });

    it('should not respond to clicks when disabled', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      component.toggle();
      fixture.detectChanges();

      expect(component.isOpen()).toBe(false);
    });
  });

  describe('Helper Methods', () => {
    it('isItemHighlighted should return true for highlighted item', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      component.highlightedIndex.set(1);
      fixture.detectChanges();

      expect(component.isItemHighlighted(mockItems[1])).toBe(true);
    });

    it('isItemHighlighted should return false for non-highlighted item', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      component.highlightedIndex.set(1);
      fixture.detectChanges();

      expect(component.isItemHighlighted(mockItems[0])).toBe(false);
    });

    it('isItemSelected should return true for selected item', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      component.selectedItem.set(mockItems[0]);
      fixture.detectChanges();

      expect(component.isItemSelected(mockItems[0])).toBe(true);
    });

    it('isItemSelected should return false for non-selected item', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      component.selectedItem.set(mockItems[0]);
      fixture.detectChanges();

      expect(component.isItemSelected(mockItems[1])).toBe(false);
    });
  });

  describe('Computed Properties', () => {
    it('buttonClass should include variant class', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.componentRef.setInput('variant', 'primary');
      fixture.detectChanges();

      expect(component.buttonClass()).toContain('btn-primary');
    });

    it('buttonClass should include size class', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.componentRef.setInput('size', 'lg');
      fixture.detectChanges();

      expect(component.buttonClass()).toContain('btn-lg');
    });

    it('buttonClass should include active class when open', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      component.open();
      fixture.detectChanges();

      expect(component.buttonClass()).toContain('active');
    });

    it('filteredItems should return all items when no search query', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      expect(component.filteredItems()).toEqual(mockItems);
    });

    it('filteredItems should return filtered items when search query exists', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      component.searchQuery.set('Option 2');
      fixture.detectChanges();

      expect(component.filteredItems().length).toBe(1);
      expect(component.filteredItems()[0].label).toBe('Option 2');
    });
  });
});
