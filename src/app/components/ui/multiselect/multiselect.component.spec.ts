import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { MultiSelectComponent, MultiSelectItem } from './multiselect.component';

describe('MultiSelectComponent', () => {
  let component: MultiSelectComponent;
  let fixture: ComponentFixture<MultiSelectComponent>;
  let compiled: HTMLElement;

  const mockItems: MultiSelectItem[] = [
    { label: 'Option 1', value: 1 },
    { label: 'Option 2', value: 2 },
    { label: 'Option 3', value: 3 },
  ];

  beforeEach(async () => {
    // Mock scrollIntoView for jsdom compatibility
    Element.prototype.scrollIntoView = vi.fn();

    await TestBed.configureTestingModule({
      imports: [MultiSelectComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(MultiSelectComponent);
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

      expect(component.placeholder()).toBe('Select options');
      expect(component.disabled()).toBe(false);
      expect(component.searchable()).toBe(true);
      expect(component.showBadges()).toBe(true);
      expect(component.variant()).toBe('outline');
      expect(component.size()).toBe('md');
    });

    it('should be closed by default', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      expect(component.isOpen()).toBe(false);
    });

    it('should have empty selection by default', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      expect(component.selectedItems()).toEqual([]);
    });
  });

  describe('Rendering', () => {
    it('should render the multiselect toggle button', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      const button = compiled.querySelector('.multiselect-toggle');
      expect(button).toBeTruthy();
    });

    it('should display placeholder when no items selected', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.componentRef.setInput('placeholder', 'Choose options');
      fixture.detectChanges();

      const button = compiled.querySelector('.multiselect-toggle');
      expect(button?.textContent).toContain('Choose options');
    });

    it('should render menu when open', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      component.open();
      fixture.detectChanges();

      const menu = compiled.querySelector('.multiselect-menu');
      expect(menu).toBeTruthy();
    });
  });

  describe('Item Selection', () => {
    it('should add item to selection when toggled', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      component.toggleItem(mockItems[0]);
      fixture.detectChanges();

      expect(component.selectedItems()).toContain(mockItems[0]);
    });

    it('should remove item from selection when toggled again', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      component.toggleItem(mockItems[0]);
      component.toggleItem(mockItems[0]);
      fixture.detectChanges();

      expect(component.selectedItems()).not.toContain(mockItems[0]);
    });

    it('should emit selectionChange event', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      const spy = vi.fn();
      component.selectionChange.subscribe(spy);

      component.toggleItem(mockItems[0]);
      fixture.detectChanges();

      expect(spy).toHaveBeenCalled();
    });

    it('should allow multiple selections', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      component.toggleItem(mockItems[0]);
      component.toggleItem(mockItems[1]);
      fixture.detectChanges();

      expect(component.selectedItems().length).toBe(2);
    });
  });

  describe('Max Selections', () => {
    it('should not exceed max selections limit', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.componentRef.setInput('maxSelections', 2);
      fixture.detectChanges();

      component.toggleItem(mockItems[0]);
      component.toggleItem(mockItems[1]);
      component.toggleItem(mockItems[2]);
      fixture.detectChanges();

      expect(component.selectedItems().length).toBe(2);
    });
  });

  describe('Select All / Clear All', () => {
    it('should select all items when selectAll is called', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      component.selectAll();
      fixture.detectChanges();

      expect(component.selectedItems().length).toBe(mockItems.length);
    });

    it('should clear all selections when clearAll is called', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      component.toggleItem(mockItems[0]);
      component.clearAll();
      fixture.detectChanges();

      expect(component.selectedItems().length).toBe(0);
    });

    it('isAllSelected should return true when all selectable items are selected', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      component.selectAll();
      fixture.detectChanges();

      expect(component.isAllSelected()).toBe(true);
    });
  });

  describe('Search Functionality', () => {
    it('should filter items based on search query', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      component.searchQuery.set('Option 1');
      fixture.detectChanges();

      const filtered = component.filteredItems();
      expect(filtered.length).toBe(1);
      expect(filtered[0].label).toBe('Option 1');
    });

    it('should emit searchChange event', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      const spy = vi.fn();
      component.searchChange.subscribe(spy);

      const mockEvent = { target: { value: 'test' } } as unknown as Event;
      component.onSearchInput(mockEvent);

      expect(spy).toHaveBeenCalledWith('test');
    });
  });

  describe('Keyboard Navigation', () => {
    it('should open dropdown with Enter key', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      Object.defineProperty(event, 'target', { value: fixture.nativeElement });
      component.onKeyDown(event);
      fixture.detectChanges();

      expect(component.isOpen()).toBe(true);
    });

    it('should close dropdown with Escape key', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      component.open();
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      component.onKeyDown(event);
      fixture.detectChanges();

      expect(component.isOpen()).toBe(false);
    });

    it('should highlight first item with Home key', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      component.open();
      const event = new KeyboardEvent('keydown', { key: 'Home' });
      component.onKeyDown(event);
      fixture.detectChanges();

      expect(component.highlightedIndex()).toBe(0);
    });

    it('should highlight last item with End key', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      component.open();
      const event = new KeyboardEvent('keydown', { key: 'End' });
      component.onKeyDown(event);
      fixture.detectChanges();

      expect(component.highlightedIndex()).toBe(mockItems.length - 1);
    });

    it('should toggle highlighted item with Enter key', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      component.open();
      component.highlightedIndex.set(0);

      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      component.onKeyDown(event);
      fixture.detectChanges();

      expect(component.selectedItems()).toContain(mockItems[0]);
    });

    it('should toggle highlighted item with Space key', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      component.open();
      component.highlightedIndex.set(1);

      const event = new KeyboardEvent('keydown', { key: ' ' });
      component.onKeyDown(event);
      fixture.detectChanges();

      expect(component.selectedItems()).toContain(mockItems[1]);
    });

    it('should check if item is highlighted', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      component.open();
      component.highlightedIndex.set(0);
      fixture.detectChanges();

      expect(component.isItemHighlighted(mockItems[0])).toBe(true);
      expect(component.isItemHighlighted(mockItems[1])).toBe(false);
    });
  });

  describe('Computed Properties', () => {
    it('displayText should show placeholder when no items selected', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.componentRef.setInput('placeholder', 'Test');
      fixture.detectChanges();

      expect(component.displayText()).toBe('Test');
    });

    it('displayText should show single item label when one selected', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      component.toggleItem(mockItems[0]);
      fixture.detectChanges();

      expect(component.displayText()).toBe('Option 1');
    });

    it('displayText should show count when multiple selected', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      component.toggleItem(mockItems[0]);
      component.toggleItem(mockItems[1]);
      fixture.detectChanges();

      expect(component.displayText()).toBe('2 selected');
    });
  });
});
