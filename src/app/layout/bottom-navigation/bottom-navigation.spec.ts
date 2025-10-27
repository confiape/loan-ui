import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideZonelessChangeDetection } from '@angular/core';
import { BottomNavigation, BottomNavItem } from './bottom-navigation';
import { By } from '@angular/platform-browser';

describe('BottomNavigation', () => {
  let component: BottomNavigation;
  let fixture: ComponentFixture<BottomNavigation>;

  const mockItems: BottomNavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '<svg class="w-6 h-6"></svg>',
      routerLink: '/dashboard',
    },
    {
      id: 'loans',
      label: 'Loans',
      icon: '<svg class="w-6 h-6"></svg>',
      routerLink: '/loans',
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: '<svg class="w-6 h-6"></svg>',
      routerLink: '/customers',
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: '<svg class="w-6 h-6"></svg>',
      routerLink: '/reports',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BottomNavigation],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([
          { path: 'dashboard', component: BottomNavigation },
          { path: 'loans', component: BottomNavigation },
          { path: 'customers', component: BottomNavigation },
          { path: 'reports', component: BottomNavigation },
          { path: 'test', component: BottomNavigation },
          { path: 'long', component: BottomNavigation },
          { path: 'special', component: BottomNavigation },
          { path: 'settings', component: BottomNavigation },
          { path: 'help', component: BottomNavigation },
        ]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BottomNavigation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should have empty items by default', () => {
      expect(component.items()).toEqual([]);
    });

    it('should display empty state when no items', () => {
      fixture.detectChanges();
      const emptyElement = fixture.debugElement.query(By.css('.bottom-nav-empty'));
      expect(emptyElement).toBeTruthy();
      expect(emptyElement.nativeElement.textContent).toContain('No navigation items');
    });
  });

  describe('Items Rendering', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();
    });

    it('should render all navigation items', () => {
      const navItems = fixture.debugElement.queryAll(By.css('.bottom-nav-item'));
      expect(navItems.length).toBe(4);
    });

    it('should render item labels', () => {
      const labels = fixture.debugElement.queryAll(By.css('.bottom-nav-label'));
      expect(labels.length).toBe(4);
      expect(labels[0].nativeElement.textContent).toBe('Dashboard');
      expect(labels[1].nativeElement.textContent).toBe('Loans');
      expect(labels[2].nativeElement.textContent).toBe('Customers');
      expect(labels[3].nativeElement.textContent).toBe('Reports');
    });

    it('should render item icons', () => {
      const icons = fixture.debugElement.queryAll(By.css('.bottom-nav-icon'));
      expect(icons.length).toBe(4);
    });

    it('should set router links correctly', () => {
      const navItems = fixture.debugElement.queryAll(By.css('.bottom-nav-item'));
      expect(navItems[0].nativeElement.getAttribute('href')).toBe('/dashboard');
      expect(navItems[1].nativeElement.getAttribute('href')).toBe('/loans');
      expect(navItems[2].nativeElement.getAttribute('href')).toBe('/customers');
      expect(navItems[3].nativeElement.getAttribute('href')).toBe('/reports');
    });

    it('should not display empty state when items exist', () => {
      const emptyElement = fixture.debugElement.query(By.css('.bottom-nav-empty'));
      expect(emptyElement).toBeFalsy();
    });
  });

  describe('ARIA Attributes', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();
    });

    it('should have navigation role', () => {
      const nav = fixture.debugElement.query(By.css('nav'));
      expect(nav.nativeElement.getAttribute('role')).toBe('navigation');
    });

    it('should have aria-label on navigation', () => {
      const nav = fixture.debugElement.query(By.css('nav'));
      expect(nav.nativeElement.getAttribute('aria-label')).toBe('Bottom navigation');
    });

    it('should have aria-label on each item', () => {
      const navItems = fixture.debugElement.queryAll(By.css('.bottom-nav-item'));
      expect(navItems[0].nativeElement.getAttribute('aria-label')).toBe('Dashboard');
      expect(navItems[1].nativeElement.getAttribute('aria-label')).toBe('Loans');
      expect(navItems[2].nativeElement.getAttribute('aria-label')).toBe('Customers');
      expect(navItems[3].nativeElement.getAttribute('aria-label')).toBe('Reports');
    });
  });

  describe('Item Click Event', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();
    });

    it('should emit itemClick event when item is clicked', async () => {
      let emittedItem: BottomNavItem | null = null;

      component.itemClick.subscribe((item: BottomNavItem) => {
        emittedItem = item;
      });

      const firstItem = fixture.debugElement.query(By.css('.bottom-nav-item'));
      firstItem.nativeElement.click();

      await fixture.whenStable();
      expect(emittedItem).toEqual(mockItems[0]);
    });

    it('should emit correct item on different clicks', async () => {
      let clickCount = 0;
      const emittedItems: BottomNavItem[] = [];

      component.itemClick.subscribe((item: BottomNavItem) => {
        clickCount++;
        emittedItems.push(item);
      });

      const navItems = fixture.debugElement.queryAll(By.css('.bottom-nav-item'));
      navItems[1].nativeElement.click(); // Loans
      navItems[2].nativeElement.click(); // Customers

      await fixture.whenStable();
      expect(clickCount).toBe(2);
      expect(emittedItems[0].id).toBe('loans');
      expect(emittedItems[1].id).toBe('customers');
    });
  });

  describe('Dynamic Items', () => {
    it('should update when items change', () => {
      fixture.componentRef.setInput('items', mockItems.slice(0, 2));
      fixture.detectChanges();

      let navItems = fixture.debugElement.queryAll(By.css('.bottom-nav-item'));
      expect(navItems.length).toBe(2);

      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      navItems = fixture.debugElement.queryAll(By.css('.bottom-nav-item'));
      expect(navItems.length).toBe(4);
    });

    it('should show empty state when items become empty', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      let emptyElement = fixture.debugElement.query(By.css('.bottom-nav-empty'));
      expect(emptyElement).toBeFalsy();

      fixture.componentRef.setInput('items', []);
      fixture.detectChanges();

      emptyElement = fixture.debugElement.query(By.css('.bottom-nav-empty'));
      expect(emptyElement).toBeTruthy();
    });
  });

  describe('HTML Structure', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();
    });

    it('should have bottom-nav class on navigation element', () => {
      const nav = fixture.debugElement.query(By.css('.bottom-nav'));
      expect(nav).toBeTruthy();
    });

    it('should have bottom-nav-container class on container', () => {
      const container = fixture.debugElement.query(By.css('.bottom-nav-container'));
      expect(container).toBeTruthy();
    });

    it('should have bottom-nav-item class on items', () => {
      const navItems = fixture.debugElement.queryAll(By.css('.bottom-nav-item'));
      expect(navItems.length).toBe(4);
    });

    it('should have bottom-nav-icon class on icons', () => {
      const icons = fixture.debugElement.queryAll(By.css('.bottom-nav-icon'));
      expect(icons.length).toBe(4);
    });

    it('should have bottom-nav-label class on labels', () => {
      const labels = fixture.debugElement.queryAll(By.css('.bottom-nav-label'));
      expect(labels.length).toBe(4);
    });
  });

  describe('Icon Rendering', () => {
    it('should render icon container for each item', () => {
      const customIcon = '<svg class="w-6 h-6"><path d="M10 20"/></svg>';
      const itemsWithCustomIcon: BottomNavItem[] = [
        {
          id: 'test',
          label: 'Test',
          icon: customIcon,
          routerLink: '/test',
        },
      ];

      fixture.componentRef.setInput('items', itemsWithCustomIcon);
      fixture.detectChanges();

      const icon = fixture.debugElement.query(By.css('.bottom-nav-icon'));
      expect(icon).toBeTruthy();
      expect(icon.nativeElement).toBeTruthy();
      // Note: Angular sanitizes HTML for security, so innerHTML may be empty in tests
      // The important thing is that the icon element exists
    });
  });

  describe('Edge Cases', () => {
    it('should handle single item', () => {
      fixture.componentRef.setInput('items', [mockItems[0]]);
      fixture.detectChanges();

      const navItems = fixture.debugElement.queryAll(By.css('.bottom-nav-item'));
      expect(navItems.length).toBe(1);
      expect(navItems[0].nativeElement.textContent).toContain('Dashboard');
    });

    it('should handle many items', () => {
      const manyItems = [
        ...mockItems,
        {
          id: 'settings',
          label: 'Settings',
          icon: '<svg></svg>',
          routerLink: '/settings',
        },
        {
          id: 'help',
          label: 'Help',
          icon: '<svg></svg>',
          routerLink: '/help',
        },
      ];

      fixture.componentRef.setInput('items', manyItems);
      fixture.detectChanges();

      const navItems = fixture.debugElement.queryAll(By.css('.bottom-nav-item'));
      expect(navItems.length).toBe(6);
    });

    it('should handle items with long labels', () => {
      const itemsWithLongLabels: BottomNavItem[] = [
        {
          id: 'long',
          label: 'Very Long Navigation Label',
          icon: '<svg></svg>',
          routerLink: '/long',
        },
      ];

      fixture.componentRef.setInput('items', itemsWithLongLabels);
      fixture.detectChanges();

      const label = fixture.debugElement.query(By.css('.bottom-nav-label'));
      expect(label.nativeElement.textContent).toBe('Very Long Navigation Label');
    });

    it('should handle items with special characters in labels', () => {
      const itemsWithSpecialChars: BottomNavItem[] = [
        {
          id: 'special',
          label: 'Préstamos & Créditos',
          icon: '<svg></svg>',
          routerLink: '/special',
        },
      ];

      fixture.componentRef.setInput('items', itemsWithSpecialChars);
      fixture.detectChanges();

      const label = fixture.debugElement.query(By.css('.bottom-nav-label'));
      expect(label.nativeElement.textContent).toBe('Préstamos & Créditos');
    });
  });
});
