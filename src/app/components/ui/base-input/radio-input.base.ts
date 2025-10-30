import { Directive, input } from '@angular/core';

import { BaseInputField } from './base-input.base';
import { InputOption } from './base-input.types';

@Directive()
export abstract class BaseRadioInputComponent<TValue> extends BaseInputField<TValue> {
  override readonly orientation = input<'vertical' | 'horizontal'>('vertical');

  protected get controlVariant() {
    return 'radio' as const;
  }
  protected parseFromInput(value: unknown): TValue | null {
    return value as TValue | null;
  }

  override handleRadioChange(option: InputOption<TValue>, event?: Event): void {
    if (event) {
      const target = event.target as HTMLInputElement | null;
      if (target?.disabled) {
        return;
      }
    }
    if (option.disabled) return;
    this.handleInput(option.value);
  }
}
