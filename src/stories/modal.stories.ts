import type { Meta, StoryObj } from '@storybook/angular';
import { fn } from 'storybook/test';
import { Component, signal } from '@angular/core';
import { ModalComponent } from '../app/components/ui/modal/modal.component';
import { CommonModule } from '@angular/common';
import { wrapInLightDarkComparison } from './story-helpers';

// Wrapper component for interactive stories
@Component({
  selector: 'story-modal-wrapper',
  standalone: true,
  imports: [ModalComponent, CommonModule],
  template: `
    <div>
      <button class="btn btn-primary" (click)="isOpen.set(true)">
        Open Modal
      </button>

      <app-modal
        [isOpen]="isOpen()"
        [title]="title"
        [subtitle]="subtitle"
        [size]="size"
        [variant]="variant"
        [showCloseButton]="showCloseButton"
        [closeOnBackdropClick]="closeOnBackdropClick"
        [closeOnEscape]="closeOnEscape"
        [centered]="centered"
        [scrollable]="scrollable"
        [fullscreen]="fullscreen"
        [loading]="loading"
        [showHeader]="showHeader"
        [showFooter]="showFooter"
        (closed)="isOpen.set(false)"
      >
        <ng-content></ng-content>
        <div modal-footer>
          <ng-content select="[modal-footer]"></ng-content>
        </div>
      </app-modal>
    </div>
  `,
})
class ModalWrapperComponent {
  isOpen = signal(false);
  title = '';
  subtitle = '';
  size: any = 'md';
  variant: any = 'default';
  showCloseButton = true;
  closeOnBackdropClick = true;
  closeOnEscape = true;
  centered = true;
  scrollable = false;
  fullscreen = false;
  loading = false;
  showHeader = true;
  showFooter = true;
}

const meta: Meta<ModalComponent> = {
  title: 'UI/Modal',
  component: ModalComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      description: 'Size of the modal',
    },
    variant: {
      control: 'select',
      options: ['default', 'success', 'error', 'warning', 'info'],
      description: 'Visual variant with icon',
    },
    title: {
      control: 'text',
      description: 'Modal title',
    },
    subtitle: {
      control: 'text',
      description: 'Modal subtitle',
    },
    showCloseButton: {
      control: 'boolean',
      description: 'Show close button in header',
    },
    closeOnBackdropClick: {
      control: 'boolean',
      description: 'Close modal when clicking backdrop',
    },
    closeOnEscape: {
      control: 'boolean',
      description: 'Close modal when pressing Escape',
    },
    centered: {
      control: 'boolean',
      description: 'Center modal vertically',
    },
    scrollable: {
      control: 'boolean',
      description: 'Make modal body scrollable',
    },
    fullscreen: {
      control: 'boolean',
      description: 'Show modal in fullscreen',
    },
    loading: {
      control: 'boolean',
      description: 'Show loading overlay',
    },
    showHeader: {
      control: 'boolean',
      description: 'Show modal header',
    },
    showFooter: {
      control: 'boolean',
      description: 'Show modal footer',
    },
  },
  args: {
    closed: fn(),
    opened: fn(),
  },
};

export default meta;
type Story = StoryObj<ModalComponent>;

// Basic Modal
export const Default: Story = {
  render: (args) => ({
    props: args,
    template: wrapInLightDarkComparison(`
      <story-modal-wrapper
        [title]="'Welcome'"
        [size]="'md'"
      >
        <p>This is a basic modal with default settings.</p>
        <p>Click outside or press Escape to close.</p>
        <div modal-footer>
          <button class="btn btn-outline-secondary">Cancel</button>
          <button class="btn btn-primary">Confirm</button>
        </div>
      </story-modal-wrapper>
    `),
    moduleMetadata: {
      imports: [ModalWrapperComponent],
    },
  }),
};

