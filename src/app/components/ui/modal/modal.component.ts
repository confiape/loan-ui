import { Component, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  // Inputs
  isOpen = input<boolean>(false);
  title = input<string>('');
  size = input<ModalSize>('md');
  showCloseButton = input<boolean>(true);
  closeOnBackdropClick = input<boolean>(true);
  closeOnEscape = input<boolean>(true);
  darkMode = input<boolean>(false);

  // Outputs
  closed = output<void>();
  opened = output<void>();

  constructor() {
    // Handle body scroll when modal opens/closes
    effect(() => {
      if (this.isOpen()) {
        document.body.style.overflow = 'hidden';
        this.opened.emit();
      } else {
        document.body.style.overflow = '';
      }
    });

    // Handle escape key
    effect(() => {
      if (this.isOpen() && this.closeOnEscape()) {
        const handleEscape = (event: KeyboardEvent) => {
          if (event.key === 'Escape') {
            this.close();
          }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
      }
      return undefined;
    });
  }

  close() {
    this.closed.emit();
  }

  onBackdropClick() {
    if (this.closeOnBackdropClick()) {
      this.close();
    }
  }

  onDialogClick(event: Event) {
    event.stopPropagation();
  }

  get sizeClass(): string {
    const sizeMap: Record<ModalSize, string> = {
      sm: 'max-w-sm',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl',
      full: 'max-w-full mx-4'
    };
    return sizeMap[this.size()];
  }
}
