import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserMenu, UserMenuItem } from './user-menu';

describe('UserMenu', () => {
  let component: UserMenu;
  let fixture: ComponentFixture<UserMenu>;

  const mockMenuItems: UserMenuItem[] = [
    { id: '1', label: 'Profile', icon: '<svg></svg>', action: 'profile' },
    { id: '2', label: 'Settings', icon: '<svg></svg>', action: 'settings' },
    { id: '3', label: '', divider: true },
    { id: '4', label: 'Logout', icon: '<svg></svg>', action: 'logout' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserMenu],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(UserMenu);
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

    it('should have default username', () => {
      expect(component.userName()).toBe('User');
    });

    it('should have empty email by default', () => {
      expect(component.userEmail()).toBe('');
    });

    it('should have empty menuItems by default', () => {
      expect(component.menuItems()).toEqual([]);
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
  });

  describe('User Initials', () => {
    it('should return U for default user', () => {
      expect(component.getUserInitials()).toBe('US');
    });

    it('should return initials for single word name', () => {
      fixture.componentRef.setInput('userName', 'John');
      expect(component.getUserInitials()).toBe('JO');
    });

    it('should return initials for full name', () => {
      fixture.componentRef.setInput('userName', 'John Doe');
      expect(component.getUserInitials()).toBe('JD');
    });

    it('should handle empty name', () => {
      fixture.componentRef.setInput('userName', '');
      expect(component.getUserInitials()).toBe('U');
    });
  });

  describe('Avatar Display', () => {
    it('should show placeholder when no avatar', () => {
      fixture.detectChanges();
      const placeholder = fixture.nativeElement.querySelector('.user-menu-avatar-placeholder');
      expect(placeholder).toBeTruthy();
    });

    it('should show avatar image when provided', () => {
      fixture.componentRef.setInput('userAvatar', 'https://example.com/avatar.jpg');
      fixture.detectChanges();
      const img = fixture.nativeElement.querySelector('.user-menu-avatar');
      expect(img).toBeTruthy();
      expect(img.src).toContain('avatar.jpg');
    });

    it('should display initials in placeholder', () => {
      fixture.componentRef.setInput('userName', 'Jane Smith');
      fixture.detectChanges();
      const placeholder = fixture.nativeElement.querySelector('.user-menu-avatar-placeholder');
      expect(placeholder.textContent.trim()).toBe('JS');
    });
  });

  describe('Menu Items Display', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('menuItems', mockMenuItems);
      component.toggle();
      fixture.detectChanges();
    });

    it('should display menu items', () => {
      const items = fixture.nativeElement.querySelectorAll('.user-menu-item');
      expect(items.length).toBe(3); // 4 items minus 1 divider
    });

    it('should display dividers', () => {
      const dividers = fixture.nativeElement.querySelectorAll('.user-menu-divider');
      expect(dividers.length).toBe(1);
    });

    it('should display user info', () => {
      fixture.componentRef.setInput('userName', 'John Doe');
      fixture.componentRef.setInput('userEmail', 'john@example.com');
      fixture.detectChanges();

      const name = fixture.nativeElement.querySelector('.user-menu-name');
      const email = fixture.nativeElement.querySelector('.user-menu-email');

      expect(name.textContent).toBe('John Doe');
      expect(email.textContent).toBe('john@example.com');
    });

    it('should not show email when empty', () => {
      fixture.componentRef.setInput('userEmail', '');
      fixture.detectChanges();

      const email = fixture.nativeElement.querySelector('.user-menu-email');
      expect(email).toBeFalsy();
    });
  });

  describe('Menu Item Click', () => {
    it('should emit menuItemClick event', () => {
      let clickedItem: UserMenuItem | undefined;
      component.menuItemClick.subscribe((item) => (clickedItem = item));

      component.onMenuItemClick(mockMenuItems[0], new Event('click'));

      expect(clickedItem).toEqual(mockMenuItems[0]);
    });

    it('should close dropdown after click', () => {
      component.isOpen.set(true);
      component.onMenuItemClick(mockMenuItems[0], new Event('click'));
      expect(component.isOpen()).toBe(false);
    });

    it('should not process click on divider', () => {
      let clicked = false;
      component.menuItemClick.subscribe(() => (clicked = true));

      component.onMenuItemClick(mockMenuItems[2], new Event('click'));

      expect(clicked).toBe(false);
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
      const button = fixture.nativeElement.querySelector('.user-menu-button');
      expect(button.getAttribute('aria-label')).toBe('Open user menu');
    });

    it('should have aria-expanded attribute', () => {
      const button = fixture.nativeElement.querySelector('.user-menu-button');
      expect(button.getAttribute('aria-expanded')).toBe('false');
      component.toggle();
      fixture.detectChanges();
      expect(button.getAttribute('aria-expanded')).toBe('true');
    });

    it('should have role="menu" on dropdown', () => {
      component.toggle();
      fixture.detectChanges();
      const dropdown = fixture.nativeElement.querySelector('.user-menu-dropdown');
      expect(dropdown.getAttribute('role')).toBe('menu');
    });
  });
});