// Sizes
export const Small: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <story-modal-wrapper
        [title]="'Small Modal'"
        [size]="'sm'"
      >
        <p>This is a small modal.</p>
        <div modal-footer>
          <button class="btn btn-primary">OK</button>
        </div>
      </story-modal-wrapper>
    `),
    moduleMetadata: {
      imports: [ModalWrapperComponent],
    },
  }),
};

export const Medium: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <story-modal-wrapper
        [title]="'Medium Modal'"
        [size]="'md'"
      >
        <p>This is a medium modal (default size).</p>
        <div modal-footer>
          <button class="btn btn-primary">OK</button>
        </div>
      </story-modal-wrapper>
    `),
    moduleMetadata: {
      imports: [ModalWrapperComponent],
    },
  }),
};

export const Large: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <story-modal-wrapper
        [title]="'Large Modal'"
        [size]="'lg'"
      >
        <p>This is a large modal with more space for content.</p>
        <div modal-footer>
          <button class="btn btn-primary">OK</button>
        </div>
      </story-modal-wrapper>
    `),
    moduleMetadata: {
      imports: [ModalWrapperComponent],
    },
  }),
};

export const ExtraLarge: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <story-modal-wrapper
        [title]="'Extra Large Modal'"
        [size]="'xl'"
      >
        <p>This is an extra large modal for complex content.</p>
        <div modal-footer>
          <button class="btn btn-primary">OK</button>
        </div>
      </story-modal-wrapper>
    `),
    moduleMetadata: {
      imports: [ModalWrapperComponent],
    },
  }),
};

export const Fullscreen: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <story-modal-wrapper
        [title]="'Fullscreen Modal'"
        [fullscreen]="true"
      >
        <p>This modal takes up the entire screen.</p>
        <div modal-footer>
          <button class="btn btn-primary">OK</button>
        </div>
      </story-modal-wrapper>
    `),
    moduleMetadata: {
      imports: [ModalWrapperComponent],
    },
  }),
};

// Variants
export const Success: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <story-modal-wrapper
        [title]="'Success!'"
        [subtitle]="'Your operation completed successfully'"
        [variant]="'success'"
      >
        <p>Your changes have been saved successfully.</p>
        <div modal-footer>
          <button class="btn btn-success">OK</button>
        </div>
      </story-modal-wrapper>
    `),
    moduleMetadata: {
      imports: [ModalWrapperComponent],
    },
  }),
};

export const Error: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <story-modal-wrapper
        [title]="'Error'"
        [subtitle]="'Something went wrong'"
        [variant]="'error'"
      >
        <p>An error occurred while processing your request. Please try again.</p>
        <div modal-footer>
          <button class="btn btn-error">Close</button>
        </div>
      </story-modal-wrapper>
    `),
    moduleMetadata: {
      imports: [ModalWrapperComponent],
    },
  }),
};

export const Warning: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <story-modal-wrapper
        [title]="'Warning'"
        [subtitle]="'This action cannot be undone'"
        [variant]="'warning'"
      >
        <p>Are you sure you want to delete this item? This action is permanent.</p>
        <div modal-footer>
          <button class="btn btn-outline-secondary">Cancel</button>
          <button class="btn btn-warning">Delete</button>
        </div>
      </story-modal-wrapper>
    `),
    moduleMetadata: {
      imports: [ModalWrapperComponent],
    },
  }),
};

export const Info: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <story-modal-wrapper
        [title]="'Information'"
        [subtitle]="'Here\\'s what you need to know'"
        [variant]="'info'"
      >
        <p>This is an informational modal to provide additional details.</p>
        <div modal-footer>
          <button class="btn btn-info">Got it</button>
        </div>
      </story-modal-wrapper>
    `),
    moduleMetadata: {
      imports: [ModalWrapperComponent],
    },
  }),
};

// Features
export const WithSubtitle: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <story-modal-wrapper
        [title]="'Modal with Subtitle'"
        [subtitle]="'This is a descriptive subtitle'"
      >
        <p>Modals can have both a title and subtitle for better context.</p>
        <div modal-footer>
          <button class="btn btn-primary">OK</button>
        </div>
      </story-modal-wrapper>
    `),
    moduleMetadata: {
      imports: [ModalWrapperComponent],
    },
  }),
};

