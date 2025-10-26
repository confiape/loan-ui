import { Component, input, output } from '@angular/core';
import { SearchBar } from '../../components/ui/search-bar/search-bar';
import { NotificationButton, Notification } from '../../components/ui/notification-button/notification-button';
import { AppsMenu, AppMenuItem } from '../../components/ui/apps-menu/apps-menu';
import { UserMenu, UserMenuItem } from '../../components/ui/user-menu/user-menu';

@Component({
  selector: 'app-navbar',
  imports: [SearchBar, NotificationButton, AppsMenu, UserMenu],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  standalone: true,
})
export class NavbarComponent {
  // Inputs
  appTitle = input<string>('Loan UI');
  userName = input<string>('User');
  userEmail = input<string>('');
  userAvatar = input<string>('');
  notifications = input<Notification[]>([]);
  apps = input<AppMenuItem[]>([]);
  userMenuItems = input<UserMenuItem[]>([]);
  showSearch = input<boolean>(true);

  // Outputs
  menuToggle = output<void>();
  searchChange = output<string>();
  searchSubmit = output<string>();
  notificationClick = output<Notification>();
  appClick = output<AppMenuItem>();
  userMenuClick = output<UserMenuItem>();

  // Methods
  onMenuToggle(): void {
    this.menuToggle.emit();
  }

  onSearchChange(query: string): void {
    this.searchChange.emit(query);
  }

  onSearchSubmit(query: string): void {
    this.searchSubmit.emit(query);
  }

  onNotificationClick(notification: Notification): void {
    this.notificationClick.emit(notification);
  }

  onAppClick(app: AppMenuItem): void {
    this.appClick.emit(app);
  }

  onUserMenuClick(item: UserMenuItem): void {
    this.userMenuClick.emit(item);
  }
}
