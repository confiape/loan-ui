import type { Meta, StoryObj } from '@storybook/angular';
import { fn } from 'storybook/test';
import {
  MultiSelectComponent,
  MultiSelectItem,
} from '../app/components/ui/multiselect/multiselect';
import { createLightDarkComparison } from './story-helpers';

const meta: Meta<MultiSelectComponent> = {
  title: 'UI/MultiSelect',
  component: MultiSelectComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline'],
      description: 'Visual style variant of the multiselect button',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the multiselect button',
    },
    position: {
      control: 'select',
      options: ['auto', 'top', 'bottom'],
      description: 'Position of the dropdown menu relative to the button',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the multiselect is disabled',
    },
    loading: {
      control: 'boolean',
      description: 'Whether the multiselect is in loading state',
    },
    searchable: {
      control: 'boolean',
      description: 'Enable search/filter functionality',
    },
    clearable: {
      control: 'boolean',
      description: 'Show clear button to remove all selections',
    },
    showBadges: {
      control: 'boolean',
      description: 'Show selected items as badges in the button (up to 3)',
    },
    showCheckboxes: {
      control: 'boolean',
      description: 'Show checkboxes for items',
    },
    showSelectAll: {
      control: 'boolean',
      description: 'Show Select All / Clear All buttons',
    },
    maxSelections: {
      control: 'number',
      description: 'Maximum number of items that can be selected (null for unlimited)',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when no items are selected',
    },
  },
  args: {
    selectionChange: fn(),
    searchChange: fn(),
  },
};

export default meta;
type Story = StoryObj<MultiSelectComponent>;

// Sample data
const basicItems: MultiSelectItem[] = [
  { label: 'Option 1', value: 1 },
  { label: 'Option 2', value: 2 },
  { label: 'Option 3', value: 3 },
  { label: 'Option 4', value: 4 },
  { label: 'Option 5', value: 5 },
];

const itemsWithIcons: MultiSelectItem[] = [
  { label: 'Home', value: 'home', icon: '🏠' },
  { label: 'Settings', value: 'settings', icon: '⚙️' },
  { label: 'Profile', value: 'profile', icon: '👤' },
  { label: 'Messages', value: 'messages', icon: '💬' },
  { label: 'Notifications', value: 'notifications', icon: '🔔' },
  { label: 'Calendar', value: 'calendar', icon: '📅' },
  { label: 'Documents', value: 'documents', icon: '📄' },
  { label: 'Images', value: 'images', icon: '🖼️' },
];

const itemsWithDisabled: MultiSelectItem[] = [
  { label: 'Available Option 1', value: 1 },
  { label: 'Available Option 2', value: 2 },
  { label: 'Disabled Option', value: 3, disabled: true },
  { label: 'Available Option 3', value: 4 },
  { label: 'Another Disabled', value: 5, disabled: true },
  { label: 'Available Option 4', value: 6 },
];

const skillsItems: MultiSelectItem[] = [
  { label: 'JavaScript', value: 'js', icon: '💛' },
  { label: 'TypeScript', value: 'ts', icon: '💙' },
  { label: 'Python', value: 'py', icon: '🐍' },
  { label: 'Java', value: 'java', icon: '☕' },
  { label: 'C++', value: 'cpp', icon: '⚡' },
  { label: 'Go', value: 'go', icon: '🐹' },
  { label: 'Rust', value: 'rust', icon: '🦀' },
  { label: 'PHP', value: 'php', icon: '🐘' },
  { label: 'Ruby', value: 'ruby', icon: '💎' },
  { label: 'Swift', value: 'swift', icon: '🦅' },
];

const countriesItems: MultiSelectItem[] = [
  { label: 'United States', value: 'US', icon: '🇺🇸' },
  { label: 'United Kingdom', value: 'GB', icon: '🇬🇧' },
  { label: 'Canada', value: 'CA', icon: '🇨🇦' },
  { label: 'Australia', value: 'AU', icon: '🇦🇺' },
  { label: 'Germany', value: 'DE', icon: '🇩🇪' },
  { label: 'France', value: 'FR', icon: '🇫🇷' },
  { label: 'Spain', value: 'ES', icon: '🇪🇸' },
  { label: 'Italy', value: 'IT', icon: '🇮🇹' },
  { label: 'Japan', value: 'JP', icon: '🇯🇵' },
  { label: 'China', value: 'CN', icon: '🇨🇳' },
  { label: 'India', value: 'IN', icon: '🇮🇳' },
  { label: 'Brazil', value: 'BR', icon: '🇧🇷' },
  { label: 'Mexico', value: 'MX', icon: '🇲🇽' },
  { label: 'Argentina', value: 'AR', icon: '🇦🇷' },
  { label: 'South Africa', value: 'ZA', icon: '🇿🇦' },
];

// Stories

