import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaseNumberInputComponent } from './number-input.base';
import { provideValueAccessor } from './value-accessor';

@Component({
  selector: 'app-numeric-input',
  templateUrl: './base-input.html',
  styleUrl: './base-input.css',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideValueAccessor(NumericInputComponent)],
  host: {
    class: 'block w-full',
  },
})
export class NumericInputComponent extends BaseNumberInputComponent {
  override readonly step = input<number | null>(null);
  override readonly min = input<number | null>(null);
  override readonly max = input<number | null>(null);
}
