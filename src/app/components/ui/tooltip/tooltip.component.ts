import { Component, input, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.css',
})
export class TooltipComponent {
  // Inputs
  text = input.required<string>();
  position = input<TooltipPosition>('top');
  delay = input<number>(200);

  // State
  isVisible = signal(false);
  private timeoutId: ReturnType<typeof setTimeout> | undefined;

  @HostListener('mouseenter')
  onMouseEnter() {
    this.timeoutId = setTimeout(() => {
      this.isVisible.set(true);
    }, this.delay());
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    clearTimeout(this.timeoutId);
    this.isVisible.set(false);
  }

  get positionClass(): string {
    const positions: Record<TooltipPosition, string> = {
      top: 'tooltip-top',
      bottom: 'tooltip-bottom',
      left: 'tooltip-left',
      right: 'tooltip-right',
    };
    return positions[this.position()];
  }
}
