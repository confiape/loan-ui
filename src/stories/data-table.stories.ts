import type { Meta, StoryObj } from '@storybook/angular';
import { DataTableComponent } from '../app/components/ui/data-table/data-table';
import { TableColumn, TableRowAction } from '../app/components/ui/table/table';
import { ToolbarAction } from '../app/components/ui/table-toolbar/table-toolbar';
import { createLightDarkComparison } from './story-helpers';

interface Product {
  id: number;
  name: string;
  category: string;
  brand: string;
  stock: number;
  price: string;
}

const mockProducts: Product[] = [
  { id: 1, name: 'Apple iMac 27"', category: 'PC', brand: 'Apple', stock: 300, price: '$2999' },
  { id: 2, name: 'Apple iMac 20"', category: 'PC', brand: 'Apple', stock: 200, price: '$1499' },
  { id: 3, name: 'Apple iPhone 14', category: 'Phone', brand: 'Apple', stock: 1237, price: '$999' },
  {
    id: 4,
    name: 'Apple iPad Air',
    category: 'Tablet',
    brand: 'Apple',
    stock: 4578,
    price: '$1199',
  },
  {
    id: 5,
    name: 'Xbox Series S',
    category: 'Gaming/Console',
    brand: 'Microsoft',
    stock: 56,
    price: '$299',
  },
  {
    id: 6,
    name: 'PlayStation 5',
    category: 'Gaming/Console',
    brand: 'Sony',
    stock: 78,
    price: '$799',
  },
  {
    id: 7,
    name: 'Xbox Series X',
    category: 'Gaming/Console',
    brand: 'Microsoft',
    stock: 200,
    price: '$699',
  },
  { id: 8, name: 'Apple Watch SE', category: 'Watch', brand: 'Apple', stock: 657, price: '$399' },
  { id: 9, name: 'NIKON D850', category: 'Photo', brand: 'Nikon', stock: 465, price: '$599' },
  {
    id: 10,
    name: 'Monitor BenQ EX2710Q',
    category: 'TV/Monitor',
    brand: 'BenQ',
    stock: 354,
    price: '$499',
  },
  {
    id: 11,
    name: 'Samsung Galaxy S23',
    category: 'Phone',
    brand: 'Samsung',
    stock: 892,
    price: '$899',
  },
  { id: 12, name: 'Dell XPS 15', category: 'PC', brand: 'Dell', stock: 123, price: '$1799' },
  { id: 13, name: 'HP Pavilion', category: 'PC', brand: 'HP', stock: 445, price: '$799' },
  { id: 14, name: 'Lenovo ThinkPad', category: 'PC', brand: 'Lenovo', stock: 267, price: '$1299' },
  {
    id: 15,
    name: 'Nintendo Switch',
    category: 'Gaming/Console',
    brand: 'Nintendo',
    stock: 589,
    price: '$299',
  },
];

const columns: TableColumn<Product>[] = [
  { key: 'name', label: 'Product name', sortable: true },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'brand', label: 'Brand', sortable: true },
  { key: 'stock', label: 'Stock', sortable: true, align: 'right' },
  { key: 'price', label: 'Price', sortable: true, align: 'right' },
];

const rowActions: TableRowAction[] = [
  { label: 'Show', variant: 'default' },
  { label: 'Edit', variant: 'default' },
  { label: 'Delete', variant: 'danger' },
];

const primaryAction: ToolbarAction = {
  label: 'Add product',
  icon: 'plus',
  variant: 'primary',
};

const bulkActions: ToolbarAction[] = [{ label: 'Mass Edit' }, { label: 'Delete all' }];