export const Default: Story = {
  args: {
    items: basicItems,
    placeholder: 'Select options',
    variant: 'outline',
    size: 'md',
    searchable: true,
    showBadges: true,
    showCheckboxes: true,
    showSelectAll: true,
    clearable: true,
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-multiselect',
      `[items]="items"
        [placeholder]="placeholder"
        [variant]="variant"
        [size]="size"
        [searchable]="searchable"
        [showBadges]="showBadges"
        [showCheckboxes]="showCheckboxes"
        [showSelectAll]="showSelectAll"
        [clearable]="clearable"`,
    ),
  }),
};

export const Primary: Story = {
  args: {
    items: basicItems,
    placeholder: 'Select options',
    variant: 'primary',
    size: 'md',
    searchable: true,
    showBadges: true,
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-multiselect',
      `[items]="items"
        [placeholder]="placeholder"
        [variant]="variant"
        [size]="size"
        [searchable]="searchable"
        [showBadges]="showBadges"`,
    ),
  }),
};

export const Secondary: Story = {
  args: {
    items: basicItems,
    placeholder: 'Select options',
    variant: 'secondary',
    size: 'md',
    searchable: true,
    showBadges: true,
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-multiselect',
      `[items]="items"
        [placeholder]="placeholder"
        [variant]="variant"
        [size]="size"
        [searchable]="searchable"
        [showBadges]="showBadges"`,
    ),
  }),
};

export const Small: Story = {
  args: {
    items: basicItems,
    placeholder: 'Select options',
    size: 'sm',
    variant: 'outline',
    searchable: true,
    showBadges: true,
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-multiselect',
      `[items]="items"
        [placeholder]="placeholder"
        [variant]="variant"
        [size]="size"
        [searchable]="searchable"
        [showBadges]="showBadges"`,
    ),
  }),
};

export const Large: Story = {
  args: {
    items: basicItems,
    placeholder: 'Select options',
    size: 'lg',
    variant: 'primary',
    searchable: true,
    showBadges: true,
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-multiselect',
      `[items]="items"
        [placeholder]="placeholder"
        [variant]="variant"
        [size]="size"
        [searchable]="searchable"
        [showBadges]="showBadges"`,
    ),
  }),
};

export const WithIcons: Story = {
  args: {
    items: itemsWithIcons,
    placeholder: 'Choose sections',
    variant: 'outline',
    size: 'md',
    searchable: true,
    showBadges: true,
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-multiselect',
      `[items]="items"
        [placeholder]="placeholder"
        [variant]="variant"
        [size]="size"
        [searchable]="searchable"
        [showBadges]="showBadges"`,
    ),
  }),
};

export const WithBadges: Story = {
  args: {
    items: skillsItems,
    placeholder: 'Select programming languages',
    variant: 'outline',
    size: 'md',
    searchable: true,
    showBadges: true,
    showCheckboxes: true,
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-multiselect',
      `[items]="items"
        [placeholder]="placeholder"
        [variant]="variant"
        [size]="size"
        [searchable]="searchable"
        [showBadges]="showBadges"
        [showCheckboxes]="showCheckboxes"`,
    ),
  }),
};

export const WithoutBadges: Story = {
  args: {
    items: skillsItems,
    placeholder: 'Select programming languages',
    variant: 'outline',
    size: 'md',
    searchable: true,
    showBadges: false,
    showCheckboxes: true,
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-multiselect',
      `[items]="items"
        [placeholder]="placeholder"
        [variant]="variant"
        [size]="size"
        [searchable]="searchable"
        [showBadges]="showBadges"
        [showCheckboxes]="showCheckboxes"`,
    ),
  }),
};

export const WithDisabledItems: Story = {
  args: {
    items: itemsWithDisabled,
    placeholder: 'Select options',
    variant: 'outline',
    size: 'md',
    searchable: true,
    showBadges: true,
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-multiselect',
      `[items]="items"
        [placeholder]="placeholder"
        [variant]="variant"
        [size]="size"
        [searchable]="searchable"
        [showBadges]="showBadges"`,
    ),
  }),
};

export const WithSearch: Story = {
  args: {
    items: countriesItems,
    placeholder: 'Select countries',
    searchable: true,
    variant: 'outline',
    size: 'md',
    showBadges: true,
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-multiselect',
      `[items]="items"
        [placeholder]="placeholder"
        [searchable]="searchable"
        [variant]="variant"
        [size]="size"
        [showBadges]="showBadges"`,
    ),
  }),
};

export const WithoutSearch: Story = {
  args: {
    items: basicItems,
    placeholder: 'Select options',
    searchable: false,
    variant: 'outline',
    size: 'md',
    showBadges: true,
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-multiselect',
      `[items]="items"
        [placeholder]="placeholder"
        [searchable]="searchable"
        [variant]="variant"
        [size]="size"
        [showBadges]="showBadges"`,
    ),
  }),
};

