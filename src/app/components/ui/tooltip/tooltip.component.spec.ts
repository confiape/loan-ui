import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TooltipComponent, TooltipPosition } from './tooltip';

describe('TooltipComponent', () => {
  let component: TooltipComponent;
  let fixture: ComponentFixture<TooltipComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TooltipComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TooltipComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have default values', () => {
      fixture.componentRef.setInput('text', 'Tooltip text');
      fixture.detectChanges();

      expect(component.position()).toBe('top');
      expect(component.delay()).toBe(200);
    });

    it('should not be visible by default', () => {
      fixture.componentRef.setInput('text', 'Tooltip text');
      fixture.detectChanges();

      expect(component.isVisible()).toBe(false);
    });
  });

  describe('Visibility', () => {
    it('should show tooltip on mouseenter', () => {
      vi.useFakeTimers();
      fixture.componentRef.setInput('text', 'Tooltip text');
      fixture.detectChanges();

      component.onMouseEnter();
      vi.advanceTimersByTime(200);
      fixture.detectChanges();

      expect(component.isVisible()).toBe(true);
      vi.useRealTimers();
    });

    it('should hide tooltip on mouseleave', () => {
      vi.useFakeTimers();
      fixture.componentRef.setInput('text', 'Tooltip text');
      fixture.detectChanges();

      component.onMouseEnter();
      vi.advanceTimersByTime(200);
      fixture.detectChanges();

      component.onMouseLeave();
      fixture.detectChanges();

      expect(component.isVisible()).toBe(false);
      vi.useRealTimers();
    });

    it('should respect delay', () => {
      vi.useFakeTimers();
      fixture.componentRef.setInput('text', 'Tooltip text');
      fixture.componentRef.setInput('delay', 500);
      fixture.detectChanges();

      component.onMouseEnter();
      vi.advanceTimersByTime(400);
      fixture.detectChanges();

      expect(component.isVisible()).toBe(false);

      vi.advanceTimersByTime(100);
      fixture.detectChanges();

      expect(component.isVisible()).toBe(true);
      vi.useRealTimers();
    });
  });

  describe('Position Classes', () => {
    const positions: TooltipPosition[] = ['top', 'bottom', 'left', 'right'];

    positions.forEach((position) => {
      it(`should apply ${position} position class`, () => {
        fixture.componentRef.setInput('text', 'Tooltip text');
        fixture.componentRef.setInput('position', position);
        fixture.detectChanges();

        expect(component.positionClass).toBe(`tooltip-${position}`);
      });
    });
  });

  describe('Rendering', () => {
    it('should render tooltip text', () => {
      fixture.componentRef.setInput('text', 'Test tooltip');
      fixture.detectChanges();

      component.isVisible.set(true);
      fixture.detectChanges();

      const tooltip = compiled.querySelector('.tooltip');
      expect(tooltip?.textContent).toContain('Test tooltip');
    });

    it('should not render tooltip when not visible', () => {
      fixture.componentRef.setInput('text', 'Test tooltip');
      fixture.detectChanges();

      const tooltip = compiled.querySelector('.tooltip');
      expect(tooltip).toBeFalsy();
    });
  });
});