const meta: Meta<DataTableComponent> = {
  title: 'UI/DataTable',
  component: DataTableComponent,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    striped: { control: 'boolean', description: 'Enable striped rows' },
    hoverable: { control: 'boolean', description: 'Enable hover effect on rows' },
    bordered: { control: 'boolean', description: 'Add borders to cells' },
    compact: { control: 'boolean', description: 'Reduce padding for compact view' },
    loading: { control: 'boolean', description: 'Show loading state' },
    showToolbar: { control: 'boolean', description: 'Show/hide toolbar' },
    showSearch: { control: 'boolean', description: 'Show/hide search input' },
    showActions: { control: 'boolean', description: 'Show/hide action buttons' },
    showPagination: { control: 'boolean', description: 'Enable pagination' },
    pageSize: { control: 'number', description: 'Items per page' },
  },
  args: {},
};

export default meta;
type Story = StoryObj<DataTableComponent>;

export const Default: Story = {
  args: {
    data: mockProducts,
    columns,
    rowActions,
    primaryAction,
    bulkActions,
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-data-table',
      `
        [data]="data"
        [columns]="columns"
        [rowActions]="rowActions"
        [primaryAction]="primaryAction"
        [bulkActions]="bulkActions"
      `,
    ),
  }),
};

export const Striped: Story = {
  args: {
    data: mockProducts,
    columns,
    rowActions,
    striped: true,
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-data-table',
      `
        [data]="data"
        [columns]="columns"
        [rowActions]="rowActions"
        [striped]="striped"
      `,
    ),
  }),
};

export const Bordered: Story = {
  args: {
    data: mockProducts,
    columns,
    rowActions,
    bordered: true,
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-data-table',
      `
        [data]="data"
        [columns]="columns"
        [rowActions]="rowActions"
        [bordered]="bordered"
      `,
    ),
  }),
};

export const Compact: Story = {
  args: {
    data: mockProducts,
    columns,
    rowActions,
    compact: true,
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-data-table',
      `
        [data]="data"
        [columns]="columns"
        [rowActions]="rowActions"
        [compact]="compact"
      `,
    ),
  }),
};

export const Loading: Story = {
  args: {
    data: mockProducts,
    columns,
    loading: true,
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-data-table',
      `
        [data]="data"
        [columns]="columns"
        [loading]="loading"
      `,
    ),
  }),
};

export const Empty: Story = {
  args: {
    data: [],
    columns,
    emptyMessage: 'No products found',
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-data-table',
      `
        [data]="data"
        [columns]="columns"
        [emptyMessage]="emptyMessage"
      `,
    ),
  }),
};

export const WithoutToolbar: Story = {
  args: {
    data: mockProducts,
    columns,
    rowActions,
    showToolbar: false,
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-data-table',
      `
        [data]="data"
        [columns]="columns"
        [rowActions]="rowActions"
        [showToolbar]="showToolbar"
      `,
    ),
  }),
};

export const WithoutPagination: Story = {
  args: {
    data: mockProducts.slice(0, 5),
    columns,
    rowActions,
    showPagination: false,
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-data-table',
      `
        [data]="data"
        [columns]="columns"
        [rowActions]="rowActions"
        [showPagination]="showPagination"
      `,
    ),
  }),
};

export const CustomPageSize: Story = {
  args: {
    data: mockProducts,
    columns,
    rowActions,
    pageSize: 5,
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-data-table',
      `
        [data]="data"
        [columns]="columns"
        [rowActions]="rowActions"
        [pageSize]="pageSize"
      `,
    ),
  }),
};

export const MinimalTable: Story = {
  args: {
    data: mockProducts,
    columns,
    showToolbar: false,
    showPagination: false,
    hoverable: false,
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-data-table',
      `
        [data]="data"
        [columns]="columns"
        [showToolbar]="showToolbar"
        [showPagination]="showPagination"
        [hoverable]="hoverable"
      `,
    ),
  }),
};

export const StripedBordered: Story = {
  args: {
    data: mockProducts,
    columns,
    rowActions,
    striped: true,
    bordered: true,
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-data-table',
      `
        [data]="data"
        [columns]="columns"
        [rowActions]="rowActions"
        [striped]="striped"
        [bordered]="bordered"
      `,
    ),
  }),
};
