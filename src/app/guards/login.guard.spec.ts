import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideZonelessChangeDetection } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateFn } from '@angular/router';
import { of, throwError, firstValueFrom, isObservable } from 'rxjs';
import { vi, Mock } from 'vitest';
import { loginGuard } from './login.guard';
import { AuthService } from '../services/auth.service';

describe('loginGuard', () => {
  let mockAuthService: {
    getToken: Mock;
    checkAuthentication: Mock;
  };
  let mockRouter: {
    navigate: Mock;
  };
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => loginGuard(...guardParameters));

  beforeEach(() => {
    mockAuthService = {
      getToken: vi.fn() as Mock,
      checkAuthentication: vi.fn() as Mock,
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
    mockState = { url: '/login' } as RouterStateSnapshot;
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should redirect to dashboard if user has a token', () => {
    mockAuthService.getToken.mockReturnValue('mock-token');

    const result = executeGuard(mockRoute, mockState);

    expect(result).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should check authentication and redirect to dashboard if authenticated', async () => {
    mockAuthService.getToken.mockReturnValue(null);
    mockAuthService.checkAuthentication.mockReturnValue(of(true));

    const result = executeGuard(mockRoute, mockState);

    if (!isObservable(result)) {
      throw new Error('Expected observable result');
    }

    const canActivate = await firstValueFrom(result);
    expect(canActivate).toBe(false);
    expect(mockAuthService.checkAuthentication).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should allow access to login if not authenticated', async () => {
    mockAuthService.getToken.mockReturnValue(null);
    mockAuthService.checkAuthentication.mockReturnValue(of(false));

    const result = executeGuard(mockRoute, mockState);

    if (!isObservable(result)) {
      throw new Error('Expected observable result');
    }

    const canActivate = await firstValueFrom(result);
    expect(canActivate).toBe(true);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should allow access to login on authentication check error', async () => {
    mockAuthService.getToken.mockReturnValue(null);
    mockAuthService.checkAuthentication.mockReturnValue(
      throwError(() => new Error('Network error')),
    );

    const result = executeGuard(mockRoute, mockState);

    if (!isObservable(result)) {
      throw new Error('Expected observable result');
    }

    const canActivate = await firstValueFrom(result);
    expect(canActivate).toBe(true);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should handle authentication errors gracefully', async () => {
    mockAuthService.getToken.mockReturnValue(null);
    mockAuthService.checkAuthentication.mockReturnValue(throwError(() => new Error('API error')));

    const result = executeGuard(mockRoute, mockState);

    if (!isObservable(result)) {
      throw new Error('Expected observable result');
    }

    const canActivate = await firstValueFrom(result);
    expect(canActivate).toBe(true);
    expect(mockAuthService.checkAuthentication).toHaveBeenCalled();
  });
});
