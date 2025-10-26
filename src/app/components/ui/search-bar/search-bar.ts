import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  imports: [FormsModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
  standalone: true,
})
export class SearchBar {
  // Inputs
  placeholder = input<string>('Search');
  disabled = input<boolean>(false);
  showOnMobile = input<boolean>(false);
  size = input<'sm' | 'md' | 'lg'>('md');

  // Outputs
  searchChange = output<string>();
  searchSubmit = output<string>();

  // State
  searchQuery = signal('');
  isFocused = signal(false);

  // Methods
  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
    this.searchChange.emit(value);
  }

  onSearchSubmit(event: Event): void {
    event.preventDefault();
    this.searchSubmit.emit(this.searchQuery());
  }

  onFocus(): void {
    this.isFocused.set(true);
  }

  onBlur(): void {
    this.isFocused.set(false);
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.searchChange.emit('');
  }
}
