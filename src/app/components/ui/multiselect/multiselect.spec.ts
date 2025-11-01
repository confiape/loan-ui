import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideZonelessChangeDetection } from '@angular/core';
import { MultiSelectComponent, MultiSelectItem } from './multiselect';

describe('MultiSelectComponent', () => {
  let component: MultiSelectComponent;
  let fixture: ComponentFixture<MultiSelectComponent>;

  const testItems: MultiSelectItem[] = [
    { label: 'Option 1', value: 1 },
    { label: 'Option 2', value: 2 },
    { label: 'Option 3', value: 3 },
    { label: 'Option 4', value: 4, disabled: true },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiSelectComponent, ReactiveFormsModule],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(MultiSelectComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('items', testItems);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ControlValueAccessor', () => {
    it('should write value correctly', () => {
      const values = [1, 2];
      component.writeValue(values);

      expect(component.selectedItems().length).toBe(2);
      expect(component.selectedItems()[0].value).toBe(1);
      expect(component.selectedItems()[1].value).toBe(2);
    });

    it('should handle null value', () => {
      component.writeValue(null);
      expect(component.selectedItems().length).toBe(0);
    });

    it('should handle empty array', () => {
      component.writeValue([]);
      expect(component.selectedItems().length).toBe(0);
    });

    it('should register onChange callback', () => {
      const onChange = vi.fn();
      component.registerOnChange(onChange);

      component.toggleItem(testItems[0]);

      expect(onChange).toHaveBeenCalledWith([1]);
    });

    it('should register onTouched callback', () => {
      const onTouched = vi.fn();
      component.registerOnTouched(onTouched);

      component.close();

      expect(onTouched).toHaveBeenCalled();
    });

    it('should set disabled state', () => {
      component.setDisabledState(true);
      expect(component.isDisabled()).toBe(true);

      component.setDisabledState(false);
      expect(component.isDisabled()).toBe(false);
    });
  });

  describe('Form Integration', () => {
    it('should work with FormControl', () => {
      const formControl = new FormControl<unknown[]>([1, 2]);

      // Manually set up the form control
      component.registerOnChange((value) => formControl.setValue(value));
      component.writeValue(formControl.value);

      expect(component.selectedItems().length).toBe(2);

      // Toggle an item
      component.toggleItem(testItems[2]);

      expect(formControl.value).toContain(3);
    });

    it('should respect FormControl disabled state', () => {
      component.setDisabledState(true);
      expect(component.isDisabled()).toBe(true);
    });

    it('should display validation errors when touched and invalid', () => {
      const formControl = new FormControl([], Validators.required);

      // Simulate form control state
      component['controlState'].set({
        control: formControl,
        invalid: true,
        touched: true,
        dirty: false,
        errors: { required: true },
      });

      expect(component.shouldDisplayErrors()).toBe(true);
      expect(component.firstErrorKey()).toBe('required');
      expect(component.validationState()).toBe('error');
    });

    it('should not display errors when not touched', () => {
      const formControl = new FormControl([], Validators.required);

      component['controlState'].set({
        control: formControl,
        invalid: true,
        touched: false,
        dirty: false,
        errors: { required: true },
      });

      expect(component.shouldDisplayErrors()).toBe(false);
    });

    it('should display errors when dirty and invalid', () => {
      const formControl = new FormControl([], Validators.required);

      component['controlState'].set({
        control: formControl,
        invalid: true,
        touched: false,
        dirty: true,
        errors: { required: true },
      });

      expect(component.shouldDisplayErrors()).toBe(true);
    });
  });

  describe('Selection Management', () => {
    it('should toggle item selection', () => {
      const onChange = vi.fn();
      component.registerOnChange(onChange);

      component.toggleItem(testItems[0]);

      expect(component.selectedItems().length).toBe(1);
      expect(component.isSelected(testItems[0])).toBe(true);
      expect(onChange).toHaveBeenCalledWith([1]);
    });

    it('should deselect item when toggled again', () => {
      const onChange = vi.fn();
      component.registerOnChange(onChange);

      component.toggleItem(testItems[0]);
      component.toggleItem(testItems[0]);

      expect(component.selectedItems().length).toBe(0);
      expect(component.isSelected(testItems[0])).toBe(false);
      expect(onChange).toHaveBeenLastCalledWith([]);
    });

    it('should select all items', () => {
      const onChange = vi.fn();
      component.registerOnChange(onChange);

      component.selectAll();

      expect(component.selectedItems().length).toBe(3); // Excluding disabled
      expect(onChange).toHaveBeenCalled();
    });

    it('should clear all items', () => {
      const onChange = vi.fn();
      component.registerOnChange(onChange);

      component.writeValue([1, 2]);
      component.clearAll();

      expect(component.selectedItems().length).toBe(0);
      expect(onChange).toHaveBeenCalledWith([]);
    });

    it('should not select disabled items', () => {
      const disabledItem = testItems[3];

      component.toggleItem(disabledItem);

      expect(component.isSelected(disabledItem)).toBe(false);
    });

    it('should respect maxSelections limit', () => {
      fixture.componentRef.setInput('maxSelections', 2);
      const onChange = vi.fn();
      component.registerOnChange(onChange);

      component.toggleItem(testItems[0]);
      component.toggleItem(testItems[1]);
      component.toggleItem(testItems[2]);

      expect(component.selectedItems().length).toBe(2);
    });
  });

  describe('Error Messages', () => {
    it('should return required error message', () => {
      component['controlState'].set({
        control: null,
        invalid: true,
        touched: true,
        dirty: false,
        errors: { required: true },
      });

      expect(component.getErrorMessage()).toBe('This field is required');
    });

    it('should return minlength error message', () => {
      component['controlState'].set({
        control: null,
        invalid: true,
        touched: true,
        dirty: false,
        errors: { minlength: { requiredLength: 3 } },
      });

      expect(component.getErrorMessage()).toContain('Minimum 3 items required');
    });

    it('should return default message for unknown error', () => {
      component['controlState'].set({
        control: null,
        invalid: true,
        touched: true,
        dirty: false,
        errors: { custom: true },
      });

      expect(component.getErrorMessage()).toContain('Validation error: custom');
    });
  });

  describe('Keyboard Navigation', () => {
    it('should open dropdown on Enter key when focused', () => {
      // Set up event with proper target
      const button = fixture.nativeElement.querySelector('button');
      const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
      Object.defineProperty(event, 'target', { value: button, writable: false });

      component.onKeyDown(event);

      expect(component.isOpen()).toBe(true);
    });

    it('should close dropdown on Escape key', () => {
      component.open();
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      component.onKeyDown(event);

      expect(component.isOpen()).toBe(false);
    });
  });

  describe('Search Functionality', () => {
    it('should filter items based on search query', () => {
      component.searchQuery.set('option 1');

      const filtered = component.filteredItems();
      expect(filtered.length).toBe(1);
      expect(filtered[0].label).toBe('Option 1');
    });

    it('should show all items when search is empty', () => {
      component.searchQuery.set('');

      const filtered = component.filteredItems();
      expect(filtered.length).toBe(testItems.length);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes when invalid', () => {
      component['controlState'].set({
        control: null,
        invalid: true,
        touched: true,
        dirty: false,
        errors: { required: true },
      });

      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('button');
      expect(button.getAttribute('aria-invalid')).toBe('true');
      expect(button.getAttribute('aria-describedby')).toBe('multiselect-error');
    });

    it('should have aria-haspopup attribute', () => {
      const button = fixture.nativeElement.querySelector('button');
      expect(button.getAttribute('aria-haspopup')).toBe('true');
    });

    it('should update aria-expanded when dropdown opens/closes', () => {
      const button = fixture.nativeElement.querySelector('button');

      component.open();
      fixture.detectChanges();
      expect(button.getAttribute('aria-expanded')).toBe('true');

      component.close();
      fixture.detectChanges();
      expect(button.getAttribute('aria-expanded')).toBe('false');
    });
  });
});
