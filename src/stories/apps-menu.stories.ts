import type { Meta, StoryObj } from '@storybook/angular';
import { AppsMenu } from '../app/components/ui/apps-menu/apps-menu';
import { createLightDarkComparison, wrapInLightDarkComparison } from './story-helpers';
import type { AppMenuItem } from '../app/components/ui/apps-menu/apps-menu';

const mockApps: AppMenuItem[] = [
  {
    id: '1',
    label: 'Sales',
    icon: '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path></svg>',
    href: '/sales',
  },
  {
    id: '2',
    label: 'Users',
    icon: '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path></svg>',
    href: '/users',
  },
  {
    id: '3',
    label: 'Inbox',
    icon: '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>',
    action: 'inbox',
  },
  {
    id: '4',
    label: 'Profile',
    icon: '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>',
    href: '/profile',
  },
  {
    id: '5',
    label: 'Settings',
    icon: '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"></path></svg>',
    href: '/settings',
  },
  {
    id: '6',
    label: 'Products',
    icon: '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clip-rule="evenodd"></path></svg>',
    href: '/products',
  },
];

const meta: Meta<AppsMenu> = {
  title: 'UI/AppsMenu',
  component: AppsMenu,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    apps: {
      control: 'object',
      description: 'Array of application menu items',
    },
    title: {
      control: 'text',
      description: 'Title displayed in the dropdown header',
    },
  },
};

export default meta;
type Story = StoryObj<AppsMenu>;

export const Default: Story = {
  args: {
    apps: mockApps,
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison('app-apps-menu', '[apps]="apps"'),
  }),
};

export const Empty: Story = {
  args: {
    apps: [],
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison('app-apps-menu', '[apps]="apps"'),
  }),
};

export const CustomTitle: Story = {
  args: {
    apps: mockApps,
    title: 'Quick Access',
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison('app-apps-menu', '[apps]="apps" [title]="title"'),
  }),
};

export const FewApps: Story = {
  args: {
    apps: mockApps.slice(0, 3),
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison('app-apps-menu', '[apps]="apps"'),
  }),
};

export const ManyApps: Story = {
  args: {
    apps: [
      ...mockApps,
      {
        id: '7',
        label: 'Calendar',
        icon: '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path></svg>',
        href: '/calendar',
      },
      {
        id: '8',
        label: 'Reports',
        icon: '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path><path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"></path></svg>',
        href: '/reports',
      },
      {
        id: '9',
        label: 'Analytics',
        icon: '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path></svg>',
        href: '/analytics',
      },
    ],
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison('app-apps-menu', '[apps]="apps"'),
  }),
};

export const WithActions: Story = {
  args: {
    apps: [
      {
        id: '1',
        label: 'Create New',
        icon: '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path></svg>',
        action: 'create',
      },
      {
        id: '2',
        label: 'Upload',
        icon: '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>',
        action: 'upload',
      },
      {
        id: '3',
        label: 'Download',
        icon: '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>',
        action: 'download',
      },
    ],
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison('app-apps-menu', '[apps]="apps"'),
  }),
};

export const MixedLinks: Story = {
  args: {
    apps: [
      {
        id: '1',
        label: 'Dashboard',
        icon: '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path></svg>',
        href: '/dashboard',
      },
      {
        id: '2',
        label: 'Open Modal',
        icon: '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>',
        action: 'openModal',
      },
      {
        id: '3',
        label: 'External Link',
        icon: '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path></svg>',
        href: 'https://example.com',
      },
    ],
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison('app-apps-menu', '[apps]="apps"'),
  }),
};

export const InNavbar: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div class="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <p class="text-sm font-semibold text-gray-500 dark:text-gray-400">
          <span class="dark:hidden">Light Mode Navbar</span>
          <span class="hidden dark:inline">Dark Mode Navbar</span>
        </p>
        <div class="flex items-center justify-end gap-4">
          <span class="text-sm text-gray-600 dark:text-gray-300">Apps menu in navbar:</span>
          <app-apps-menu [apps]="apps" />
        </div>
      </div>
    `),
    props: {
      apps: mockApps,
    },
  }),
};

export const States: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div class="space-y-6 rounded-lg bg-white p-8 shadow-sm dark:bg-gray-900">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          <span class="dark:hidden">Light Mode - States</span>
          <span class="hidden dark:inline">Dark Mode - States</span>
        </h3>
        <div class="space-y-4">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">With apps (6 items)</p>
            <app-apps-menu [apps]="apps" />
          </div>
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Empty</p>
            <app-apps-menu [apps]="[]" />
          </div>
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Custom title</p>
            <app-apps-menu [apps]="apps" [title]="'Quick Access'" />
          </div>
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Few apps (3 items)</p>
            <app-apps-menu [apps]="fewApps" />
          </div>
        </div>
      </div>
    `),
    props: {
      apps: mockApps,
      fewApps: mockApps.slice(0, 3),
    },
  }),
};
