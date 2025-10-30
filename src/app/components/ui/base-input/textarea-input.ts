import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaseTextareaInputComponent } from './textarea-input.base';
import { provideValueAccessor } from './value-accessor';

@Component({
  selector: 'app-textarea-input',
  templateUrl: './base-input.html',
  styleUrl: './base-input.css',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideValueAccessor(TextareaInputComponent)],
  host: {
    class: 'block w-full',
  },
})
export class TextareaInputComponent extends BaseTextareaInputComponent {
  override readonly rows = input<number | null>(6);
}
