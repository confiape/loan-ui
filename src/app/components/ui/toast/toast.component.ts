import { Component, input, output, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ToastType = 'success' | 'error' | 'warning' | 'info';
export type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-center'
  | 'bottom-center';

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  dismissible?: boolean;
}

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
})
export class ToastComponent {
  // Inputs
  toast = input.required<Toast>();
  position = input<ToastPosition>('top-right');

  // Outputs
  dismissed = output<string>();

  constructor() {
    effect(() => {
      const toastData = this.toast();
      if (toastData && toastData.duration && toastData.duration > 0) {
        setTimeout(() => {
          this.dismiss();
        }, toastData.duration);
      }
    });
  }

  dismiss() {
    this.dismissed.emit(this.toast().id);
  }

  get typeClass(): string {
    const typeMap: Record<ToastType, string> = {
      success: 'toast-success',
      error: 'toast-error',
      warning: 'toast-warning',
      info: 'toast-info',
    };
    return typeMap[this.toast().type];
  }

  get icon(): string {
    const icons: Record<ToastType, string> = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ',
    };
    return icons[this.toast().type];
  }
}
