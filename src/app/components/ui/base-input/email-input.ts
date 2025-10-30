import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaseTextInputComponent } from './text-input.base';
import { provideValueAccessor } from './value-accessor';

@Component({
  selector: 'app-email-input',
  templateUrl: './base-input.html',
  styleUrl: './base-input.css',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideValueAccessor(EmailInputComponent)],
  host: {
    class: 'block w-full',
  },
})
export class EmailInputComponent extends BaseTextInputComponent {
  protected readonly type = 'email';
  override readonly autocomplete = input<string | null>('email');
}
