import type { Meta, StoryObj } from '@storybook/angular';
import { UserMenu } from '../app/components/ui/user-menu/user-menu';
import { createLightDarkComparison } from './story-helpers';
import type { UserMenuItem } from '../app/components/ui/user-menu/user-menu';

const mockMenuItems: UserMenuItem[] = [
  {
    id: '1',
    label: 'My Profile',
    icon: '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>',
    action: 'profile',
  },
  {
    id: '2',
    label: 'Settings',
    icon: '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"></path></svg>',
    action: 'settings',
  },
  {
    id: '3',
    label: '',
    divider: true,
  },
  {
    id: '4',
    label: 'Earnings',
    icon: '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"></path><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd"></path></svg>',
    action: 'earnings',
  },
  {
    id: '5',
    label: '',
    divider: true,
  },
  {
    id: '6',
    label: 'Sign out',
    icon: '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd"></path></svg>',
    action: 'logout',
  },
];

const meta: Meta<UserMenu> = {
  title: 'UI/UserMenu',
  component: UserMenu,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    userName: {
      control: 'text',
      description: 'User name to display',
    },
    userEmail: {
      control: 'text',
      description: 'User email to display',
    },
    userAvatar: {
      control: 'text',
      description: 'URL to user avatar image',
    },
    menuItems: {
      control: 'object',
      description: 'Array of menu items',
    },
  },
};

export default meta;
type Story = StoryObj<UserMenu>;

export const Default: Story = {
  args: {
    userName: 'John Doe',
    userEmail: 'john.doe@example.com',
    menuItems: mockMenuItems,
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-user-menu',
      '[userName]="userName" [userEmail]="userEmail" [menuItems]="menuItems"'
    ),
  }),
};

export const WithAvatar: Story = {
  args: {
    userName: 'Jane Smith',
    userEmail: 'jane.smith@example.com',
    userAvatar: 'https://i.pravatar.cc/150?img=5',
    menuItems: mockMenuItems,
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-user-menu',
      '[userName]="userName" [userEmail]="userEmail" [userAvatar]="userAvatar" [menuItems]="menuItems"'
    ),
  }),
};

export const WithoutEmail: Story = {
  args: {
    userName: 'Bob Johnson',
    menuItems: mockMenuItems,
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-user-menu',
      '[userName]="userName" [menuItems]="menuItems"'
    ),
  }),
};

export const SingleName: Story = {
  args: {
    userName: 'Alice',
    userEmail: 'alice@example.com',
    menuItems: mockMenuItems,
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-user-menu',
      '[userName]="userName" [userEmail]="userEmail" [menuItems]="menuItems"'
    ),
  }),
};

export const LongName: Story = {
  args: {
    userName: 'Christopher Alexander Montgomery',
    userEmail: 'christopher.montgomery@example.com',
    menuItems: mockMenuItems,
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-user-menu',
      '[userName]="userName" [userEmail]="userEmail" [menuItems]="menuItems"'
    ),
  }),
};

export const EmptyMenu: Story = {
  args: {
    userName: 'John Doe',
    userEmail: 'john.doe@example.com',
    menuItems: [],
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-user-menu',
      '[userName]="userName" [userEmail]="userEmail" [menuItems]="menuItems"'
    ),
  }),
};

export const SimpleMenu: Story = {
  args: {
    userName: 'Jane Doe',
    userEmail: 'jane@example.com',
    menuItems: [
      {
        id: '1',
        label: 'Profile',
        icon: '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>',
        action: 'profile',
      },
      {
        id: '2',
        label: 'Settings',
        icon: '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"></path></svg>',
        action: 'settings',
      },
      {
        id: '3',
        label: 'Logout',
        icon: '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd"></path></svg>',
        action: 'logout',
      },
    ],
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-user-menu',
      '[userName]="userName" [userEmail]="userEmail" [menuItems]="menuItems"'
    ),
  }),
};

export const WithLinks: Story = {
  args: {
    userName: 'Admin User',
    userEmail: 'admin@example.com',
    menuItems: [
      {
        id: '1',
        label: 'Dashboard',
        icon: '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path></svg>',
        href: '/dashboard',
      },
      {
        id: '2',
        label: 'Settings',
        icon: '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"></path></svg>',
        href: '/settings',
      },
      {
        id: '3',
        label: '',
        divider: true,
      },
      {
        id: '4',
        label: 'Help Center',
        icon: '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path></svg>',
        href: '/help',
      },
      {
        id: '5',
        label: 'Sign out',
        icon: '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd"></path></svg>',
        action: 'logout',
      },
    ],
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-user-menu',
      '[userName]="userName" [userEmail]="userEmail" [menuItems]="menuItems"'
    ),
  }),
};

