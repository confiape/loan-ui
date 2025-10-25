import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { TabsComponent, TabItem } from './tabs.component';

describe('TabsComponent', () => {
  let component: TabsComponent;
  let fixture: ComponentFixture<TabsComponent>;
  let compiled: HTMLElement;

  const mockTabs: TabItem[] = [
    { id: 'tab1', label: 'Tab 1', content: 'Content 1' },
    { id: 'tab2', label: 'Tab 2', content: 'Content 2' },
    { id: 'tab3', label: 'Tab 3', content: 'Content 3' },
  ];

  const mockTabsWithDisabled: TabItem[] = [
    { id: 'tab1', label: 'Tab 1', content: 'Content 1' },
    { id: 'tab2', label: 'Disabled', content: 'Content 2', disabled: true },
    { id: 'tab3', label: 'Tab 3', content: 'Content 3' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsComponent],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(TabsComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have default values', () => {
      fixture.componentRef.setInput('tabs', mockTabs);
      fixture.detectChanges();

      expect(component.variant()).toBe('default');
      expect(component.orientation()).toBe('horizontal');
      expect(component.justified()).toBe(false);
      expect(component.fullWidth()).toBe(false);
      expect(component.useRouter()).toBe(false);
    });

    it('should set initial active tab', () => {
      fixture.componentRef.setInput('tabs', mockTabs);
      fixture.detectChanges();

      component.ngOnInit();
      fixture.detectChanges();

      expect(component.activeTab()).toBeTruthy();
    });
  });

  describe('Rendering', () => {
    it('should render tabs list', () => {
      fixture.componentRef.setInput('tabs', mockTabs);
      fixture.detectChanges();

      component.ngOnInit();
      fixture.detectChanges();

      const tabsList = compiled.querySelector('.tabs-list');
      expect(tabsList).toBeTruthy();
    });

    it('should render all tabs', () => {
      fixture.componentRef.setInput('tabs', mockTabs);
      fixture.detectChanges();

      component.ngOnInit();
      fixture.detectChanges();

      const tabs = compiled.querySelectorAll('.tab-button');
      expect(tabs.length).toBe(3);
    });

    it('should render tab content', () => {
      fixture.componentRef.setInput('tabs', mockTabs);
      fixture.detectChanges();

      component.ngOnInit();
      component.selectTab(mockTabs[0], 0);
      fixture.detectChanges();

      const content = compiled.querySelector('.tab-content');
      expect(content).toBeTruthy();
    });

    it('should render disabled tabs correctly', () => {
      fixture.componentRef.setInput('tabs', mockTabsWithDisabled);
      fixture.detectChanges();

      component.ngOnInit();
      fixture.detectChanges();

      const disabledTab = compiled.querySelector('.tab-button[disabled]');
      expect(disabledTab).toBeTruthy();
    });
  });

  describe('Variants', () => {
    const variants = ['default', 'pills', 'underline', 'boxed', 'segmented'] as const;

    variants.forEach((variant) => {
      it(`should apply ${variant} variant class`, () => {
        fixture.componentRef.setInput('tabs', mockTabs);
        fixture.componentRef.setInput('variant', variant);
        fixture.detectChanges();

        component.ngOnInit();
        fixture.detectChanges();

        expect(component.tabListClasses()).toContain(`tabs-list-${variant}`);
      });
    });
  });

  describe('Orientation', () => {
    it('should apply horizontal orientation class', () => {
      fixture.componentRef.setInput('tabs', mockTabs);
      fixture.componentRef.setInput('orientation', 'horizontal');
      fixture.detectChanges();

      expect(component.tabListClasses()).toContain('tabs-list-horizontal');
    });

    it('should apply vertical orientation class', () => {
      fixture.componentRef.setInput('tabs', mockTabs);
      fixture.componentRef.setInput('orientation', 'vertical');
      fixture.detectChanges();

      expect(component.tabListClasses()).toContain('tabs-list-vertical');
      expect(component.containerClasses()).toContain('tabs-container-vertical');
    });
  });

  describe('Tab Selection', () => {
    it('should select tab when clicked', () => {
      fixture.componentRef.setInput('tabs', mockTabs);
      fixture.detectChanges();

      component.ngOnInit();
      component.selectTab(mockTabs[1], 1);
      fixture.detectChanges();

      expect(component.activeTab()).toBe('tab2');
    });

    it('should emit tabChanged event', () => {
      fixture.componentRef.setInput('tabs', mockTabs);
      fixture.detectChanges();

      const spy = vi.fn();
      component.tabChanged.subscribe(spy);

      component.ngOnInit();
      component.selectTab(mockTabs[1], 1);
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith(mockTabs[1]);
    });

    it('should not select disabled tabs', () => {
      fixture.componentRef.setInput('tabs', mockTabsWithDisabled);
      fixture.detectChanges();

      component.ngOnInit();
      const initialTab = component.activeTab();

      component.selectTab(mockTabsWithDisabled[1], 1);
      fixture.detectChanges();

      expect(component.activeTab()).toBe(initialTab);
    });

    it('isActive should return true for active tab', () => {
      fixture.componentRef.setInput('tabs', mockTabs);
      fixture.detectChanges();

      component.ngOnInit();
      component.selectTab(mockTabs[0], 0);
      fixture.detectChanges();

      expect(component.isActive(mockTabs[0])).toBe(true);
    });

    it('isActive should return false for inactive tab', () => {
      fixture.componentRef.setInput('tabs', mockTabs);
      fixture.detectChanges();

      component.ngOnInit();
      component.selectTab(mockTabs[0], 0);
      fixture.detectChanges();

      expect(component.isActive(mockTabs[1])).toBe(false);
    });
  });

  describe('Keyboard Navigation', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('tabs', mockTabs);
      fixture.detectChanges();
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should navigate to next tab with ArrowRight', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      component.handleKeyDown(event, 0);
      fixture.detectChanges();

      expect(component.focusedTabIndex()).toBe(1);
    });

    it('should navigate to previous tab with ArrowLeft', () => {
      component.focusedTabIndex.set(1);
      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      component.handleKeyDown(event, 1);
      fixture.detectChanges();

      expect(component.focusedTabIndex()).toBe(0);
    });

    it('should navigate to first tab with Home key', () => {
      component.focusedTabIndex.set(2);
      const event = new KeyboardEvent('keydown', { key: 'Home' });
      component.handleKeyDown(event, 2);
      fixture.detectChanges();

      expect(component.focusedTabIndex()).toBe(0);
    });

    it('should navigate to last tab with End key', () => {
      const event = new KeyboardEvent('keydown', { key: 'End' });
      component.handleKeyDown(event, 0);
      fixture.detectChanges();

      expect(component.focusedTabIndex()).toBe(2);
    });

    it('should select tab with Enter key', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      const spy = vi.fn();
      component.tabChanged.subscribe(spy);

      component.handleKeyDown(event, 0);
      fixture.detectChanges();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Computed Properties', () => {
    it('activeTabItem should return correct tab', () => {
      fixture.componentRef.setInput('tabs', mockTabs);
      fixture.detectChanges();

      component.ngOnInit();
      component.selectTab(mockTabs[1], 1);
      fixture.detectChanges();

      expect(component.activeTabItem()).toEqual(mockTabs[1]);
    });

    it('activeContent should return correct content', () => {
      fixture.componentRef.setInput('tabs', mockTabs);
      fixture.detectChanges();

      component.ngOnInit();
      component.selectTab(mockTabs[1], 1);
      fixture.detectChanges();

      expect(component.activeContent()).toBe('Content 2');
    });

    it('enabledTabs should filter out disabled tabs', () => {
      fixture.componentRef.setInput('tabs', mockTabsWithDisabled);
      fixture.detectChanges();

      const enabled = component.enabledTabs();
      expect(enabled.length).toBe(2);
      expect(enabled.some((t) => t.disabled)).toBe(false);
    });

    it('tabListClasses should include justified class', () => {
      fixture.componentRef.setInput('tabs', mockTabs);
      fixture.componentRef.setInput('justified', true);
      fixture.detectChanges();

      expect(component.tabListClasses()).toContain('tabs-list-justified');
    });

    it('tabListClasses should include fullWidth class', () => {
      fixture.componentRef.setInput('tabs', mockTabs);
      fixture.componentRef.setInput('fullWidth', true);
      fixture.detectChanges();

      expect(component.tabListClasses()).toContain('tabs-list-full-width');
    });
  });
});
