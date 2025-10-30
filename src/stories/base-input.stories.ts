import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import {
  CheckboxInputComponent,
  EmailInputComponent,
  NumericInputComponent,
  PasswordInputComponent,
  PhoneInputComponent,
  RadioInputComponent,
  SearchInputComponent,
  TextareaInputComponent,
  TextInputComponent,
  UrlInputComponent,
  type InputOption,
} from '../app/components/ui/base-input';
import { createLightDarkComparison, wrapInLightDarkComparison } from './story-helpers';

const meta: Meta<TextInputComponent> = {
  title: 'Forms/Base Input',
  component: TextInputComponent,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helperText: { control: 'text' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<TextInputComponent>;

export const TextInput: Story = {
  args: {
    label: 'Full name',
    placeholder: 'Enter your name',
    helperText: 'Use the same name that appears on legal documents.',
    size: 'md',
    required: true,
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-text-input',
      `
        [label]="label"
        [placeholder]="placeholder"
        [helperText]="helperText"
        [required]="required"
        [size]="size"
      `,
    ),
    moduleMetadata: {
      imports: [TextInputComponent],
    },
  }),
};

export const NumericInput: Story = {
  args: {
    label: 'Requested amount',
    placeholder: 'Enter loan amount',
    helperText: 'Numeric values only.',
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-numeric-input',
      `
        [label]="label"
        [placeholder]="placeholder"
        [helperText]="helperText"
        [min]="1000"
        [max]="50000"
        [step]="500"
      `,
    ),
    moduleMetadata: {
      imports: [NumericInputComponent],
    },
  }),
};

export const ContactInputs: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div class="flex max-w-md flex-col gap-6">
        <app-phone-input
          label="Phone number"
          placeholder="+51 999 999 999"
          helperText="Include country code."
          required
        />
        <app-email-input
          label="Email address"
          placeholder="you@example.com"
          required
        />
        <app-password-input
          label="Password"
          placeholder="Enter a secure password"
        />
      </div>
    `),
    moduleMetadata: {
      imports: [PhoneInputComponent, EmailInputComponent, PasswordInputComponent, CommonModule],
    },
  }),
};

export const Textarea: Story = {
  args: {
    label: 'Application notes',
    placeholder: 'Share additional context for the underwriting team...',
    helperText: 'Provide as much detail as possible.',
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-textarea-input',
      `
        [label]="label"
        [placeholder]="placeholder"
        [helperText]="helperText"
        [rows]="6"
        [autoResize]="true"
      `,
    ),
    moduleMetadata: {
      imports: [TextareaInputComponent],
    },
  }),
};

export const SelectionInputs: Story = {
  render: () => {
    const options: InputOption<string>[] = [
      { label: 'Individual', value: 'individual', description: 'Single applicant' },
      { label: 'Joint', value: 'joint', description: 'Two or more applicants' },
      { label: 'Business', value: 'business', description: 'Registered company' },
    ];

    return {
      props: { options },
      template: `
        <div class="grid grid-cols-1 gap-8 p-8 bg-muted/20 min-h-screen">
          <div>
            <h3 class="text-lg font-semibold text-foreground mb-4">Checkbox</h3>
            <app-checkbox-input
              label="Terms"
              checkboxLabel="I agree to the loan terms and privacy policy"
              helperText="You must accept before submitting."
              required
            />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-foreground mb-4">Radio group</h3>
            <app-radio-input
              label="Profile type"
              [options]="options"
              helperText="Select the profile that best describes your application."
              required
            />
          </div>
        </div>
      `,
      moduleMetadata: {
        imports: [CheckboxInputComponent, RadioInputComponent, CommonModule],
      },
    };
  },
};

export const TemplateDrivenValidation: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [FormsModule, TextInputComponent],
    },
    props: {
      model: '',
    },
    template: `
      <div class="p-8 min-h-screen bg-muted/20">
        <form #form="ngForm" class="max-w-lg space-y-4">
          <app-text-input
            name="company"
            label="Company name"
            placeholder="Acme Corp"
            helperText="Required field"
            [(ngModel)]="model"
            required
          />
          <button
            type="button"
            class="btn btn-primary"
            (click)="form.form.markAllAsTouched()"
          >
            Validate
          </button>
        </form>
      </div>
    `,
  }),
};

export const ReactiveValidation: Story = {
  render: () => {
    const fb = new FormBuilder();
    const form = fb.group({
      amount: fb.control(0, {
        validators: [Validators.required, Validators.min(1000), Validators.max(50000)],
        nonNullable: true,
      }),
      purpose: fb.control('', {
        validators: [Validators.required, Validators.minLength(10)],
        nonNullable: true,
      }),
    });
    form.markAllAsTouched();

    return {
      props: { form },
      moduleMetadata: {
        imports: [ReactiveFormsModule, NumericInputComponent, TextareaInputComponent, CommonModule],
      },
      template: `
        <div class="p-8 min-h-screen bg-muted/20">
          <form [formGroup]="form" class="grid gap-6 max-w-2xl">
            <app-numeric-input
              label="Amount requested"
              helperText="Between 1,000 and 50,000"
              formControlName="amount"
              required
            />
            <app-textarea-input
              label="Loan purpose"
              helperText="Share at least 10 characters."
              formControlName="purpose"
              required
            />
          </form>
        </div>
      `,
    };
  },
};

export const SearchAndUrl: Story = {
  render: () => ({
    template: `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 min-h-screen bg-muted/20">
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-foreground">Light mode</h3>
          <app-search-input label="Search directory" placeholder="Search clients" />
          <app-url-input label="Website" placeholder="https://example.com" />
        </div>
        <div class="dark space-y-4 bg-gray-900 p-8 rounded-lg">
          <h3 class="text-lg font-semibold text-white">Dark mode</h3>
          <app-search-input label="Search directory" placeholder="Search clients" />
          <app-url-input label="Website" placeholder="https://example.com" />
        </div>
      </div>
    `,
    moduleMetadata: {
      imports: [SearchInputComponent, UrlInputComponent, CommonModule],
    },
  }),
};

export const ValidationStates: Story = {
  render: () => {
    const fb = new FormBuilder();
    const form = fb.group({
      successName: fb.control('Flowbite Style', {
        validators: [Validators.required, Validators.minLength(3)],
        nonNullable: true,
      }),
      errorName: fb.control('', {
        validators: [Validators.required, Validators.minLength(3)],
        nonNullable: true,
      }),
    });

    form.markAllAsTouched();

    return {
      props: { form },
      moduleMetadata: {
        imports: [ReactiveFormsModule, TextInputComponent, CommonModule],
      },
      template: `
        <div class="p-8 bg-muted/20 min-h-screen">
          <form [formGroup]="form" class="max-w-lg space-y-6">
            <app-text-input
              label="Your name"
              helperText="Well done! Some success message."
              formControlName="successName"
              [required]="true"
            />
            <app-text-input
              label="Your name"
              helperText="Oh, snap! Some error message."
              formControlName="errorName"
              [required]="true"
            />
          </form>
        </div>
      `,
    };
  },
};
