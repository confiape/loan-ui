import { Component, signal, computed, input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidenavComponent, SidenavItem } from '../../components/ui/sidenav/sidenav';
import { NavbarComponent } from '../navbar/navbar';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, SidenavComponent, NavbarComponent],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
  standalone: true,
})
export class MainLayout {
  // Data
  private defaultSidenavItems: SidenavItem[] = [
    {
      label: 'Dashboard',
      icon: '📊',
      value: 'dashboard',
    },
    {
      label: 'Préstamos',
      icon: '💰',
      value: 'loans',
      children: [
        { label: 'Todos', value: 'loans-all' },
        { label: 'Activos', value: 'loans-active' },
        { label: 'Pendientes', value: 'loans-pending' },
        { label: 'Completados', value: 'loans-completed' },
      ],
    },
    {
      label: 'Clientes',
      icon: '👥',
      value: 'clients',
      children: [
        { label: 'Todos', value: 'clients-all' },
        { label: 'Nuevos', value: 'clients-new' },
        { label: 'VIP', value: 'clients-vip', badge: '12' },
      ],
    },
    {
      label: 'Reportes',
      icon: '📈',
      value: 'reports',
    },
    {
      label: 'Configuración',
      icon: '⚙️',
      value: 'settings',
    },
  ];

  private defaultUserInfo = {
    name: 'Juan Pérez',
    email: 'juan.perez@example.com',
    role: 'Administrador',
  };

  // Inputs
  sidenavItems = input<SidenavItem[]>(this.defaultSidenavItems);
  appTitle = input<string>('Loan UI');
  userInfo = input<{ name: string; avatar?: string }>(this.defaultUserInfo);

  // State
  isSidenavOpen = signal(true);
  isMobileMenuOpen = signal(false);

  // Computed
  sidenavClasses = computed(() => {
    const classes = ['main-layout-sidenav'];
    if (!this.isSidenavOpen() && !this.isMobileMenuOpen()) {
      classes.push('main-layout-sidenav-hidden');
    }
    return classes.join(' ');
  });

  layoutClasses = computed(() => {
    const classes = ['main-layout'];
    if (this.isSidenavOpen()) {
      classes.push('main-layout-sidenav-open');
    }
    if (this.isMobileMenuOpen()) {
      classes.push('main-layout-mobile-menu-open');
    }
    return classes.join(' ');
  });

  // Methods
  toggleSidenav(): void {
    this.isSidenavOpen.update((v) => !v);
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((v) => !v);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  onSidenavItemClick(item: SidenavItem): void {
    console.log('Sidenav item clicked:', item);
    // En móvil, cerrar el menú al hacer clic
    if (window.innerWidth < 1024) {
      this.closeMobileMenu();
    }
  }
}
