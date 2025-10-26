import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppsMenu, AppMenuItem } from './apps-menu';

describe('AppsMenu', () => {
  let component: AppsMenu;
  let fixture: ComponentFixture<AppsMenu>;

  const mockApps: AppMenuItem[] = [
    { id: '1', label: 'Sales', icon: '<svg></svg>', action: 'sales' },
    { id: '2', label: 'Users', icon: '<svg></svg>', action: 'users' },
    { id: '3', label: 'Settings', icon: '<svg></svg>', href: '/settings' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppsMenu],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(AppsMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should not be open initially', () => {
      expect(component.isOpen()).toBe(false);
    });

    it('should have empty apps by default', () => {
      expect(component.apps()).toEqual([]);
    });

    it('should have default title', () => {
      expect(component.title()).toBe('Apps');
    });
  });

  describe('Toggle Functionality', () => {
    it('should toggle isOpen state', () => {
      component.toggle();
      expect(component.isOpen()).toBe(true);
      component.toggle();
      expect(component.isOpen()).toBe(false);
    });

    it('should close dropdown', () => {
      component.isOpen.set(true);
      component.close();
      expect(component.isOpen()).toBe(false);
    });

    it('should show dropdown when opened', () => {
      component.toggle();
      fixture.detectChanges();
      const dropdown = fixture.nativeElement.querySelector('.apps-menu-dropdown');
      expect(dropdown).toBeTruthy();
    });
  });

  describe('Apps Display', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('apps', mockApps);
      component.toggle();
      fixture.detectChanges();
    });

    it('should display all apps', () => {
      const items = fixture.nativeElement.querySelectorAll('.apps-menu-item');
      expect(items.length).toBe(3);
    });

    it('should display app labels', () => {
      const labels = fixture.nativeElement.querySelectorAll('.apps-menu-item-label');
      expect(labels[0].textContent).toBe('Sales');
      expect(labels[1].textContent).toBe('Users');
    });

    it('should display app icons', () => {
      const icons = fixture.nativeElement.querySelectorAll('.apps-menu-item-icon');
      expect(icons.length).toBe(3);
    });
  });

  describe('App Click', () => {
    it('should emit appClick event', () => {
      let clickedApp: AppMenuItem | undefined;
      component.appClick.subscribe((app) => (clickedApp = app));

      const event = new Event('click');
      component.onAppClick(mockApps[0], event);

      expect(clickedApp).toEqual(mockApps[0]);
    });

    it('should close dropdown after click', () => {
      component.isOpen.set(true);
      component.onAppClick(mockApps[0], new Event('click'));
      expect(component.isOpen()).toBe(false);
    });
  });

  describe('Keyboard Navigation', () => {
    it('should close on Escape key', () => {
      component.isOpen.set(true);
      component.onEscapeKey();
      expect(component.isOpen()).toBe(false);
    });
  });

  describe('Click Outside', () => {
    it('should close when clicking outside', () => {
      component.isOpen.set(true);
      component.onDocumentClick(new MouseEvent('click'));
      expect(component.isOpen()).toBe(false);
    });
  });

  describe('Accessibility', () => {
    it('should have aria-label on button', () => {
      const button = fixture.nativeElement.querySelector('.apps-menu-button');
      expect(button.getAttribute('aria-label')).toBe('View apps');
    });

    it('should have aria-expanded attribute', () => {
      const button = fixture.nativeElement.querySelector('.apps-menu-button');
      expect(button.getAttribute('aria-expanded')).toBe('false');
      component.toggle();
      fixture.detectChanges();
      expect(button.getAttribute('aria-expanded')).toBe('true');
    });

    it('should have role="menu" on dropdown', () => {
      component.toggle();
      fixture.detectChanges();
      const dropdown = fixture.nativeElement.querySelector('.apps-menu-dropdown');
      expect(dropdown.getAttribute('role')).toBe('menu');
    });
  });
});
