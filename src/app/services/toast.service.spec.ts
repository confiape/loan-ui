import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';
import { provideZonelessChangeDetection } from '@angular/core';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), ToastService],
    });
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('show', () => {
    it('should add a toast to the list', () => {
      service.show('success', 'Test message');
      expect(service.toasts$().length).toBe(1);
      expect(service.toasts$()[0].message).toBe('Test message');
      expect(service.toasts$()[0].type).toBe('success');
    });

    it('should use default duration for error (3000ms)', () => {
      service.show('error', 'Error message');
      expect(service.toasts$()[0].duration).toBe(3000);
    });

    it('should use default duration for success (2000ms)', () => {
      service.show('success', 'Success message');
      expect(service.toasts$()[0].duration).toBe(2000);
    });

    it('should use custom duration when provided', () => {
      service.show('info', 'Info message', undefined, 5000);
      expect(service.toasts$()[0].duration).toBe(5000);
    });

    it('should add title when provided', () => {
      service.show('warning', 'Warning message', 'Warning Title');
      expect(service.toasts$()[0].title).toBe('Warning Title');
    });

    it('should generate unique IDs for multiple toasts', () => {
      service.show('success', 'Message 1');
      service.show('error', 'Message 2');
      const toasts = service.toasts$();
      expect(toasts.length).toBe(2);
      expect(toasts[0].id).not.toBe(toasts[1].id);
    });
  });

  describe('success', () => {
    it('should create a success toast', () => {
      service.success('Success message');
      const toast = service.toasts$()[0];
      expect(toast.type).toBe('success');
      expect(toast.message).toBe('Success message');
    });
  });

  describe('error', () => {
    it('should create an error toast', () => {
      service.error('Error message');
      const toast = service.toasts$()[0];
      expect(toast.type).toBe('error');
      expect(toast.message).toBe('Error message');
    });
  });

  describe('warning', () => {
    it('should create a warning toast', () => {
      service.warning('Warning message');
      const toast = service.toasts$()[0];
      expect(toast.type).toBe('warning');
      expect(toast.message).toBe('Warning message');
    });
  });

  describe('info', () => {
    it('should create an info toast', () => {
      service.info('Info message');
      const toast = service.toasts$()[0];
      expect(toast.type).toBe('info');
      expect(toast.message).toBe('Info message');
    });
  });

  describe('dismiss', () => {
    it('should remove a toast by ID', () => {
      service.show('success', 'Message 1');
      service.show('error', 'Message 2');
      const toastId = service.toasts$()[0].id;

      service.dismiss(toastId);

      expect(service.toasts$().length).toBe(1);
      expect(service.toasts$()[0].message).toBe('Message 2');
    });

    it('should do nothing if ID does not exist', () => {
      service.show('success', 'Message 1');
      service.dismiss('non-existent-id');
      expect(service.toasts$().length).toBe(1);
    });
  });

  describe('clear', () => {
    it('should remove all toasts', () => {
      service.show('success', 'Message 1');
      service.show('error', 'Message 2');
      service.show('info', 'Message 3');

      expect(service.toasts$().length).toBe(3);

      service.clear();

      expect(service.toasts$().length).toBe(0);
    });
  });
});
