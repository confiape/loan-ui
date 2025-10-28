import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideZonelessChangeDetection } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateFn } from '@angular/router';
import { of, throwError, firstValueFrom, isObservable } from 'rxjs';
import { vi, Mock } from 'vitest';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', () => {
  let mockAuthService: {
    getToken: Mock;
    checkAuthentication: Mock;
    getAuthorizationToken: Mock;
  };
  let mockRouter: {
    navigate: Mock;
  };
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(() => {
    mockAuthService = {
      getToken: vi.fn() as Mock,
      checkAuthentication: vi.fn() as Mock,
      getAuthorizationToken: vi.fn() as Mock,
    };
    mockRouter = {
      navigate: vi.fn() as Mock,
    };

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    mockRoute = {} as ActivatedRouteSnapshot;
    mockState = { url: '/dashboard' } as RouterStateSnapshot;
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should allow access if user has a token', () => {
    mockAuthService.getToken.mockReturnValue('mock-token');

    const result = executeGuard(mockRoute, mockState);

    expect(result).toBe(true);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should check authentication and allow access if authenticated', async () => {
    mockAuthService.getToken.mockReturnValue(null);
    mockAuthService.checkAuthentication.mockReturnValue(of(true));
    mockAuthService.getAuthorizationToken.mockReturnValue(of({ accessToken: 'new-token' }));

    const result = executeGuard(mockRoute, mockState);

    if (!isObservable(result)) {
      throw new Error('Expected observable result');
    }

    const canActivate = await firstValueFrom(result);
    expect(canActivate).toBe(true);
    expect(mockAuthService.checkAuthentication).toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to login if not authenticated', async () => {
    mockAuthService.getToken.mockReturnValue(null);
    mockAuthService.checkAuthentication.mockReturnValue(of(false));

    const result = executeGuard(mockRoute, mockState);

    if (!isObservable(result)) {
      throw new Error('Expected observable result');
    }

    const canActivate = await firstValueFrom(result);
    expect(canActivate).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login'], {
      queryParams: { returnUrl: '/dashboard' },
    });
  });

  it('should redirect to login on authentication check error', async () => {
    mockAuthService.getToken.mockReturnValue(null);
    mockAuthService.checkAuthentication.mockReturnValue(
      throwError(() => new Error('Network error')),
    );

    const result = executeGuard(mockRoute, mockState);

    if (!isObservable(result)) {
      throw new Error('Expected observable result');
    }

    const canActivate = await firstValueFrom(result);
    expect(canActivate).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login'], {
      queryParams: { returnUrl: '/dashboard' },
    });
  });

  it('should include returnUrl in query params when redirecting', async () => {
    mockAuthService.getToken.mockReturnValue(null);
    mockAuthService.checkAuthentication.mockReturnValue(of(false));
    const customState = { url: '/protected/route' } as RouterStateSnapshot;

    const result = executeGuard(mockRoute, customState);

    if (!isObservable(result)) {
      throw new Error('Expected observable result');
    }

    await firstValueFrom(result);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login'], {
      queryParams: { returnUrl: '/protected/route' },
    });
  });
});
