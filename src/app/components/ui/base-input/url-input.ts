import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaseTextInputComponent } from './text-input.base';
import { provideValueAccessor } from './value-accessor';

@Component({
  selector: 'app-url-input',
  templateUrl: './base-input.html',
  styleUrl: './base-input.css',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideValueAccessor(UrlInputComponent)],
  host: {
    class: 'block w-full',
  },
})
export class UrlInputComponent extends BaseTextInputComponent {
  protected readonly type = 'url';
  override readonly autocomplete = input<string | null>('url');
}
