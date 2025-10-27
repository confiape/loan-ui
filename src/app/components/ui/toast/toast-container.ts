import { Component, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastComponent, ToastPosition } from './toast';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, ToastComponent],
  template: `
    <div class="toast-container" [class]="positionClass">
      @for (toast of toastService.toasts$(); track toast.id) {
        <app-toast [toast]="toast" [position]="position()" (dismissed)="onDismiss($event)" />
      }
    </div>
  `,
  styles: [
    `
      .toast-container {
        position: fixed;
        z-index: var(--z-50);
        display: flex;
        flex-direction: column;
        gap: var(--spacing-2);
        pointer-events: none;
      }

      .toast-container > * {
        pointer-events: auto;
      }

      .top-right {
        top: 1rem;
        right: 1rem;
      }

      .top-left {
        top: 1rem;
        left: 1rem;
      }

      .bottom-right {
        bottom: 1rem;
        right: 1rem;
      }

      .bottom-left {
        bottom: 1rem;
        left: 1rem;
      }

      .top-center {
        top: 1rem;
        left: 50%;
        transform: translateX(-50%);
      }

      .bottom-center {
        bottom: 1rem;
        left: 50%;
        transform: translateX(-50%);
      }
    `,
  ],
})
export class ToastContainerComponent {
  // Services
  protected toastService = inject(ToastService);

  // Inputs
  position = input<ToastPosition>('top-right');

  onDismiss(id: string): void {
    this.toastService.dismiss(id);
  }

  get positionClass(): string {
    return this.position();
  }
}
