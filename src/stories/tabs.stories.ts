import type { Meta, StoryObj } from '@storybook/angular';
import { TabsComponent, TabItem } from '../app/components/ui/tabs/tabs.component';
import { createLightDarkComparison } from './story-helpers';

const meta: Meta<TabsComponent> = {
  title: 'Components/Tabs',
  component: TabsComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'pills', 'underline', 'boxed', 'segmented'],
      description: 'Visual variant of the tabs',
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Orientation of the tab list',
    },
    justified: {
      control: 'boolean',
      description: 'Whether tabs should be justified (evenly distributed)',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether tabs should take full width',
    },
    activeTabId: {
      control: 'text',
      description: 'ID of the initially active tab',
    },
  },
};

export default meta;
type Story = StoryObj<TabsComponent>;

// Sample data
const basicTabs: TabItem[] = [
  { id: 'tab1', label: 'Profile', content: 'Profile content here. Edit your personal information and settings.' },
  { id: 'tab2', label: 'Dashboard', content: 'Dashboard content here. View your analytics and statistics.' },
  { id: 'tab3', label: 'Settings', content: 'Settings content here. Configure your preferences and options.' },
];

const tabsWithIcons: TabItem[] = [
  { id: 'home', label: 'Home', icon: '🏠', content: 'Welcome to your home page!' },
  { id: 'profile', label: 'Profile', icon: '👤', content: 'Manage your profile information.' },
  { id: 'messages', label: 'Messages', icon: '💬', content: 'Check your messages and notifications.' },
  { id: 'settings', label: 'Settings', icon: '⚙️', content: 'Configure application settings.' },
];

const tabsWithBadges: TabItem[] = [
  { id: 'inbox', label: 'Inbox', icon: '📥', badge: 5, badgeVariant: 'primary', content: 'You have 5 unread messages.' },
  { id: 'sent', label: 'Sent', icon: '📤', badge: 12, content: 'View your sent messages.' },
  { id: 'drafts', label: 'Drafts', icon: '📝', badge: 3, badgeVariant: 'warning', content: 'You have 3 draft messages.' },
  { id: 'trash', label: 'Trash', icon: '🗑️', content: 'View deleted messages.' },
];

const tabsWithDisabled: TabItem[] = [
  { id: 'available', label: 'Available', content: 'This tab is available.' },
  { id: 'disabled1', label: 'Disabled', content: 'This content is not accessible.', disabled: true },
  { id: 'enabled', label: 'Enabled', content: 'This tab is enabled.' },
  { id: 'disabled2', label: 'Also Disabled', content: 'This is also disabled.', disabled: true },
];

const manyTabs: TabItem[] = [
  { id: 't1', label: 'Tab 1', content: 'Content for tab 1' },
  { id: 't2', label: 'Tab 2', content: 'Content for tab 2' },
  { id: 't3', label: 'Tab 3', content: 'Content for tab 3' },
  { id: 't4', label: 'Tab 4', content: 'Content for tab 4' },
  { id: 't5', label: 'Tab 5', content: 'Content for tab 5' },
  { id: 't6', label: 'Tab 6', content: 'Content for tab 6' },
  { id: 't7', label: 'Tab 7', content: 'Content for tab 7' },
  { id: 't8', label: 'Tab 8', content: 'Content for tab 8' },
];

// ============================================
// BASIC VARIANTS
// ============================================

export const Default: Story = {
  args: {
    tabs: basicTabs,
    variant: 'default',
    orientation: 'horizontal',
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-tabs',
      `[tabs]="tabs"
        [variant]="variant"
        [orientation]="orientation"`
    ),
  }),
};

export const Pills: Story = {
  args: {
    tabs: basicTabs,
    variant: 'pills',
    orientation: 'horizontal',
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-tabs',
      `[tabs]="tabs"
        [variant]="variant"
        [orientation]="orientation"`
    ),
  }),
};

export const Underline: Story = {
  args: {
    tabs: basicTabs,
    variant: 'underline',
    orientation: 'horizontal',
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-tabs',
      `[tabs]="tabs"
        [variant]="variant"
        [orientation]="orientation"`
    ),
  }),
};

