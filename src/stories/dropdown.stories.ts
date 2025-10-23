import type { Meta, StoryObj } from '@storybook/angular';
import { fn } from 'storybook/test';
import { DropdownComponent, DropdownItem } from '../app/components/ui/dropdown/dropdown.component';

const meta: Meta<DropdownComponent> = {
  title: 'UI/Dropdown',
  component: DropdownComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline'],
      description: 'Visual style variant of the dropdown button',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the dropdown button',
    },
    position: {
      control: 'select',
      options: ['auto', 'top', 'bottom'],
      description: 'Position of the dropdown menu relative to the button',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the dropdown is disabled',
    },
    loading: {
      control: 'boolean',
      description: 'Whether the dropdown is in loading state',
    },
    searchable: {
      control: 'boolean',
      description: 'Enable search/filter functionality',
    },
    clearable: {
      control: 'boolean',
      description: 'Show clear button to remove selection',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when no item is selected',
    },
  },
  args: {
    selectionChange: fn(),
    searchChange: fn(),
  },
};

export default meta;
type Story = StoryObj<DropdownComponent>;

// Sample data
const basicItems: DropdownItem[] = [
  { label: 'Option 1', value: 1 },
  { label: 'Option 2', value: 2 },
  { label: 'Option 3', value: 3 },
  { label: 'Option 4', value: 4 },
];

const itemsWithIcons: DropdownItem[] = [
  { label: 'Home', value: 'home', icon: '🏠' },
  { label: 'Settings', value: 'settings', icon: '⚙️' },
  { label: 'Profile', value: 'profile', icon: '👤' },
  { label: 'Messages', value: 'messages', icon: '💬' },
  { label: 'Notifications', value: 'notifications', icon: '🔔' },
];

const itemsWithDividers: DropdownItem[] = [
  { label: 'Edit', value: 'edit', icon: '✏️' },
  { label: 'Duplicate', value: 'duplicate', icon: '📋' },
  { divider: true, label: '', value: 'divider1' },
  { label: 'Archive', value: 'archive', icon: '📦' },
  { label: 'Delete', value: 'delete', icon: '🗑️', disabled: false },
];

const itemsWithDisabled: DropdownItem[] = [
  { label: 'Available Option 1', value: 1 },
  { label: 'Available Option 2', value: 2 },
  { label: 'Disabled Option', value: 3, disabled: true },
  { label: 'Available Option 3', value: 4 },
  { label: 'Another Disabled', value: 5, disabled: true },
];

const longItemsList: DropdownItem[] = [
  { label: 'Afghanistan', value: 'AF' },
  { label: 'Albania', value: 'AL' },
  { label: 'Algeria', value: 'DZ' },
  { label: 'Argentina', value: 'AR' },
  { label: 'Australia', value: 'AU' },
  { label: 'Austria', value: 'AT' },
  { label: 'Belgium', value: 'BE' },
  { label: 'Brazil', value: 'BR' },
  { label: 'Canada', value: 'CA' },
  { label: 'Chile', value: 'CL' },
  { label: 'China', value: 'CN' },
  { label: 'Colombia', value: 'CO' },
  { label: 'Denmark', value: 'DK' },
  { label: 'Egypt', value: 'EG' },
  { label: 'Finland', value: 'FI' },
  { label: 'France', value: 'FR' },
  { label: 'Germany', value: 'DE' },
  { label: 'Greece', value: 'GR' },
  { label: 'India', value: 'IN' },
  { label: 'Indonesia', value: 'ID' },
  { label: 'Ireland', value: 'IE' },
  { label: 'Italy', value: 'IT' },
  { label: 'Japan', value: 'JP' },
  { label: 'Mexico', value: 'MX' },
  { label: 'Netherlands', value: 'NL' },
  { label: 'Norway', value: 'NO' },
  { label: 'Poland', value: 'PL' },
  { label: 'Portugal', value: 'PT' },
  { label: 'Russia', value: 'RU' },
  { label: 'Spain', value: 'ES' },
  { label: 'Sweden', value: 'SE' },
  { label: 'Switzerland', value: 'CH' },
  { label: 'United Kingdom', value: 'GB' },
  { label: 'United States', value: 'US' },
];

// Stories

export const Default: Story = {
  args: {
    items: basicItems,
    placeholder: 'Select an option',
    variant: 'outline',
    size: 'md',
  },
};

export const Primary: Story = {
  args: {
    items: basicItems,
    placeholder: 'Select an option',
    variant: 'primary',
    size: 'md',
  },
};

export const Secondary: Story = {
  args: {
    items: basicItems,
    placeholder: 'Select an option',
    variant: 'secondary',
    size: 'md',
  },
};

export const Small: Story = {
  args: {
    items: basicItems,
    placeholder: 'Select an option',
    size: 'sm',
    variant: 'outline',
  },
};

export const Large: Story = {
  args: {
    items: basicItems,
    placeholder: 'Select an option',
    size: 'lg',
    variant: 'primary',
  },
};

export const WithIcons: Story = {
  args: {
    items: itemsWithIcons,
    placeholder: 'Choose a section',
    variant: 'outline',
    size: 'md',
  },
};

export const WithDividers: Story = {
  args: {
    items: itemsWithDividers,
    placeholder: 'Actions',
    variant: 'outline',
    size: 'md',
  },
};

export const WithDisabledItems: Story = {
  args: {
    items: itemsWithDisabled,
    placeholder: 'Select an option',
    variant: 'outline',
    size: 'md',
  },
};

export const Searchable: Story = {
  args: {
    items: longItemsList,
    placeholder: 'Select a country',
    searchable: true,
    variant: 'outline',
    size: 'md',
  },
};

export const SearchableWithIcons: Story = {
  args: {
    items: itemsWithIcons,
    placeholder: 'Search sections',
    searchable: true,
    variant: 'outline',
    size: 'md',
  },
};

export const Clearable: Story = {
  args: {
    items: basicItems,
    placeholder: 'Select an option',
    clearable: true,
    variant: 'outline',
    size: 'md',
  },
};

export const ClearableAndSearchable: Story = {
  args: {
    items: longItemsList,
    placeholder: 'Select a country',
    searchable: true,
    clearable: true,
    variant: 'outline',
    size: 'md',
  },
};

export const Disabled: Story = {
  args: {
    items: basicItems,
    placeholder: 'Select an option',
    disabled: true,
    variant: 'outline',
    size: 'md',
  },
};

export const Loading: Story = {
  args: {
    items: basicItems,
    placeholder: 'Loading...',
    loading: true,
    variant: 'outline',
    size: 'md',
  },
};

export const PositionTop: Story = {
  args: {
    items: basicItems,
    placeholder: 'Opens upward',
    position: 'top',
    variant: 'outline',
    size: 'md',
  },
  parameters: {
    layout: 'centered',
  },
};

export const LongList: Story = {
  args: {
    items: longItemsList,
    placeholder: 'Select a country',
    variant: 'outline',
    size: 'md',
  },
};

export const AllFeatures: Story = {
  args: {
    items: itemsWithIcons,
    placeholder: 'Full-featured dropdown',
    searchable: true,
    clearable: true,
    variant: 'primary',
    size: 'lg',
  },
};
