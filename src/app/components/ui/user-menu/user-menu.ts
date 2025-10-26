import { Component, input, output, signal, HostListener, ElementRef, inject } from '@angular/core';

export interface UserMenuItem {
  id: string;
  label: string;
  icon?: string;
  href?: string;
  action?: string;
  divider?: boolean;
}

@Component({
  selector: 'app-user-menu',
  imports: [],
  templateUrl: './user-menu.html',
  styleUrl: './user-menu.css',
  standalone: true,
})
export class UserMenu {
  // Inputs
  userName = input<string>('User');
  userEmail = input<string>('');
  userAvatar = input<string>('');
  menuItems = input<UserMenuItem[]>([]);

  // Outputs
  menuItemClick = output<UserMenuItem>();

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

  onMenuItemClick(item: UserMenuItem, event: Event): void {
    if (item.divider) return;
    event.preventDefault();
    this.menuItemClick.emit(item);
    this.close();
  }

  getUserInitials(): string {
    const name = this.userName();
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }
}
