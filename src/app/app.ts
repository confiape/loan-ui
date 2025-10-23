import { Component, signal, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DropdownComponent, DropdownItem } from './components/ui/dropdown/dropdown.component';
import {
  MultiSelectComponent,
  MultiSelectItem,
} from './components/ui/multiselect/multiselect.component';
import { ModalComponent } from './components/ui/modal/modal.component';
import { AccordionComponent, AccordionItem } from './components/ui/accordion/accordion.component';
import { TooltipComponent } from './components/ui/tooltip/tooltip.component';
import { TabsComponent, TabItem } from './components/ui/tabs/tabs.component';
import { ToastContainerComponent } from './components/ui/toast/toast-container.component';
import { Toast } from './components/ui/toast/toast.component';

interface ColorConfig {
  name: string;
  variable: string;
  defaultLight: string;
  defaultDark: string;
}

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    DropdownComponent,
    MultiSelectComponent,
    ModalComponent,
    AccordionComponent,
    TooltipComponent,
    TabsComponent,
    ToastContainerComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('loan-ui');

  // Demo data for components
  protected dropdownItems = signal<DropdownItem[]>([
    { label: 'Dashboard', value: 'dashboard' },
    { label: 'Settings', value: 'settings' },
    { label: 'Earnings', value: 'earnings' },
    { label: 'Sign out', value: 'signout', divider: true },
  ]);

  protected multiSelectItems = signal<MultiSelectItem[]>([
    { label: 'React', value: 'react' },
    { label: 'Angular', value: 'angular' },
    { label: 'Vue', value: 'vue' },
    { label: 'Svelte', value: 'svelte' },
    { label: 'Next.js', value: 'nextjs' },
  ]);

  protected accordionItems = signal<AccordionItem[]>([
    {
      id: '1',
      title: '¿Qué es Flowbite?',
      content:
        'Flowbite es una biblioteca de componentes de código abierto construida con Tailwind CSS con elementos interactivos como dropdowns, modals, navbars, y más.',
      isOpen: true,
    },
    {
      id: '2',
      title: '¿Es gratis usar Flowbite?',
      content:
        'Sí, Flowbite es 100% gratuito y de código abierto bajo la licencia MIT. Puedes usarlo en proyectos personales y comerciales.',
    },
    {
      id: '3',
      title: '¿Qué tecnologías soporta?',
      content:
        'Flowbite funciona con Tailwind CSS v3.x y es compatible con React, Vue, Angular, Svelte y vanilla JavaScript.',
    },
  ]);

  protected tabItems = signal<TabItem[]>([
    {
      id: 'profile',
      label: 'Perfil',
      content:
        'Información del perfil del usuario. Aquí puedes ver y editar tu información personal.',
      icon: '👤',
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      content: 'Panel de control con estadísticas y métricas importantes de tu cuenta.',
    },
    {
      id: 'settings',
      label: 'Configuración',
      content: 'Ajusta las preferencias y configuraciones de tu cuenta.',
    },
    {
      id: 'disabled',
      label: 'Deshabilitado',
      content: '',
      disabled: true,
    },
  ]);

  protected toasts = signal<Toast[]>([
    {
      id: '1',
      type: 'success',
      title: 'Success!',
      message: 'Tu operación se completó correctamente',
      duration: 5000,
      dismissible: true,
    },
  ]);

  protected isModalOpenLight = signal(false);
  protected isModalOpenDark = signal(false);
  protected selectedDropdownItem = signal<DropdownItem | null>(null);
  protected selectedMultiItems = signal<MultiSelectItem[]>([]);

  // Configuración de colores editables
  protected colors: ColorConfig[] = [
    { name: 'Primary', variable: 'primary', defaultLight: '#1d4ed8', defaultDark: '#2563eb' },
    {
      name: 'Primary Hover',
      variable: 'primary-hover',
      defaultLight: '#1e40af',
      defaultDark: '#1d4ed8',
    },
    { name: 'Success', variable: 'success', defaultLight: '#15803d', defaultDark: '#16a34a' },
    {
      name: 'Success Hover',
      variable: 'success-hover',
      defaultLight: '#166534',
      defaultDark: '#15803d',
    },
    { name: 'Error', variable: 'error', defaultLight: '#b91c1c', defaultDark: '#dc2626' },
    {
      name: 'Error Hover',
      variable: 'error-hover',
      defaultLight: '#991b1b',
      defaultDark: '#b91c1c',
    },
    { name: 'Warning', variable: 'warning', defaultLight: '#eab308', defaultDark: '#facc15' },
    {
      name: 'Warning Hover',
      variable: 'warning-hover',
      defaultLight: '#ca8a04',
      defaultDark: '#eab308',
    },
    { name: 'Info', variable: 'info', defaultLight: '#0891b2', defaultDark: '#06b6d4' },
    { name: 'Info Hover', variable: 'info-hover', defaultLight: '#0e7490', defaultDark: '#0891b2' },
  ];

  protected currentLightColors = signal<Record<string, string>>({});
  protected currentDarkColors = signal<Record<string, string>>({});

  constructor() {
    // Inicializar colores
    const lightColors: Record<string, string> = {};
    const darkColors: Record<string, string> = {};

    this.colors.forEach((color) => {
      lightColors[color.variable] = color.defaultLight;
      darkColors[color.variable] = color.defaultDark;
    });

    this.currentLightColors.set(lightColors);
    this.currentDarkColors.set(darkColors);

    // Aplicar colores light mode por defecto
    this.applyLightColors();
  }

  protected onColorChange(variable: string, value: string, isDark: boolean) {
    if (isDark) {
      const colors = { ...this.currentDarkColors() };
      colors[variable] = value;
      this.currentDarkColors.set(colors);
      this.applyDarkColors();
    } else {
      const colors = { ...this.currentLightColors() };
      colors[variable] = value;
      this.currentLightColors.set(colors);
      this.applyLightColors();
    }
  }

  protected resetColors() {
    const lightColors: Record<string, string> = {};
    const darkColors: Record<string, string> = {};

    this.colors.forEach((color) => {
      lightColors[color.variable] = color.defaultLight;
      darkColors[color.variable] = color.defaultDark;
    });

    this.currentLightColors.set(lightColors);
    this.currentDarkColors.set(darkColors);

    this.applyLightColors();
    this.applyDarkColors();
  }

  private applyLightColors() {
    const root = document.documentElement;
    const colors = this.currentLightColors();

    Object.entries(colors).forEach(([variable, value]) => {
      root.style.setProperty(`--color-${variable}`, value);
    });
  }

  private applyDarkColors() {
    // Para dark mode, necesitamos aplicar las variables dentro de .dark
    const colors = this.currentDarkColors();
    const styleId = 'dynamic-dark-colors';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;

    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    const darkStyles = Object.entries(colors)
      .map(([variable, value]) => `--color-${variable}: ${value};`)
      .join('\n  ');

    styleElement.textContent = `.dark {\n  ${darkStyles}\n}`;
  }

  // Component event handlers
  protected onDropdownChange(item: DropdownItem) {
    this.selectedDropdownItem.set(item);
    console.log('Dropdown selected:', item);
  }

  protected onMultiSelectChange(items: MultiSelectItem[]) {
    this.selectedMultiItems.set(items);
    console.log('MultiSelect changed:', items);
  }

  protected openModalLight() {
    this.isModalOpenLight.set(true);
  }

  protected closeModalLight() {
    this.isModalOpenLight.set(false);
  }

  protected openModalDark() {
    this.isModalOpenDark.set(true);
  }

  protected closeModalDark() {
    this.isModalOpenDark.set(false);
  }

  protected onAccordionToggle(item: AccordionItem) {
    console.log('Accordion toggled:', item);
  }

  protected onTabChange(tab: TabItem) {
    console.log('Tab changed:', tab);
  }

  protected showToast(type: 'success' | 'error' | 'warning' | 'info') {
    const messages = {
      success: { title: 'Éxito!', message: 'La operación se completó correctamente' },
      error: { title: 'Error!', message: 'Algo salió mal. Por favor intenta de nuevo' },
      warning: { title: 'Advertencia!', message: 'Ten cuidado con esta acción' },
      info: { title: 'Información', message: 'Aquí hay información importante' },
    };

    const newToast: Toast = {
      id: Date.now().toString(),
      type,
      ...messages[type],
      duration: 5000,
      dismissible: true,
    };

    this.toasts.update((toasts) => [...toasts, newToast]);
  }

  protected dismissToast(id: string) {
    this.toasts.update((toasts) => toasts.filter((t) => t.id !== id));
  }
}
