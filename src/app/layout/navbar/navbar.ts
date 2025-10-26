import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  standalone: true,
})
export class NavbarComponent {
  // Inputs
  appTitle = input<string>('Loan UI');

  // Outputs
  menuToggle = output<void>();

  // Methods
  onMenuToggle(): void {
    this.menuToggle.emit();
  }
}
