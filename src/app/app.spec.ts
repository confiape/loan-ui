import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './app';
import { DropdownItem } from './components/ui/dropdown/dropdown.component';
import { MultiSelectItem } from './components/ui/multiselect/multiselect.component';
import { AccordionItem } from './components/ui/accordion/accordion.component';
import { TabItem } from './components/ui/tabs/tabs.component';

describe('App', () => {
  let component: App;
  let fixture: ComponentFixture<App>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create the app', () => {
      expect(component).toBeTruthy();
    });

    it('should render without errors', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled).toBeTruthy();
    });

    it('should initialize color values', () => {
      expect(component['currentLightColors']()).toBeDefined();
      expect(component['currentDarkColors']()).toBeDefined();
    });

    it('should initialize with default colors', () => {
      const lightColors = component['currentLightColors']();
      const darkColors = component['currentDarkColors']();

      expect(lightColors['primary']).toBeDefined();
      expect(darkColors['primary']).toBeDefined();
    });
  });

  describe('Color Theme Management - Light Mode', () => {
    it('should change light mode color', () => {
      const initialColors = component['currentLightColors']();
      const newColor = '#ff0000';

      component['onColorChange']('primary', newColor, false);

      const updatedColors = component['currentLightColors']();
      expect(updatedColors['primary']).toBe(newColor);
    });

    it('should update currentLightColors signal when changing light color', () => {
      const initialColors = component['currentLightColors']();
      const newColor = '#00ff00';

      component['onColorChange']('success', newColor, false);

      const updatedColors = component['currentLightColors']();
      expect(updatedColors['success']).toBe(newColor);
      expect(updatedColors).not.toBe(initialColors);
    });

    it('should apply light colors to CSS variables', () => {
      const newColor = '#0000ff';
      const root = document.documentElement;

      component['onColorChange']('info', newColor, false);

      const appliedColor = root.style.getPropertyValue('--color-info');
      expect(appliedColor).toBe(newColor);
    });

    it('should preserve other colors when changing one light color', () => {
      const initialPrimary = component['currentLightColors']()['primary'];

      component['onColorChange']('success', '#123456', false);

      const updatedPrimary = component['currentLightColors']()['primary'];
      expect(updatedPrimary).toBe(initialPrimary);
    });
  });

  describe('Color Theme Management - Dark Mode', () => {
    it('should change dark mode color', () => {
      const newColor = '#ff00ff';

      component['onColorChange']('primary', newColor, true);

      const updatedColors = component['currentDarkColors']();
      expect(updatedColors['primary']).toBe(newColor);
    });

    it('should update currentDarkColors signal when changing dark color', () => {
      const initialColors = component['currentDarkColors']();
      const newColor = '#00ffff';

      component['onColorChange']('error', newColor, true);

      const updatedColors = component['currentDarkColors']();
      expect(updatedColors['error']).toBe(newColor);
      expect(updatedColors).not.toBe(initialColors);
    });

    it('should create style element for dark colors', () => {
      const newColor = '#abcdef';

      component['onColorChange']('warning', newColor, true);

      const styleElement = document.getElementById('dynamic-dark-colors');
      expect(styleElement).toBeTruthy();
      expect(styleElement?.tagName).toBe('STYLE');
    });

    it('should apply dark colors to style element', () => {
      const newColor = '#fedcba';

      component['onColorChange']('secondary', newColor, true);

      const styleElement = document.getElementById('dynamic-dark-colors');
      expect(styleElement?.textContent).toContain('--color-secondary');
      expect(styleElement?.textContent).toContain(newColor);
      expect(styleElement?.textContent).toContain('.dark');
    });

    it('should reuse existing style element for dark colors', () => {
      component['onColorChange']('primary', '#111111', true);
      const firstElement = document.getElementById('dynamic-dark-colors');

      component['onColorChange']('success', '#222222', true);
      const secondElement = document.getElementById('dynamic-dark-colors');

      expect(firstElement).toBe(secondElement);
    });
  });

  describe('Color Reset', () => {
    it('should reset colors to defaults', () => {
      // Change some colors
      component['onColorChange']('primary', '#ff0000', false);
      component['onColorChange']('success', '#00ff00', true);

      // Reset
      component['resetColors']();

      const lightColors = component['currentLightColors']();
      const darkColors = component['currentDarkColors']();

      // Should be back to default colors
      expect(lightColors['primary']).toBe('#1d4ed8');
      expect(darkColors['success']).toBe('#16a34a');
    });

    it('should reset both light and dark colors', () => {
      component['onColorChange']('error', '#ff0000', false);
      component['onColorChange']('warning', '#00ff00', true);

      component['resetColors']();

      const lightColors = component['currentLightColors']();
      const darkColors = component['currentDarkColors']();

      expect(lightColors['error']).toBe('#b91c1c');
      expect(darkColors['warning']).toBe('#facc15');
    });

    it('should apply reset colors to DOM', () => {
      const root = document.documentElement;
      component['onColorChange']('primary', '#ffffff', false);

      component['resetColors']();

      const appliedColor = root.style.getPropertyValue('--color-primary');
      expect(appliedColor).toBe('#1d4ed8');
    });
  });

  describe('Event Handlers - Dropdown', () => {
    it('should handle dropdown change', () => {
      const consoleSpy = vi.spyOn(console, 'log');
      const item: DropdownItem = { label: 'Test', value: 'test' };

      component['onDropdownChange'](item);

      expect(component['selectedDropdownItem']()).toEqual(item);
      expect(consoleSpy).toHaveBeenCalledWith('Dropdown selected:', item);

      consoleSpy.mockRestore();
    });

    it('should update selected dropdown item signal', () => {
      const item1: DropdownItem = { label: 'Item 1', value: 1 };
      const item2: DropdownItem = { label: 'Item 2', value: 2 };

      component['onDropdownChange'](item1);
      expect(component['selectedDropdownItem']()).toEqual(item1);

      component['onDropdownChange'](item2);
      expect(component['selectedDropdownItem']()).toEqual(item2);
    });
  });

  describe('Event Handlers - MultiSelect', () => {
    it('should handle multiselect change', () => {
      const consoleSpy = vi.spyOn(console, 'log');
      const items: MultiSelectItem[] = [
        { label: 'Item 1', value: 1 },
        { label: 'Item 2', value: 2 },
      ];

      component['onMultiSelectChange'](items);

      expect(component['selectedMultiItems']()).toEqual(items);
      expect(consoleSpy).toHaveBeenCalledWith('MultiSelect changed:', items);

      consoleSpy.mockRestore();
    });

    it('should update selected multi items signal', () => {
      const items1: MultiSelectItem[] = [{ label: 'A', value: 'a' }];
      const items2: MultiSelectItem[] = [
        { label: 'B', value: 'b' },
        { label: 'C', value: 'c' },
      ];

      component['onMultiSelectChange'](items1);
      expect(component['selectedMultiItems']()).toEqual(items1);

      component['onMultiSelectChange'](items2);
      expect(component['selectedMultiItems']()).toEqual(items2);
    });
  });

  describe('Event Handlers - Modals', () => {
    it('should open light modal', () => {
      expect(component['isModalOpenLight']()).toBe(false);

      component['openModalLight']();

      expect(component['isModalOpenLight']()).toBe(true);
    });

    it('should close light modal', () => {
      component['isModalOpenLight'].set(true);

      component['closeModalLight']();

      expect(component['isModalOpenLight']()).toBe(false);
    });

    it('should open dark modal', () => {
      expect(component['isModalOpenDark']()).toBe(false);

      component['openModalDark']();

      expect(component['isModalOpenDark']()).toBe(true);
    });

    it('should close dark modal', () => {
      component['isModalOpenDark'].set(true);

      component['closeModalDark']();

      expect(component['isModalOpenDark']()).toBe(false);
    });

    it('should handle multiple modal toggles', () => {
      component['openModalLight']();
      expect(component['isModalOpenLight']()).toBe(true);

      component['closeModalLight']();
      expect(component['isModalOpenLight']()).toBe(false);

      component['openModalLight']();
      expect(component['isModalOpenLight']()).toBe(true);
    });
  });

  describe('Event Handlers - Accordion', () => {
    it('should handle accordion toggle', () => {
      const consoleSpy = vi.spyOn(console, 'log');
      const item: AccordionItem = {
        id: '1',
        title: 'Test',
        content: 'Content',
        isOpen: true,
      };

      component['onAccordionToggle'](item);

      expect(consoleSpy).toHaveBeenCalledWith('Accordion toggled:', item);

      consoleSpy.mockRestore();
    });

    it('should log accordion toggle events', () => {
      const consoleSpy = vi.spyOn(console, 'log');
      const item1: AccordionItem = {
        id: '1',
        title: 'Item 1',
        content: 'Content 1',
        isOpen: false,
      };
      const item2: AccordionItem = {
        id: '2',
        title: 'Item 2',
        content: 'Content 2',
        isOpen: true,
      };

      component['onAccordionToggle'](item1);
      component['onAccordionToggle'](item2);

      expect(consoleSpy).toHaveBeenCalledTimes(2);

      consoleSpy.mockRestore();
    });
  });

  describe('Event Handlers - Tabs', () => {
    it('should handle tab change', () => {
      const consoleSpy = vi.spyOn(console, 'log');
      const tab: TabItem = { id: 'tab1', label: 'Tab 1', content: 'Content' };

      component['onTabChange'](tab);

      expect(consoleSpy).toHaveBeenCalledWith('Tab changed:', tab);

      consoleSpy.mockRestore();
    });

    it('should log tab change events', () => {
      const consoleSpy = vi.spyOn(console, 'log');
      const tab1: TabItem = { id: '1', label: 'First', content: 'Content 1' };
      const tab2: TabItem = { id: '2', label: 'Second', content: 'Content 2' };

      component['onTabChange'](tab1);
      component['onTabChange'](tab2);

      expect(consoleSpy).toHaveBeenCalledTimes(2);

      consoleSpy.mockRestore();
    });
  });

  describe('Event Handlers - Toast', () => {
    it('should show success toast', () => {
      const initialLength = component['toasts']().length;

      component['showToast']('success');

      const toasts = component['toasts']();
      expect(toasts.length).toBe(initialLength + 1);
      expect(toasts[toasts.length - 1].type).toBe('success');
      expect(toasts[toasts.length - 1].title).toBe('Éxito!');
    });

    it('should show error toast', () => {
      const initialLength = component['toasts']().length;

      component['showToast']('error');

      const toasts = component['toasts']();
      expect(toasts.length).toBe(initialLength + 1);
      expect(toasts[toasts.length - 1].type).toBe('error');
      expect(toasts[toasts.length - 1].title).toBe('Error!');
    });

    it('should show warning toast', () => {
      const initialLength = component['toasts']().length;

      component['showToast']('warning');

      const toasts = component['toasts']();
      expect(toasts.length).toBe(initialLength + 1);
      expect(toasts[toasts.length - 1].type).toBe('warning');
      expect(toasts[toasts.length - 1].title).toBe('Advertencia!');
    });

    it('should show info toast', () => {
      const initialLength = component['toasts']().length;

      component['showToast']('info');

      const toasts = component['toasts']();
      expect(toasts.length).toBe(initialLength + 1);
      expect(toasts[toasts.length - 1].type).toBe('info');
      expect(toasts[toasts.length - 1].title).toBe('Información');
    });

    it('should create toast with correct properties', () => {
      component['showToast']('success');

      const toasts = component['toasts']();
      const lastToast = toasts[toasts.length - 1];

      expect(lastToast.id).toBeDefined();
      expect(lastToast.duration).toBe(5000);
      expect(lastToast.dismissible).toBe(true);
      expect(lastToast.message).toBeDefined();
    });

    it('should dismiss toast by id', () => {
      component['showToast']('success');
      const toasts = component['toasts']();
      const toastId = toasts[toasts.length - 1].id;

      component['dismissToast'](toastId);

      const updatedToasts = component['toasts']();
      const dismissed = updatedToasts.find((t) => t.id === toastId);
      expect(dismissed).toBeUndefined();
    });

    it('should handle dismissing non-existent toast', () => {
      const initialToasts = component['toasts']();

      component['dismissToast']('non-existent-id');

      const updatedToasts = component['toasts']();
      expect(updatedToasts.length).toBe(initialToasts.length);
    });

    it('should generate unique toast IDs', async () => {
      component['showToast']('success');

      // Wait 1ms to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 2));

      component['showToast']('error');

      const toasts = component['toasts']();
      const lastTwo = toasts.slice(-2);

      expect(lastTwo[0].id).not.toBe(lastTwo[1].id);
    });
  });
});
