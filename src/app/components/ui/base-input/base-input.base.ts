import {
  computed,
  DestroyRef,
  Directive,
  effect,
  inject,
  Injector,
  input,
  output,
  signal,
  Signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, ControlValueAccessor, NgControl, ValidationErrors } from '@angular/forms';

import {
  InputControlVariant,
  InputErrorMessages,
  InputOption,
  InputSize,
} from './base-input.types';

let nextId = 0;

const DEFAULT_ERROR_MESSAGES: InputErrorMessages = {
  required: (_error, context) => `${context.label ?? 'This field'} is required`.trim(),
  minlength: (error) => `Minimum length is ${(error as { requiredLength: number }).requiredLength}`,
  maxlength: (error) => `Maximum length is ${(error as { requiredLength: number }).requiredLength}`,
  min: (error) => `Minimum value is ${(error as { min: number }).min}`,
  max: (error) => `Maximum value is ${(error as { max: number }).max}`,
  email: 'Enter a valid email address',
  pattern: 'Value does not match the required format',
};

function coerceErrorMessage(
  messages: InputErrorMessages | undefined,
  key: string,
  error: unknown,
  context: { label?: string; placeholder?: string },
): string | null {
  const entry = messages?.[key] ?? DEFAULT_ERROR_MESSAGES[key];
  if (!entry) return null;
  if (typeof entry === 'function') {
    return entry(error, context);
  }
  return entry;
}

@Directive()
export abstract class BaseInputField<TValue> implements ControlValueAccessor {
  // UI inputs
  readonly label = input<string | null>(null);
  readonly placeholder = input<string | null>(null);
  readonly helperText = input<string | null>(null);
  readonly hint = input<string | null>(null);
  readonly id = input<string | null>(null);
  readonly name = input<string | null>(null);
  readonly size = input<InputSize>('md');
  readonly disabled = input<boolean>(false);
  readonly readOnly = input<boolean>(false);
  readonly required = input<boolean>(false);
  readonly ariaDescribedBy = input<string | null>(null);
  readonly errorMessages = input<InputErrorMessages | null>(null);
  readonly showOptionalHint = input<boolean>(false);
  readonly prefixText = input<string | null>(null);
  readonly suffixText = input<string | null>(null);
  readonly rows = input<number | null>(null);
  readonly autoResize = input<boolean>(false);
  readonly inputMode = input<string | null>(null);
  readonly autocomplete = input<string | null>(null);
  readonly maxLength = input<number | null>(null);
  readonly minLength = input<number | null>(null);
  readonly pattern = input<string | null>(null);
  readonly spellcheck = input<boolean | null>(null);
  readonly min = input<number | null>(null);
  readonly max = input<number | null>(null);
  readonly step = input<number | null>(null);
  readonly orientation = input<'vertical' | 'horizontal'>('vertical');
  readonly optionHint = input<string | null>(null);
  readonly testId = input<string | null>(null); // For E2E testing

  // Options (used for radio, checkbox groups)
  readonly options = input<InputOption<TValue>[]>([]);
  readonly checkboxLabel = input<string | null>(null);

  // Outputs
  readonly valueChange = output<TValue | null>();
  readonly focusChange = output<boolean>();

  protected abstract get controlVariant(): InputControlVariant;

  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private readonly ngControlSignal = signal<NgControl | null>(null);
  private readonly controlState = signal<{
    control: AbstractControl | null;
    invalid: boolean;
    touched: boolean;
    dirty: boolean;
    errors: ValidationErrors | null;
  }>({ control: null, invalid: false, touched: false, dirty: false, errors: null });

  protected get ngControl(): NgControl | null {
    return this.ngControlSignal();
  }

  private readonly generatedId = `app-input-${++nextId}`;

  private readonly disabledFromControl = signal(false);
  private readonly internalValue = signal<TValue | null>(null);
  private readonly touched = signal(false);
  private readonly focused = signal(false);

  private onChangeFn: (value: TValue | null) => void = () => undefined;
  private onTouchedFn: () => void = () => undefined;

  readonly resolvedType = computed(() => 'text');

  get variant(): InputControlVariant {
    return this.controlVariant;
  }

  readonly value: Signal<TValue | null> = this.internalValue.asReadonly();
  readonly isFocused = this.focused.asReadonly();
  readonly isTouched = this.touched.asReadonly();

  readonly controlId = computed(() => this.id() ?? this.generatedId);

  readonly labelId = computed(() => {
    if (!this.label()) return null;
    return `${this.controlId()}-label`;
  });

  readonly inputName = computed(() => {
    if (this.name()) return this.name()!;
    if (this.controlVariant === 'radio') {
      return `${this.controlId()}-group`;
    }
    return this.controlId();
  });

  readonly isDisabled = computed(() => this.disabledFromControl() || this.disabled());

  readonly isReadOnly = computed(() => this.readOnly());

  readonly showOptionalText = computed(() => !this.required() && this.showOptionalHint());

  readonly control = computed(() => this.controlState().control);

  readonly shouldDisplayErrors = computed(() => {
    const state = this.controlState();
    if (!state.invalid) return false;
    return state.touched || state.dirty;
  });

  readonly firstErrorKey = computed(() => {
    if (!this.shouldDisplayErrors()) return null;
    const errors = this.controlState().errors;
    if (!errors) {
      return null;
    }
    const keys = Object.keys(errors);
    return keys.length ? keys[0] : null;
  });

