import { Component, input, output, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface AccordionItem {
  id: string;
  title: string;
  content: string;
  isOpen?: boolean;
  disabled?: boolean;
}

@Component({
  selector: 'app-accordion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.css',
})
export class AccordionComponent implements OnInit {
  // Inputs
  items = input.required<AccordionItem[]>();
  allowMultiple = input<boolean>(false);
  animated = input<boolean>(true);

  // Outputs
  itemToggled = output<AccordionItem>();

  // State
  openItems = signal<Set<string>>(new Set());

  ngOnInit() {
    // Initialize open items
    const initialOpenItems = this.items()
      .filter((item) => item.isOpen)
      .map((item) => item.id);

    this.openItems.set(new Set(initialOpenItems));
  }

  toggle(item: AccordionItem) {
    if (item.disabled) {
      return;
    }

    const openItems = new Set(this.openItems());

    if (openItems.has(item.id)) {
      // Close the item
      openItems.delete(item.id);
    } else {
      // Open the item
      if (!this.allowMultiple()) {
        // Close all other items
        openItems.clear();
      }
      openItems.add(item.id);
    }

    this.openItems.set(openItems);
    this.itemToggled.emit(item);
  }

  isOpen(item: AccordionItem): boolean {
    return this.openItems().has(item.id);
  }
}
