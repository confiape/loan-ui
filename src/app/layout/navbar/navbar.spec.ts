import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { NavbarComponent as Navbar } from './navbar';
import { UserApiService } from '../../core/openapi/api/user.service';
import { UserDto } from '../../core/openapi/model/userDto';

describe('Navbar', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;
  let mockUserApiService: { getCurrentUser: ReturnType<typeof vi.fn> };

  const mockUser: UserDto = {
    id: '123',
    email: 'test@example.com',
    avatar: 'https://example.com/avatar.jpg',
    background: null,
    isActive: true,
    person: {
      name: 'John Doe',
      dni: '12345678',
      phoneNumber: '987654321',
      birthday: null,
      address: null,
      notes: null,
    },
    roles: [],
    permissions: [],
    companies: [],
  };

  beforeEach(async () => {
    mockUserApiService = {
      getCurrentUser: vi.fn().mockReturnValue(of(mockUser)),
    };

    await TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [
        provideZonelessChangeDetection(),
        { provide: UserApiService, useValue: mockUserApiService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load current user on init', () => {
    expect(mockUserApiService.getCurrentUser).toHaveBeenCalled();
    expect(component.currentUser()).toEqual(mockUser);
  });

  it('should display user name from API', () => {
    expect(component.displayUserName).toBe('John Doe');
  });

  it('should display user email from API', () => {
    expect(component.displayUserEmail).toBe('test@example.com');
  });

  it('should display user avatar from API', () => {
    expect(component.displayUserAvatar).toBe('https://example.com/avatar.jpg');
  });

  it('should fallback to input userName when API data is not available', () => {
    component.currentUser.set(null);
    fixture.componentRef.setInput('userName', 'Fallback User');
    expect(component.displayUserName).toBe('Fallback User');
  });

  it('should fallback to input userEmail when API data is not available', () => {
    component.currentUser.set(null);
    fixture.componentRef.setInput('userEmail', 'fallback@example.com');
    expect(component.displayUserEmail).toBe('fallback@example.com');
  });

  it('should fallback to input userAvatar when API data is not available', () => {
    component.currentUser.set(null);
    fixture.componentRef.setInput('userAvatar', 'https://fallback.com/avatar.jpg');
    expect(component.displayUserAvatar).toBe('https://fallback.com/avatar.jpg');
  });

  it('should handle error when loading user fails', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {
      // Intentionally empty to suppress console errors in tests
    });
    mockUserApiService.getCurrentUser.mockReturnValue(throwError(() => new Error('API Error')));

    component.loadCurrentUser();

    expect(errorSpy).toHaveBeenCalledWith('Error loading current user:', expect.any(Error));
    expect(component.userLoadError()).toBe('Failed to load user data');
    expect(component.isLoadingUser()).toBe(false);
  });

  it('should set loading state correctly', () => {
    expect(component.isLoadingUser()).toBe(false);
  });

  it('should emit menuToggle event', () => {
    vi.spyOn(component.menuToggle, 'emit');
    component.onMenuToggle();
    expect(component.menuToggle.emit).toHaveBeenCalled();
  });

  it('should emit searchChange event', () => {
    vi.spyOn(component.searchChange, 'emit');
    component.onSearchChange('test query');
    expect(component.searchChange.emit).toHaveBeenCalledWith('test query');
  });

  it('should emit searchSubmit event', () => {
    vi.spyOn(component.searchSubmit, 'emit');
    component.onSearchSubmit('test query');
    expect(component.searchSubmit.emit).toHaveBeenCalledWith('test query');
  });

  it('should emit notificationClick event', () => {
    vi.spyOn(component.notificationClick, 'emit');
    const notification = {
      id: '1',
      title: 'Test',
      message: 'Test message',
      time: '5m ago',
      read: false,
    };
    component.onNotificationClick(notification);
    expect(component.notificationClick.emit).toHaveBeenCalledWith(notification);
  });

  it('should emit appClick event', () => {
    vi.spyOn(component.appClick, 'emit');
    const app = { id: '1', label: 'Test App', icon: 'icon', href: '/test' };
    component.onAppClick(app);
    expect(component.appClick.emit).toHaveBeenCalledWith(app);
  });

  it('should emit userMenuClick event', () => {
    vi.spyOn(component.userMenuClick, 'emit');
    const menuItem = { id: '1', label: 'Profile', icon: 'user', action: 'profile' };
    component.onUserMenuClick(menuItem);
    expect(component.userMenuClick.emit).toHaveBeenCalledWith(menuItem);
  });
});
