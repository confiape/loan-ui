import type { Meta, StoryObj } from '@storybook/angular';
import { Datepicker } from '../app/components/ui/datepicker/datepicker';
import { createLightDarkComparison, wrapInLightDarkComparison } from './story-helpers';

// Mock function for action logging
const fn = () => (value: unknown) => console.log('Action:', value);

const meta: Meta<Datepicker> = {
  title: 'UI/Datepicker',
  component: Datepicker,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    selectionMode: {
      control: 'select',
      options: ['single', 'range', 'multiple'],
      description: 'Modo de selección de fechas',
    },
    displayMode: {
      control: 'select',
      options: ['popup', 'inline'],
      description: 'Modo de visualización del calendario',
    },
    showTime: {
      control: 'boolean',
      description: 'Mostrar selector de hora',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Tamaño del input',
    },
    disabled: {
      control: 'boolean',
      description: 'Deshabilitar el datepicker',
    },
    readonly: {
      control: 'boolean',
      description: 'Solo lectura',
    },
    required: {
      control: 'boolean',
      description: 'Campo requerido',
    },
    placeholder: {
      control: 'text',
      description: 'Texto placeholder del input',
    },
    label: {
      control: 'text',
      description: 'Etiqueta del campo',
    },
    showMonthYearPicker: {
      control: 'boolean',
      description: 'Mostrar selector rápido de mes/año',
    },
    showTodayButton: {
      control: 'boolean',
      description: 'Mostrar botón "Hoy"',
    },
    showClearButton: {
      control: 'boolean',
      description: 'Mostrar botón "Limpiar"',
    },
  },
  args: {
    dateChange: fn(),
    rangeChange: fn(),
    multipleChange: fn(),
    onOpen: fn(),
    onClose: fn(),
  },
};

export default meta;
type Story = StoryObj<Datepicker>;

// ========================================
// BASIC VARIANTS
// ========================================

export const Default: Story = {
  args: {
    label: 'Fecha',
    placeholder: 'Seleccionar fecha',
  },
  render: (args) => ({
    props: args,
    template: wrapInLightDarkComparison(`
      <div style="padding: 20px;">
        <app-datepicker
          [label]="label"
          [placeholder]="placeholder"
          (dateChange)="dateChange($event)"
        />
      </div>
    `),
  }),
};

export const WithLabel: Story = {
  args: {
    label: 'Fecha de nacimiento',
    placeholder: 'dd/mm/aaaa',
    required: true,
  },
  render: (args) => ({
    props: args,
    template: wrapInLightDarkComparison(`
      <div style="padding: 20px;">
        <app-datepicker
          [label]="label"
          [placeholder]="placeholder"
          [required]="required"
          (dateChange)="dateChange($event)"
        />
      </div>
    `),
  }),
};

export const InlineCalendar: Story = {
  args: {
    displayMode: 'inline',
    label: 'Calendario Inline',
  },
  render: (args) => ({
    props: args,
    template: wrapInLightDarkComparison(`
      <div style="padding: 20px;">
        <app-datepicker
          [displayMode]="displayMode"
          [label]="label"
          (dateChange)="dateChange($event)"
        />
      </div>
    `),
  }),
};

// ========================================
// SIZES
// ========================================

