import type { Meta, StoryObj } from '@storybook/angular';
import { fn } from 'storybook/test';
import { BottomNavigation, BottomNavItem } from '../app/layout/bottom-navigation/bottom-navigation';
import { wrapInLightDarkComparison } from './story-helpers';
import { provideRouter } from '@angular/router';

// Mock data for bottom navigation items
const mockBottomNavItems: BottomNavItem[] = [
  {
    id: 'dashboard',
    label: 'Home',
    icon: '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/></svg>',
    routerLink: '/dashboard',
  },
  {
    id: 'loans',
    label: 'Wallet',
    icon: '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M11.074 4 8.442.408A.95.95 0 0 0 7.014.254L2.926 4h8.148ZM9 13v-1a4 4 0 0 1 4-4h6V6a1 1 0 0 0-1-1H1a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h17a1 1 0 0 0 1-1v-2h-6a4 4 0 0 1-4-4Z"/><path d="M19 10h-6a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1Zm-4.5 3.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2ZM12.62 4h2.78L12.539.41a1.086 1.086 0 1 0-1.7 1.352L12.62 4Z"/></svg>',
    routerLink: '/loans',
  },
  {
    id: 'customers',
    label: 'Settings',
    icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 20 20"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2"/></svg>',
    routerLink: '/customers',
  },
  {
    id: 'reports',
    label: 'Profile',
    icon: '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/></svg>',
    routerLink: '/reports',
  },
];

const meta: Meta<BottomNavigation> = {
  title: 'Layout/BottomNavigation',
  component: BottomNavigation,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    items: {
      description: 'Array of navigation items to display',
      control: 'object',
    },
    itemClick: {
      description: 'Event emitted when a navigation item is clicked',
      action: 'itemClick',
    },
  },
  args: {
    itemClick: fn(),
  },
  decorators: [
    (story) => ({
      ...story(),
      applicationConfig: {
        providers: [provideRouter([])],
      },
    }),
  ],
};

export default meta;
type Story = StoryObj<BottomNavigation>;

// Default story with 4 items
export const Default: Story = {
  args: {
    items: mockBottomNavItems,
  },
  render: (args) => ({
    props: args,
    template: wrapInLightDarkComparison(`
      <div class="h-screen grid grid-rows-[1fr_auto]">
        <div class="flex items-center justify-center p-4">
          <p class="text-lg">Bottom Navigation - Default</p>
        </div>
        <app-bottom-navigation
          [items]="items"
          (itemClick)="itemClick($event)"
        />
      </div>
    `),
  }),
};

// With loan items
export const WithLoanItems: Story = {
  args: {
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path></svg>',
        routerLink: '/dashboard',
      },
      {
        id: 'loans',
        label: 'Loans',
        icon: '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd"></path></svg>',
        routerLink: '/loans',
      },
      {
        id: 'customers',
        label: 'Customers',
        icon: '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>',
        routerLink: '/customers',
      },
      {
        id: 'reports',
        label: 'Reports',
        icon: '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5z"></path></svg>',
        routerLink: '/reports',
      },
    ],
  },
  render: (args) => ({
    props: args,
    template: wrapInLightDarkComparison(`
      <div class="h-screen grid grid-rows-[1fr_auto]">
        <div class="flex items-center justify-center p-4">
          <p class="text-lg">With Loan App Icons</p>
        </div>
        <app-bottom-navigation
          [items]="items"
          (itemClick)="itemClick($event)"
        />
      </div>
    `),
  }),
};

// Mobile Preview
export const MobilePreview: Story = {
  args: {
    items: mockBottomNavItems,
  },
  render: (args) => ({
    props: args,
    template: wrapInLightDarkComparison(`
      <div class="h-screen grid grid-rows-[auto_1fr_auto]" style="max-width: 400px; margin: 0 auto;">
        <div class="h-16 bg-[var(--color-bg-primary)] border-b border-[var(--color-border)] flex items-center justify-center">
          <span class="font-bold">Loan UI</span>
        </div>
        <div class="overflow-y-auto p-4 bg-[var(--color-bg-secondary)]">
          <h1 class="text-xl font-bold mb-4">Mobile Layout</h1>
          <p class="mb-4">Simulated mobile view with scrollable content</p>
          <div class="space-y-4">
            <div class="h-32 bg-[var(--color-bg-primary)] rounded p-4">Block 1</div>
            <div class="h-32 bg-[var(--color-bg-primary)] rounded p-4">Block 2</div>
            <div class="h-32 bg-[var(--color-bg-primary)] rounded p-4">Block 3</div>
          </div>
        </div>
        <app-bottom-navigation
          [items]="items"
          (itemClick)="itemClick($event)"
        />
      </div>
    `),
  }),
};
