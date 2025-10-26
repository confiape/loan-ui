import { Component, input, output, signal, HostListener, ElementRef, inject } from '@angular/core';

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read?: boolean;
  icon?: string;
  iconColor?: string;
  avatar?: string;
  actionUrl?: string;
}

@Component({
  selector: 'app-notification-button',
  imports: [],
  templateUrl: './notification-button.html',
  styleUrl: './notification-button.css',
  standalone: true,
})
export class NotificationButton {
  // Inputs
  notifications = input<Notification[]>([]);
  badgeCount = input<number>(0);
  showBadge = input<boolean>(true);
  maxNotificationsDisplay = input<number>(5);
  emptyMessage = input<string>('No notifications');

  // Outputs
  notificationClick = output<Notification>();
  markAsRead = output<string>(); // notification id
  markAllAsRead = output<void>();
  viewAll = output<void>();

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

  onNotificationClick(notification: Notification): void {
    this.notificationClick.emit(notification);
    if (!notification.read) {
      this.markAsRead.emit(notification.id);
    }
  }

  onMarkAllAsRead(): void {
    this.markAllAsRead.emit();
  }

  onViewAll(): void {
    this.viewAll.emit();
    this.close();
  }

  get displayedNotifications(): Notification[] {
    return this.notifications().slice(0, this.maxNotificationsDisplay());
  }

  get unreadCount(): number {
    if (this.badgeCount() > 0) {
      return this.badgeCount();
    }
    return this.notifications().filter((n) => !n.read).length;
  }
}
