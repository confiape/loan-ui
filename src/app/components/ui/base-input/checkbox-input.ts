import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaseCheckboxInputComponent } from './checkbox-input.base';
import { provideValueAccessor } from './value-accessor';

@Component({
  selector: 'app-checkbox-input',
  templateUrl: './base-input.html',
  styleUrl: './base-input.css',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideValueAccessor(CheckboxInputComponent)],
  host: {
    class: 'block w-full',
  },
})
export class CheckboxInputComponent extends BaseCheckboxInputComponent {}
