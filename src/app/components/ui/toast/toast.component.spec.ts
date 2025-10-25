import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ToastComponent, Toast, ToastType } from './toast.component';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;
  let compiled: HTMLElement;

  const mockToast: Toast = {
    id: '1',
    type: 'success',
    message: 'Test message',
    dismissible: true,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have default position', () => {
      fixture.componentRef.setInput('toast', mockToast);
      fixture.detectChanges();

      expect(component.position()).toBe('top-right');
    });
  });

  describe('Rendering', () => {
    it('should render toast message', () => {
      fixture.componentRef.setInput('toast', mockToast);
      fixture.detectChanges();

      const message = compiled.querySelector('.toast-message');
      expect(message?.textContent).toContain('Test message');
    });

    it('should render toast title when provided', () => {
      const toastWithTitle = { ...mockToast, title: 'Test Title' };
      fixture.componentRef.setInput('toast', toastWithTitle);
      fixture.detectChanges();

      const title = compiled.querySelector('.toast-title');
      expect(title?.textContent).toContain('Test Title');
    });

    it('should render dismiss button when dismissible is true', () => {
      fixture.componentRef.setInput('toast', mockToast);
      fixture.detectChanges();

      const dismissButton = compiled.querySelector('.toast-close');
      expect(dismissButton).toBeTruthy();
    });

    it('should not render dismiss button when dismissible is false', () => {
      const nonDismissible = { ...mockToast, dismissible: false };
      fixture.componentRef.setInput('toast', nonDismissible);
      fixture.detectChanges();

      const dismissButton = compiled.querySelector('.toast-close');
      expect(dismissButton).toBeFalsy();
    });
  });

  describe('Toast Types', () => {
    const types: ToastType[] = ['success', 'error', 'warning', 'info'];

    types.forEach((type) => {
      it(`should apply ${type} type class`, () => {
        const toast = { ...mockToast, type };
        fixture.componentRef.setInput('toast', toast);
        fixture.detectChanges();

        expect(component.typeClass).toContain(type);
      });

      it(`should show correct icon for ${type}`, () => {
        const toast = { ...mockToast, type };
        fixture.componentRef.setInput('toast', toast);
        fixture.detectChanges();

        expect(component.icon).toBeTruthy();
      });
    });
  });

  describe('Dismiss Behavior', () => {
    it('should emit dismissed event when dismiss is called', () => {
      fixture.componentRef.setInput('toast', mockToast);
      fixture.detectChanges();

      const spy = vi.fn();
      component.dismissed.subscribe(spy);

      component.dismiss();
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith('1');
    });
  });

  describe('Icon Display', () => {
    it('should return correct icon for success', () => {
      const toast = { ...mockToast, type: 'success' as ToastType };
      fixture.componentRef.setInput('toast', toast);
      fixture.detectChanges();

      expect(component.icon).toBe('✓');
    });

    it('should return correct icon for error', () => {
      const toast = { ...mockToast, type: 'error' as ToastType };
      fixture.componentRef.setInput('toast', toast);
      fixture.detectChanges();

      expect(component.icon).toBe('✕');
    });

    it('should return correct icon for warning', () => {
      const toast = { ...mockToast, type: 'warning' as ToastType };
      fixture.componentRef.setInput('toast', toast);
      fixture.detectChanges();

      expect(component.icon).toBe('⚠');
    });

    it('should return correct icon for info', () => {
      const toast = { ...mockToast, type: 'info' as ToastType };
      fixture.componentRef.setInput('toast', toast);
      fixture.detectChanges();

      expect(component.icon).toBe('ℹ');
    });
  });
});
