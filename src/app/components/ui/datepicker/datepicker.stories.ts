import { Meta, StoryObj } from '@storybook/angular';
import { Datepicker, DateRange } from './datepicker';
import {
  createLightDarkComparison,
  wrapInLightDarkComparison,
} from '../../../../stories/story-helpers';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { JsonPipe } from '@angular/common';

const meta: Meta<Datepicker> = {
  title: 'UI/Datepicker',
  component: Datepicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    selectionMode: {
      control: 'select',
      options: ['single', 'range', 'multiple'],
    },
    displayMode: {
      control: 'select',
      options: ['inline', 'popup'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    showTime: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    required: { control: 'boolean' },
    showMonthYearPicker: { control: 'boolean' },
    showTodayButton: { control: 'boolean' },
    showClearButton: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<Datepicker>;

// ========================================
// BASIC STORIES
// ========================================

export const Default: Story = {
  args: {
    label: 'Fecha',
    placeholder: 'Seleccionar fecha',
    selectionMode: 'single',
    displayMode: 'popup',
    size: 'md',
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-datepicker',
      `
        [label]="label"
        [placeholder]="placeholder"
        [selectionMode]="selectionMode"
        [displayMode]="displayMode"
        [size]="size"
      `,
    ),
  }),
};

export const WithLabel: Story = {
  args: {
    label: 'Fecha de nacimiento',
    placeholder: 'dd/mm/yyyy',
    selectionMode: 'single',
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-datepicker',
      `[label]="label" [placeholder]="placeholder" [selectionMode]="selectionMode"`,
    ),
  }),
};

export const Required: Story = {
  args: {
    label: 'Fecha requerida',
    placeholder: 'Seleccionar fecha',
    required: true,
    selectionMode: 'single',
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-datepicker',
      `[label]="label" [placeholder]="placeholder" [required]="required" [selectionMode]="selectionMode"`,
    ),
  }),
};

export const Disabled: Story = {
  args: {
    label: 'Fecha deshabilitada',
    placeholder: 'Seleccionar fecha',
    disabled: true,
    value: new Date(),
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-datepicker',
      `[label]="label" [placeholder]="placeholder" [disabled]="disabled" [value]="value"`,
    ),
  }),
};

// ========================================
// SELECTION MODES
// ========================================

export const SingleDate: Story = {
  args: {
    label: 'Selección simple',
    selectionMode: 'single',
    displayMode: 'inline',
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-datepicker',
      `[label]="label" [selectionMode]="selectionMode" [displayMode]="displayMode"`,
    ),
  }),
};

export const RangeDate: Story = {
  args: {
    label: 'Selección de rango',
    selectionMode: 'range',
    displayMode: 'inline',
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-datepicker',
      `[label]="label" [selectionMode]="selectionMode" [displayMode]="displayMode"`,
    ),
  }),
};

export const MultipleDates: Story = {
  args: {
    label: 'Selección múltiple',
    selectionMode: 'multiple',
    displayMode: 'inline',
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-datepicker',
      `[label]="label" [selectionMode]="selectionMode" [displayMode]="displayMode"`,
    ),
  }),
};

// ========================================
// SIZES
// ========================================

export const Sizes: Story = {
  render: () => ({
    props: {},
    template: wrapInLightDarkComparison(`
      <div class="p-8 space-y-6">
        <div>
          <h3 class="text-lg font-semibold mb-4 text-[var(--color-text-primary)]">Small</h3>
          <app-datepicker label="Fecha pequeña" size="sm" placeholder="Small size"></app-datepicker>
        </div>
        <div>
          <h3 class="text-lg font-semibold mb-4 text-[var(--color-text-primary)]">Medium (Default)</h3>
          <app-datepicker label="Fecha mediana" size="md" placeholder="Medium size"></app-datepicker>
        </div>
        <div>
          <h3 class="text-lg font-semibold mb-4 text-[var(--color-text-primary)]">Large</h3>
          <app-datepicker label="Fecha grande" size="lg" placeholder="Large size"></app-datepicker>
        </div>
      </div>
    `),
  }),
};

