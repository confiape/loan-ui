import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface BottomNavItem {
  id: string;
  label: string;
  icon: string;
  routerLink: string;
}

@Component({
  selector: 'app-bottom-navigation',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './bottom-navigation.html',
  styleUrl: './bottom-navigation.css',
  standalone: true,
})
export class BottomNavigation {
  // Inputs
  items = input<BottomNavItem[]>([]);

  // Outputs
  itemClick = output<BottomNavItem>();

  // Methods
  onItemClick(item: BottomNavItem): void {
    this.itemClick.emit(item);
  }
}