export const Sizes: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div style="padding: 20px; display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
        <app-datepicker
          label="Small"
          size="sm"
          placeholder="Fecha pequeña"
        />
        <app-datepicker
          label="Medium (Default)"
          size="md"
          placeholder="Fecha mediana"
        />
        <app-datepicker
          label="Large"
          size="lg"
          placeholder="Fecha grande"
        />
      </div>
    `),
  }),
};

// ========================================
// SELECTION MODES
// ========================================

export const SingleDate: Story = {
  args: {
    selectionMode: 'single',
    label: 'Selección única',
    placeholder: 'Seleccionar una fecha',
  },
  render: (args) => ({
    props: args,
    template: wrapInLightDarkComparison(`
      <div style="padding: 20px;">
        <app-datepicker
          [selectionMode]="selectionMode"
          [label]="label"
          [placeholder]="placeholder"
          (dateChange)="dateChange($event)"
        />
      </div>
    `),
  }),
};

export const DateRange: Story = {
  args: {
    selectionMode: 'range',
    label: 'Rango de fechas',
    placeholder: 'Seleccionar rango',
  },
  render: (args) => ({
    props: args,
    template: wrapInLightDarkComparison(`
      <div style="padding: 20px;">
        <app-datepicker
          [selectionMode]="selectionMode"
          [label]="label"
          [placeholder]="placeholder"
          (rangeChange)="rangeChange($event)"
        />
      </div>
    `),
  }),
};

export const MultipleDates: Story = {
  args: {
    selectionMode: 'multiple',
    label: 'Fechas múltiples',
    placeholder: 'Seleccionar múltiples fechas',
  },
  render: (args) => ({
    props: args,
    template: wrapInLightDarkComparison(`
      <div style="padding: 20px;">
        <app-datepicker
          [selectionMode]="selectionMode"
          [label]="label"
          [placeholder]="placeholder"
          (multipleChange)="multipleChange($event)"
        />
      </div>
    `),
  }),
};

// ========================================
// WITH TIME PICKER
// ========================================

export const WithTimePicker: Story = {
  args: {
    label: 'Fecha y hora',
    showTime: true,
    placeholder: 'Seleccionar fecha y hora',
  },
  render: (args) => ({
    props: args,
    template: wrapInLightDarkComparison(`
      <div style="padding: 20px;">
        <app-datepicker
          [label]="label"
          [showTime]="showTime"
          [placeholder]="placeholder"
          (dateChange)="dateChange($event)"
        />
      </div>
    `),
  }),
};

export const RangeWithTime: Story = {
  args: {
    selectionMode: 'range',
    label: 'Rango con hora',
    showTime: true,
    placeholder: 'Seleccionar rango con hora',
  },
  render: (args) => ({
    props: args,
    template: wrapInLightDarkComparison(`
      <div style="padding: 20px;">
        <app-datepicker
          [selectionMode]="selectionMode"
          [label]="label"
          [showTime]="showTime"
          [placeholder]="placeholder"
          (rangeChange)="rangeChange($event)"
        />
      </div>
    `),
  }),
};

// ========================================
// STATES
// ========================================

export const Disabled: Story = {
  args: {
    label: 'Fecha',
    disabled: true,
    placeholder: 'Campo deshabilitado',
  },
  render: (args) => ({
    props: args,
    template: wrapInLightDarkComparison(`
      <div style="padding: 20px;">
        <app-datepicker
          [label]="label"
          [disabled]="disabled"
          [placeholder]="placeholder"
        />
      </div>
    `),
  }),
};

export const Readonly: Story = {
  args: {
    label: 'Fecha',
    readonly: true,
    placeholder: 'Campo de solo lectura',
  },
  render: (args) => ({
    props: args,
    template: wrapInLightDarkComparison(`
      <div style="padding: 20px;">
        <app-datepicker
          [label]="label"
          [readonly]="readonly"
          [placeholder]="placeholder"
        />
      </div>
    `),
  }),
};

export const Required: Story = {
  args: {
    label: 'Fecha requerida',
    required: true,
    placeholder: 'Este campo es obligatorio',
  },
  render: (args) => ({
    props: args,
    template: wrapInLightDarkComparison(`
      <div style="padding: 20px;">
        <app-datepicker
          [label]="label"
          [required]="required"
          [placeholder]="placeholder"
        />
      </div>
    `),
  }),
};

// ========================================
// DATE CONSTRAINTS
// ========================================

export const WithMinMaxDates: Story = {
  args: {
    label: 'Fecha con límites',
    placeholder: 'Solo próximos 30 días',
  },
  render: (args) => ({
    props: {
      ...args,
      minDate: new Date(),
      maxDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    template: wrapInLightDarkComparison(`
      <div style="padding: 20px;">
        <app-datepicker
          [label]="label"
          [placeholder]="placeholder"
          [minDate]="minDate"
          [maxDate]="maxDate"
          (dateChange)="dateChange($event)"
        />
        <p style="margin-top: 8px; font-size: 12px; color: var(--color-text-secondary);">
          Solo se pueden seleccionar fechas de los próximos 30 días
        </p>
      </div>
    `),
  }),
};

export const WithDisabledWeekends: Story = {
  args: {
    label: 'Solo días laborables',
    placeholder: 'Fines de semana deshabilitados',
  },
  render: (args) => ({
    props: {
      ...args,
      disabledDateFn: (date: Date) => {
        const day = date.getDay();
        return day === 0 || day === 6; // Sunday = 0, Saturday = 6
      },
    },
    template: wrapInLightDarkComparison(`
      <div style="padding: 20px;">
        <app-datepicker
          [label]="label"
          [placeholder]="placeholder"
          [disabledDateFn]="disabledDateFn"
          (dateChange)="dateChange($event)"
        />
        <p style="margin-top: 8px; font-size: 12px; color: var(--color-text-secondary);">
          Los fines de semana están deshabilitados
        </p>
      </div>
    `),
  }),
};

// ========================================
// QUICK NAVIGATION OPTIONS
// ========================================

export const WithoutQuickNavigation: Story = {
  args: {
    label: 'Sin navegación rápida',
    showMonthYearPicker: false,
    showTodayButton: false,
    showClearButton: false,
  },
  render: (args) => ({
    props: args,
    template: wrapInLightDarkComparison(`
      <div style="padding: 20px;">
        <app-datepicker
          [label]="label"
          [showMonthYearPicker]="showMonthYearPicker"
          [showTodayButton]="showTodayButton"
          [showClearButton]="showClearButton"
          (dateChange)="dateChange($event)"
        />
      </div>
    `),
  }),
};

export const WithAllButtons: Story = {
  args: {
    label: 'Con todos los botones',
    showMonthYearPicker: true,
    showTodayButton: true,
    showClearButton: true,
  },
  render: (args) => ({
    props: args,
    template: wrapInLightDarkComparison(`
      <div style="padding: 20px;">
        <app-datepicker
          [label]="label"
          [showMonthYearPicker]="showMonthYearPicker"
          [showTodayButton]="showTodayButton"
          [showClearButton]="showClearButton"
          (dateChange)="dateChange($event)"
        />
      </div>
    `),
  }),
};

// ========================================
// DISPLAY MODES COMPARISON
// ========================================

export const DisplayModes: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div style="padding: 20px; display: flex; gap: 40px; flex-wrap: wrap;">
        <div style="flex: 1; min-width: 300px;">
          <h3 style="margin-bottom: 16px;">Popup Mode</h3>
          <app-datepicker
            label="Fecha"
            displayMode="popup"
            placeholder="Click para abrir calendario"
          />
        </div>
        <div style="flex: 1; min-width: 300px;">
          <h3 style="margin-bottom: 16px;">Inline Mode</h3>
          <app-datepicker
            label="Fecha"
            displayMode="inline"
          />
        </div>
      </div>
    `),
  }),
};

