import { Meta, StoryObj, applicationConfig } from '@storybook/angular';
import { provideHttpClient } from '@angular/common/http';
import { RolesListComponent } from './roles-list';
import { wrapInLightDarkComparison } from '../../../../stories/story-helpers';
import { of } from 'rxjs';
import { UserApiService } from '../../../core/openapi';

const meta: Meta<RolesListComponent> = {
  title: 'Features/Roles/RolesList',
  component: RolesListComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    applicationConfig({
      providers: [
        provideHttpClient(),
        {
          provide: UserApiService,
          useValue: {
            getAllRoles: () => of(mockRoles),
            getAllPermissions: () => of(mockPermissions),
            deleteRole: () => of({}),
            saveRole: () => of(mockRoles[0]),
          },
        },
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<RolesListComponent>;

// Mock data
const mockPermissions = [
  { name: 'View Dashboard' },
  { name: 'Manage Users' },
  { name: 'Manage Loans' },
  { name: 'View Reports' },
  { name: 'Export Data' },
  { name: 'Delete Records' },
  { name: 'System Settings' },
  { name: 'User Permissions' },
  { name: 'Audit Logs' },
  { name: 'API Access' },
];

const mockRoles = [
  {
    id: 'r1',
    name: 'Administrator',
    permissions: [
      mockPermissions[0],
      mockPermissions[1],
      mockPermissions[2],
      mockPermissions[3],
      mockPermissions[4],
      mockPermissions[5],
      mockPermissions[6],
      mockPermissions[7],
      mockPermissions[8],
      mockPermissions[9],
    ],
    roles: [],
  },
  {
    id: 'r2',
    name: 'Manager',
    permissions: [
      mockPermissions[0],
      mockPermissions[1],
      mockPermissions[2],
      mockPermissions[3],
      mockPermissions[4],
    ],
    roles: [],
  },
  {
    id: 'r3',
    name: 'Editor',
    permissions: [mockPermissions[0], mockPermissions[2]],
    roles: [],
  },
  {
    id: 'r4',
    name: 'Viewer',
    permissions: [mockPermissions[0], mockPermissions[3]],
    roles: [],
  },
  {
    id: 'r5',
    name: 'Analyst',
    permissions: [mockPermissions[0], mockPermissions[3], mockPermissions[4]],
    roles: [],
  },
  {
    id: 'r6',
    name: 'Support Agent',
    permissions: [mockPermissions[0], mockPermissions[1]],
    roles: [],
  },
  {
    id: 'r7',
    name: 'Content Writer',
    permissions: [mockPermissions[0], mockPermissions[2]],
    roles: [],
  },
  {
    id: 'r8',
    name: 'Financial Controller',
    permissions: [mockPermissions[0], mockPermissions[3], mockPermissions[4]],
    roles: [],
  },
  {
    id: 'r9',
    name: 'HR Manager',
    permissions: [mockPermissions[0], mockPermissions[1], mockPermissions[7]],
    roles: [],
  },
  {
    id: 'r10',
    name: 'IT Support',
    permissions: [mockPermissions[0], mockPermissions[6], mockPermissions[9]],
    roles: [],
  },
  {
    id: 'r11',
    name: 'Sales Representative',
    permissions: [mockPermissions[0], mockPermissions[2], mockPermissions[3]],
    roles: [],
  },
  {
    id: 'r12',
    name: 'Marketing Specialist',
    permissions: [mockPermissions[0], mockPermissions[2]],
    roles: [],
  },
  {
    id: 'r13',
    name: 'Product Owner',
    permissions: [mockPermissions[0], mockPermissions[1], mockPermissions[2], mockPermissions[3]],
    roles: [],
  },
  {
    id: 'r14',
    name: 'Quality Assurance',
    permissions: [mockPermissions[0], mockPermissions[3], mockPermissions[8]],
    roles: [],
  },
  {
    id: 'r15',
    name: 'Operations Manager',
    permissions: [mockPermissions[0], mockPermissions[1], mockPermissions[3], mockPermissions[4]],
    roles: [],
  },
  {
    id: 'r16',
    name: 'Customer Service',
    permissions: [mockPermissions[0], mockPermissions[1]],
    roles: [],
  },
  {
    id: 'r17',
    name: 'Data Analyst',
    permissions: [mockPermissions[0], mockPermissions[3], mockPermissions[4], mockPermissions[8]],
    roles: [],
  },
  {
    id: 'r18',
    name: 'Security Officer',
    permissions: [mockPermissions[0], mockPermissions[6], mockPermissions[7], mockPermissions[8]],
    roles: [],
  },
  {
    id: 'r19',
    name: 'Guest',
    permissions: [mockPermissions[0]],
    roles: [],
  },
  {
    id: 'r20',
    name: 'Team Lead',
    permissions: [mockPermissions[0], mockPermissions[1], mockPermissions[2], mockPermissions[3]],
    roles: [],
  },
  {
    id: 'r21',
    name: 'Project Manager',
    permissions: [
      mockPermissions[0],
      mockPermissions[1],
      mockPermissions[2],
      mockPermissions[3],
      mockPermissions[4],
    ],
    roles: [],
  },
  {
    id: 'r22',
    name: 'Accountant',
    permissions: [mockPermissions[0], mockPermissions[3], mockPermissions[4]],
    roles: [],
  },
  {
    id: 'r23',
    name: 'Legal Advisor',
    permissions: [mockPermissions[0], mockPermissions[3]],
    roles: [],
  },
  {
    id: 'r24',
    name: 'Compliance Officer',
    permissions: [mockPermissions[0], mockPermissions[7], mockPermissions[8]],
    roles: [],
  },
  {
    id: 'r25',
    name: 'Developer',
    permissions: [mockPermissions[0], mockPermissions[2], mockPermissions[6], mockPermissions[9]],
    roles: [],
  },
];

// Default view with roles
export const Default: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div class="h-screen">
        <app-roles-list />
      </div>
    `),
  }),
};

// Empty state (no roles)
export const EmptyState: Story = {
  decorators: [
    applicationConfig({
      providers: [
        provideHttpClient(),
        {
          provide: UserApiService,
          useValue: {
            getAllRoles: () => of([]),
            getAllPermissions: () => of(mockPermissions),
            deleteRole: () => of({}),
            saveRole: () => of(mockRoles[0]),
          },
        },
      ],
    }),
  ],
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div class="h-screen">
        <app-roles-list />
      </div>
    `),
  }),
};

