import type { Meta, StoryObj } from '@storybook/angular';
import { SidenavComponent, SidenavItem } from '../app/layout/sidenav/sidenav';
import { createVariantComparison, wrapInLightDarkComparison } from './story-helpers';

const meta: Meta<SidenavComponent> = {
  title: 'UI/Sidenav',
  component: SidenavComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<SidenavComponent>;

// Sample data
const basicItems: SidenavItem[] = [
  {
    label: 'Dashboard',
    icon: '📊',
    value: 'dashboard',
  },
  {
    label: 'Users',
    icon: '👥',
    value: 'users',
  },
  {
    label: 'Settings',
    icon: '⚙️',
    value: 'settings',
  },
  {
    label: 'Logout',
    icon: '🚪',
    value: 'logout',
  },
];

const itemsWithBadges: SidenavItem[] = [
  {
    label: 'Inbox',
    icon: '📥',
    value: 'inbox',
    badge: 12,
  },
  {
    label: 'Notifications',
    icon: '🔔',
    value: 'notifications',
    badge: 5,
  },
  {
    label: 'Messages',
    icon: '💬',
    value: 'messages',
    badge: 'New',
  },
  {
    label: 'Archive',
    icon: '📦',
    value: 'archive',
  },
];

const itemsWithChildren: SidenavItem[] = [
  {
    label: 'Home',
    icon: '🏠',
    value: 'home',
  },
  {
    label: 'Products',
    icon: '📦',
    value: 'products',
    children: [
      {
        label: 'All Products',
        icon: '📋',
        value: 'products-all',
      },
      {
        label: 'Categories',
        icon: '🏷️',
        value: 'products-categories',
      },
      {
        label: 'Add New',
        icon: '➕',
        value: 'products-add',
      },
    ],
  },
  {
    label: 'Orders',
    icon: '🛒',
    value: 'orders',
    badge: 8,
    children: [
      {
        label: 'Pending',
        value: 'orders-pending',
        badge: 3,
      },
      {
        label: 'Completed',
        value: 'orders-completed',
      },
      {
        label: 'Cancelled',
        value: 'orders-cancelled',
      },
    ],
  },
  {
    label: 'Customers',
    icon: '👥',
    value: 'customers',
  },
];

const itemsWithDividers: SidenavItem[] = [
  {
    label: 'Dashboard',
    icon: '📊',
    value: 'dashboard',
  },
  {
    label: 'Analytics',
    icon: '📈',
    value: 'analytics',
  },
  {
    label: '',
    value: 'divider-1',
    divider: true,
  },
  {
    label: 'Settings',
    icon: '⚙️',
    value: 'settings',
  },
  {
    label: 'Profile',
    icon: '👤',
    value: 'profile',
  },
  {
    label: '',
    value: 'divider-2',
    divider: true,
  },
  {
    label: 'Help',
    icon: '❓',
    value: 'help',
  },
  {
    label: 'Logout',
    icon: '🚪',
    value: 'logout',
  },
];

const itemsWithDisabled: SidenavItem[] = [
  {
    label: 'Home',
    icon: '🏠',
    value: 'home',
  },
  {
    label: 'Projects',
    icon: '📁',
    value: 'projects',
  },
  {
    label: 'Team (Coming Soon)',
    icon: '👥',
    value: 'team',
    disabled: true,
  },
  {
    label: 'Calendar (Beta)',
    icon: '📅',
    value: 'calendar',
    disabled: true,
  },
  {
    label: 'Settings',
    icon: '⚙️',
    value: 'settings',
  },
];

// Helper function to create side-by-side comparison template
const createComparisonTemplate = (extraBindings = '') =>
  wrapInLightDarkComparison(`
    <div class="flex w-full justify-center p-8">
      <app-sidenav
        [items]="items"
        [header]="header"
        [position]="position"
        [variant]="variant"
        [collapsible]="collapsible"
        [showToggle]="showToggle"
        [collapsed]="collapsed"
        [selectedValue]="selectedValue"
        [logo]="logo"
        [logoCollapsed]="logoCollapsed"
        [footer]="footer"
        ${extraBindings}
      />
    </div>
  `);

// Stories with Light vs Dark comparison

export const Default: Story = {
  args: {
    items: basicItems,
    header: 'My App',
    position: 'left',
    variant: 'default',
    collapsible: false,
    selectedValue: 'dashboard',
  },
  render: (args) => ({
    props: args,
    template: createComparisonTemplate(),
  }),
};

export const WithBadges: Story = {
  args: {
    items: itemsWithBadges,
    header: 'Messages',
    position: 'left',
    variant: 'default',
    collapsible: false,
    selectedValue: 'inbox',
  },
  render: (args) => ({
    props: args,
    template: createComparisonTemplate(),
  }),
};

export const WithChildren: Story = {
  args: {
    items: itemsWithChildren,
    header: 'E-Commerce',
    position: 'left',
    variant: 'default',
    collapsible: false,
    selectedValue: 'products-all',
  },
  render: (args) => ({
    props: args,
    template: createComparisonTemplate(),
  }),
};

export const WithDividers: Story = {
  args: {
    items: itemsWithDividers,
    header: 'Navigation',
    position: 'left',
    variant: 'default',
    collapsible: false,
    selectedValue: 'dashboard',
  },
  render: (args) => ({
    props: args,
    template: createComparisonTemplate(),
  }),
};

export const WithDisabledItems: Story = {
  args: {
    items: itemsWithDisabled,
    header: 'Workspace',
    position: 'left',
    variant: 'default',
    collapsible: false,
    selectedValue: 'home',
  },
  render: (args) => ({
    props: args,
    template: createComparisonTemplate(),
  }),
};

export const Collapsible: Story = {
  args: {
    items: itemsWithChildren,
    header: 'Dashboard',
    position: 'left',
    variant: 'default',
    collapsible: true,
    showToggle: true,
    collapsed: false,
    selectedValue: 'home',
  },
  render: (args) => ({
    props: args,
    template: createComparisonTemplate(),
  }),
};

export const CollapsedByDefault: Story = {
  args: {
    items: basicItems,
    header: 'Menu',
    position: 'left',
    variant: 'default',
    collapsible: true,
    showToggle: true,
    collapsed: true,
    selectedValue: 'dashboard',
  },
  render: (args) => ({
    props: args,
    template: createComparisonTemplate(),
  }),
};

export const BorderedVariant: Story = {
  args: {
    items: itemsWithChildren,
    header: 'Bordered Menu',
    position: 'left',
    variant: 'bordered',
    collapsible: true,
    selectedValue: 'home',
  },
  render: (args) => ({
    props: args,
    template: createComparisonTemplate(),
  }),
};

export const PillsVariant: Story = {
  args: {
    items: itemsWithBadges,
    header: 'Pills Menu',
    position: 'left',
    variant: 'pills',
    collapsible: false,
    selectedValue: 'inbox',
  },
  render: (args) => ({
    props: args,
    template: createComparisonTemplate(),
  }),
};

export const WithLogo: Story = {
  args: {
    items: basicItems,
    logo: '<strong style="font-size: 1.5rem;">💼</strong>',
    logoCollapsed: '<strong style="font-size: 1.25rem;">💼</strong>',
    header: 'Confiape',
    position: 'left',
    variant: 'default',
    collapsible: true,
    showToggle: true,
    selectedValue: 'dashboard',
  },
  render: (args) => ({
    props: args,
    template: createComparisonTemplate(),
  }),
};

export const WithFooter: Story = {
  args: {
    items: basicItems,
    header: 'My App',
    footer:
      '<small style="text-align: center; display: block;">© 2025 My Company<br/>v1.0.0</small>',
    position: 'left',
    variant: 'default',
    collapsible: false,
    selectedValue: 'dashboard',
  },
  render: (args) => ({
    props: args,
    template: createComparisonTemplate(),
  }),
};

export const CustomWidth: Story = {
  args: {
    items: itemsWithChildren,
    header: 'Wide Menu',
    position: 'left',
    variant: 'default',
    width: '20rem',
    collapsedWidth: '5rem',
    collapsible: true,
    showToggle: true,
    selectedValue: 'home',
  },
  render: (args) => ({
    props: args,
    template: createComparisonTemplate('[width]="width" [collapsedWidth]="collapsedWidth"'),
  }),
};

// Special: All Variants Comparison (3x2 Grid)
export const AllVariantsComparison: Story = {
  args: {
    items: itemsWithBadges,
    header: 'Variants',
    selectedValue: 'inbox',
  },
  render: (args) => ({
    props: args,
    template: createVariantComparison(
      'app-sidenav',
      ['Default', 'Bordered', 'Pills'],
      `
        [items]="items"
        [header]="header"
        [selectedValue]="selectedValue"
      `,
    ),
  }),
};

export const FullExample: Story = {
  args: {
    items: [
      {
        label: 'Dashboard',
        icon: '📊',
        value: 'dashboard',
      },
      {
        label: 'Loans',
        icon: '💰',
        value: 'loans',
        badge: 12,
        children: [
          {
            label: 'Active Loans',
            icon: '✅',
            value: 'loans-active',
            badge: 8,
          },
          {
            label: 'Pending Approval',
            icon: '⏳',
            value: 'loans-pending',
            badge: 4,
          },
          {
            label: 'Completed',
            icon: '✔️',
            value: 'loans-completed',
          },
        ],
      },
      {
        label: 'Customers',
        icon: '👥',
        value: 'customers',
        children: [
          {
            label: 'All Customers',
            value: 'customers-all',
          },
          {
            label: 'Add New',
            value: 'customers-add',
          },
        ],
      },
      {
        label: 'Reports',
        icon: '📈',
        value: 'reports',
      },
      {
        label: '',
        value: 'divider-1',
        divider: true,
      },
      {
        label: 'Settings',
        icon: '⚙️',
        value: 'settings',
      },
      {
        label: 'Help Center',
        icon: '❓',
        value: 'help',
      },
      {
        label: 'Logout',
        icon: '🚪',
        value: 'logout',
      },
    ],
    logo: '<strong style="font-size: 1.5rem;">💼</strong>',
    logoCollapsed: '<strong style="font-size: 1.25rem;">💼</strong>',
    header: 'Confiape Loan',
    footer:
      '<div style="text-align: center;"><small>© 2025 Confiape<br/>Sistema de Préstamos</small></div>',
    position: 'left',
    variant: 'default',
    collapsible: true,
    showToggle: true,
    collapsed: false,
    selectedValue: 'loans-pending',
  },
  render: (args) => ({
    props: args,
    template: createComparisonTemplate(),
  }),
};
