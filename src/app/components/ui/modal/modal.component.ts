import {
  Component,
  input,
  output,
  signal,
  computed,
  effect,
  ElementRef,
  AfterViewInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type ModalVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent implements AfterViewInit {
  // Inputs
  isOpen = input<boolean>(false);
  title = input<string>('');
  subtitle = input<string>('');
  size = input<ModalSize>('md');
  variant = input<ModalVariant>('default');
  showCloseButton = input<boolean>(true);
  closeOnBackdropClick = input<boolean>(true);
  closeOnEscape = input<boolean>(true);
  centered = input<boolean>(true);
  scrollable = input<boolean>(false);
  fullscreen = input<boolean>(false);
  loading = input<boolean>(false);
  showHeader = input<boolean>(true);
  showFooter = input<boolean>(true);

  // Outputs
  closed = output<void>();
  opened = output<void>();

  // State
  private previousActiveElement: HTMLElement | null = null;
  private focusableElements: HTMLElement[] = [];
  modalId = signal(`modal-${Math.random().toString(36).substr(2, 9)}`);

  // Computed
  sizeClass = computed(() => {
    if (this.fullscreen()) return 'modal-fullscreen';

    const sizeMap: Record<ModalSize, string> = {
      sm: 'modal-sm',
      md: 'modal-md',
      lg: 'modal-lg',
      xl: 'modal-xl',
      full: 'modal-full',
    };
    return sizeMap[this.size()];
  });

  variantClass = computed(() => {
    if (this.variant() === 'default') return '';
    return `modal-${this.variant()}`;
  });

  dialogClass = computed(() => {
    const classes = ['modal-dialog', this.sizeClass(), this.variantClass()];

    if (this.centered()) classes.push('modal-centered');
    if (this.scrollable()) classes.push('modal-scrollable');

    return classes.filter(Boolean).join(' ');
  });

  private elementRef = inject(ElementRef);

  constructor() {
    // Handle body scroll when modal opens/closes
    effect(() => {
      if (this.isOpen()) {
        this.previousActiveElement = document.activeElement as HTMLElement;
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = this.getScrollbarWidth() + 'px';

        // Set focus after animation
        setTimeout(() => {
          this.setInitialFocus();
          this.setupFocusTrap();
        }, 100);

        this.opened.emit();
      } else {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';

        // Restore focus
        if (this.previousActiveElement) {
          this.previousActiveElement.focus();
          this.previousActiveElement = null;
        }
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

  ngAfterViewInit() {
    if (this.isOpen()) {
      this.setInitialFocus();
      this.setupFocusTrap();
    }
  }

  close() {
    if (!this.loading()) {
      this.closed.emit();
    }
  }

  onBackdropClick() {
    if (this.closeOnBackdropClick() && !this.loading()) {
      this.close();
    }
  }

  onDialogClick(event: Event) {
    event.stopPropagation();
  }

  // Focus management
  private setInitialFocus() {
    const modalElement = this.elementRef.nativeElement.querySelector('.modal-dialog');
    if (!modalElement) return;

    // Try to focus first focusable element or close button
    const closeButton = modalElement.querySelector('.modal-close') as HTMLElement;
    const firstInput = modalElement.querySelector(
      'input, button, select, textarea, [tabindex]:not([tabindex="-1"])',
    ) as HTMLElement;

    if (firstInput && firstInput !== closeButton) {
      firstInput.focus();
    } else if (closeButton) {
      closeButton.focus();
    } else {
      (modalElement as HTMLElement).focus();
    }
  }

  private setupFocusTrap() {
    const modalElement = this.elementRef.nativeElement.querySelector('.modal-dialog');
    if (!modalElement) return;

    const nodeList = modalElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    this.focusableElements = Array.from(nodeList)
      .filter((el) => {
        const htmlEl = el as HTMLElement;
        return (
          !htmlEl.hasAttribute('disabled') && htmlEl.offsetParent !== null && htmlEl.tabIndex !== -1
        );
      })
      .map((el) => el as HTMLElement);

    modalElement.addEventListener('keydown', this.handleFocusTrap.bind(this));
  }

  private handleFocusTrap(event: KeyboardEvent) {
    if (event.key !== 'Tab') return;

    if (this.focusableElements.length === 0) {
      event.preventDefault();
      return;
    }

    const firstElement = this.focusableElements[0];
    const lastElement = this.focusableElements[this.focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (event.shiftKey) {
      // Shift + Tab
      if (activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  private getScrollbarWidth(): number {
    return window.innerWidth - document.documentElement.clientWidth;
  }

  getVariantIcon(): string {
    const icons: Record<ModalVariant, string> = {
      default: '',
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ',
    };
    return icons[this.variant()];
  }

  getVariantColor(): string {
    const colors: Record<ModalVariant, string> = {
      default: '',
      success: 'var(--color-success)',
      error: 'var(--color-error)',
      warning: 'var(--color-warning)',
      info: 'var(--color-info)',
    };
    return colors[this.variant()];
  }
}