export const Boxed: Story = {
  args: {
    tabs: basicTabs,
    variant: 'boxed',
    orientation: 'horizontal',
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-tabs',
      `[tabs]="tabs"
        [variant]="variant"
        [orientation]="orientation"`
    ),
  }),
};

export const Segmented: Story = {
  args: {
    tabs: basicTabs,
    variant: 'segmented',
    orientation: 'horizontal',
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-tabs',
      `[tabs]="tabs"
        [variant]="variant"
        [orientation]="orientation"`
    ),
  }),
};

// ============================================
// WITH ICONS
// ============================================

export const DefaultWithIcons: Story = {
  args: {
    tabs: tabsWithIcons,
    variant: 'default',
    orientation: 'horizontal',
  },
};

export const PillsWithIcons: Story = {
  args: {
    tabs: tabsWithIcons,
    variant: 'pills',
    orientation: 'horizontal',
  },
};

export const UnderlineWithIcons: Story = {
  args: {
    tabs: tabsWithIcons,
    variant: 'underline',
    orientation: 'horizontal',
  },
};

export const BoxedWithIcons: Story = {
  args: {
    tabs: tabsWithIcons,
    variant: 'boxed',
    orientation: 'horizontal',
  },
};

export const SegmentedWithIcons: Story = {
  args: {
    tabs: tabsWithIcons,
    variant: 'segmented',
    orientation: 'horizontal',
  },
};

// ============================================
// WITH BADGES
// ============================================

export const DefaultWithBadges: Story = {
  args: {
    tabs: tabsWithBadges,
    variant: 'default',
    orientation: 'horizontal',
  },
};

export const PillsWithBadges: Story = {
  args: {
    tabs: tabsWithBadges,
    variant: 'pills',
    orientation: 'horizontal',
  },
};

export const UnderlineWithBadges: Story = {
  args: {
    tabs: tabsWithBadges,
    variant: 'underline',
    orientation: 'horizontal',
  },
};

export const BoxedWithBadges: Story = {
  args: {
    tabs: tabsWithBadges,
    variant: 'boxed',
    orientation: 'horizontal',
  },
};

export const SegmentedWithBadges: Story = {
  args: {
    tabs: tabsWithBadges,
    variant: 'segmented',
    orientation: 'horizontal',
  },
};

// ============================================
// VERTICAL ORIENTATION
// ============================================

export const VerticalDefault: Story = {
  args: {
    tabs: basicTabs,
    variant: 'default',
    orientation: 'vertical',
  },
};

export const VerticalPills: Story = {
  args: {
    tabs: basicTabs,
    variant: 'pills',
    orientation: 'vertical',
  },
};

export const VerticalUnderline: Story = {
  args: {
    tabs: basicTabs,
    variant: 'underline',
    orientation: 'vertical',
  },
};

export const VerticalBoxed: Story = {
  args: {
    tabs: basicTabs,
    variant: 'boxed',
    orientation: 'vertical',
  },
};

export const VerticalSegmented: Story = {
  args: {
    tabs: basicTabs,
    variant: 'segmented',
    orientation: 'vertical',
  },
};

export const VerticalWithIcons: Story = {
  args: {
    tabs: tabsWithIcons,
    variant: 'pills',
    orientation: 'vertical',
  },
};

export const VerticalWithBadges: Story = {
  args: {
    tabs: tabsWithBadges,
    variant: 'default',
    orientation: 'vertical',
  },
};

// ============================================
// LAYOUT OPTIONS
// ============================================

export const Justified: Story = {
  args: {
    tabs: basicTabs,
    variant: 'default',
    orientation: 'horizontal',
    justified: true,
  },
};

export const JustifiedPills: Story = {
  args: {
    tabs: basicTabs,
    variant: 'pills',
    orientation: 'horizontal',
    justified: true,
  },
};

export const JustifiedUnderline: Story = {
  args: {
    tabs: basicTabs,
    variant: 'underline',
    orientation: 'horizontal',
    justified: true,
  },
};

export const FullWidth: Story = {
  args: {
    tabs: basicTabs,
    variant: 'boxed',
    orientation: 'horizontal',
    fullWidth: true,
  },
};

// ============================================
// STATE EXAMPLES
// ============================================

