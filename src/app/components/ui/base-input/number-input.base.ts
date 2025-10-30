import { computed, Directive, input } from '@angular/core';

import { BaseInputField } from './base-input.base';

@Directive()
export abstract class BaseNumberInputComponent extends BaseInputField<number | null> {
  override readonly inputMode = input<string | null>('decimal');
  readonly inputType = input<'number' | 'tel' | 'text' | null>(null);

  protected get controlVariant() {
    return 'input' as const;
  }

  override readonly resolvedType = computed(() => this.inputType() ?? 'number');

  protected parseFromInput(value: unknown): number | null {
    if (typeof value === 'number') return Number.isNaN(value) ? null : value;
    if (value == null || value === '') return null;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  }

  override onInput(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    if (!target) return;
    this.handleInput(target.value);
  }
}
