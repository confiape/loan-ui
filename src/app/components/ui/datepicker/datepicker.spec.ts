import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component } from '@angular/core';

import { Datepicker, DateRange } from './datepicker';

describe('Datepicker', () => {
  let component: Datepicker;
  let fixture: ComponentFixture<Datepicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Datepicker],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(Datepicker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ControlValueAccessor', () => {
    it('should implement ControlValueAccessor', () => {
      expect(component.writeValue).toBeDefined();
      expect(component.registerOnChange).toBeDefined();
      expect(component.registerOnTouched).toBeDefined();
      expect(component.setDisabledState).toBeDefined();
    });

    it('should write value for single mode', () => {
      const testDate = new Date(2024, 0, 15);
      component.writeValue(testDate);
      expect(component.selectedDate()).toEqual(testDate);
    });

    it('should write value for range mode', () => {
      fixture.componentRef.setInput('selectionMode', 'range');
      const testRange: DateRange = {
        start: new Date(2024, 0, 1),
        end: new Date(2024, 0, 31),
      };
      component.writeValue(testRange);
      expect(component.selectedRange()).toEqual(testRange);
    });

    it('should write value for multiple mode', () => {
      fixture.componentRef.setInput('selectionMode', 'multiple');
      const testDates = [new Date(2024, 0, 1), new Date(2024, 0, 15)];
      component.writeValue(testDates);
      expect(component.selectedMultiple()).toEqual(testDates);
    });

    it('should register onChange callback', () => {
      const onChange = vi.fn();
      component.registerOnChange(onChange);
      const testDate = new Date(2024, 0, 15);
      component.selectDate(testDate);
      expect(onChange).toHaveBeenCalledWith(testDate);
    });

    it('should register onTouched callback', () => {
      const onTouched = vi.fn();
      component.registerOnTouched(onTouched);
      component.close();
      expect(onTouched).toHaveBeenCalled();
    });

    it('should set disabled state', () => {
      component.setDisabledState(true);
      expect(component.isDisabledState()).toBe(true);

      component.setDisabledState(false);
      expect(component.isDisabledState()).toBe(false);
    });

    it('should notify form when value changes in single mode', () => {
      const onChange = vi.fn();
      component.registerOnChange(onChange);
      const testDate = new Date(2024, 0, 15);
      component.selectDate(testDate);
      expect(onChange).toHaveBeenCalledWith(testDate);
    });

    it('should notify form when clearing value', () => {
      const onChange = vi.fn();
      component.registerOnChange(onChange);
      component.clear();
      expect(onChange).toHaveBeenCalledWith(null);
    });
  });

  describe('Form Integration', () => {
    @Component({
      template: `
        <form [formGroup]="form">
          <app-datepicker formControlName="date"></app-datepicker>
        </form>
      `,
      standalone: true,
      imports: [Datepicker, ReactiveFormsModule],
    })
    class TestHostComponent {
      form = new FormGroup({
        date: new FormControl<Date | null>(null),
      });
    }

    let hostFixture: ComponentFixture<TestHostComponent>;
    let hostComponent: TestHostComponent;

    beforeEach(() => {
      TestBed.resetTestingModule();
    });

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TestHostComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      hostFixture = TestBed.createComponent(TestHostComponent);
      hostComponent = hostFixture.componentInstance;
      hostFixture.detectChanges();
    });

    it('should integrate with reactive forms', () => {
      const testDate = new Date(2024, 0, 15);
      hostComponent.form.controls.date.setValue(testDate);
      hostFixture.detectChanges();

      const datepickerComponent = hostFixture.debugElement.query(
        (el) => el.componentInstance instanceof Datepicker,
      )?.componentInstance as Datepicker;

      expect(datepickerComponent.selectedDate()).toEqual(testDate);
    });

    it('should update form when date is selected', async () => {
      const datepickerComponent = hostFixture.debugElement.query(
        (el) => el.componentInstance instanceof Datepicker,
      )?.componentInstance as Datepicker;

      const testDate = new Date(2024, 0, 15);
      datepickerComponent.selectDate(testDate);
      hostFixture.detectChanges();

      await hostFixture.whenStable();

      expect(hostComponent.form.controls.date.value).toEqual(testDate);
    });

    it('should respect disabled state from form', () => {
      hostComponent.form.controls.date.disable();
      hostFixture.detectChanges();

      const datepickerComponent = hostFixture.debugElement.query(
        (el) => el.componentInstance instanceof Datepicker,
      )?.componentInstance as Datepicker;

      expect(datepickerComponent.isDisabledState()).toBe(true);
    });

    it('should show validation errors', () => {
      hostComponent.form.controls.date.setValidators([Validators.required]);
      hostComponent.form.controls.date.markAsTouched();
      hostComponent.form.controls.date.updateValueAndValidity();
      hostFixture.detectChanges();

      const datepickerComponent = hostFixture.debugElement.query(
        (el) => el.componentInstance instanceof Datepicker,
      )?.componentInstance as Datepicker;

      expect(datepickerComponent.shouldDisplayErrors()).toBe(true);
    });
  });

  describe('Validation', () => {
    it('should have neutral validation state initially', () => {
      expect(component.validationState()).toBe('neutral');
    });

    it('should display error message when invalid and touched', () => {
      // Mock control state
      component['controlState'].set({
        control: null,
        invalid: true,
        touched: true,
        dirty: false,
        errors: { required: true },
      });

      expect(component.shouldDisplayErrors()).toBe(true);
      expect(component.currentErrorMessage()).toBeTruthy();
    });

    it('should not display error when invalid but not touched', () => {
      component['controlState'].set({
        control: null,
        invalid: true,
        touched: false,
        dirty: false,
        errors: { required: true },
      });

      expect(component.shouldDisplayErrors()).toBe(false);
    });

    it('should show success state when valid and touched', () => {
      // Create a mock control
      const mockControl = new FormControl(new Date());
      mockControl.markAsTouched();

      component['controlState'].set({
        control: mockControl,
        invalid: false,
        touched: true,
        dirty: false,
        errors: null,
      });

      expect(component.validationState()).toBe('success');
    });

    it('should use custom error message when provided', () => {
      fixture.componentRef.setInput('errorMessage', 'Custom error');
      expect(component.currentErrorMessage()).toBe('Custom error');
    });
  });

  describe('Date Selection with Forms', () => {
    it('should mark as touched when closing picker', () => {
      const onTouched = vi.fn();
      component.registerOnTouched(onTouched);

      fixture.componentRef.setInput('displayMode', 'popup');
      component.open();
      component.close();

      expect(onTouched).toHaveBeenCalled();
    });

    it('should notify form on clear', () => {
      const onChange = vi.fn();
      component.registerOnChange(onChange);

      const testDate = new Date(2024, 0, 15);
      component.selectDate(testDate);
      onChange.mockClear();

      component.clear();
      expect(onChange).toHaveBeenCalledWith(null);
    });

    it('should notify form when time changes in single mode', () => {
      const onChange = vi.fn();
      component.registerOnChange(onChange);
      fixture.componentRef.setInput('showTime', true);

      const testDate = new Date(2024, 0, 15, 0, 0);
      component.selectDate(testDate);
      onChange.mockClear();

      component.setHour(14);
      expect(onChange).toHaveBeenCalled();
    });

    it('should notify form for range selection', () => {
      const onChange = vi.fn();
      component.registerOnChange(onChange);
      fixture.componentRef.setInput('selectionMode', 'range');

      const date1 = new Date(2024, 0, 1);
      const date2 = new Date(2024, 0, 15);

      component.selectRangeDate(date1);
      component.selectRangeDate(date2);

      expect(onChange).toHaveBeenCalledWith({
        start: date1,
        end: date2,
      });
    });

    it('should notify form for multiple date selection', () => {
      const onChange = vi.fn();
      component.registerOnChange(onChange);
      fixture.componentRef.setInput('selectionMode', 'multiple');

      const date1 = new Date(2024, 0, 1);
      const date2 = new Date(2024, 0, 15);

      component.selectMultipleDate(date1);
      component.selectMultipleDate(date2);

      expect(onChange).toHaveBeenCalledWith(expect.arrayContaining([date1, date2]));
    });
  });
});
