import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TabItem {
  id: string;
  label: string;
  content: string;
  disabled?: boolean;
  icon?: string;
}

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css'
})
export class TabsComponent {
  // Inputs
  tabs = input.required<TabItem[]>();
  activeTabId = input<string>('');

  // Outputs
  tabChanged = output<TabItem>();

  // State
  activeTab = signal<string>('');

  ngOnInit() {
    // Set initial active tab
    const initialTab = this.activeTabId() || this.tabs()[0]?.id;
    this.activeTab.set(initialTab);
  }

  selectTab(tab: TabItem) {
    if (tab.disabled) {
      return;
    }

    this.activeTab.set(tab.id);
    this.tabChanged.emit(tab);
  }

  isActive(tab: TabItem): boolean {
    return this.activeTab() === tab.id;
  }

  getActiveContent(): string {
    const tab = this.tabs().find(t => t.id === this.activeTab());
    return tab?.content || '';
  }
}
