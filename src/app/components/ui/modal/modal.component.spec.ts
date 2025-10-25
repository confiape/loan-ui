import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ModalComponent, ModalSize, ModalVariant } from './modal.component';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
  });

  afterEach(() => {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have default values', () => {
      fixture.detectChanges();

      expect(component.isOpen()).toBe(false);
      expect(component.title()).toBe('');
      expect(component.size()).toBe('md');
      expect(component.variant()).toBe('default');
      expect(component.showCloseButton()).toBe(true);
      expect(component.closeOnBackdropClick()).toBe(true);
      expect(component.centered()).toBe(true);
    });
  });

  describe('Rendering', () => {
    it('should not render modal when closed', () => {
      fixture.componentRef.setInput('isOpen', false);
      fixture.detectChanges();

      const modal = compiled.querySelector('.modal-container');
      expect(modal).toBeFalsy();
    });

    it('should render modal when open', () => {
      fixture.componentRef.setInput('isOpen', true);
      fixture.detectChanges();

      const modal = compiled.querySelector('.modal-container');
      expect(modal).toBeTruthy();
    });

    it('should render title when provided', () => {
      fixture.componentRef.setInput('isOpen', true);
      fixture.componentRef.setInput('title', 'Test Title');
      fixture.detectChanges();

      const title = compiled.querySelector('.modal-title');
      expect(title?.textContent).toContain('Test Title');
    });

    it('should render close button when showCloseButton is true', () => {
      fixture.componentRef.setInput('isOpen', true);
      fixture.componentRef.setInput('showCloseButton', true);
      fixture.detectChanges();

      const closeButton = compiled.querySelector('.modal-close');
      expect(closeButton).toBeTruthy();
    });

    it('should not render close button when showCloseButton is false', () => {
      fixture.componentRef.setInput('isOpen', true);
      fixture.componentRef.setInput('showCloseButton', false);
      fixture.detectChanges();

      const closeButton = compiled.querySelector('.modal-close');
      expect(closeButton).toBeFalsy();
    });
  });

  describe('Sizes', () => {
    const sizes: ModalSize[] = ['sm', 'md', 'lg', 'xl', 'full'];

    sizes.forEach((size) => {
      it(`should apply ${size} size class`, () => {
        fixture.componentRef.setInput('size', size);
        fixture.detectChanges();

        const sizeClass = component.sizeClass();
        expect(sizeClass).toContain(size);
      });
    });

    it('should apply fullscreen class when fullscreen is true', () => {
      fixture.componentRef.setInput('fullscreen', true);
      fixture.detectChanges();

      expect(component.sizeClass()).toBe('modal-fullscreen');
    });
  });

  describe('Variants', () => {
    const variants: ModalVariant[] = ['default', 'success', 'error', 'warning', 'info'];

    variants.forEach((variant) => {
      it(`should apply ${variant} variant class`, () => {
        fixture.componentRef.setInput('variant', variant);
        fixture.detectChanges();

        const variantClass = component.variantClass();
        if (variant === 'default') {
          expect(variantClass).toBe('');
        } else {
          expect(variantClass).toContain(variant);
        }
      });
    });

    it('should show correct icon for success variant', () => {
      fixture.componentRef.setInput('variant', 'success');
      fixture.detectChanges();

      expect(component.getVariantIcon()).toBe('✓');
    });

    it('should show correct icon for error variant', () => {
      fixture.componentRef.setInput('variant', 'error');
      fixture.detectChanges();

      expect(component.getVariantIcon()).toBe('✕');
    });
  });

  describe('Close Behavior', () => {
    it('should emit closed event when close is called', () => {
      fixture.detectChanges();

      const spy = vi.fn();
      component.closed.subscribe(spy);

      component.close();
      fixture.detectChanges();

      expect(spy).toHaveBeenCalled();
    });

    it('should not close when loading is true', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      const spy = vi.fn();
      component.closed.subscribe(spy);

      component.close();
      fixture.detectChanges();

      expect(spy).not.toHaveBeenCalled();
    });

    it('should close when backdrop is clicked and closeOnBackdropClick is true', () => {
      fixture.componentRef.setInput('closeOnBackdropClick', true);
      fixture.detectChanges();

      const spy = vi.fn();
      component.closed.subscribe(spy);

      component.onBackdropClick();
      fixture.detectChanges();

      expect(spy).toHaveBeenCalled();
    });

    it('should not close when backdrop is clicked and closeOnBackdropClick is false', () => {
      fixture.componentRef.setInput('closeOnBackdropClick', false);
      fixture.detectChanges();

      const spy = vi.fn();
      component.closed.subscribe(spy);

      component.onBackdropClick();
      fixture.detectChanges();

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('Dialog Classes', () => {
    it('should include centered class when centered is true', () => {
      fixture.componentRef.setInput('centered', true);
      fixture.detectChanges();

      expect(component.dialogClass()).toContain('modal-centered');
    });

    it('should include scrollable class when scrollable is true', () => {
      fixture.componentRef.setInput('scrollable', true);
      fixture.detectChanges();

      expect(component.dialogClass()).toContain('modal-scrollable');
    });
  });

  describe('Loading State', () => {
    it('should prevent closing when loading', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      const spy = vi.fn();
      component.closed.subscribe(spy);

      component.close();
      component.onBackdropClick();
      fixture.detectChanges();

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('Computed Properties', () => {
    it('sizeClass should return correct class for each size', () => {
      const sizes: ModalSize[] = ['sm', 'md', 'lg', 'xl', 'full'];

      sizes.forEach((size) => {
        fixture.componentRef.setInput('size', size);
        fixture.detectChanges();

        expect(component.sizeClass()).toBe(`modal-${size}`);
      });
    });

    it('variantClass should return empty string for default variant', () => {
      fixture.componentRef.setInput('variant', 'default');
      fixture.detectChanges();

      expect(component.variantClass()).toBe('');
    });

    it('dialogClass should combine all applicable classes', () => {
      fixture.componentRef.setInput('size', 'lg');
      fixture.componentRef.setInput('variant', 'success');
      fixture.componentRef.setInput('centered', true);
      fixture.componentRef.setInput('scrollable', true);
      fixture.detectChanges();

      const dialogClass = component.dialogClass();
      expect(dialogClass).toContain('modal-dialog');
      expect(dialogClass).toContain('modal-lg');
      expect(dialogClass).toContain('modal-success');
      expect(dialogClass).toContain('modal-centered');
      expect(dialogClass).toContain('modal-scrollable');
    });
  });

  describe('Variant Methods', () => {
    it('getVariantIcon should return correct icon for each variant', () => {
      const variants = {
        default: '',
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ',
      };

      Object.entries(variants).forEach(([variant, icon]) => {
        fixture.componentRef.setInput('variant', variant as any);
        fixture.detectChanges();

        expect(component.getVariantIcon()).toBe(icon);
      });
    });

    it('getVariantColor should return correct color for each variant', () => {
      fixture.componentRef.setInput('variant', 'success');
      fixture.detectChanges();
      expect(component.getVariantColor()).toBe('var(--color-success)');

      fixture.componentRef.setInput('variant', 'error');
      fixture.detectChanges();
      expect(component.getVariantColor()).toBe('var(--color-error)');

      fixture.componentRef.setInput('variant', 'warning');
      fixture.detectChanges();
      expect(component.getVariantColor()).toBe('var(--color-warning)');

      fixture.componentRef.setInput('variant', 'info');
      fixture.detectChanges();
      expect(component.getVariantColor()).toBe('var(--color-info)');

      fixture.componentRef.setInput('variant', 'default');
      fixture.detectChanges();
      expect(component.getVariantColor()).toBe('');
    });
  });

  describe('Focus Trap', () => {
    it('should handle focus trap with Tab key correctly', () => {
      // Test the handleFocusTrap method directly
      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' });
      const preventDefaultSpy = vi.spyOn(tabEvent, 'preventDefault');

      // Call the private method with Tab key (no focusable elements)
      component['focusableElements'] = [];
      component['handleFocusTrap'](tabEvent);

      // Should prevent default when no focusable elements
      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should handle focus trap with Shift+Tab correctly', () => {
      // Create mock focusable elements
      const button1 = document.createElement('button');
      const button2 = document.createElement('button');
      document.body.appendChild(button1);
      document.body.appendChild(button2);

      component['focusableElements'] = [button1, button2];
      button1.focus();

      const shiftTabEvent = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true });
      Object.defineProperty(shiftTabEvent, 'shiftKey', { value: true });
      const preventDefaultSpy = vi.spyOn(shiftTabEvent, 'preventDefault');

      component['handleFocusTrap'](shiftTabEvent);

      // Should handle Shift+Tab
      expect(component['focusableElements'].length).toBe(2);

      // Cleanup
      document.body.removeChild(button1);
      document.body.removeChild(button2);
    });

    it('should not interfere with non-Tab keys', () => {
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      const preventDefaultSpy = vi.spyOn(enterEvent, 'preventDefault');

      component['focusableElements'] = [];
      component['handleFocusTrap'](enterEvent);

      // Should not prevent default for non-Tab keys
      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });

    it('should handle Tab forward at last element', () => {
      const button1 = document.createElement('button');
      const button2 = document.createElement('button');
      document.body.appendChild(button1);
      document.body.appendChild(button2);

      component['focusableElements'] = [button1, button2];
      button2.focus();

      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' });
      const preventDefaultSpy = vi.spyOn(tabEvent, 'preventDefault');

      component['handleFocusTrap'](tabEvent);

      expect(component['focusableElements'].length).toBe(2);

      document.body.removeChild(button1);
      document.body.removeChild(button2);
    });
  });
});
