import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';
import { tokenRetryInterceptor } from './interceptors/token-retry.interceptor';
import { httpNotificationInterceptor } from './interceptors/http-notification.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        authInterceptor, // 1. Check auth and add token
        tokenRetryInterceptor, // 2. Handle expired tokens
        httpNotificationInterceptor, // 3. Show notifications
      ])
    ),
  ],
};
