import { Directive, input } from '@angular/core';

import { BaseInputField } from './base-input.base';

@Directive()
export abstract class BaseTextareaInputComponent extends BaseInputField<string> {
  override readonly rows = input<number | null>(4);
  override readonly autoResize = input<boolean>(false);

  protected get controlVariant() {
    return 'textarea' as const;
  }
  protected parseFromInput(value: unknown): string | null {
    if (value == null) return '';
    if (typeof value === 'string') return value;
    return String(value);
  }

  override onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement | null;
    if (!target) return;
    this.handleInput(target.value);

    if (this.autoResize()) {
      target.style.height = 'auto';
      target.style.height = `${target.scrollHeight}px`;
    }
  }
}
