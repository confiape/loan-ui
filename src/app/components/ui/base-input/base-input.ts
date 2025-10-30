import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaseTextInputComponent } from './text-input.base';
import { provideValueAccessor } from './value-accessor';

@Component({
  selector: 'app-base-input',
  templateUrl: './base-input.html',
  styleUrl: './base-input.css',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideValueAccessor(BaseInputComponent)],
  host: {
    class: 'block w-full',
  },
})
export class BaseInputComponent extends BaseTextInputComponent {
  protected readonly type = 'text';
}
