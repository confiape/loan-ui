import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaseRadioInputComponent } from './radio-input.base';
import { provideValueAccessor } from './value-accessor';
import { InputOption } from './base-input.types';

@Component({
  selector: 'app-radio-input',
  templateUrl: './base-input.html',
  styleUrl: './base-input.css',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideValueAccessor(RadioInputComponent)],
  host: {
    class: 'block w-full',
  },
})
export class RadioInputComponent extends BaseRadioInputComponent<unknown> {
  override readonly options = input<InputOption<unknown>[]>([]);
}