export const WithDisabledTabs: Story = {
  args: {
    tabs: tabsWithDisabled,
    variant: 'default',
    orientation: 'horizontal',
  },
};

export const WithDisabledTabsPills: Story = {
  args: {
    tabs: tabsWithDisabled,
    variant: 'pills',
    orientation: 'horizontal',
  },
};

export const ManyTabsScrollable: Story = {
  args: {
    tabs: manyTabs,
    variant: 'underline',
    orientation: 'horizontal',
  },
};

export const PreselectedTab: Story = {
  args: {
    tabs: basicTabs,
    variant: 'pills',
    orientation: 'horizontal',
    activeTabId: 'tab2',
  },
};

// ============================================
// COMPLEX EXAMPLES
// ============================================

export const CompleteExample: Story = {
  args: {
    tabs: [
      {
        id: 'overview',
        label: 'Overview',
        icon: '📊',
        content: 'Overview of all your activities and recent updates. Monitor your progress and key metrics.',
      },
      {
        id: 'analytics',
        label: 'Analytics',
        icon: '📈',
        badge: 'New',
        badgeVariant: 'success',
        content: 'Detailed analytics and insights. View trends, charts, and performance indicators.',
      },
      {
        id: 'reports',
        label: 'Reports',
        icon: '📄',
        badge: 3,
        badgeVariant: 'warning',
        content: 'Generate and view reports. You have 3 pending reports to review.',
      },
      {
        id: 'team',
        label: 'Team',
        icon: '👥',
        content: 'Manage your team members and collaborators. Invite new members and assign roles.',
      },
      {
        id: 'archive',
        label: 'Archive',
        icon: '📦',
        disabled: true,
        content: 'Archived items (currently unavailable).',
      },
    ],
    variant: 'pills',
    orientation: 'horizontal',
  },
};

export const EmailInboxExample: Story = {
  args: {
    tabs: [
      {
        id: 'primary',
        label: 'Primary',
        icon: '📧',
        badge: 12,
        badgeVariant: 'primary',
        content: 'Your primary inbox with 12 unread messages.',
      },
      {
        id: 'social',
        label: 'Social',
        icon: '👥',
        badge: 5,
        badgeVariant: 'info',
        content: 'Social updates and notifications (5 new).',
      },
      {
        id: 'promotions',
        label: 'Promotions',
        icon: '🏷️',
        badge: 23,
        badgeVariant: 'success',
        content: 'Promotional emails and offers (23 unread).',
      },
      {
        id: 'updates',
        label: 'Updates',
        icon: '🔔',
        badge: 8,
        badgeVariant: 'warning',
        content: 'System updates and notifications (8 new).',
      },
      {
        id: 'forums',
        label: 'Forums',
        icon: '💬',
        content: 'Forum discussions and community posts.',
      },
    ],
    variant: 'underline',
    orientation: 'horizontal',
  },
};

export const SettingsPanelExample: Story = {
  args: {
    tabs: [
      {
        id: 'general',
        label: 'General',
        icon: '⚙️',
        content: 'General settings and preferences. Configure basic application behavior.',
      },
      {
        id: 'profile',
        label: 'Profile',
        icon: '👤',
        content: 'Edit your profile information, avatar, and bio.',
      },
      {
        id: 'security',
        label: 'Security',
        icon: '🔒',
        badge: '!',
        badgeVariant: 'error',
        content: 'Security settings and two-factor authentication. Action required!',
      },
      {
        id: 'notifications',
        label: 'Notifications',
        icon: '🔔',
        content: 'Manage email and push notifications preferences.',
      },
      {
        id: 'billing',
        label: 'Billing',
        icon: '💳',
        content: 'View billing history and manage payment methods.',
      },
      {
        id: 'advanced',
        label: 'Advanced',
        icon: '🔧',
        content: 'Advanced settings for power users.',
      },
    ],
    variant: 'default',
    orientation: 'vertical',
  },
};

// ============================================
// ACCESSIBILITY SHOWCASE
// ============================================

