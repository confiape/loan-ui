import { Meta, StoryObj, applicationConfig } from '@storybook/angular';
import { provideHttpClient } from '@angular/common/http';
import { UsersListComponent } from './users-list';
import { wrapInLightDarkComparison } from '../../../../stories/story-helpers';
import { of } from 'rxjs';
import { UserApiService, CompanyApiService } from '../../../core/openapi';

const meta: Meta<UsersListComponent> = {
  title: 'Features/Users/UsersList',
  component: UsersListComponent,
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
            getAllUsers: () => of(mockUsers),
            getAllRoles: () => of(mockRoles),
            getAllPermissions: () => of(mockPermissions),
            deleteUser: () => of({}),
            saveUser: () => of(mockUsers[0]),
          },
        },
        {
          provide: CompanyApiService,
          useValue: {
            getAllCompanies: () => of(mockCompanies),
          },
        },
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<UsersListComponent>;

// Mock data
const mockPermissions = [
  { name: 'View Dashboard' },
  { name: 'Manage Users' },
  { name: 'Manage Loans' },
  { name: 'View Reports' },
  { name: 'Export Data' },
];

const mockRoles = [
  {
    id: 'r1',
    name: 'Administrator',
    permissions: mockPermissions,
    roles: [],
  },
  {
    id: 'r2',
    name: 'Manager',
    permissions: [mockPermissions[0], mockPermissions[1]],
    roles: [],
  },
  {
    id: 'r3',
    name: 'Viewer',
    permissions: [mockPermissions[0]],
    roles: [],
  },
];

const mockCompanies = [
  { id: 'c1', name: 'Acme Corporation' },
  { id: 'c2', name: 'TechStart Inc' },
  { id: 'c3', name: 'Global Solutions' },
  { id: 'c4', name: 'Innovation Labs' },
];

const mockUsers = [
  {
    id: 'u1',
    email: 'john.doe@example.com',
    avatar: null,
    background: null,
    isActive: true,
    person: {
      name: 'John Doe',
      dni: '12345678',
      phoneNumber: '+1 234 567 8900',
      birthday: '1990-01-15T00:00:00Z',
      address: '123 Main Street, New York, NY 10001',
      notes: 'Senior administrator with full access',
    },
    roles: [mockRoles[0]],
    permissions: mockPermissions,
    companies: [mockCompanies[0], mockCompanies[1]],
  },
  {
    id: 'u2',
    email: 'jane.smith@example.com',
    avatar: null,
    background: null,
    isActive: true,
    person: {
      name: 'Jane Smith',
      dni: '87654321',
      phoneNumber: '+1 234 567 8901',
      birthday: '1985-06-20T00:00:00Z',
      address: '456 Oak Avenue, Los Angeles, CA 90001',
      notes: 'Manager of operations team',
    },
    roles: [mockRoles[1]],
    permissions: [mockPermissions[0], mockPermissions[1]],
    companies: [mockCompanies[0]],
  },
  {
    id: 'u3',
    email: 'bob.johnson@example.com',
    avatar: null,
    background: null,
    isActive: false,
    person: {
      name: 'Bob Johnson',
      dni: '11223344',
      phoneNumber: '+1 234 567 8902',
      birthday: '1992-03-10T00:00:00Z',
      address: '789 Pine Road, Chicago, IL 60601',
      notes: null,
    },
    roles: [mockRoles[2]],
    permissions: [mockPermissions[0]],
    companies: [mockCompanies[2]],
  },
  {
    id: 'u4',
    email: 'alice.williams@example.com',
    avatar: null,
    background: null,
    isActive: true,
    person: {
      name: 'Alice Williams',
      dni: '55667788',
      phoneNumber: '+1 234 567 8903',
      birthday: '1988-11-25T00:00:00Z',
      address: '321 Elm Street, Houston, TX 77001',
      notes: 'Part-time consultant',
    },
    roles: [mockRoles[1], mockRoles[2]],
    permissions: [mockPermissions[0], mockPermissions[1], mockPermissions[3]],
    companies: [mockCompanies[0], mockCompanies[2], mockCompanies[3]],
  },
  {
    id: 'u5',
    email: 'charlie.brown@example.com',
    avatar: null,
    background: null,
    isActive: true,
    person: {
      name: 'Charlie Brown',
      dni: '99887766',
      phoneNumber: '+1 234 567 8904',
      birthday: null,
      address: null,
      notes: null,
    },
    roles: [],
    permissions: [],
    companies: [],
  },
  {
    id: 'u6',
    email: 'emma.davis@example.com',
    avatar: null,
    background: null,
    isActive: true,
    person: {
      name: 'Emma Davis',
      dni: '44556677',
      phoneNumber: '+1 234 567 8905',
      birthday: '1995-07-08T00:00:00Z',
      address: '654 Maple Drive, Phoenix, AZ 85001',
      notes: 'New hire - onboarding in progress',
    },
    roles: [mockRoles[2]],
    permissions: [mockPermissions[0]],
    companies: [mockCompanies[1]],
  },
  {
    id: 'u7',
    email: 'david.miller@example.com',
    avatar: null,
    background: null,
    isActive: false,
    person: {
      name: 'David Miller',
      dni: '33445566',
      phoneNumber: '+1 234 567 8906',
      birthday: '1980-12-30T00:00:00Z',
      address: '987 Cedar Lane, Philadelphia, PA 19101',
      notes: 'Account suspended - pending review',
    },
    roles: [mockRoles[1]],
    permissions: [mockPermissions[0], mockPermissions[1]],
    companies: [mockCompanies[3]],
  },
];

