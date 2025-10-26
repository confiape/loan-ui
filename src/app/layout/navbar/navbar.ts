import { Component, input, output, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  DropdownComponent,
  DropdownItem,
} from '../../components/ui/dropdown/dropdown.component';

export interface UserInfo {
  name: string;
  email?: string;
  avatar?: string;
  role?: string;
}

export interface NavbarAction {
  label: string;
  icon?: string;
  value: string;
  badge?: string | number;
  disabled?: boolean;
}

@Component({
  selector: 'app-navbar',
  imports: [FormsModule, DropdownComponent],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  standalone: true,
})
export class NavbarComponent {
  // Inputs
  appTitle = input<string>('Loan UI');
  userInfo = input<UserInfo>();
  actions = input<NavbarAction[]>([]);
  showSearch = input<boolean>(false);
  showNotifications = input<boolean>(true);

  // Outputs
  menuToggle = output<void>();
  sidenavToggle = output<void>();
  actionClick = output<NavbarAction>();
  userMenuClick = output<string>();
  searchSubmit = output<string>();

  // State
  searchQuery = signal('');
  notificationCount = signal(3);
  isSearchFocused = signal(false);

  // Computed
  userInitials = computed(() => {
    const user = this.userInfo();
    if (!user) return 'U';

    const names = user.name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  });

  userMenuItems = computed(() => [
    { label: 'Mi Perfil', value: 'profile' },
    { label: 'Configuración', value: 'settings' },
    { label: 'Ayuda', value: 'help' },
    { label: 'Cerrar Sesión', value: 'logout' },
  ]);

  // Methods
  onMenuToggle(): void {
    this.menuToggle.emit();
  }

  onSidenavToggle(): void {
    this.sidenavToggle.emit();
  }

  onActionClick(action: NavbarAction): void {
    if (!action.disabled) {
      this.actionClick.emit(action);
    }
  }

  onUserMenuSelect(item: DropdownItem): void {
    this.userMenuClick.emit(item.value as string);
  }

  onSearchSubmit(): void {
    const query = this.searchQuery();
    if (query.trim()) {
      this.searchSubmit.emit(query);
    }
  }

  onSearchFocus(): void {
    this.isSearchFocused.set(true);
  }

  onSearchBlur(): void {
    this.isSearchFocused.set(false);
  }
}
