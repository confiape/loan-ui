import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ToastContainerComponent } from './toast-container.component';
import { ToastPosition } from './toast.component';
import { ToastService } from '../../../services/toast.service';

describe('ToastContainerComponent', () => {
  let component: ToastContainerComponent;
  let fixture: ComponentFixture<ToastContainerComponent>;
  let compiled: HTMLElement;
  let toastService: ToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastContainerComponent],
      providers: [provideZonelessChangeDetection(), ToastService],
    }).compileComponents();

    fixture = TestBed.createComponent(ToastContainerComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    toastService = TestBed.inject(ToastService);
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have default position', () => {
      fixture.detectChanges();
      expect(component.position()).toBe('top-right');
    });

    it('should inject ToastService', () => {
      expect(component.toastService).toBeTruthy();
    });
  });

  describe('Rendering', () => {
    it('should render all toasts from service', () => {
      toastService.success('Success message');
      toastService.error('Error message');
      fixture.detectChanges();

      const toasts = compiled.querySelectorAll('app-toast');
      expect(toasts.length).toBe(2);
    });

    it('should not render when no toasts', () => {
      fixture.detectChanges();

      const toasts = compiled.querySelectorAll('app-toast');
      expect(toasts.length).toBe(0);
    });

    it('should update when toasts are added', () => {
      fixture.detectChanges();
      expect(compiled.querySelectorAll('app-toast').length).toBe(0);

      toastService.info('New toast');
      fixture.detectChanges();
      expect(compiled.querySelectorAll('app-toast').length).toBe(1);
    });
  });

  describe('onDismiss', () => {
    it('should remove toast when dismissed', () => {
      toastService.success('Test message');
      fixture.detectChanges();

      const toastId = toastService.toasts$()[0].id;
      component.onDismiss(toastId);

      expect(toastService.toasts$().length).toBe(0);
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
        fixture.componentRef.setInput('position', position);
        fixture.detectChanges();

        expect(component.positionClass).toBe(position);
      });
    });
  });
});
