import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideZonelessChangeDetection } from '@angular/core';
import { of, throwError, firstValueFrom, delay } from 'rxjs';
import { vi, Mock } from 'vitest';
import { AuthService } from './auth.service';
import { AuthenticationApiService } from '../core/openapi/api/authentication.service';
import { LoginResponse } from '../core/openapi/model/loginResponse';

describe('AuthService', () => {
  let service: AuthService;
  let authApiMock: {
    isAuthenticated: Mock;
    getAuthorizationToken: Mock;
    logOut: Mock;
  };
  let routerMock: {
    navigate: Mock;
  };

  const mockLoginResponse: LoginResponse = {
    user: {
      name: 'Test User',
      dni: '12345678',
      phoneNumber: '123456789',
    },
    accessToken: 'mock-access-token',
    tokenType: 'Bearer',
  };

  beforeEach(() => {
    authApiMock = {
      isAuthenticated: vi.fn() as Mock,
      getAuthorizationToken: vi.fn() as Mock,
      logOut: vi.fn() as Mock,
    };

    routerMock = {
      navigate: vi.fn() as Mock,
    };

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        AuthService,
        { provide: AuthenticationApiService, useValue: authApiMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    service.clearToken();
  });

  describe('Token Management', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize with null token', () => {
      expect(service.getToken()).toBeNull();
      expect(service.isAuthenticated$()).toBe(false);
    });

    it('should set and get token', () => {
      service.setToken('test-token');

      expect(service.getToken()).toBe('test-token');
      expect(service.token$()).toBe('test-token');
      expect(service.isAuthenticated$()).toBe(true);
    });

    it('should clear token', () => {
      service.setToken('test-token');
      service.clearToken();

      expect(service.getToken()).toBeNull();
      expect(service.token$()).toBeNull();
      expect(service.isAuthenticated$()).toBe(false);
    });
  });

  describe('checkAuthentication', () => {
    it('should update authentication state when API returns true', async () => {
      authApiMock.isAuthenticated!.mockReturnValue(of(true));

      const isAuth = await firstValueFrom(service.checkAuthentication());
      expect(isAuth).toBe(true);
      expect(service.isAuthenticated$()).toBe(true);
      expect(authApiMock.isAuthenticated).toHaveBeenCalled();
    });

    it('should clear token when API returns false', async () => {
      service.setToken('test-token');
      authApiMock.isAuthenticated!.mockReturnValue(of(false));

      const isAuth = await firstValueFrom(service.checkAuthentication());
      expect(isAuth).toBe(false);
      expect(service.isAuthenticated$()).toBe(false);
      expect(service.getToken()).toBeNull();
    });

    it('should handle API errors and clear token', async () => {
      service.setToken('test-token');
      authApiMock.isAuthenticated!.mockReturnValue(throwError(() => new Error('API Error')));

      const isAuth = await firstValueFrom(service.checkAuthentication());
      expect(isAuth).toBe(false);
      expect(service.isAuthenticated$()).toBe(false);
      expect(service.getToken()).toBeNull();
    });
  });

  describe('getAuthorizationToken', () => {
    it('should set token when API returns success', async () => {
      authApiMock.getAuthorizationToken!.mockReturnValue(of(mockLoginResponse));

      const response = await firstValueFrom(service.getAuthorizationToken());
      expect(response).toEqual(mockLoginResponse);
      expect(service.getToken()).toBe('mock-access-token');
      expect(service.isAuthenticated$()).toBe(true);
      expect(authApiMock.getAuthorizationToken).toHaveBeenCalled();
    });

    it('should clear token when API fails', async () => {
      service.setToken('old-token');
      authApiMock.getAuthorizationToken!.mockReturnValue(throwError(() => new Error('API Error')));

      try {
        await firstValueFrom(service.getAuthorizationToken());
        // If we reach here, the test should fail
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeDefined();
        expect(service.getToken()).toBeNull();
        expect(service.isAuthenticated$()).toBe(false);
      }
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      authApiMock.getAuthorizationToken!.mockReturnValue(of(mockLoginResponse));

      const response = await firstValueFrom(service.refreshToken());
      expect(response).toEqual(mockLoginResponse);
      expect(service.getToken()).toBe('mock-access-token');
      expect(authApiMock.getAuthorizationToken).toHaveBeenCalled();
    });

    it('should clear token when refresh fails', async () => {
      service.setToken('old-token');
      authApiMock.getAuthorizationToken!.mockReturnValue(
        throwError(() => new Error('Refresh failed')),
      );

      try {
        await firstValueFrom(service.refreshToken());
        // If we reach here, the test should fail
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeDefined();
        expect(service.getToken()).toBeNull();
        expect(service.isAuthenticated$()).toBe(false);
      }
    });

    it('should prevent multiple simultaneous refreshes', async () => {
      let callCount = 0;
      authApiMock.getAuthorizationToken.mockImplementation(() => {
        callCount++;
        return of(mockLoginResponse).pipe(delay(100));
      });

      // Call refresh twice simultaneously
      const promise1 = firstValueFrom(service.refreshToken());
      const promise2 = firstValueFrom(service.refreshToken());

      await Promise.all([promise1, promise2]);

      // Only one API call should have been made
      expect(callCount).toBe(1);
    });
  });

  describe('navigateToLogin', () => {
    it('should clear token and navigate to login', () => {
      service.setToken('test-token');

      service.navigateToLogin();

      expect(service.getToken()).toBeNull();
      expect(service.isAuthenticated$()).toBe(false);
      expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      service.setToken('test-token');
      authApiMock.logOut!.mockReturnValue(of(undefined));

      await firstValueFrom(service.logout());
      expect(service.getToken()).toBeNull();
      expect(service.isAuthenticated$()).toBe(false);
      expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
      expect(authApiMock.logOut).toHaveBeenCalled();
    });

    it('should clear token even if logout API fails', async () => {
      service.setToken('test-token');
      authApiMock.logOut!.mockReturnValue(throwError(() => new Error('Logout failed')));

      await firstValueFrom(service.logout());
      expect(service.getToken()).toBeNull();
      expect(service.isAuthenticated$()).toBe(false);
      expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
    });
  });
});
