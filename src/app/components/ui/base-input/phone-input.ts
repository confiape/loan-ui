import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaseTextInputComponent } from './text-input.base';
import { provideValueAccessor } from './value-accessor';

@Component({
  selector: 'app-phone-input',
  templateUrl: './base-input.html',
  styleUrl: './base-input.css',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideValueAccessor(PhoneInputComponent)],
  host: {
    class: 'block w-full',
  },
})
export class PhoneInputComponent extends BaseTextInputComponent {
  protected readonly type = 'tel';
  override readonly inputMode = input<string | null>('tel');
  override readonly autocomplete = input<string | null>('tel');
}
