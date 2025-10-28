import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Authentication Guard
 *
 * This guard protects routes that require authentication.
 * If the user is not authenticated, they will be redirected to the login page.
 *
 * Usage:
 * ```typescript
 * {
 *   path: 'dashboard',
 *   component: DashboardComponent,
 *   canActivate: [authGuard]
 * }
 * ```
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if user has a token first (quick check)
  const token = authService.getToken();

  if (token) {
    // User has a token, allow access
    return true;
  }

  // No token, verify authentication status with the API
  return authService.checkAuthentication().pipe(
    map((isAuthenticated) => {
      if (isAuthenticated) {
        // User is authenticated, try to get authorization token
        authService.getAuthorizationToken().subscribe({
          error: () => {
            // Failed to get token, redirect to login
            router.navigate(['/login'], {
              queryParams: { returnUrl: state.url },
            });
          },
        });
        return true;
      } else {
        // Not authenticated, redirect to login
        router.navigate(['/login'], {
          queryParams: { returnUrl: state.url },
        });
        return false;
      }
    }),
    catchError(() => {
      // Error checking authentication, redirect to login
      router.navigate(['/login'], {
        queryParams: { returnUrl: state.url },
      });
      return of(false);
    }),
  );
};
