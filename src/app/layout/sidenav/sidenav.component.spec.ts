import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import { SidenavComponent, SidenavItem } from './sidenav';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;

  const mockItems: SidenavItem[] = [
    { label: 'Home', value: 'home', icon: '🏠' },
    { label: 'Profile', value: 'profile', icon: '👤' },
    { label: 'Settings', value: 'settings', icon: '⚙️' },
  ];

  const mockItemsWithChildren: SidenavItem[] = [
    { label: 'Home', value: 'home', icon: '🏠' },
    {
      label: 'Products',
      value: 'products',
      icon: '📦',
      children: [
        { label: 'Product 1', value: 'product-1' },
        { label: 'Product 2', value: 'product-2' },
      ],
    },
    { label: 'Settings', value: 'settings', icon: '⚙️' },
  ];

  const mockItemsWithDisabled: SidenavItem[] = [
    { label: 'Enabled', value: 'enabled' },
    { label: 'Disabled', value: 'disabled', disabled: true },
  ];

  const mockItemsWithBadges: SidenavItem[] = [
    { label: 'Messages', value: 'messages', badge: 5 },
    { label: 'Notifications', value: 'notifications', badge: 'New' },
  ];
  let httpClient: {
    get: Mock;
  };

  beforeEach(async () => {
    httpClient = {
      get: vi.fn(() => of('<svg data-test="icon"></svg>')) as Mock,
    };
    await TestBed.configureTestingModule({
      imports: [SidenavComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: HttpClient, useValue: httpClient },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have default values', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      expect(component.position()).toBe('left');
      expect(component.variant()).toBe('default');
      expect(component.collapsed()).toBe(false);
      expect(component.collapsible()).toBe(false);
      expect(component.showToggle()).toBe(true);
      expect(component.width()).toBe('16rem');
      expect(component.collapsedWidth()).toBe('4rem');
    });

    it('should initialize with empty items', () => {
      fixture.detectChanges();
      expect(component.items()).toEqual([]);
    });

    it('should initialize collapsed state from input', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.componentRef.setInput('collapsed', true);
      fixture.detectChanges();

      expect(component.isCollapsed()).toBe(true);
    });

    it('should initialize selected value from input', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.componentRef.setInput('selectedValue', 'home');
      fixture.detectChanges();

      expect(component.selectedItem()).toBe('home');
    });
  });

  describe('Rendering', () => {
    it('should render sidenav with base Tailwind classes', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      const aside = fixture.nativeElement.querySelector('aside');
      expect(aside.classList.contains('min-h-screen')).toBe(true);
      expect(aside.classList.contains('flex')).toBe(true);
      expect(aside.classList.contains('flex-col')).toBe(true);
    });

    it('should apply left border when position is left', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.componentRef.setInput('position', 'left');
      fixture.detectChanges();

      const aside = fixture.nativeElement.querySelector('aside');
      expect(aside.classList.contains('left-0')).toBe(true);
      expect(aside.classList.contains('border-r')).toBe(true);
    });

    it('should apply right border when position is right', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.componentRef.setInput('position', 'right');
      fixture.detectChanges();

      const aside = fixture.nativeElement.querySelector('aside');
      expect(aside.classList.contains('right-0')).toBe(true);
      expect(aside.classList.contains('border-l')).toBe(true);
    });

    it('should apply shadow when variant is default', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.componentRef.setInput('variant', 'default');
      fixture.detectChanges();

      const aside = fixture.nativeElement.querySelector('aside');
      expect(aside.classList.contains('shadow-sm')).toBe(true);
    });

    it('should apply border-2 when variant is bordered', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.componentRef.setInput('variant', 'bordered');
      fixture.detectChanges();

      const aside = fixture.nativeElement.querySelector('aside');
      expect(aside.classList.contains('border-2')).toBe(true);
    });

    it('should apply overflow-visible when collapsed', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.componentRef.setInput('collapsed', true);
      fixture.detectChanges();

      const aside = fixture.nativeElement.querySelector('aside');
      expect(aside.classList.contains('overflow-visible')).toBe(true);
    });

    it('should not apply overflow-visible when not collapsed', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.componentRef.setInput('collapsed', false);
      fixture.detectChanges();

      const aside = fixture.nativeElement.querySelector('aside');
      expect(aside.classList.contains('overflow-visible')).toBe(false);
    });

    it('should render items with base Tailwind classes', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      const itemLink = fixture.nativeElement.querySelector('a[role="menuitem"]');
      expect(itemLink.classList.contains('flex')).toBe(true);
      expect(itemLink.classList.contains('items-center')).toBe(true);
      expect(itemLink.classList.contains('gap-3')).toBe(true);
      expect(itemLink.classList.contains('px-4')).toBe(true);
      expect(itemLink.classList.contains('py-3')).toBe(true);
    });

    it('should apply active Tailwind classes to selected items', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.componentRef.setInput('selectedValue', 'home');
      fixture.detectChanges();

      const activeItem = fixture.nativeElement.querySelector('[aria-current="page"]');
      expect(activeItem).toBeTruthy();
      expect(activeItem.classList.contains('text-white')).toBe(true);
    });

    it('should apply disabled Tailwind classes to disabled items', () => {
      fixture.componentRef.setInput('items', mockItemsWithDisabled);
      fixture.detectChanges();

      const disabledItem = fixture.nativeElement.querySelector('[aria-disabled="true"]');
      expect(disabledItem).toBeTruthy();
      expect(disabledItem.classList.contains('opacity-50')).toBe(true);
      expect(disabledItem.classList.contains('cursor-not-allowed')).toBe(true);
    });

    it('should apply font-semibold to items with children', () => {
      fixture.componentRef.setInput('items', mockItemsWithChildren);
      fixture.detectChanges();

      const parentItem = fixture.nativeElement.querySelector('[aria-expanded]');
      expect(parentItem).toBeTruthy();
      expect(parentItem.classList.contains('font-semibold')).toBe(true);
    });

    it('should apply pills variant classes when variant is pills', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.componentRef.setInput('variant', 'pills');
      fixture.detectChanges();

      const itemLink = fixture.nativeElement.querySelector('a[role="menuitem"]');
      expect(itemLink.classList.contains('rounded-full')).toBe(true);
      expect(itemLink.classList.contains('mx-2')).toBe(true);
      expect(itemLink.classList.contains('my-1')).toBe(true);
    });
  });

  describe('Collapsed State', () => {
    it('should toggle collapse when collapsible is true', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.componentRef.setInput('collapsible', true);
      fixture.detectChanges();

      expect(component.isCollapsed()).toBe(false);

      component.toggleCollapse();
      fixture.detectChanges();

      expect(component.isCollapsed()).toBe(true);
    });

    it('should not toggle collapse when collapsible is false', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.componentRef.setInput('collapsible', false);
      fixture.detectChanges();

      const initialState = component.isCollapsed();
      component.toggleCollapse();
      fixture.detectChanges();

      expect(component.isCollapsed()).toBe(initialState);
    });

    it('should emit toggleChange event when toggling', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.componentRef.setInput('collapsible', true);
      fixture.detectChanges();

      const spy = vi.fn();
      const subscription = component.toggleChange.subscribe(spy);

      component.toggleCollapse();
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith(true);
      subscription.unsubscribe();
    });

    it('should set correct width when expanded', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.componentRef.setInput('width', '20rem');
      fixture.componentRef.setInput('collapsed', false);
      fixture.detectChanges();

      expect(component.currentWidth()).toBe('20rem');
    });

    it('should set correct width when collapsed', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.componentRef.setInput('collapsedWidth', '5rem');
      fixture.componentRef.setInput('collapsed', true);
      fixture.detectChanges();

      expect(component.currentWidth()).toBe('5rem');
    });

    it('should collapse all expanded items when collapsing sidenav', () => {
      fixture.componentRef.setInput('items', mockItemsWithChildren);
      fixture.componentRef.setInput('collapsible', true);
      fixture.detectChanges();

      // Expand an item
      component.toggleItemExpansion('products');
      expect(component.isItemExpanded('products')).toBe(true);

      // Collapse sidenav
      component.toggleCollapse();
      fixture.detectChanges();

      // Verify expanded items are cleared
      expect(component.isItemExpanded('products')).toBe(false);
    });
  });

  describe('Item Clicks', () => {
    it('should select item on click', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      const event = new Event('click');
      component.onItemClick(mockItems[0], event);
      fixture.detectChanges();

      expect(component.selectedItem()).toBe('home');
    });

    it('should emit itemClick event', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      const spy = vi.fn();
      const subscription = component.itemClick.subscribe(spy);

      const event = new Event('click');
      component.onItemClick(mockItems[0], event);
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith(mockItems[0]);
      subscription.unsubscribe();
    });

    it('should emit selectionChange event', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      const spy = vi.fn();
      const subscription = component.selectionChange.subscribe(spy);

      const event = new Event('click');
      component.onItemClick(mockItems[0], event);
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith(mockItems[0]);
      subscription.unsubscribe();
    });

    it('should not select disabled items', () => {
      fixture.componentRef.setInput('items', mockItemsWithDisabled);
      fixture.detectChanges();

      const event = new Event('click');
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      component.onItemClick(mockItemsWithDisabled[1], event);
      fixture.detectChanges();

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(component.selectedItem()).not.toBe('disabled');
    });

    it('should toggle expansion when clicking item with children', () => {
      fixture.componentRef.setInput('items', mockItemsWithChildren);
      fixture.detectChanges();

      const event = new Event('click');
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      expect(component.isItemExpanded('products')).toBe(false);

      component.onItemClick(mockItemsWithChildren[1], event);
      fixture.detectChanges();

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(component.isItemExpanded('products')).toBe(true);
    });

    it('should not select item with children', () => {
      fixture.componentRef.setInput('items', mockItemsWithChildren);
      fixture.detectChanges();

      const event = new Event('click');
      component.onItemClick(mockItemsWithChildren[1], event);
      fixture.detectChanges();

      expect(component.selectedItem()).not.toBe('products');
    });
  });

  describe('Item Expansion', () => {
    it('should expand item with children', () => {
      fixture.componentRef.setInput('items', mockItemsWithChildren);
      fixture.detectChanges();

      expect(component.isItemExpanded('products')).toBe(false);

      component.toggleItemExpansion('products');
      fixture.detectChanges();

      expect(component.isItemExpanded('products')).toBe(true);
    });

    it('should collapse item with children', () => {
      fixture.componentRef.setInput('items', mockItemsWithChildren);
      fixture.detectChanges();

      component.toggleItemExpansion('products');
      expect(component.isItemExpanded('products')).toBe(true);

      component.toggleItemExpansion('products');
      fixture.detectChanges();

      expect(component.isItemExpanded('products')).toBe(false);
    });

    it('should track expanded items in Set', () => {
      fixture.componentRef.setInput('items', mockItemsWithChildren);
      fixture.detectChanges();

      component.toggleItemExpansion('products');
      fixture.detectChanges();

      const expanded = component.expandedItems();
      expect(expanded.has('products')).toBe(true);
    });

    it('should handle multiple expanded items', () => {
      const itemsWithMultipleParents: SidenavItem[] = [
        {
          label: 'Parent 1',
          value: 'parent1',
          children: [{ label: 'Child 1', value: 'child1' }],
        },
        {
          label: 'Parent 2',
          value: 'parent2',
          children: [{ label: 'Child 2', value: 'child2' }],
        },
      ];

      fixture.componentRef.setInput('items', itemsWithMultipleParents);
      fixture.detectChanges();

      component.toggleItemExpansion('parent1');
      component.toggleItemExpansion('parent2');
      fixture.detectChanges();

      expect(component.isItemExpanded('parent1')).toBe(true);
      expect(component.isItemExpanded('parent2')).toBe(true);
    });
  });

  describe('Item States', () => {
    it('should return true for selected item', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.componentRef.setInput('selectedValue', 'home');
      fixture.detectChanges();

      expect(component.isItemSelected('home')).toBe(true);
      expect(component.isItemSelected('profile')).toBe(false);
    });
  });

  describe('Hover State', () => {
    it('should track hovered item on mouse enter', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      component.onItemMouseEnter('home');
      fixture.detectChanges();

      expect(component.hoveredItem()).toBe('home');
      expect(component.isItemHovered('home')).toBe(true);
    });

    it('should clear hovered item on mouse leave', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      component.onItemMouseEnter('home');
      expect(component.hoveredItem()).toBe('home');

      component.onItemMouseLeave();
      fixture.detectChanges();

      expect(component.hoveredItem()).toBeNull();
      expect(component.isItemHovered('home')).toBe(false);
    });

    it('should return false for non-hovered item', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      component.onItemMouseEnter('home');
      fixture.detectChanges();

      expect(component.isItemHovered('profile')).toBe(false);
    });
  });

  describe('Keyboard Navigation', () => {
    it('should select item with Enter key', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      component.onKeyDown(event, mockItems[0]);
      fixture.detectChanges();

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(component.selectedItem()).toBe('home');
    });

    it('should select item with Space key', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: ' ' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      component.onKeyDown(event, mockItems[0]);
      fixture.detectChanges();

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(component.selectedItem()).toBe('home');
    });

    it('should expand item with ArrowRight when collapsed', () => {
      fixture.componentRef.setInput('items', mockItemsWithChildren);
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      expect(component.isItemExpanded('products')).toBe(false);

      component.onKeyDown(event, mockItemsWithChildren[1]);
      fixture.detectChanges();

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(component.isItemExpanded('products')).toBe(true);
    });

    it('should not expand item with ArrowRight when already expanded', () => {
      fixture.componentRef.setInput('items', mockItemsWithChildren);
      fixture.detectChanges();

      component.toggleItemExpansion('products');
      expect(component.isItemExpanded('products')).toBe(true);

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      component.onKeyDown(event, mockItemsWithChildren[1]);
      fixture.detectChanges();

      expect(preventDefaultSpy).not.toHaveBeenCalled();
      expect(component.isItemExpanded('products')).toBe(true);
    });

    it('should collapse item with ArrowLeft when expanded', () => {
      fixture.componentRef.setInput('items', mockItemsWithChildren);
      fixture.detectChanges();

      component.toggleItemExpansion('products');
      expect(component.isItemExpanded('products')).toBe(true);

      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      component.onKeyDown(event, mockItemsWithChildren[1]);
      fixture.detectChanges();

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(component.isItemExpanded('products')).toBe(false);
    });

    it('should not collapse item with ArrowLeft when already collapsed', () => {
      fixture.componentRef.setInput('items', mockItemsWithChildren);
      fixture.detectChanges();

      expect(component.isItemExpanded('products')).toBe(false);

      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      component.onKeyDown(event, mockItemsWithChildren[1]);
      fixture.detectChanges();

      expect(preventDefaultSpy).not.toHaveBeenCalled();
      expect(component.isItemExpanded('products')).toBe(false);
    });

    it('should not respond to keyboard when item is disabled', () => {
      fixture.componentRef.setInput('items', mockItemsWithDisabled);
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      component.onKeyDown(event, mockItemsWithDisabled[1]);
      fixture.detectChanges();

      expect(preventDefaultSpy).not.toHaveBeenCalled();
      expect(component.selectedItem()).not.toBe('disabled');
    });

    it('should not respond to other keys', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'a' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      component.onKeyDown(event, mockItems[0]);
      fixture.detectChanges();

      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });
  });

  describe('Computed Properties', () => {
    it('should compute currentWidth correctly when expanded', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.componentRef.setInput('width', '18rem');
      fixture.componentRef.setInput('collapsed', false);
      fixture.detectChanges();

      expect(component.currentWidth()).toBe('18rem');
    });

    it('should compute currentWidth correctly when collapsed', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.componentRef.setInput('collapsedWidth', '3rem');
      fixture.componentRef.setInput('collapsed', true);
      fixture.detectChanges();

      expect(component.currentWidth()).toBe('3rem');
    });
  });

  describe('Effects', () => {
    it('should sync collapsed state from input', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.componentRef.setInput('collapsed', false);
      fixture.detectChanges();

      expect(component.isCollapsed()).toBe(false);

      fixture.componentRef.setInput('collapsed', true);
      fixture.detectChanges();

      expect(component.isCollapsed()).toBe(true);
    });

    it('should sync selected value from input', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.componentRef.setInput('selectedValue', 'home');
      fixture.detectChanges();

      expect(component.selectedItem()).toBe('home');

      fixture.componentRef.setInput('selectedValue', 'profile');
      fixture.detectChanges();

      expect(component.selectedItem()).toBe('profile');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty items array', () => {
      fixture.componentRef.setInput('items', []);
      fixture.detectChanges();

      expect(component.items()).toEqual([]);
    });

    it('should handle items with badges', () => {
      fixture.componentRef.setInput('items', mockItemsWithBadges);
      fixture.detectChanges();

      expect(component.items()[0].badge).toBe(5);
      expect(component.items()[1].badge).toBe('New');
    });

    it('should handle items with dividers', () => {
      const itemsWithDivider: SidenavItem[] = [
        { label: 'Item 1', value: 'item1' },
        { label: '', value: 'div', divider: true },
        { label: 'Item 2', value: 'item2' },
      ];

      fixture.componentRef.setInput('items', itemsWithDivider);
      fixture.detectChanges();

      expect(component.items()[1].divider).toBe(true);
    });

    it('should handle header and footer inputs', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.componentRef.setInput('header', 'My App');
      fixture.componentRef.setInput('footer', 'Version 1.0');
      fixture.detectChanges();

      expect(component.header()).toBe('My App');
      expect(component.footer()).toBe('Version 1.0');
    });

    it('should handle logo inputs', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.componentRef.setInput('logo', 'logo.png');
      fixture.componentRef.setInput('logoCollapsed', 'logo-small.png');
      fixture.detectChanges();

      expect(component.logo()).toBe('logo.png');
      expect(component.logoCollapsed()).toBe('logo-small.png');
    });
  });
});
