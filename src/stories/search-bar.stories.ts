import type { Meta, StoryObj } from '@storybook/angular';
import { SearchBar } from '../app/components/ui/search-bar/search-bar';
import { createLightDarkComparison } from './story-helpers';

const meta: Meta<SearchBar> = {
  title: 'UI/SearchBar',
  component: SearchBar,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the search input',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the search bar is disabled',
    },
    showOnMobile: {
      control: 'boolean',
      description: 'Whether to show the search bar on mobile devices',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the search bar',
    },
  },
};

export default meta;
type Story = StoryObj<SearchBar>;

export const Default: Story = {
  args: {
    placeholder: 'Search',
    size: 'md',
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-search-bar',
      '[placeholder]="placeholder" [size]="size"',
    ),
  }),
};

export const Small: Story = {
  args: {
    placeholder: 'Search',
    size: 'sm',
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-search-bar',
      '[placeholder]="placeholder" [size]="size"',
    ),
  }),
};

export const Medium: Story = {
  args: {
    placeholder: 'Search',
    size: 'md',
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-search-bar',
      '[placeholder]="placeholder" [size]="size"',
    ),
  }),
};

export const Large: Story = {
  args: {
    placeholder: 'Search',
    size: 'lg',
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-search-bar',
      '[placeholder]="placeholder" [size]="size"',
    ),
  }),
};

export const Disabled: Story = {
  args: {
    placeholder: 'Search disabled',
    disabled: true,
    size: 'md',
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-search-bar',
      '[placeholder]="placeholder" [disabled]="disabled" [size]="size"',
    ),
  }),
};

export const CustomPlaceholder: Story = {
  args: {
    placeholder: 'Search for products, users, or orders...',
    size: 'md',
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-search-bar',
      '[placeholder]="placeholder" [size]="size"',
    ),
  }),
};

export const WithInitialValue: Story = {
  args: {
    placeholder: 'Search',
    size: 'md',
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-search-bar',
      '[placeholder]="placeholder" [size]="size"',
    ),
  }),
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
        <div class="space-y-8">
          <div class="bg-white p-8 rounded-lg">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Light Mode</h3>
            <div class="space-y-4">
              <div>
                <p class="text-sm text-gray-600 mb-2">Small</p>
                <app-search-bar [size]="'sm'" [placeholder]="'Search small...'" />
              </div>
              <div>
                <p class="text-sm text-gray-600 mb-2">Medium</p>
                <app-search-bar [size]="'md'" [placeholder]="'Search medium...'" />
              </div>
              <div>
                <p class="text-sm text-gray-600 mb-2">Large</p>
                <app-search-bar [size]="'lg'" [placeholder]="'Search large...'" />
              </div>
            </div>
          </div>
        </div>
        <div class="space-y-8">
          <div class="dark bg-gray-900 p-8 rounded-lg">
            <h3 class="text-lg font-semibold text-white mb-4">Dark Mode</h3>
            <div class="space-y-4">
              <div>
                <p class="text-sm text-gray-400 mb-2">Small</p>
                <app-search-bar [size]="'sm'" [placeholder]="'Search small...'" />
              </div>
              <div>
                <p class="text-sm text-gray-400 mb-2">Medium</p>
                <app-search-bar [size]="'md'" [placeholder]="'Search medium...'" />
              </div>
              <div>
                <p class="text-sm text-gray-400 mb-2">Large</p>
                <app-search-bar [size]="'lg'" [placeholder]="'Search large...'" />
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
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
                <p class="text-sm text-gray-600 mb-2">Default</p>
                <app-search-bar [placeholder]="'Search...'" />
              </div>
              <div>
                <p class="text-sm text-gray-600 mb-2">Disabled</p>
                <app-search-bar [placeholder]="'Search disabled'" [disabled]="true" />
              </div>
              <div>
                <p class="text-sm text-gray-600 mb-2">Long placeholder</p>
                <app-search-bar [placeholder]="'Search for products, users, orders, and more...'" />
              </div>
            </div>
          </div>
        </div>
        <div class="space-y-8">
          <div class="dark bg-gray-900 p-8 rounded-lg">
            <h3 class="text-lg font-semibold text-white mb-4">Dark Mode - States</h3>
            <div class="space-y-4">
              <div>
                <p class="text-sm text-gray-400 mb-2">Default</p>
                <app-search-bar [placeholder]="'Search...'" />
              </div>
              <div>
                <p class="text-sm text-gray-400 mb-2">Disabled</p>
                <app-search-bar [placeholder]="'Search disabled'" [disabled]="true" />
              </div>
              <div>
                <p class="text-sm text-gray-400 mb-2">Long placeholder</p>
                <app-search-bar [placeholder]="'Search for products, users, orders, and more...'" />
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};

export const InNavbar: Story = {
  render: () => ({
    template: `
      <div class="space-y-8">
        <!-- Light Mode Navbar -->
        <div class="bg-white border-b border-gray-200 p-4">
          <div class="flex items-center gap-4">
            <span class="text-lg font-semibold">Logo</span>
            <div class="flex-1 max-w-md">
              <app-search-bar [placeholder]="'Search...'" [size]="'md'" />
            </div>
            <div class="flex items-center gap-2">
              <button class="p-2 rounded-lg hover:bg-gray-100">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Dark Mode Navbar -->
        <div class="dark bg-gray-800 border-b border-gray-700 p-4">
          <div class="flex items-center gap-4">
            <span class="text-lg font-semibold text-white">Logo</span>
            <div class="flex-1 max-w-md">
              <app-search-bar [placeholder]="'Search...'" [size]="'md'" />
            </div>
            <div class="flex items-center gap-2">
              <button class="p-2 rounded-lg hover:bg-gray-700 text-gray-400">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};