// With many roles (scroll test)
export const WithManyRoles: Story = {
  decorators: [
    applicationConfig({
      providers: [
        provideHttpClient(),
        {
          provide: UserApiService,
          useValue: {
            getAllRoles: () =>
              of([
                ...mockRoles,
                ...Array.from({ length: 15 }, (_, i) => ({
                  id: `r${i + 6}`,
                  name: `Role ${i + 6}`,
                  permissions: [mockPermissions[i % mockPermissions.length]],
                  roles: [],
                })),
              ]),
            getAllPermissions: () => of(mockPermissions),
            deleteRole: () => of({}),
            saveRole: () => of(mockRoles[0]),
          },
        },
      ],
    }),
  ],
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div class="h-screen">
        <app-roles-list />
      </div>
    `),
  }),
};

// Loading state
export const LoadingState: Story = {
  decorators: [
    applicationConfig({
      providers: [
        provideHttpClient(),
        {
          provide: UserApiService,
          useValue: {
            getAllRoles: () =>
              new Promise(() => {
                // Never resolves to show loading state
              }),
            getAllPermissions: () =>
              new Promise(() => {
                // Never resolves
              }),
            deleteRole: () => of({}),
            saveRole: () => of(mockRoles[0]),
          },
        },
      ],
    }),
  ],
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div class="h-screen">
        <app-roles-list />
      </div>
    `),
  }),
};
