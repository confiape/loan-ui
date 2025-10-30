import { Directive } from '@angular/core';

import { BaseInputField } from './base-input.base';

@Directive()
export abstract class BaseCheckboxInputComponent extends BaseInputField<boolean> {
  protected get controlVariant() {
    return 'checkbox' as const;
  }
  protected parseFromInput(value: unknown): boolean | null {
    return value === true;
  }

  override handleCheckboxChange(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    if (!target) return;
    this.handleInput(target.checked);
  }

  override isChecked(): boolean {
    return this.value() === true;
  }
}
