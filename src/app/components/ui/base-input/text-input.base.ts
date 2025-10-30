import { computed, Directive, input } from '@angular/core';

import { BaseInputField } from './base-input.base';

@Directive()
export abstract class BaseTextInputComponent extends BaseInputField<string> {
  protected abstract readonly type: string;

  readonly inputType = input<string | null>(null);
  protected get controlVariant() {
    return 'input' as const;
  }

  override readonly resolvedType = computed(() => this.inputType() ?? this.type);

  protected parseFromInput(value: unknown): string | null {
    if (value == null) return '';
    if (typeof value === 'string') return value;
    return String(value);
  }

  override onInput(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    if (!target) return;
    this.handleInput(target.value);
  }
}