export const WithoutCloseButton: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <story-modal-wrapper
        [title]="'No Close Button'"
        [showCloseButton]="false"
      >
        <p>This modal doesn't have a close button. Use the footer button to close.</p>
        <div modal-footer>
          <button class="btn btn-primary">Close Modal</button>
        </div>
      </story-modal-wrapper>
    `),
    moduleMetadata: {
      imports: [ModalWrapperComponent],
    },
  }),
};

export const NoBackdropClick: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <story-modal-wrapper
        [title]="'No Backdrop Close'"
        [closeOnBackdropClick]="false"
      >
        <p>Clicking outside won't close this modal. Use the close button or Escape key.</p>
        <div modal-footer>
          <button class="btn btn-primary">Close</button>
        </div>
      </story-modal-wrapper>
    `),
    moduleMetadata: {
      imports: [ModalWrapperComponent],
    },
  }),
};

export const NoEscapeKey: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <story-modal-wrapper
        [title]="'No Escape Key'"
        [closeOnEscape]="false"
      >
        <p>Pressing Escape won't close this modal. Use the close button.</p>
        <div modal-footer>
          <button class="btn btn-primary">Close</button>
        </div>
      </story-modal-wrapper>
    `),
    moduleMetadata: {
      imports: [ModalWrapperComponent],
    },
  }),
};

export const Loading: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <story-modal-wrapper
        [title]="'Processing'"
        [loading]="true"
      >
        <p>Please wait while we process your request...</p>
        <div modal-footer>
          <button class="btn btn-primary" disabled>Submit</button>
        </div>
      </story-modal-wrapper>
    `),
    moduleMetadata: {
      imports: [ModalWrapperComponent],
    },
  }),
};

export const ScrollableContent: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <story-modal-wrapper
        [title]="'Scrollable Content'"
        [scrollable]="true"
      >
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
        <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
        <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <div modal-footer>
          <button class="btn btn-primary">OK</button>
        </div>
      </story-modal-wrapper>
    `),
    moduleMetadata: {
      imports: [ModalWrapperComponent],
    },
  }),
};

export const WithForm: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <story-modal-wrapper
        [title]="'User Profile'"
        [subtitle]="'Update your information'"
      >
        <form class="space-y-4">
          <div>
            <label class="form-label">Name</label>
            <input type="text" class="form-input" placeholder="Enter your name" />
          </div>
          <div>
            <label class="form-label">Email</label>
            <input type="email" class="form-input" placeholder="your@email.com" />
          </div>
          <div>
            <label class="form-label">Bio</label>
            <textarea class="form-input" rows="4" placeholder="Tell us about yourself"></textarea>
          </div>
        </form>
        <div modal-footer>
          <button class="btn btn-outline-secondary">Cancel</button>
          <button class="btn btn-primary">Save Changes</button>
        </div>
      </story-modal-wrapper>
    `),
    moduleMetadata: {
      imports: [ModalWrapperComponent],
    },
  }),
};

export const ConfirmDialog: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <story-modal-wrapper
        [title]="'Confirm Action'"
        [size]="'sm'"
        [variant]="'warning'"
      >
        <p>Are you sure you want to proceed with this action?</p>
        <div modal-footer>
          <button class="btn btn-outline-secondary">No, Cancel</button>
          <button class="btn btn-warning">Yes, Continue</button>
        </div>
      </story-modal-wrapper>
    `),
    moduleMetadata: {
      imports: [ModalWrapperComponent],
    },
  }),
};

export const WithoutHeaderAndFooter: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <story-modal-wrapper
        [showHeader]="false"
        [showFooter]="false"
      >
        <div class="text-center p-8">
          <h3 class="heading-3 mb-4">Custom Content</h3>
          <p class="mb-6">This modal has no header or footer.</p>
          <button class="btn btn-primary">Close</button>
        </div>
      </story-modal-wrapper>
    `),
    moduleMetadata: {
      imports: [ModalWrapperComponent],
    },
  }),
};
