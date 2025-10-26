import type { Meta, StoryObj } from '@storybook/angular';
import { NotificationButton } from '../app/components/ui/notification-button/notification-button';
import { createLightDarkComparison } from './story-helpers';
import type { Notification } from '../app/components/ui/notification-button/notification-button';

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New message',
    message: 'You have a new message from John Doe',
    time: '5 min ago',
    read: false,
  },
  {
    id: '2',
    title: 'System update',
    message: 'System will be updated tonight at 2:00 AM',
    time: '1 hour ago',
    read: true,
    icon: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z"></path></svg>',
    iconColor: 'text-blue-500',
  },
  {
    id: '3',
    title: 'New comment',
    message: 'Jane Smith commented on your post',
    time: '2 hours ago',
    read: false,
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '4',
    title: 'Task completed',
    message: 'Your export task has been completed successfully',
    time: '3 hours ago',
    read: true,
    icon: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>',
    iconColor: 'text-green-500',
  },
];

const meta: Meta<NotificationButton> = {
  title: 'UI/NotificationButton',
  component: NotificationButton,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    notifications: {
      control: 'object',
      description: 'Array of notification objects',
    },
    showBadge: {
      control: 'boolean',
      description: 'Whether to show the badge counter',
    },
    badgeCount: {
      control: 'number',
      description: 'Custom badge count (overrides calculated count)',
    },
    emptyMessage: {
      control: 'text',
      description: 'Message to display when there are no notifications',
    },
    maxNotificationsDisplay: {
      control: 'number',
      description: 'Maximum number of notifications to display',
    },
  },
};

export default meta;
type Story = StoryObj<NotificationButton>;

export const Default: Story = {
  args: {
    notifications: mockNotifications,
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-notification-button',
      '[notifications]="notifications"'
    ),
  }),
};

export const Empty: Story = {
  args: {
    notifications: [],
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison('app-notification-button', '[notifications]="notifications"'),
  }),
};

export const CustomEmptyMessage: Story = {
  args: {
    notifications: [],
    emptyMessage: 'No new notifications at this time',
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-notification-button',
      '[notifications]="notifications" [emptyMessage]="emptyMessage"'
    ),
  }),
};

export const WithBadgeCount: Story = {
  args: {
    notifications: mockNotifications,
    badgeCount: 10,
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-notification-button',
      '[notifications]="notifications" [badgeCount]="badgeCount"'
    ),
  }),
};

export const LargeBadgeCount: Story = {
  args: {
    notifications: mockNotifications,
    badgeCount: 150,
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-notification-button',
      '[notifications]="notifications" [badgeCount]="badgeCount"'
    ),
  }),
};

export const WithoutBadge: Story = {
  args: {
    notifications: mockNotifications,
    showBadge: false,
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-notification-button',
      '[notifications]="notifications" [showBadge]="showBadge"'
    ),
  }),
};

export const LimitedDisplay: Story = {
  args: {
    notifications: mockNotifications,
    maxNotificationsDisplay: 2,
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-notification-button',
      '[notifications]="notifications" [maxNotificationsDisplay]="maxNotificationsDisplay"'
    ),
  }),
};

export const AllUnread: Story = {
  args: {
    notifications: mockNotifications.map((n) => ({ ...n, read: false })),
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-notification-button',
      '[notifications]="notifications"'
    ),
  }),
};

export const AllRead: Story = {
  args: {
    notifications: mockNotifications.map((n) => ({ ...n, read: true })),
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-notification-button',
      '[notifications]="notifications"'
    ),
  }),
};

export const WithIcons: Story = {
  args: {
    notifications: [
      {
        id: '1',
        title: 'Success',
        message: 'Your changes have been saved',
        time: '1 min ago',
        read: false,
        icon: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>',
        iconColor: 'text-green-500',
      },
      {
        id: '2',
        title: 'Warning',
        message: 'Your session will expire soon',
        time: '5 min ago',
        read: false,
        icon: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>',
        iconColor: 'text-yellow-500',
      },
      {
        id: '3',
        title: 'Error',
        message: 'Failed to upload file',
        time: '10 min ago',
        read: false,
        icon: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>',
        iconColor: 'text-red-500',
      },
      {
        id: '4',
        title: 'Info',
        message: 'New features available',
        time: '1 hour ago',
        read: false,
        icon: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>',
        iconColor: 'text-blue-500',
      },
    ],
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-notification-button',
      '[notifications]="notifications"'
    ),
  }),
};

export const WithAvatars: Story = {
  args: {
    notifications: [
      {
        id: '1',
        title: 'John Doe',
        message: 'Sent you a friend request',
        time: '2 min ago',
        read: false,
        avatar: 'https://i.pravatar.cc/150?img=1',
      },
      {
        id: '2',
        title: 'Jane Smith',
        message: 'Liked your post',
        time: '5 min ago',
        read: false,
        avatar: 'https://i.pravatar.cc/150?img=5',
      },
      {
        id: '3',
        title: 'Bob Johnson',
        message: 'Started following you',
        time: '10 min ago',
        read: true,
        avatar: 'https://i.pravatar.cc/150?img=8',
      },
    ],
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-notification-button',
      '[notifications]="notifications"'
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
            <span class="text-sm text-gray-600">Notification in navbar:</span>
            <app-notification-button [notifications]="notifications" />
          </div>
        </div>

        <!-- Dark Mode Navbar -->
        <div class="dark bg-gray-800 border-b border-gray-700 p-4">
          <div class="flex items-center justify-end gap-4">
            <span class="text-sm text-gray-400">Notification in navbar:</span>
            <app-notification-button [notifications]="notifications" />
          </div>
        </div>
      </div>
    `,
    props: {
      notifications: mockNotifications,
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
                <p class="text-sm text-gray-600 mb-2">With notifications (2 unread)</p>
                <app-notification-button [notifications]="withNotifications" />
              </div>
              <div>
                <p class="text-sm text-gray-600 mb-2">Empty</p>
                <app-notification-button [notifications]="[]" />
              </div>
              <div>
                <p class="text-sm text-gray-600 mb-2">Large count (99+)</p>
                <app-notification-button [notifications]="withNotifications" [badgeCount]="150" />
              </div>
              <div>
                <p class="text-sm text-gray-600 mb-2">Without badge</p>
                <app-notification-button [notifications]="withNotifications" [showBadge]="false" />
              </div>
            </div>
          </div>
        </div>
        <div class="space-y-8">
          <div class="dark bg-gray-900 p-8 rounded-lg">
            <h3 class="text-lg font-semibold text-white mb-4">Dark Mode - States</h3>
            <div class="space-y-4">
              <div>
                <p class="text-sm text-gray-400 mb-2">With notifications (2 unread)</p>
                <app-notification-button [notifications]="withNotifications" />
              </div>
              <div>
                <p class="text-sm text-gray-400 mb-2">Empty</p>
                <app-notification-button [notifications]="[]" />
              </div>
              <div>
                <p class="text-sm text-gray-400 mb-2">Large count (99+)</p>
                <app-notification-button [notifications]="withNotifications" [badgeCount]="150" />
              </div>
              <div>
                <p class="text-sm text-gray-400 mb-2">Without badge</p>
                <app-notification-button [notifications]="withNotifications" [showBadge]="false" />
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
    props: {
      withNotifications: mockNotifications,
    },
  }),
};