export const KeyboardNavigationDemo: Story = {
  args: {
    tabs: [
      {
        id: 'k1',
        label: 'Tab 1',
        content: 'Use Arrow keys (← →) to navigate between tabs. Press Enter or Space to activate a tab. Press Home to go to first tab, End to go to last tab.',
      },
      {
        id: 'k2',
        label: 'Tab 2',
        content: 'Keyboard navigation is fully supported. Try using Tab to focus the tab list, then use arrow keys.',
      },
      {
        id: 'k3',
        label: 'Tab 3',
        content: 'Disabled tabs are skipped during keyboard navigation.',
      },
      {
        id: 'k4',
        label: 'Disabled Tab',
        disabled: true,
        content: 'This tab cannot be activated.',
      },
      {
        id: 'k5',
        label: 'Tab 5',
        content: 'All tabs have proper ARIA attributes for screen readers.',
      },
    ],
    variant: 'underline',
    orientation: 'horizontal',
  },
};

export const AllVariantsSideBySide: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        <div>
          <h3 style="margin-bottom: 1rem; color: var(--color-text-primary);">Default Variant</h3>
          <app-tabs [tabs]="tabs" variant="default"></app-tabs>
        </div>
        <div>
          <h3 style="margin-bottom: 1rem; color: var(--color-text-primary);">Pills Variant</h3>
          <app-tabs [tabs]="tabs" variant="pills"></app-tabs>
        </div>
        <div>
          <h3 style="margin-bottom: 1rem; color: var(--color-text-primary);">Underline Variant</h3>
          <app-tabs [tabs]="tabs" variant="underline"></app-tabs>
        </div>
        <div>
          <h3 style="margin-bottom: 1rem; color: var(--color-text-primary);">Boxed Variant</h3>
          <app-tabs [tabs]="tabs" variant="boxed"></app-tabs>
        </div>
        <div>
          <h3 style="margin-bottom: 1rem; color: var(--color-text-primary);">Segmented Variant</h3>
          <app-tabs [tabs]="tabs" variant="segmented"></app-tabs>
        </div>
      </div>
    `,
  }),
  args: {
    tabs: tabsWithIcons,
  },
};

// ============================================
// ROUTER MODE EXAMPLES
// ============================================

const routerTabs: TabItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: '🏠',
    route: '/home',
  },
  {
    id: 'products',
    label: 'Products',
    icon: '📦',
    badge: 23,
    badgeVariant: 'primary',
    route: '/products',
  },
  {
    id: 'orders',
    label: 'Orders',
    icon: '🛒',
    badge: 5,
    badgeVariant: 'warning',
    route: '/orders',
  },
  {
    id: 'customers',
    label: 'Customers',
    icon: '👥',
    route: '/customers',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: '⚙️',
    route: '/settings',
  },
];

export const RouterModeExample: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 1rem; background: var(--color-bg-secondary); border-radius: var(--border-radius-lg);">
        <h3 style="margin-bottom: 1rem; color: var(--color-text-primary);">Router Mode Example</h3>
        <p style="margin-bottom: 1rem; color: var(--color-text-secondary); font-size: 0.875rem;">
          <strong>Note:</strong> Router mode requires Angular routing to be configured.
          This example shows the UI, but navigation won't work in Storybook.
        </p>

        <div style="background: var(--color-bg-primary); padding: 1rem; border-radius: var(--border-radius-lg);">
          <app-tabs
            [tabs]="tabs"
            [useRouter]="true"
            variant="underline"
          ></app-tabs>
        </div>

        <div style="margin-top: 2rem; padding: 1rem; background: var(--color-bg-tertiary); border-radius: var(--border-radius-md);">
          <h4 style="color: var(--color-text-primary); margin-bottom: 0.5rem; font-size: 0.875rem;">Usage Example:</h4>
          <pre style="color: var(--color-text-secondary); font-size: 0.75rem; overflow-x: auto;"><code>// Define tabs with routes
const tabs: TabItem[] = [
  { id: 'home', label: 'Home', route: '/home' },
  { id: 'products', label: 'Products', route: '/products' },
];

// Use in template with router mode enabled
&lt;app-tabs [tabs]="tabs" [useRouter]="true" /&gt;

// The component will:
// 1. Navigate using Angular Router
// 2. Sync active tab with current URL
// 3. Render content via &lt;router-outlet&gt;
</code></pre>
        </div>
      </div>
    `,
  }),
  args: {
    tabs: routerTabs,
  },
};
