import { Component, input, output, signal, inject, OnInit } from '@angular/core';
import { SearchBar } from '../../components/ui/search-bar/search-bar';
import {
  NotificationButton,
  Notification,
} from '../../components/ui/notification-button/notification-button';
import { AppsMenu, AppMenuItem } from '../../components/ui/apps-menu/apps-menu';
import { UserMenu, UserMenuItem } from '../../components/ui/user-menu/user-menu';
import { UserApiService } from '../../core/openapi/api/user.service';
import { UserDto } from '../../core/openapi/model/userDto';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [SearchBar, NotificationButton, AppsMenu, UserMenu],
  templateUrl: './navbar.html',
  standalone: true,
})
export class NavbarComponent implements OnInit {
  // Services
  private userApiService = inject(UserApiService);

  // Signals
  currentUser = signal<UserDto | null>(null);
  isLoadingUser = signal<boolean>(false);
  userLoadError = signal<string | null>(null);

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

  // Lifecycle
  ngOnInit(): void {
    this.loadCurrentUser();
  }

  // Methods
  loadCurrentUser(): void {
    this.isLoadingUser.set(true);
    this.userLoadError.set(null);

    this.userApiService
      .getCurrentUser()
      .pipe(
        tap((user) => {
          this.currentUser.set(user);
          this.isLoadingUser.set(false);
        }),
        catchError((error) => {
          console.error('Error loading current user:', error);
          this.userLoadError.set('Failed to load user data');
          this.isLoadingUser.set(false);
          return of(null);
        }),
      )
      .subscribe();
  }

  // Computed properties
  get displayUserName(): string {
    const user = this.currentUser();
    if (user?.person?.name) {
      return user.person.name;
    }
    return this.userName() || 'User';
  }

  get displayUserEmail(): string {
    const user = this.currentUser();
    if (user?.email) {
      return user.email;
    }
    return this.userEmail() || '';
  }

  get displayUserAvatar(): string {
    const user = this.currentUser();
    if (user?.avatar) {
      return user.avatar;
    }
    return this.userAvatar() || '';
  }

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
