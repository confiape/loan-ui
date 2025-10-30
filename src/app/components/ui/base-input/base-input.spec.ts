import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { beforeEach, describe, expect, it } from 'vitest';

import {
  CheckboxInputComponent,
  NumericInputComponent,
  RadioInputComponent,
  TextInputComponent,
  TextareaInputComponent,
  type InputOption,
} from './index';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TextInputComponent,
    NumericInputComponent,
    CheckboxInputComponent,
    RadioInputComponent,
    TextareaInputComponent,
  ],
  template: `
    <form [formGroup]="form" class="grid gap-6">
      <app-text-input
        label="Applicant name"
        helperText="Required field"
        formControlName="name"
        [required]="true"
      />

      <app-numeric-input
        label="Loan amount"
        helperText="Enter a numeric value"
        formControlName="amount"
        [min]="1000"
        [max]="50000"
      />

      <app-textarea-input
        label="Purpose"
        helperText="Explain why the loan is needed"
        formControlName="purpose"
        [required]="true"
      />

      <app-checkbox-input
        label="Terms"
        checkboxLabel="I agree to the loan terms"
        formControlName="terms"
        [required]="true"
      />

      <app-radio-input
        label="Profile type"
        [options]="options()"
        formControlName="profile"
        [required]="true"
      />
    </form>
  `,
})
class BaseInputHostComponent {
  private readonly fb = new FormBuilder();

  readonly options = signal<InputOption<string>[]>([
    { label: 'Individual', value: 'individual' },
    { label: 'Joint', value: 'joint' },
    { label: 'Business', value: 'business' },
  ]);

  readonly form = this.fb.group({
    name: this.fb.control('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    amount: this.fb.control<number | null>(null, {
      validators: [Validators.required, Validators.min(1000)],
    }),
    purpose: this.fb.control('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10)],
    }),
    terms: this.fb.control(false, {
      nonNullable: true,
      validators: Validators.requiredTrue,
    }),
    profile: this.fb.control('individual', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });
}

describe('Base Input Components', () => {
  let fixture: ComponentFixture<BaseInputHostComponent>;
  let host: BaseInputHostComponent;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseInputHostComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(BaseInputHostComponent);
    host = fixture.componentInstance;
    element = fixture.nativeElement;
    host.form.markAllAsTouched();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should render all input variants', () => {
    expect(element.querySelector('app-text-input')).toBeTruthy();
    expect(element.querySelector('app-numeric-input')).toBeTruthy();
    expect(element.querySelector('app-textarea-input')).toBeTruthy();
    expect(element.querySelector('app-checkbox-input')).toBeTruthy();
    expect(element.querySelector('app-radio-input')).toBeTruthy();
  });

  it('should display validation errors when controls are invalid', () => {
    const errors = Array.from(element.querySelectorAll('.error-text'));
    const messages = errors.map((node) => node.textContent?.trim());

    expect(messages).toContain('Applicant name is required');
    expect(messages).toContain('Purpose is required');
    expect(messages).toContain('Terms is required');
  });

  it('should update text input control when user types', () => {
    const input = element.querySelector('app-text-input input') as HTMLInputElement;
    input.value = 'Jane Doe';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(host.form.controls.name.value).toBe('Jane Doe');
  });

  it('should parse numeric values correctly', () => {
    const input = element.querySelector('app-numeric-input input') as HTMLInputElement;
    input.value = '2500';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(host.form.controls.amount.value).toBe(2500);

    input.value = 'abc';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(host.form.controls.amount.value).toBeNull();
  });

  it('should emit checkbox toggles', () => {
    const input = element.querySelector('app-checkbox-input input') as HTMLInputElement;
    expect(host.form.controls.terms.value).toBe(false);

    input.click();
    fixture.detectChanges();

    expect(host.form.controls.terms.value).toBe(true);
  });

  it('should update value when radio option is selected', () => {
    const radioButtons = element.querySelectorAll('app-radio-input input[type="radio"]');
    const jointOption = radioButtons.item(1) as HTMLInputElement;

    jointOption.click();
    fixture.detectChanges();

    expect(host.form.controls.profile.value).toBe('joint');
  });

  it('should remove error message when control becomes valid', async () => {
    host.form.controls.name.setValue('John Doe');
    host.form.controls.purpose.setValue('Consolidating business debt');
    host.form.controls.terms.setValue(true);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const nameInputErrors = element.querySelectorAll('app-text-input .error-text');
    expect(nameInputErrors.length).toBe(0);
  });

  it('should expose success state styling when fields are valid', async () => {
    host.form.controls.name.setValue('John Doe');
    host.form.controls.purpose.setValue('Consolidating business debt');
    host.form.controls.terms.setValue(true);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const successContainers = element.querySelectorAll('.input-container[data-state="success"]');
    expect(successContainers.length).toBeGreaterThan(0);
  });
});
