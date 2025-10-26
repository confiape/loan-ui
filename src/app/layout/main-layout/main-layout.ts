import { Component, signal, input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidenavComponent, SidenavItem } from '../sidenav/sidenav';
import { NavbarComponent } from '../navbar/navbar';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, SidenavComponent, NavbarComponent],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
  standalone: true,
})
export class MainLayout {
  // Inputs
  sidenavItems = input<SidenavItem[]>([]);
  appTitle = input<string>('Loan UI');

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
  }
}
