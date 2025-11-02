import { Meta, StoryObj, applicationConfig } from '@storybook/angular';
import { provideHttpClient } from '@angular/common/http';
import { RolesFormComponent } from './roles-form';
import { wrapInLightDarkComparison } from '../../../../stories/story-helpers';

const meta: Meta<RolesFormComponent> = {
  title: 'Features/Roles/RolesForm',
  component: RolesFormComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    applicationConfig({
      providers: [provideHttpClient()],
    }),
  ],
  argTypes: {
    role: {
      description: 'Role to edit (null for create mode)',
    },
    allPermissions: {
      description: 'Available permissions list',
    },
    allRoles: {
      description: 'Available roles for inheritance',
    },
  },
};

export default meta;
type Story = StoryObj<RolesFormComponent>;

// Mock data
const mockPermissions = [
  { name: 'View Dashboard' },
  { name: 'Manage Users' },
  { name: 'Manage Loans' },
  { name: 'View Reports' },
  { name: 'Export Data' },
];

const mockRoles = [
  { id: 'r1', name: 'Admin', permissions: [], roles: [] },
  { id: 'r2', name: 'Manager', permissions: [], roles: [] },
  { id: 'r3', name: 'Viewer', permissions: [], roles: [] },
];

// Create Mode (New Role)
export const CreateMode: Story = {
  args: {
    role: null,
    allPermissions: mockPermissions,
    allRoles: mockRoles,
  },
  render: (args) => ({
    props: args,
    template: wrapInLightDarkComparison(`
      <div class="max-w-2xl mx-auto mt-8 bg-[var(--color-bg-primary)] rounded-lg shadow-lg">
        <app-roles-form
          [role]="role"
          [allPermissions]="allPermissions"
          [allRoles]="allRoles"
          (saveRole)="saveRole($event)"
          (cancelForm)="cancelForm()"
        />
      </div>
    `),
  }),
};

// Edit Mode (Existing Role)
export const EditMode: Story = {
  args: {
    role: {
      id: 'r4',
      name: 'Editor',
      permissions: [mockPermissions[0], mockPermissions[2]],
      roles: [mockRoles[2]],
    },
    allPermissions: mockPermissions,
    allRoles: mockRoles,
  },
  render: (args) => ({
    props: args,
    template: wrapInLightDarkComparison(`
      <div class="max-w-2xl mx-auto mt-8 bg-[var(--color-bg-primary)] rounded-lg shadow-lg">
        <app-roles-form
          [role]="role"
          [allPermissions]="allPermissions"
          [allRoles]="allRoles"
          (saveRole)="saveRole($event)"
          (cancelForm)="cancelForm()"
        />
      </div>
    `),
  }),
};

// With Many Permissions
export const WithManyPermissions: Story = {
  args: {
    role: null,
    allPermissions: [
      ...mockPermissions,
      { name: 'Delete Records' },
      { name: 'System Settings' },
      { name: 'User Permissions' },
      { name: 'Audit Logs' },
      { name: 'API Access' },
    ],
    allRoles: mockRoles,
  },
  render: (args) => ({
    props: args,
    template: wrapInLightDarkComparison(`
      <div class="max-w-2xl mx-auto mt-8 bg-[var(--color-bg-primary)] rounded-lg shadow-lg">
        <app-roles-form
          [role]="role"
          [allPermissions]="allPermissions"
          [allRoles]="allRoles"
          (saveRole)="saveRole($event)"
          (cancelForm)="cancelForm()"
        />
      </div>
    `),
  }),
};

// Empty State (No Permissions/Roles Available)
export const EmptyState: Story = {
  args: {
    role: null,
    allPermissions: [],
    allRoles: [],
  },
  render: (args) => ({
    props: args,
    template: wrapInLightDarkComparison(`
      <div class="max-w-2xl mx-auto mt-8 bg-[var(--color-bg-primary)] rounded-lg shadow-lg">
        <app-roles-form
          [role]="role"
          [allPermissions]="allPermissions"
          [allRoles]="allRoles"
          (saveRole)="saveRole($event)"
          (cancelForm)="cancelForm()"
        />
      </div>
    `),
  }),
};
