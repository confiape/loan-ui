import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidenavComponent, SidenavItem } from '../sidenav/sidenav';
import { NavbarComponent } from '../navbar/navbar';
import { Notification } from '../../components/ui/notification-button/notification-button';
import { AppMenuItem } from '../../components/ui/apps-menu/apps-menu';
import { UserMenuItem } from '../../components/ui/user-menu/user-menu';
import {
  SIDENAV_ITEMS,
  APPS_MENU_ITEMS,
  USER_MENU_ITEMS,
  MOCK_NOTIFICATIONS,
} from '../../config/layout.config';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, SidenavComponent, NavbarComponent],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
  standalone: true,
})
export class MainLayout {
  // Configuration
  appTitle = 'Loan UI';
  userName = 'Warren Martinez';
  userEmail = 'warren@loanui.com';
  userAvatar = '';

  // Data from config
  sidenavItems: SidenavItem[] = SIDENAV_ITEMS;
  appsMenuItems: AppMenuItem[] = APPS_MENU_ITEMS;
  userMenuItems: UserMenuItem[] = USER_MENU_ITEMS;
  notifications = signal<Notification[]>(MOCK_NOTIFICATIONS);

  // State
  isMobileMenuOpen = signal(false);

  // Methods
  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((v) => !v);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  onSidenavItemClick(item: SidenavItem): void {
    console.log('Sidenav item clicked:', item);
    this.closeMobileMenu();
    // Handle navigation or action here
  }

  onSearchChange(query: string): void {
    console.log('Search query:', query);
    // Implement search functionality
  }

  onSearchSubmit(query: string): void {
    console.log('Search submitted:', query);
    // Implement search submission
  }

  onNotificationClick(notification: Notification): void {
    console.log('Notification clicked:', notification);
    // Mark as read
    this.notifications.update((notifications) =>
      notifications.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
    );
  }

  onMarkAllAsRead(): void {
    this.notifications.update((notifications) => notifications.map((n) => ({ ...n, read: true })));
  }

  onAppClick(app: AppMenuItem): void {
    console.log('App clicked:', app);
    // Navigate to app or handle action
  }

  onUserMenuClick(item: UserMenuItem): void {
    console.log('User menu item clicked:', item);
    if (item.action === 'logout') {
      // Handle logout
      console.log('Logging out...');
    }
    // Handle other menu items
  }
}
