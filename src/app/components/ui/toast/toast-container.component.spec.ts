import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ToastContainerComponent } from './toast-container.component';
import { Toast, ToastPosition } from './toast.component';

describe('ToastContainerComponent', () => {
  let component: ToastContainerComponent;
  let fixture: ComponentFixture<ToastContainerComponent>;
  let compiled: HTMLElement;

  const mockToasts: Toast[] = [
    { id: '1', type: 'success', message: 'Success message' },
    { id: '2', type: 'error', message: 'Error message' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastContainerComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(ToastContainerComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have default position', () => {
      fixture.componentRef.setInput('toasts', []);
      fixture.detectChanges();

      expect(component.position()).toBe('top-right');
    });
  });

  describe('Rendering', () => {
    it('should render all toasts', () => {
      fixture.componentRef.setInput('toasts', mockToasts);
      fixture.detectChanges();

      const toasts = compiled.querySelectorAll('app-toast');
      expect(toasts.length).toBe(2);
    });

    it('should not render when no toasts', () => {
      fixture.componentRef.setInput('toasts', []);
      fixture.detectChanges();

      const toasts = compiled.querySelectorAll('app-toast');
      expect(toasts.length).toBe(0);
    });
  });

  describe('Position Classes', () => {
    const positions: ToastPosition[] = [
      'top-right',
      'top-left',
      'bottom-right',
      'bottom-left',
      'top-center',
      'bottom-center',
    ];

    positions.forEach((position) => {
      it(`should apply ${position} position class`, () => {
        fixture.componentRef.setInput('toasts', mockToasts);
        fixture.componentRef.setInput('position', position);
        fixture.detectChanges();

        expect(component.positionClass).toBe(position);
      });
    });
  });
});
