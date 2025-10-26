import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { LoginComponent } from '../app/features/auth/login/login.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AuthenticationApiService } from '../app/core/openapi/api/authentication.service';
import { AuthService } from '../app/services/auth.service';
import { ToastService } from '../app/services/toast.service';
import { of, throwError } from 'rxjs';

// Mock services for Storybook
const mockAuthApiService = {
  logIn: () => of(undefined),
  getAuthorizationToken: () =>
    of({
      user: { id: 1, email: 'demo@example.com', name: 'Demo User' },
      accessToken: 'mock-token-123',
      tokenType: 'Bearer',
    }),
};

const mockAuthService = {
  getAuthorizationToken: () =>
    of({
      user: { id: 1, email: 'demo@example.com', name: 'Demo User' },
      accessToken: 'mock-token-123',
      tokenType: 'Bearer',
    }),
};

const mockToastService = {
  success: (message: string) => console.log('Success:', message),
  error: (message: string) => console.log('Error:', message),
};

const meta: Meta<LoginComponent> = {
  title: 'Pages/Login',
  component: LoginComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    moduleMetadata({
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: AuthenticationApiService, useValue: mockAuthApiService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ToastService, useValue: mockToastService },
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<LoginComponent>;

/**
 * Default login page in light mode
 */
export const LightMode: Story = {
  render: () => ({
    template: `
      <div>
        <app-login />
      </div>
    `,
  }),
};

/**
 * Login page in dark mode
 */
export const DarkMode: Story = {
  render: () => ({
    template: `
      <div class="dark">
        <app-login />
      </div>
    `,
  }),
};

/**
 * Login page comparison between light and dark themes
 */
export const LightDarkComparison: Story = {
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; min-height: 100vh;">
        <div style="display: flex; flex-direction: column; border-right: 2px solid #e5e7eb;">
          <div style="padding: 1rem; background: #f3f4f6; font-weight: 600; text-align: center; border-bottom: 2px solid #e5e7eb;">
            Light Mode
          </div>
          <div style="flex: 1;">
            <app-login />
          </div>
        </div>
        <div class="dark" style="display: flex; flex-direction: column;">
          <div style="padding: 1rem; background: #1f2937; color: white; font-weight: 600; text-align: center; border-bottom: 2px solid #374151;">
            Dark Mode
          </div>
          <div style="flex: 1;">
            <app-login />
          </div>
        </div>
      </div>
    `,
  }),
};

/**
 * Login page with pre-filled credentials (for testing)
 */
export const WithCredentials: Story = {
  render: () => ({
    props: {},
    template: `
      <div>
        <app-login />
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = canvasElement;
    const emailInput = canvas.querySelector<HTMLInputElement>('#email');
    const passwordInput = canvas.querySelector<HTMLInputElement>('#password');

    if (emailInput) {
      emailInput.value = 'demo@example.com';
      emailInput.dispatchEvent(new Event('input'));
    }

    if (passwordInput) {
      passwordInput.value = 'password123';
      passwordInput.dispatchEvent(new Event('input'));
    }
  },
};

/**
 * Login page in loading state
 */
export const LoadingState: Story = {
  decorators: [
    moduleMetadata({
      providers: [
        provideRouter([]),
        provideHttpClient(),
        {
          provide: AuthenticationApiService,
          useValue: {
            logIn: () =>
              new Promise((resolve) => setTimeout(() => resolve(undefined), 5000)),
          },
        },
        {
          provide: AuthService,
          useValue: {
            getAuthorizationToken: () =>
              new Promise((resolve) =>
                setTimeout(
                  () =>
                    resolve({
                      accessToken: 'mock-token',
                      tokenType: 'Bearer',
                      user: {},
                    }),
                  5000
                )
              ),
          },
        },
        { provide: ToastService, useValue: mockToastService },
      ],
    }),
  ],
  render: () => ({
    template: `
      <div>
        <app-login />
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = canvasElement;
    const emailInput = canvas.querySelector<HTMLInputElement>('#email');
    const passwordInput = canvas.querySelector<HTMLInputElement>('#password');
    const submitButton = canvas.querySelector<HTMLButtonElement>('button[type="submit"]');

    if (emailInput) {
      emailInput.value = 'demo@example.com';
      emailInput.dispatchEvent(new Event('input'));
    }

    if (passwordInput) {
      passwordInput.value = 'password123';
      passwordInput.dispatchEvent(new Event('input'));
    }

    // Wait a bit for Angular to process the inputs
    await new Promise((resolve) => setTimeout(resolve, 100));

    if (submitButton && !submitButton.disabled) {
      submitButton.click();
    }
  },
};

/**
 * Login page with error state
 */
export const ErrorState: Story = {
  decorators: [
    moduleMetadata({
      providers: [
        provideRouter([]),
        provideHttpClient(),
        {
          provide: AuthenticationApiService,
          useValue: {
            logIn: () =>
              throwError(() => ({
                error: { message: 'Email o contraseña incorrectos' },
              })),
          },
        },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ToastService, useValue: mockToastService },
      ],
    }),
  ],
  render: () => ({
    template: `
      <div>
        <app-login />
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = canvasElement;
    const emailInput = canvas.querySelector<HTMLInputElement>('#email');
    const passwordInput = canvas.querySelector<HTMLInputElement>('#password');
    const submitButton = canvas.querySelector<HTMLButtonElement>('button[type="submit"]');

    if (emailInput) {
      emailInput.value = 'wrong@example.com';
      emailInput.dispatchEvent(new Event('input'));
    }

    if (passwordInput) {
      passwordInput.value = 'wrongpassword';
      passwordInput.dispatchEvent(new Event('input'));
    }

    await new Promise((resolve) => setTimeout(resolve, 100));

    if (submitButton && !submitButton.disabled) {
      submitButton.click();
    }
  },
};

/**
 * Login page with password visible
 */
export const PasswordVisible: Story = {
  render: () => ({
    template: `
      <div>
        <app-login />
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = canvasElement;
    const emailInput = canvas.querySelector<HTMLInputElement>('#email');
    const passwordInput = canvas.querySelector<HTMLInputElement>('#password');
    const toggleButton = canvas.querySelector<HTMLButtonElement>('.password-toggle');

    if (emailInput) {
      emailInput.value = 'demo@example.com';
      emailInput.dispatchEvent(new Event('input'));
    }

    if (passwordInput) {
      passwordInput.value = 'MySecurePassword123!';
      passwordInput.dispatchEvent(new Event('input'));
    }

    if (toggleButton) {
      toggleButton.click();
    }
  },
};

/**
 * Mobile view of login page
 */
export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: () => ({
    template: `
      <div>
        <app-login />
      </div>
    `,
  }),
};

/**
 * Tablet view of login page
 */
export const TabletView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
  render: () => ({
    template: `
      <div>
        <app-login />
      </div>
    `,
  }),
};
