import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AccordionComponent, AccordionItem } from './accordion';

describe('AccordionComponent', () => {
  let component: AccordionComponent;
  let fixture: ComponentFixture<AccordionComponent>;
  let compiled: HTMLElement;

  const mockItems: AccordionItem[] = [
    { id: '1', title: 'Item 1', content: 'Content 1' },
    { id: '2', title: 'Item 2', content: 'Content 2' },
    { id: '3', title: 'Item 3', content: 'Content 3' },
  ];

  const mockItemsWithOpen: AccordionItem[] = [
    { id: '1', title: 'Item 1', content: 'Content 1', isOpen: true },
    { id: '2', title: 'Item 2', content: 'Content 2' },
    { id: '3', title: 'Item 3', content: 'Content 3' },
  ];

  const mockItemsWithDisabled: AccordionItem[] = [
    { id: '1', title: 'Item 1', content: 'Content 1' },
    { id: '2', title: 'Disabled', content: 'Content 2', disabled: true },
    { id: '3', title: 'Item 3', content: 'Content 3' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccordionComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(AccordionComponent);
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

      expect(component.allowMultiple()).toBe(false);
      expect(component.animated()).toBe(true);
    });

    it('should initialize open items', () => {
      fixture.componentRef.setInput('items', mockItemsWithOpen);
      fixture.detectChanges();

      component.ngOnInit();
      fixture.detectChanges();

      expect(component.openItems().has('1')).toBe(true);
    });
  });

  describe('Rendering', () => {
    it('should render all items', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      component.ngOnInit();
      fixture.detectChanges();

      const items = compiled.querySelectorAll('.accordion-item');
      expect(items.length).toBe(3);
    });

    it('should render item titles', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      component.ngOnInit();
      fixture.detectChanges();

      const header = compiled.querySelector('.accordion-header');
      expect(header?.textContent).toContain('Item 1');
    });

    it('should render disabled items correctly', () => {
      fixture.componentRef.setInput('items', mockItemsWithDisabled);
      fixture.detectChanges();

      component.ngOnInit();
      fixture.detectChanges();

      const disabledItem = compiled.querySelector('.accordion-header[disabled]');
      expect(disabledItem).toBeTruthy();
    });
  });

  describe('Toggle Behavior', () => {
    it('should open item when toggled', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      component.ngOnInit();
      component.toggle(mockItems[0]);
      fixture.detectChanges();

      expect(component.isOpen(mockItems[0])).toBe(true);
    });

    it('should close open item when toggled', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      component.ngOnInit();
      component.toggle(mockItems[0]);
      fixture.detectChanges();
      component.toggle(mockItems[0]);
      fixture.detectChanges();

      expect(component.isOpen(mockItems[0])).toBe(false);
    });

    it('should emit itemToggled event', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      const spy = vi.fn();
      component.itemToggled.subscribe(spy);

      component.ngOnInit();
      component.toggle(mockItems[0]);
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith(mockItems[0]);
    });

    it('should not toggle disabled items', () => {
      fixture.componentRef.setInput('items', mockItemsWithDisabled);
      fixture.detectChanges();

      component.ngOnInit();
      component.toggle(mockItemsWithDisabled[1]);
      fixture.detectChanges();

      expect(component.isOpen(mockItemsWithDisabled[1])).toBe(false);
    });
  });

  describe('Allow Multiple', () => {
    it('should close other items when allowMultiple is false', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.componentRef.setInput('allowMultiple', false);
      fixture.detectChanges();

      component.ngOnInit();
      component.toggle(mockItems[0]);
      fixture.detectChanges();
      component.toggle(mockItems[1]);
      fixture.detectChanges();

      expect(component.isOpen(mockItems[0])).toBe(false);
      expect(component.isOpen(mockItems[1])).toBe(true);
    });

    it('should allow multiple open items when allowMultiple is true', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.componentRef.setInput('allowMultiple', true);
      fixture.detectChanges();

      component.ngOnInit();
      component.toggle(mockItems[0]);
      fixture.detectChanges();
      component.toggle(mockItems[1]);
      fixture.detectChanges();

      expect(component.isOpen(mockItems[0])).toBe(true);
      expect(component.isOpen(mockItems[1])).toBe(true);
    });
  });

  describe('Helper Methods', () => {
    it('isOpen should return true for open item', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      component.ngOnInit();
      component.toggle(mockItems[0]);
      fixture.detectChanges();

      expect(component.isOpen(mockItems[0])).toBe(true);
    });

    it('isOpen should return false for closed item', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      component.ngOnInit();
      fixture.detectChanges();

      expect(component.isOpen(mockItems[0])).toBe(false);
    });
  });
});
