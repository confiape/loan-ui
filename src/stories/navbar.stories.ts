import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideZonelessChangeDetection } from '@angular/core';
import { of } from 'rxjs';

import { NavbarComponent } from '../app/layout/navbar/navbar';
import { UserApiService } from '../app/core/openapi/api/user.service';
import { UserDto } from '../app/core/openapi/model/userDto';

const mockUser: UserDto = {
  id: '123',
  email: 'john.doe@example.com',
  avatar: 'https://i.pravatar.cc/150?img=12',
  background: null,
  isActive: true,
  person: {
    name: 'John Doe',
    dni: '12345678',
    phoneNumber: '987654321',
    birthday: '1990-01-01',
    address: '123 Main St',
    notes: null,
  },
  roles: [
    {
      id: '1',
      name: 'Admin',
      roles: [],
      permissions: [],
    },
  ],
  permissions: [],
  companies: [],
};

const mockUserApiService = {
  getCurrentUser: () => of(mockUser),
};

const meta: Meta<NavbarComponent> = {
  title: 'Layout/Navbar',
  component: NavbarComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [
        provideZonelessChangeDetection(),
        { provide: UserApiService, useValue: mockUserApiService },
      ],
    }),
  ],
  argTypes: {
    appTitle: {
      control: 'text',
      description: 'Application title displayed in navbar',
    },
    showSearch: {
      control: 'boolean',
      description: 'Show or hide search bar',
    },
    notifications: {
      control: 'object',
      description: 'Array of notifications',
    },
    apps: {
      control: 'object',
      description: 'Array of app menu items',
    },
    userMenuItems: {
      control: 'object',
      description: 'Array of user menu items',
    },
  },
  args: {
    appTitle: 'Loan UI',
    showSearch: true,
    notifications: [
      {
        id: '1',
        title: 'New Loan Application',
        message: 'You have a new loan application from John Smith',
        time: '5m ago',
        read: false,
      },
      {
        id: '2',
        title: 'Payment Received',
        message: 'Payment of $500 received from Jane Doe',
        time: '30m ago',
        read: false,
      },
      {
        id: '3',
        title: 'Document Uploaded',
        message: 'New document uploaded by Bob Johnson',
        time: '2h ago',
        read: true,
      },
    ],
    apps: [
      {
        id: '1',
        label: 'Loans',
        icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
        href: '/loans',
      },
      {
        id: '2',
        label: 'Borrowers',
        icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2',
        href: '/borrowers',
      },
      {
        id: '3',
        label: 'Payments',
        icon: 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
        href: '/payments',
      },
    ],
    userMenuItems: [
      {
        id: '1',
        label: 'Profile',
        icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2',
        action: 'profile',
      },
      {
        id: '2',
        label: 'Settings',
        icon: 'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z',
        action: 'settings',
      },
      {
        id: '3',
        label: 'Sign Out',
        icon: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4',
        action: 'logout',
      },
    ],
  },
};

export default meta;
type Story = StoryObj<NavbarComponent>;

export const Default: Story = {
  name: 'Default (Light Mode)',
};

export const DarkMode: Story = {
  name: 'Dark Mode',
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (story) => {
      const storyResult = story();
      // Add dark class to the component's host element
      setTimeout(() => {
        const element = document.querySelector('app-navbar');
        if (element) {
          element.classList.add('dark');
        }
      });
      return storyResult;
    },
  ],
};

export const WithoutSearch: Story = {
  name: 'Without Search Bar',
  args: {
    showSearch: false,
  },
};

export const MinimalNotifications: Story = {
  name: 'With Few Notifications',
  args: {
    notifications: [
      {
        id: '1',
        title: 'Single Notification',
        message: 'You have one unread notification',
        time: 'just now',
        read: false,
      },
    ],
  },
};

export const NoNotifications: Story = {
  name: 'No Notifications',
  args: {
    notifications: [],
  },
};

export const LoadingUserError: Story = {
  name: 'User Loading Error',
  decorators: [
    applicationConfig({
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: UserApiService,
          useValue: {
            getCurrentUser: () => {
              throw new Error('Failed to load user');
            },
          },
        },
      ],
    }),
  ],
};