  readonly currentErrorMessage = computed(() => {
    const key = this.firstErrorKey();
    if (!key) return null;
    const errors = this.controlState().errors ?? {};
    const error = errors[key];
    return (
      coerceErrorMessage(this.errorMessages() ?? undefined, key, error, {
        label: this.label() ?? undefined,
        placeholder: this.placeholder() ?? undefined,
      }) ?? null
    );
  });

  readonly helperTextId = computed(() => {
    if (!this.helperText() && !this.hint()) return null;
    return `${this.controlId()}-helper`;
  });

  readonly errorTextId = computed(() => {
    if (!this.currentErrorMessage()) return null;
    return `${this.controlId()}-error`;
  });

  readonly describedByAttr = computed(() => {
    const segments = [this.ariaDescribedBy(), this.helperTextId(), this.errorTextId()].filter(
      (segment): segment is string => !!segment,
    );
    return segments.length ? segments.join(' ') : null;
  });

  readonly validationState = computed<'neutral' | 'success' | 'error'>(() => {
    if (this.shouldDisplayErrors()) {
      return 'error';
    }

    const state = this.controlState();
    if (state.control && (state.touched || state.dirty) && !state.invalid) {
      return 'success';
    }

    return 'neutral';
  });

  readonly visualState = computed(() => {
    const base = {
      labelColor: 'var(--color-text-primary)',
      helperColor: 'var(--color-text-secondary)',
      inputBg: 'var(--color-bg-primary)',
      inputBorder: 'var(--color-border)',
      inputText: 'var(--color-text-primary)',
      focusBorder: 'var(--color-primary)',
      ringColor: 'var(--color-primary-focus-ring)',
      prefixColor: 'var(--color-text-muted)',
    };

    switch (this.validationState()) {
      case 'success':
        return {
          ...base,
          labelColor: 'var(--color-success-700)',
          helperColor: 'var(--color-success-700)',
          inputBg: 'var(--color-success-lighter)',
          inputBorder: 'var(--color-success)',
          inputText: 'var(--color-success-800)',
          focusBorder: 'var(--color-success)',
          ringColor: 'var(--color-success-ring)',
          prefixColor: 'var(--color-success-700)',
        };
      case 'error':
        return {
          ...base,
          labelColor: 'var(--color-error-700)',
          helperColor: 'var(--color-error-700)',
          inputBg: 'var(--color-error-lighter)',
          inputBorder: 'var(--color-error)',
          inputText: 'var(--color-error-800)',
          focusBorder: 'var(--color-error)',
          ringColor: 'var(--color-error-ring)',
          prefixColor: 'var(--color-error-700)',
        };
      default:
        return base;
    }
  });

  constructor() {
    effect(() => {
      this.focusChange.emit(this.isFocused());
    });

    queueMicrotask(() => {
      const control = this.injector.get(NgControl, null, { self: true, optional: true });
      if (control) {
        control.valueAccessor = this;
      }
      this.ngControlSignal.set(control);
      this.updateControlState(control?.control ?? null);
    });
  }

  writeValue(value: TValue | null): void {
    this.internalValue.set(value ?? null);
  }

  registerOnChange(fn: (value: TValue | null) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledFromControl.set(isDisabled);
  }

  protected markAsTouched(): void {
    if (!this.touched()) {
      this.touched.set(true);
    }
    this.onTouchedFn();
  }

  protected markFocus(focused: boolean): void {
    this.focused.set(focused);
  }

  protected commitValue(value: TValue | null): void {
    this.internalValue.set(value);
    this.onChangeFn(value);
    this.valueChange.emit(value);
  }

  protected abstract parseFromInput(value: unknown): TValue | null;

  // Default handlers are overridden by specific variants. They exist to satisfy
  // the shared template that references these callbacks across input types.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onInput(_event: Event): void {
    /* noop */
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleCheckboxChange(_event: Event): void {
    /* noop */
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleRadioChange(_option: InputOption<TValue>, _event?: Event): void {
    /* noop */
  }

  isChecked(): boolean {
    return false;
  }

  trackOption(index: number, option: InputOption<TValue>): unknown {
    return option.value ?? index;
  }

  private updateControlState(control: AbstractControl | null): void {
    const applyState = (target: AbstractControl | null) => {
      this.controlState.set({
        control: target,
        invalid: target?.invalid ?? false,
        touched: target?.touched ?? false,
        dirty: target?.dirty ?? false,
        errors: target?.errors ?? null,
      });
    };

    applyState(control);

    if (!control) {
      return;
    }

    control.statusChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => applyState(control));

    control.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => applyState(control));
  }

  handleInput(value: unknown): void {
    if (this.isDisabled()) return;
    const parsed = this.parseFromInput(value);
    this.commitValue(parsed);
  }

  handleBlur(): void {
    this.markAsTouched();
    this.markFocus(false);

    // Force update controlState after marking as touched
    // because statusChanges doesn't emit for touched/dirty changes
    const control = this.ngControl?.control;
    if (control) {
      this.controlState.set({
        control: control,
        invalid: control.invalid,
        touched: control.touched,
        dirty: control.dirty,
        errors: control.errors,
      });
    }
  }

  handleFocus(): void {
    if (this.isDisabled()) return;
    this.markFocus(true);
  }
}