export const MultipleDividers: Story = {
  args: {
    userName: 'John Doe',
    userEmail: 'john@example.com',
    menuItems: [
      {
        id: '1',
        label: 'Profile',
        icon: '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>',
        action: 'profile',
      },
      {
        id: '2',
        label: 'Settings',
        icon: '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"></path></svg>',
        action: 'settings',
      },
      {
        id: '3',
        label: '',
        divider: true,
      },
      {
        id: '4',
        label: 'Billing',
        icon: '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"></path><path fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd"></path></svg>',
        action: 'billing',
      },
      {
        id: '5',
        label: 'Team',
        icon: '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path></svg>',
        action: 'team',
      },
      {
        id: '6',
        label: '',
        divider: true,
      },
      {
        id: '7',
        label: 'Help',
        icon: '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path></svg>',
        action: 'help',
      },
      {
        id: '8',
        label: '',
        divider: true,
      },
      {
        id: '9',
        label: 'Sign out',
        icon: '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd"></path></svg>',
        action: 'logout',
      },
    ],
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-user-menu',
      '[userName]="userName" [userEmail]="userEmail" [menuItems]="menuItems"'
    ),
  }),
};

export const InNavbar: Story = {
  render: () => ({
    template: `
      <div class="space-y-8">
        <!-- Light Mode Navbar -->
        <div class="bg-white border-b border-gray-200 p-4">
          <div class="flex items-center justify-end gap-4">
            <span class="text-sm text-gray-600">User menu in navbar:</span>
            <app-user-menu
              [userName]="userName"
              [userEmail]="userEmail"
              [menuItems]="menuItems"
            />
          </div>
        </div>

        <!-- Dark Mode Navbar -->
        <div class="dark bg-gray-800 border-b border-gray-700 p-4">
          <div class="flex items-center justify-end gap-4">
            <span class="text-sm text-gray-400">User menu in navbar:</span>
            <app-user-menu
              [userName]="userName"
              [userEmail]="userEmail"
              [menuItems]="menuItems"
            />
          </div>
        </div>
      </div>
    `,
    props: {
      userName: 'John Doe',
      userEmail: 'john.doe@example.com',
      menuItems: mockMenuItems,
    },
  }),
};

export const States: Story = {
  render: () => ({
    template: `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
        <div class="space-y-8">
          <div class="bg-white p-8 rounded-lg">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Light Mode - States</h3>
            <div class="space-y-4">
              <div>
                <p class="text-sm text-gray-600 mb-2">With email</p>
                <app-user-menu
                  [userName]="'John Doe'"
                  [userEmail]="'john@example.com'"
                  [menuItems]="menuItems"
                />
              </div>
              <div>
                <p class="text-sm text-gray-600 mb-2">Without email</p>
                <app-user-menu
                  [userName]="'Jane Smith'"
                  [menuItems]="menuItems"
                />
              </div>
              <div>
                <p class="text-sm text-gray-600 mb-2">With avatar</p>
                <app-user-menu
                  [userName]="'Bob Johnson'"
                  [userEmail]="'bob@example.com'"
                  [userAvatar]="'https://i.pravatar.cc/150?img=8'"
                  [menuItems]="menuItems"
                />
              </div>
              <div>
                <p class="text-sm text-gray-600 mb-2">Empty menu</p>
                <app-user-menu
                  [userName]="'Alice Brown'"
                  [userEmail]="'alice@example.com'"
                  [menuItems]="[]"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="space-y-8">
          <div class="dark bg-gray-900 p-8 rounded-lg">
            <h3 class="text-lg font-semibold text-white mb-4">Dark Mode - States</h3>
            <div class="space-y-4">
              <div>
                <p class="text-sm text-gray-400 mb-2">With email</p>
                <app-user-menu
                  [userName]="'John Doe'"
                  [userEmail]="'john@example.com'"
                  [menuItems]="menuItems"
                />
              </div>
              <div>
                <p class="text-sm text-gray-400 mb-2">Without email</p>
                <app-user-menu
                  [userName]="'Jane Smith'"
                  [menuItems]="menuItems"
                />
              </div>
              <div>
                <p class="text-sm text-gray-400 mb-2">With avatar</p>
                <app-user-menu
                  [userName]="'Bob Johnson'"
                  [userEmail]="'bob@example.com'"
                  [userAvatar]="'https://i.pravatar.cc/150?img=8'"
                  [menuItems]="menuItems"
                />
              </div>
              <div>
                <p class="text-sm text-gray-400 mb-2">Empty menu</p>
                <app-user-menu
                  [userName]="'Alice Brown'"
                  [userEmail]="'alice@example.com'"
                  [menuItems]="[]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
    props: {
      menuItems: mockMenuItems,
    },
  }),
};
