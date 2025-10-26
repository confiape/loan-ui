import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationButton, Notification } from './notification-button';

describe('NotificationButton', () => {
  let component: NotificationButton;
  let fixture: ComponentFixture<NotificationButton>;

  const mockNotifications: Notification[] = [
    {
      id: '1',
      title: 'Test Title 1',
      message: 'Test message 1',
      time: '5 min ago',
      read: false,
    },
    {
      id: '2',
      title: 'Test Title 2',
      message: 'Test message 2',
      time: '1 hour ago',
      read: true,
    },
    {
      id: '3',
      title: 'Test Title 3',
      message: 'Test message 3',
      time: '2 hours ago',
      read: false,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationButton],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationButton);
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

    it('should have empty notifications by default', () => {
      expect(component.notifications()).toEqual([]);
    });

    it('should show badge by default', () => {
      expect(component.showBadge()).toBe(true);
    });

    it('should have default empty message', () => {
      expect(component.emptyMessage()).toBe('No notifications');
    });

    it('should display max 5 notifications by default', () => {
      expect(component.maxNotificationsDisplay()).toBe(5);
    });
  });

  describe('Toggle Functionality', () => {
    it('should toggle isOpen state', () => {
      expect(component.isOpen()).toBe(false);
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

  describe('Notifications Display', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('notifications', mockNotifications);
      fixture.detectChanges();
    });

    it('should display notifications', () => {
      expect(component.notifications().length).toBe(3);
    });

    it('should limit displayed notifications to maxNotificationsDisplay', () => {
      expect(component.displayedNotifications.length).toBe(3);

      fixture.componentRef.setInput('maxNotificationsDisplay', 2);
      expect(component.displayedNotifications.length).toBe(2);
    });

    it('should show dropdown when opened', () => {
      component.toggle();
      fixture.detectChanges();

      const dropdown = fixture.nativeElement.querySelector('.notification-dropdown');
      expect(dropdown).toBeTruthy();
    });

    it('should not show dropdown when closed', () => {
      const dropdown = fixture.nativeElement.querySelector('.notification-dropdown');
      expect(dropdown).toBeFalsy();
    });
  });

  describe('Unread Count', () => {
    it('should calculate unread count from notifications', () => {
      fixture.componentRef.setInput('notifications', mockNotifications);
      expect(component.unreadCount).toBe(2);
    });

    it('should use badgeCount when provided', () => {
      fixture.componentRef.setInput('badgeCount', 10);
      expect(component.unreadCount).toBe(10);
    });

    it('should show badge with unread count', () => {
      fixture.componentRef.setInput('notifications', mockNotifications);
      fixture.detectChanges();

      const badge = fixture.nativeElement.querySelector('.notification-badge');
      expect(badge).toBeTruthy();
      expect(badge.textContent.trim()).toBe('2');
    });

    it('should show 99+ for counts over 99', () => {
      fixture.componentRef.setInput('badgeCount', 150);
      fixture.detectChanges();

      const badge = fixture.nativeElement.querySelector('.notification-badge');
      expect(badge.textContent.trim()).toBe('99+');
    });

    it('should not show badge when showBadge is false', () => {
      fixture.componentRef.setInput('notifications', mockNotifications);
      fixture.componentRef.setInput('showBadge', false);
      fixture.detectChanges();

      const badge = fixture.nativeElement.querySelector('.notification-badge');
      expect(badge).toBeFalsy();
    });

    it('should not show badge when count is 0', () => {
      fixture.componentRef.setInput('notifications', []);
      fixture.detectChanges();

      const badge = fixture.nativeElement.querySelector('.notification-badge');
      expect(badge).toBeFalsy();
    });
  });

  describe('Notification Click', () => {
    it('should emit notificationClick event', () => {
      let clickedNotification: Notification | undefined;
      component.notificationClick.subscribe((n) => (clickedNotification = n));

      component.onNotificationClick(mockNotifications[0]);

      expect(clickedNotification).toEqual(mockNotifications[0]);
    });

    it('should emit markAsRead for unread notifications', () => {
      let markedId = '';
      component.markAsRead.subscribe((id) => (markedId = id));

      component.onNotificationClick(mockNotifications[0]);

      expect(markedId).toBe('1');
    });

    it('should not emit markAsRead for already read notifications', () => {
      let markedId = '';
      component.markAsRead.subscribe((id) => (markedId = id));

      component.onNotificationClick(mockNotifications[1]);

      expect(markedId).toBe('');
    });
  });

  describe('Mark All As Read', () => {
    it('should emit markAllAsRead event', () => {
      let emitted = false;
      component.markAllAsRead.subscribe(() => (emitted = true));

      component.onMarkAllAsRead();

      expect(emitted).toBe(true);
    });
  });

  describe('View All', () => {
    it('should emit viewAll event', () => {
      let emitted = false;
      component.viewAll.subscribe(() => (emitted = true));

      component.onViewAll();

      expect(emitted).toBe(true);
    });

    it('should close dropdown after view all', () => {
      component.isOpen.set(true);
      component.onViewAll();

      expect(component.isOpen()).toBe(false);
    });
  });

  describe('Empty State', () => {
    it('should show empty message when no notifications', () => {
      component.toggle();
      fixture.detectChanges();

      const emptyState = fixture.nativeElement.querySelector('.notification-empty');
      expect(emptyState).toBeTruthy();
    });

    it('should display custom empty message', () => {
      fixture.componentRef.setInput('emptyMessage', 'Custom empty message');
      component.toggle();
      fixture.detectChanges();

      const emptyState = fixture.nativeElement.querySelector('.notification-empty');
      expect(emptyState.textContent).toContain('Custom empty message');
    });

    it('should not show mark all as read button when empty', () => {
      component.toggle();
      fixture.detectChanges();

      const markAllBtn = fixture.nativeElement.querySelector('.notification-mark-all-read');
      expect(markAllBtn).toBeFalsy();
    });

    it('should not show view all footer when empty', () => {
      component.toggle();
      fixture.detectChanges();

      const footer = fixture.nativeElement.querySelector('.notification-dropdown-footer');
      expect(footer).toBeFalsy();
    });
  });

  describe('Keyboard Navigation', () => {
    it('should close on Escape key', () => {
      component.isOpen.set(true);

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      component.onEscapeKey();

      expect(component.isOpen()).toBe(false);
    });
  });

  describe('Click Outside', () => {
    it('should close when clicking outside', () => {
      component.isOpen.set(true);

      const outsideClick = new MouseEvent('click');
      component.onDocumentClick(outsideClick);

      expect(component.isOpen()).toBe(false);
    });
  });

  describe('Accessibility', () => {
    it('should have aria-label on button', () => {
      const button = fixture.nativeElement.querySelector('.notification-button');
      expect(button.getAttribute('aria-label')).toBe('View notifications');
    });

    it('should have aria-expanded attribute', () => {
      const button = fixture.nativeElement.querySelector('.notification-button');
      expect(button.getAttribute('aria-expanded')).toBe('false');

      component.toggle();
      fixture.detectChanges();
      expect(button.getAttribute('aria-expanded')).toBe('true');
    });

    it('should have aria-haspopup attribute', () => {
      const button = fixture.nativeElement.querySelector('.notification-button');
      expect(button.getAttribute('aria-haspopup')).toBe('true');
    });

    it('should have role="menu" on dropdown', () => {
      component.toggle();
      fixture.detectChanges();

      const dropdown = fixture.nativeElement.querySelector('.notification-dropdown');
      expect(dropdown.getAttribute('role')).toBe('menu');
    });
  });
});
