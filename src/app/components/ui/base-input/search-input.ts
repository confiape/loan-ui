import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaseTextInputComponent } from './text-input.base';
import { provideValueAccessor } from './value-accessor';

@Component({
  selector: 'app-search-input',
  templateUrl: './base-input.html',
  styleUrl: './base-input.css',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideValueAccessor(SearchInputComponent)],
  host: {
    class: 'block w-full',
  },
})
export class SearchInputComponent extends BaseTextInputComponent {
  protected readonly type = 'search';
  override readonly autocomplete = input<string | null>('off');
}
