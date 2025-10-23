import { Component, OnInit, input, output, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

export interface TabItem {
  id: string;
  label: string;
  content?: string;
  route?: string; // Router path
  disabled?: boolean;
  icon?: string;
  badge?: string | number;
  badgeVariant?: 'primary' | 'success' | 'error' | 'warning' | 'info';
}

export type TabVariant = 'default' | 'pills' | 'underline' | 'boxed' | 'segmented';
export type TabOrientation = 'horizontal' | 'vertical';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css',
})
export class TabsComponent implements OnInit {
  // Inputs
  tabs = input.required<TabItem[]>();
  activeTabId = input<string>('');
  variant = input<TabVariant>('default');
  orientation = input<TabOrientation>('horizontal');
  justified = input<boolean>(false);
  fullWidth = input<boolean>(false);
  useRouter = input<boolean>(false); // Enable router mode

  // Outputs
  tabChanged = output<TabItem>();

  // State
  activeTab = signal<string>('');
  focusedTabIndex = signal<number>(0);

  constructor(private router: Router) {}

  // Computed properties
  activeTabItem = computed(() => {
    return this.tabs().find((t) => t.id === this.activeTab());
  });

  activeContent = computed(() => {
    return this.activeTabItem()?.content || '';
  });

  enabledTabs = computed(() => {
    return this.tabs().filter((t) => !t.disabled);
  });

  containerClasses = computed(() => {
    const classes = ['tabs-container'];
    if (this.orientation() === 'vertical') {
      classes.push('tabs-container-vertical');
    }
    return classes.join(' ');
  });

  tabListClasses = computed(() => {
    const classes = ['tabs-list'];
    classes.push(`tabs-list-${this.variant()}`);
    classes.push(`tabs-list-${this.orientation()}`);

    if (this.justified()) {
      classes.push('tabs-list-justified');
    }

    if (this.fullWidth()) {
      classes.push('tabs-list-full-width');
    }

    return classes.join(' ');
  });

  ngOnInit() {
    // Set initial active tab
    const initialTab = this.activeTabId() || this.tabs()[0]?.id;
    if (initialTab) {
      this.activeTab.set(initialTab);
      const initialIndex = this.tabs().findIndex((t) => t.id === initialTab);
      if (initialIndex !== -1) {
        this.focusedTabIndex.set(initialIndex);
      }
    }

    // If using router mode, listen to route changes
    if (this.useRouter()) {
      this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
        this.syncActiveTabWithRoute();
      });

      // Sync initial route
      this.syncActiveTabWithRoute();
    }
  }

  private syncActiveTabWithRoute() {
    const currentUrl = this.router.url;
    const matchedTab = this.tabs().find((tab) => {
      if (!tab.route) return false;
      // Support both exact and partial matches
      return currentUrl === tab.route || currentUrl.startsWith(tab.route + '/');
    });

    if (matchedTab) {
      this.activeTab.set(matchedTab.id);
      const index = this.tabs().findIndex((t) => t.id === matchedTab.id);
      if (index !== -1) {
        this.focusedTabIndex.set(index);
      }
    }
  }

  selectTab(tab: TabItem, index?: number) {
    if (tab.disabled) {
      return;
    }

    this.activeTab.set(tab.id);
    this.tabChanged.emit(tab);

    if (index !== undefined) {
      this.focusedTabIndex.set(index);
    }

    // If using router mode and tab has a route, navigate
    if (this.useRouter() && tab.route) {
      this.router.navigate([tab.route]);
    }
  }

  isActive(tab: TabItem): boolean {
    if (this.useRouter() && tab.route) {
      const currentUrl = this.router.url;
      return currentUrl === tab.route || currentUrl.startsWith(tab.route + '/');
    }
    return this.activeTab() === tab.id;
  }

  getRouterLink(tab: TabItem): string | null {
    return this.useRouter() && tab.route ? tab.route : null;
  }

  getActiveContent(): string {
    return this.activeContent();
  }

  // Keyboard navigation
  handleKeyDown(event: KeyboardEvent, currentIndex: number) {
    const tabsArray = this.tabs();
    let newIndex = currentIndex;

    const isHorizontal = this.orientation() === 'horizontal';
    const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown';
    const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp';

    switch (event.key) {
      case nextKey:
        event.preventDefault();
        newIndex = this.findNextEnabledTab(currentIndex, 1);
        break;
      case prevKey:
        event.preventDefault();
        newIndex = this.findNextEnabledTab(currentIndex, -1);
        break;
      case 'Home':
        event.preventDefault();
        newIndex = this.findNextEnabledTab(-1, 1);
        break;
      case 'End':
        event.preventDefault();
        newIndex = this.findNextEnabledTab(tabsArray.length, -1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        const tab = tabsArray[currentIndex];
        if (tab && !tab.disabled) {
          this.selectTab(tab, currentIndex);
        }
        return;
      default:
        return;
    }

    if (newIndex !== currentIndex) {
      this.focusedTabIndex.set(newIndex);
      // Focus the new tab
      setTimeout(() => {
        const tabButton = document.querySelector(
          `.tab-button[data-index="${newIndex}"]`,
        ) as HTMLElement;
        tabButton?.focus();
      }, 0);
    }
  }

  private findNextEnabledTab(currentIndex: number, direction: 1 | -1): number {
    const tabsArray = this.tabs();
    let newIndex = currentIndex + direction;

    while (newIndex >= 0 && newIndex < tabsArray.length) {
      if (!tabsArray[newIndex].disabled) {
        return newIndex;
      }
      newIndex += direction;
    }

    return currentIndex;
  }

  getBadgeClass(variant?: string): string {
    return variant ? `badge badge-${variant}` : 'badge badge-primary';
  }
}
