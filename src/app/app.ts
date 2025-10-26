import { Component } from '@angular/core';
import { DropdownComponent, DropdownItem } from './components/ui';

@Component({
  selector: 'app-root',
  imports: [DropdownComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  items: DropdownItem[] = [
    {
      label: 'test',
      value: 1,
    },
    {
      label: 'test2',
      value: 2,
    },
  ];
}