// Generate more users for pagination testing
const generateMockUsers = (count: number) => {
  const users = [...mockUsers];
  for (let i = 8; i <= count; i++) {
    users.push({
      id: `u${i}`,
      email: `user${i}@example.com`,
      avatar: null,
      background: null,
      isActive: i % 3 !== 0,
      person: {
        name: `User ${i}`,
        dni: `${10000000 + i}`,
        phoneNumber: `+1 234 567 ${8900 + i}`,
        birthday: i % 2 === 0 ? `199${i % 10}-0${(i % 9) + 1}-01T00:00:00Z` : null,
        address: i % 3 === 0 ? `${i} Test Street, City, State ${10000 + i}` : null,
        notes: i % 4 === 0 ? `Test user ${i}` : null,
      },
      roles: [mockRoles[i % 3]],
      permissions: [mockPermissions[i % 5]],
      companies: [mockCompanies[i % 4]],
    });
  }
  return users;
};

// Default view with users
export const Default: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div class="h-screen">
        <app-users-list />
      </div>
    `),
  }),
};

// Empty state (no users)
export const EmptyState: Story = {
  decorators: [
    applicationConfig({
      providers: [
        provideHttpClient(),
        {
          provide: UserApiService,
          useValue: {
            getAllUsers: () => of([]),
            getAllRoles: () => of(mockRoles),
            getAllPermissions: () => of(mockPermissions),
            deleteUser: () => of({}),
            saveUser: () => of(mockUsers[0]),
          },
        },
        {
          provide: CompanyApiService,
          useValue: {
            getAllCompanies: () => of(mockCompanies),
          },
        },
      ],
    }),
  ],
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div class="h-screen">
        <app-users-list />
      </div>
    `),
  }),
};

// With many users (pagination test)
export const WithManyUsers: Story = {
  decorators: [
    applicationConfig({
      providers: [
        provideHttpClient(),
        {
          provide: UserApiService,
          useValue: {
            getAllUsers: () => of(generateMockUsers(30)),
            getAllRoles: () => of(mockRoles),
            getAllPermissions: () => of(mockPermissions),
            deleteUser: () => of({}),
            saveUser: () => of(mockUsers[0]),
          },
        },
        {
          provide: CompanyApiService,
          useValue: {
            getAllCompanies: () => of(mockCompanies),
          },
        },
      ],
    }),
  ],
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div class="h-screen">
        <app-users-list />
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
            getAllUsers: () =>
              new Promise(() => {
                // Never resolves to show loading state
              }),
            getAllRoles: () =>
              new Promise(() => {
                // Never resolves
              }),
            getAllPermissions: () =>
              new Promise(() => {
                // Never resolves
              }),
            deleteUser: () => of({}),
            saveUser: () => of(mockUsers[0]),
          },
        },
        {
          provide: CompanyApiService,
          useValue: {
            getAllCompanies: () =>
              new Promise(() => {
                // Never resolves
              }),
          },
        },
      ],
    }),
  ],
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div class="h-screen">
        <app-users-list />
      </div>
    `),
  }),
};

// With inactive users highlighted
export const WithInactiveUsers: Story = {
  decorators: [
    applicationConfig({
      providers: [
        provideHttpClient(),
        {
          provide: UserApiService,
          useValue: {
            getAllUsers: () => of(mockUsers.filter(u => !u.isActive)),
            getAllRoles: () => of(mockRoles),
            getAllPermissions: () => of(mockPermissions),
            deleteUser: () => of({}),
            saveUser: () => of(mockUsers[0]),
          },
        },
        {
          provide: CompanyApiService,
          useValue: {
            getAllCompanies: () => of(mockCompanies),
          },
        },
      ],
    }),
  ],
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div class="h-screen">
        <app-users-list />
      </div>
    `),
  }),
};

// Single user (minimal data)
export const SingleUser: Story = {
  decorators: [
    applicationConfig({
      providers: [
        provideHttpClient(),
        {
          provide: UserApiService,
          useValue: {
            getAllUsers: () => of([mockUsers[4]]), // Charlie Brown with minimal data
            getAllRoles: () => of(mockRoles),
            getAllPermissions: () => of(mockPermissions),
            deleteUser: () => of({}),
            saveUser: () => of(mockUsers[4]),
          },
        },
        {
          provide: CompanyApiService,
          useValue: {
            getAllCompanies: () => of(mockCompanies),
          },
        },
      ],
    }),
  ],
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div class="h-screen">
        <app-users-list />
      </div>
    `),
  }),
};
