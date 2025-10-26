import { Component, input, output, signal, HostListener, ElementRef, inject } from '@angular/core';

export interface AppMenuItem {
  id: string;
  label: string;
  icon: string;
  href?: string;
  action?: string;
}

@Component({
  selector: 'app-apps-menu',
  imports: [],
  templateUrl: './apps-menu.html',
  styleUrl: './apps-menu.css',
  standalone: true,
})
export class AppsMenu {
  // Inputs
  apps = input<AppMenuItem[]>([]);
  title = input<string>('Apps');

  // Outputs
  appClick = output<AppMenuItem>();

  // State
  isOpen = signal(false);

  private readonly elementRef = inject(ElementRef);

  // Click outside to close
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside && this.isOpen()) {
      this.close();
    }
  }

  // Keyboard navigation
  @HostListener('document:keydown.escape')
  onEscapeKey() {
    if (this.isOpen()) {
      this.close();
    }
  }

  // Methods
  toggle(): void {
    this.isOpen.update((v) => !v);
  }

  close(): void {
    this.isOpen.set(false);
  }

  onAppClick(app: AppMenuItem, event: Event): void {
    event.preventDefault();
    this.appClick.emit(app);
    this.close();
  }
}
