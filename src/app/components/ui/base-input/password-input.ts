import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaseTextInputComponent } from './text-input.base';
import { provideValueAccessor } from './value-accessor';

@Component({
  selector: 'app-password-input',
  templateUrl: './base-input.html',
  styleUrl: './base-input.css',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideValueAccessor(PasswordInputComponent)],
  host: {
    class: 'block w-full',
  },
})
export class PasswordInputComponent extends BaseTextInputComponent {
  protected readonly type = 'password';
  override readonly autocomplete = input<string | null>('current-password');
}
