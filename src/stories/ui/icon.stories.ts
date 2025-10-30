import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { of } from 'rxjs';
import { IconComponent } from '../../app/components/ui/icon/icon';
import { IconService } from '../../app/components/ui/icon/icon.service';
import { createLightDarkComparison } from '../story-helpers';

const ICON_SVGS: Record<string, string> = {
  check: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
    <path d="M5 12.5L9.5 17 19 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  </svg>`,
  logo: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
    <circle cx="32" cy="32" r="30" stroke="currentColor" stroke-width="4" />
    <path d="M20 36c3.5-6 9-10 12-12 3 2 8.5 6 12 12" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M24 44c2.5 2 5.5 3 8 3s5.5-1 8-3" fill="currentColor" opacity="0.2" />
  </svg>`,
};

const meta: Meta<IconComponent> = {
  title: 'UI/Icon',
  component: IconComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    moduleMetadata({
      providers: [
        {
          provide: IconService,
          useFactory: (sanitizer: DomSanitizer) => ({
            getSvg: (name: string) => {
              const match = name.trim() || 'check';
              const svg = ICON_SVGS[match] ?? ICON_SVGS['check'];
              return of(sanitizer.bypassSecurityTrustHtml(svg));
            },
          }),
          deps: [DomSanitizer],
        },
      ],
    }),
  ],
  argTypes: {
    name: {
      control: 'select',
      options: Object.keys(ICON_SVGS),
      description: 'Nombre del icono a mostrar',
    },
    size: {
      control: 'text',
      description: 'Tamaño del icono (sm, md, lg o valor numérico en px)',
    },
    ariaLabel: {
      control: 'text',
      description: 'Etiqueta accesible para describir el icono',
    },
  },
};

export default meta;
type Story = StoryObj<IconComponent>;

const renderIcon = (bindings: string) => (args: Record<string, unknown>) => ({
  props: args,
  template: createLightDarkComparison('app-icon', bindings),
});

export const Check: Story = {
  args: {
    name: 'check',
    size: 'md',
  },
  render: renderIcon(`[name]="name"
    [size]="size"
    [ariaLabel]="ariaLabel"`),
};

export const Logo: Story = {
  args: {
    name: 'logo',
    size: 'lg',
    ariaLabel: 'Marca corporativa',
  },
  render: renderIcon(`[name]="name"
    [size]="size"
    [ariaLabel]="ariaLabel"`),
};

export const CustomPixelSize: Story = {
  args: {
    name: 'check',
    size: 48,
    ariaLabel: 'Check grande',
  },
  render: renderIcon(`[name]="name"
    [size]="size"
    [ariaLabel]="ariaLabel"`),
};