export const WithoutCheckboxes: Story = {
  args: {
    items: itemsWithIcons,
    placeholder: 'Select sections',
    showCheckboxes: false,
    variant: 'outline',
    size: 'md',
    searchable: true,
    showBadges: true,
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-multiselect',
      `[items]="items"
        [placeholder]="placeholder"
        [showCheckboxes]="showCheckboxes"
        [variant]="variant"
        [size]="size"
        [searchable]="searchable"
        [showBadges]="showBadges"`,
    ),
  }),
};

export const WithMaxSelections: Story = {
  args: {
    items: skillsItems,
    placeholder: 'Select up to 3 skills',
    maxSelections: 3,
    variant: 'outline',
    size: 'md',
    searchable: true,
    showBadges: true,
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-multiselect',
      `[items]="items"
        [placeholder]="placeholder"
        [maxSelections]="maxSelections"
        [variant]="variant"
        [size]="size"
        [searchable]="searchable"
        [showBadges]="showBadges"`,
    ),
  }),
};

export const WithoutSelectAll: Story = {
  args: {
    items: basicItems,
    placeholder: 'Select options',
    showSelectAll: false,
    variant: 'outline',
    size: 'md',
    searchable: true,
    showBadges: true,
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-multiselect',
      `[items]="items"
        [placeholder]="placeholder"
        [showSelectAll]="showSelectAll"
        [variant]="variant"
        [size]="size"
        [searchable]="searchable"
        [showBadges]="showBadges"`,
    ),
  }),
};

export const Disabled: Story = {
  args: {
    items: basicItems,
    placeholder: 'Select options',
    disabled: true,
    variant: 'outline',
    size: 'md',
    searchable: true,
    showBadges: true,
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-multiselect',
      `[items]="items"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [variant]="variant"
        [size]="size"
        [searchable]="searchable"
        [showBadges]="showBadges"`,
    ),
  }),
};

export const Loading: Story = {
  args: {
    items: basicItems,
    placeholder: 'Loading...',
    loading: true,
    variant: 'outline',
    size: 'md',
    searchable: true,
    showBadges: true,
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-multiselect',
      `[items]="items"
        [placeholder]="placeholder"
        [loading]="loading"
        [variant]="variant"
        [size]="size"
        [searchable]="searchable"
        [showBadges]="showBadges"`,
    ),
  }),
};

export const NotClearable: Story = {
  args: {
    items: basicItems,
    placeholder: 'Select options',
    clearable: false,
    variant: 'outline',
    size: 'md',
    searchable: true,
    showBadges: true,
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-multiselect',
      `[items]="items"
        [placeholder]="placeholder"
        [clearable]="clearable"
        [variant]="variant"
        [size]="size"
        [searchable]="searchable"
        [showBadges]="showBadges"`,
    ),
  }),
};

export const PositionTop: Story = {
  args: {
    items: basicItems,
    placeholder: 'Opens upward',
    position: 'top',
    variant: 'outline',
    size: 'md',
    searchable: true,
    showBadges: true,
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-multiselect',
      `[items]="items"
        [placeholder]="placeholder"
        [position]="position"
        [variant]="variant"
        [size]="size"
        [searchable]="searchable"
        [showBadges]="showBadges"`,
    ),
  }),
};

export const LongList: Story = {
  args: {
    items: countriesItems,
    placeholder: 'Select countries',
    variant: 'outline',
    size: 'md',
    searchable: true,
    showBadges: true,
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-multiselect',
      `[items]="items"
        [placeholder]="placeholder"
        [variant]="variant"
        [size]="size"
        [searchable]="searchable"
        [showBadges]="showBadges"`,
    ),
  }),
};

export const AllFeatures: Story = {
  args: {
    items: skillsItems,
    placeholder: 'Full-featured multiselect',
    searchable: true,
    clearable: true,
    showBadges: true,
    showCheckboxes: true,
    showSelectAll: true,
    variant: 'primary',
    size: 'lg',
    maxSelections: 5,
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-multiselect',
      `[items]="items"
        [placeholder]="placeholder"
        [searchable]="searchable"
        [clearable]="clearable"
        [showBadges]="showBadges"
        [showCheckboxes]="showCheckboxes"
        [showSelectAll]="showSelectAll"
        [variant]="variant"
        [size]="size"
        [maxSelections]="maxSelections"`,
    ),
  }),
};

export const MinimalConfig: Story = {
  args: {
    items: basicItems,
    placeholder: 'Minimal multiselect',
    searchable: false,
    clearable: false,
    showBadges: false,
    showCheckboxes: false,
    showSelectAll: false,
    variant: 'outline',
    size: 'md',
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-multiselect',
      `[items]="items"
        [placeholder]="placeholder"
        [searchable]="searchable"
        [clearable]="clearable"
        [showBadges]="showBadges"
        [showCheckboxes]="showCheckboxes"
        [showSelectAll]="showSelectAll"
        [variant]="variant"
        [size]="size"`,
    ),
  }),
};