// ========================================
// WITH TIME
// ========================================

export const WithTime: Story = {
  args: {
    label: 'Fecha y hora',
    selectionMode: 'single',
    showTime: true,
    displayMode: 'inline',
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-datepicker',
      `[label]="label" [selectionMode]="selectionMode" [showTime]="showTime" [displayMode]="displayMode"`,
    ),
  }),
};

// ========================================
// ANGULAR FORMS INTEGRATION
// ========================================

@Component({
  selector: 'app-datepicker-reactive-form-story',
  standalone: true,
  imports: [Datepicker, ReactiveFormsModule, JsonPipe],
  template: `
    <div class="p-8 max-w-2xl">
      <h2 class="text-2xl font-bold mb-6 text-[var(--color-text-primary)]">
        Reactive Form with Validation
      </h2>

      <form [formGroup]="form" class="space-y-6">
        <!-- Required field -->
        <app-datepicker
          label="Fecha de inicio (Requerida)"
          placeholder="Seleccionar fecha"
          formControlName="startDate"
          [required]="true"
        ></app-datepicker>

        <!-- Optional field -->
        <app-datepicker
          label="Fecha de fin (Opcional)"
          placeholder="Seleccionar fecha"
          formControlName="endDate"
        ></app-datepicker>

        <!-- Range selection -->
        <app-datepicker
          label="Rango de fechas"
          placeholder="Seleccionar rango"
          formControlName="dateRange"
          selectionMode="range"
        ></app-datepicker>

        <!-- Multiple selection -->
        <app-datepicker
          label="Fechas múltiples"
          placeholder="Seleccionar fechas"
          formControlName="multipleDates"
          selectionMode="multiple"
        ></app-datepicker>

        <!-- Form values -->
        <div class="mt-8 p-4 bg-[var(--color-bg-secondary)] rounded-lg">
          <h3 class="text-lg font-semibold mb-2 text-[var(--color-text-primary)]">Form Values:</h3>
          <pre class="text-sm text-[var(--color-text-secondary)]">{{ form.value | json }}</pre>
        </div>

        <!-- Form status -->
        <div class="mt-4 p-4 bg-[var(--color-bg-secondary)] rounded-lg">
          <h3 class="text-lg font-semibold mb-2 text-[var(--color-text-primary)]">Form Status:</h3>
          <p class="text-sm text-[var(--color-text-secondary)]">Valid: {{ form.valid }}</p>
          <p class="text-sm text-[var(--color-text-secondary)]">Touched: {{ form.touched }}</p>
          <p class="text-sm text-[var(--color-text-secondary)]">Dirty: {{ form.dirty }}</p>
        </div>

        <!-- Actions -->
        <div class="flex gap-4">
          <button type="button" class="btn btn-primary" (click)="submit()" [disabled]="!form.valid">
            Submit
          </button>
          <button type="button" class="btn btn-outline-secondary" (click)="reset()">Reset</button>
        </div>
      </form>
    </div>
  `,
})
class DatepickerReactiveFormStory {
  form = new FormGroup({
    startDate: new FormControl<Date | null>(null, [Validators.required]),
    endDate: new FormControl<Date | null>(null),
    dateRange: new FormControl<DateRange | null>(null),
    multipleDates: new FormControl<Date[]>([]),
  });

  submit(): void {
    if (this.form.valid) {
      console.log('Form submitted:', this.form.value);
      alert('Form submitted! Check console for values.');
    }
  }

  reset(): void {
    this.form.reset();
  }
}

export const ReactiveFormIntegration: Story = {
  render: () => ({
    props: {},
    template: wrapInLightDarkComparison(`
      <app-datepicker-reactive-form-story></app-datepicker-reactive-form-story>
    `),
    moduleMetadata: {
      imports: [DatepickerReactiveFormStory],
    },
  }),
};

