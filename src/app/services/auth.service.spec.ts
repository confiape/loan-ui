import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideZonelessChangeDetection } from '@angular/core';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { AuthService } from './auth.service';
import { AuthenticationApiService } from '../core/openapi/api/authentication.service';
import { LoginResponse } from '../core/openapi/model/loginResponse';

describe('AuthService', () => {
  let service: AuthService;
  let authApiMock: Partial<AuthenticationApiService>;
  let routerMock: Partial<Router>;

  const mockLoginResponse: LoginResponse = {
    user: { id: 1, email: 'test@test.com' } as any,
    accessToken: 'mock-access-token',
    tokenType: 'Bearer',
  };

  beforeEach(() => {
    authApiMock = {
      isAuthenticated: vi.fn(),
      getAuthorizationToken: vi.fn(),
      logOut: vi.fn(),
    };

    routerMock = {
      navigate: vi.fn(),
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
    it('should update authentication state when API returns true', (done) => {
      authApiMock.isAuthenticated!.mockReturnValue(of(true));

      service.checkAuthentication().subscribe((isAuth) => {
        expect(isAuth).toBe(true);
        expect(service.isAuthenticated$()).toBe(true);
        expect(authApiMock.isAuthenticated).toHaveBeenCalled();
        done();
      });
    });

    it('should clear token when API returns false', (done) => {
      service.setToken('test-token');
      authApiMock.isAuthenticated!.mockReturnValue(of(false));

      service.checkAuthentication().subscribe((isAuth) => {
        expect(isAuth).toBe(false);
        expect(service.isAuthenticated$()).toBe(false);
        expect(service.getToken()).toBeNull();
        done();
      });
    });

    it('should handle API errors and clear token', (done) => {
      service.setToken('test-token');
      authApiMock.isAuthenticated!.mockReturnValue(
        throwError(() => new Error('API Error'))
      );

      service.checkAuthentication().subscribe((isAuth) => {
        expect(isAuth).toBe(false);
        expect(service.isAuthenticated$()).toBe(false);
        expect(service.getToken()).toBeNull();
        done();
      });
    });
  });

  describe('getAuthorizationToken', () => {
    it('should set token when API returns success', (done) => {
      authApiMock.getAuthorizationToken!.mockReturnValue(of(mockLoginResponse));

      service.getAuthorizationToken().subscribe((response) => {
        expect(response).toEqual(mockLoginResponse);
        expect(service.getToken()).toBe('mock-access-token');
        expect(service.isAuthenticated$()).toBe(true);
        expect(authApiMock.getAuthorizationToken).toHaveBeenCalled();
        done();
      });
    });

    it('should clear token when API fails', (done) => {
      service.setToken('old-token');
      authApiMock.getAuthorizationToken!.mockReturnValue(
        throwError(() => new Error('API Error'))
      );

      service.getAuthorizationToken().subscribe({
        error: (error) => {
          expect(error).toBeDefined();
          expect(service.getToken()).toBeNull();
          expect(service.isAuthenticated$()).toBe(false);
          done();
        },
      });
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', (done) => {
      authApiMock.getAuthorizationToken!.mockReturnValue(of(mockLoginResponse));

      service.refreshToken().subscribe((response) => {
        expect(response).toEqual(mockLoginResponse);
        expect(service.getToken()).toBe('mock-access-token');
        expect(authApiMock.getAuthorizationToken).toHaveBeenCalled();
        done();
      });
    });

    it('should clear token when refresh fails', (done) => {
      service.setToken('old-token');
      authApiMock.getAuthorizationToken!.mockReturnValue(
        throwError(() => new Error('Refresh failed'))
      );

      service.refreshToken().subscribe({
        error: (error) => {
          expect(error).toBeDefined();
          expect(service.getToken()).toBeNull();
          expect(service.isAuthenticated$()).toBe(false);
          done();
        },
      });
    });

    it('should prevent multiple simultaneous refreshes', (done) => {
      let callCount = 0;
      authApiMock.getAuthorizationToken!.mockImplementation(() => {
        callCount++;
        return new Promise((resolve) => {
          setTimeout(() => resolve(mockLoginResponse), 100);
        }) as any;
      });

      // Call refresh twice simultaneously
      service.refreshToken().subscribe();
      service.refreshToken().subscribe(() => {
        // Only one API call should have been made
        expect(callCount).toBe(1);
        done();
      });
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
    it('should logout successfully', (done) => {
      service.setToken('test-token');
      authApiMock.logOut!.mockReturnValue(of(undefined));

      service.logout().subscribe(() => {
        expect(service.getToken()).toBeNull();
        expect(service.isAuthenticated$()).toBe(false);
        expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
        expect(authApiMock.logOut).toHaveBeenCalled();
        done();
      });
    });

    it('should clear token even if logout API fails', (done) => {
      service.setToken('test-token');
      authApiMock.logOut!.mockReturnValue(throwError(() => new Error('Logout failed')));

      service.logout().subscribe(() => {
        expect(service.getToken()).toBeNull();
        expect(service.isAuthenticated$()).toBe(false);
        expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
        done();
      });
    });
  });
});