// ========================================
// SELECTION MODES COMPARISON
// ========================================

export const AllSelectionModes: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div style="padding: 20px; display: flex; flex-direction: column; gap: 24px; max-width: 400px;">
        <div>
          <h3 style="margin-bottom: 16px;">Single Date</h3>
          <app-datepicker
            selectionMode="single"
            label="Fecha única"
            placeholder="Seleccionar una fecha"
          />
        </div>
        <div>
          <h3 style="margin-bottom: 16px;">Date Range</h3>
          <app-datepicker
            selectionMode="range"
            label="Rango de fechas"
            placeholder="Seleccionar rango"
          />
        </div>
        <div>
          <h3 style="margin-bottom: 16px;">Multiple Dates</h3>
          <app-datepicker
            selectionMode="multiple"
            label="Fechas múltiples"
            placeholder="Seleccionar múltiples fechas"
          />
        </div>
      </div>
    `),
  }),
};

// ========================================
// COMPLEX EXAMPLES
// ========================================

export const BookingForm: Story = {
  render: () => ({
    props: {
      minDate: new Date(),
      disabledDateFn: (date: Date) => {
        const day = date.getDay();
        return day === 0 || day === 6;
      },
    },
    template: wrapInLightDarkComparison(`
      <div style="padding: 20px; max-width: 500px;">
        <h2 style="margin-bottom: 24px;">Formulario de Reserva</h2>

        <div style="display: flex; flex-direction: column; gap: 16px;">
          <app-datepicker
            label="Fecha de inicio"
            placeholder="Seleccionar fecha de inicio"
            [minDate]="minDate"
            [disabledDateFn]="disabledDateFn"
            required
            showTime
          />

          <app-datepicker
            label="Fecha de fin"
            placeholder="Seleccionar fecha de fin"
            [minDate]="minDate"
            [disabledDateFn]="disabledDateFn"
            required
            showTime
          />
        </div>
      </div>
    `),
  }),
};

export const EventScheduler: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div style="padding: 20px; max-width: 600px;">
        <h2 style="margin-bottom: 24px;">Programar Eventos</h2>

        <div style="display: flex; gap: 24px;">
          <div style="flex: 1;">
            <app-datepicker
              label="Fechas del evento"
              selectionMode="multiple"
              placeholder="Seleccionar fechas"
              displayMode="inline"
              showTime
            />
          </div>

          <div style="flex: 1;">
            <h3 style="margin-bottom: 16px;">Información</h3>
            <p style="font-size: 14px; color: var(--color-text-secondary);">
              Selecciona múltiples fechas en el calendario para programar eventos recurrentes.
            </p>
          </div>
        </div>
      </div>
    `),
  }),
};

export const VacationPicker: Story = {
  render: () => ({
    props: {
      minDate: new Date(),
      maxDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
    template: wrapInLightDarkComparison(`
      <div style="padding: 20px; max-width: 400px;">
        <h2 style="margin-bottom: 24px;">Solicitar Vacaciones</h2>

        <app-datepicker
          label="Periodo de vacaciones"
          selectionMode="range"
          placeholder="Seleccionar rango de fechas"
          [minDate]="minDate"
          [maxDate]="maxDate"
          required
        />

        <p style="margin-top: 12px; font-size: 12px; color: var(--color-text-secondary);">
          Selecciona el rango de fechas para tu periodo de vacaciones (hasta 1 año adelante)
        </p>
      </div>
    `),
  }),
};

// ========================================
// INLINE CALENDARS SHOWCASE
// ========================================

export const InlineCalendars: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div style="padding: 20px; display: flex; gap: 24px; flex-wrap: wrap; justify-content: center;">
        <app-datepicker
          label="Fecha única"
          displayMode="inline"
          selectionMode="single"
        />

        <app-datepicker
          label="Rango de fechas"
          displayMode="inline"
          selectionMode="range"
        />

        <app-datepicker
          label="Fechas múltiples"
          displayMode="inline"
          selectionMode="multiple"
        />
      </div>
    `),
  }),
};