@Component({
  selector: 'app-datepicker-validation-story',
  standalone: true,
  imports: [Datepicker, ReactiveFormsModule],
  template: `
    <div class="p-8 max-w-2xl">
      <h2 class="text-2xl font-bold mb-6 text-[var(--color-text-primary)]">
        Form Validation States
      </h2>

      <form [formGroup]="form" class="space-y-6">
        <!-- Untouched (neutral) -->
        <app-datepicker
          label="Untouched field"
          placeholder="Click to select"
          formControlName="untouched"
          [required]="true"
        ></app-datepicker>

        <!-- Invalid after touch -->
        <app-datepicker
          label="Required field (touch to see error)"
          placeholder="Select a date"
          formControlName="requiredField"
          [required]="true"
        ></app-datepicker>

        <!-- Valid field -->
        <app-datepicker
          label="Valid field with date"
          placeholder="Select a date"
          formControlName="validField"
        ></app-datepicker>

        <!-- Custom error message -->
        <app-datepicker
          label="Field with custom error"
          placeholder="Select a date"
          formControlName="customError"
          [errorMessage]="getCustomError()"
        ></app-datepicker>

        <!-- Actions to trigger validation -->
        <div class="flex gap-4">
          <button type="button" class="btn btn-primary" (click)="markAllAsTouched()">
            Mark All as Touched
          </button>
          <button type="button" class="btn btn-outline-secondary" (click)="setCustomError()">
            Set Custom Error
          </button>
        </div>
      </form>
    </div>
  `,
})
class DatepickerValidationStory {
  form = new FormGroup({
    untouched: new FormControl<Date | null>(null, [Validators.required]),
    requiredField: new FormControl<Date | null>(null, [Validators.required]),
    validField: new FormControl<Date | null>(new Date()),
    customError: new FormControl<Date | null>(null),
  });

  markAllAsTouched(): void {
    this.form.markAllAsTouched();
  }

  setCustomError(): void {
    this.form.controls.customError.setErrors({ custom: true });
    this.form.controls.customError.markAsTouched();
  }

  getCustomError(): string {
    const control = this.form.controls.customError;
    if (control.hasError('custom') && control.touched) {
      return 'This is a custom error message!';
    }
    return '';
  }
}

export const ValidationStates: Story = {
  render: () => ({
    props: {},
    template: wrapInLightDarkComparison(`
      <app-datepicker-validation-story></app-datepicker-validation-story>
    `),
    moduleMetadata: {
      imports: [DatepickerValidationStory],
    },
  }),
};

// ========================================
// DATE CONSTRAINTS
// ========================================

export const WithMinMaxDates: Story = {
  args: {
    label: 'Fecha con restricciones',
    placeholder: 'Seleccionar fecha',
    selectionMode: 'single',
    displayMode: 'inline',
    minDate: new Date(2024, 0, 1), // Jan 1, 2024
    maxDate: new Date(2024, 11, 31), // Dec 31, 2024
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-datepicker',
      `
        [label]="label"
        [placeholder]="placeholder"
        [selectionMode]="selectionMode"
        [displayMode]="displayMode"
        [minDate]="minDate"
        [maxDate]="maxDate"
      `,
    ),
  }),
};

// ========================================
// DISPLAY MODES
// ========================================

export const InlineMode: Story = {
  args: {
    label: 'Calendario inline',
    selectionMode: 'single',
    displayMode: 'inline',
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-datepicker',
      `[label]="label" [selectionMode]="selectionMode" [displayMode]="displayMode"`,
    ),
  }),
};

export const PopupMode: Story = {
  args: {
    label: 'Calendario popup',
    placeholder: 'Click para abrir',
    selectionMode: 'single',
    displayMode: 'popup',
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-datepicker',
      `[label]="label" [placeholder]="placeholder" [selectionMode]="selectionMode" [displayMode]="displayMode"`,
    ),
  }),
};
