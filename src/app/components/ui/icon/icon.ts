import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, distinctUntilChanged, switchMap } from 'rxjs';
import { of } from 'rxjs';
import { IconService } from './icon.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

const SIZE_VARIANTS = new Set(['sm', 'md', 'lg'] as const);

@Component({
  selector: 'app-icon',
  standalone: true,
  templateUrl: './icon.html',
  styleUrl: './icon.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.app-icon]': 'true',
    '[class.app-icon--sm]': 'sizeClass() === "sm"',
    '[class.app-icon--md]': 'sizeClass() === "md"',
    '[class.app-icon--lg]': 'sizeClass() === "lg"',
    '[innerHTML]': 'svgContent()',
    '[attr.role]': 'roleAttr()',
    '[attr.aria-label]': 'ariaLabelAttr()',
    '[attr.aria-hidden]': 'ariaHiddenAttr()',
    '[style.width.px]': 'numericSize()',
    '[style.height.px]': 'numericSize()',
  },
})
export class IconComponent {
  private readonly iconService = inject(IconService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly emptyIcon = this.sanitizer.bypassSecurityTrustHtml('');

  name = input.required<string>();
  size = input<'sm' | 'md' | 'lg' | number>('md');
  ariaLabel = input<string | null>(null);

  protected readonly normalizedName = computed(() => this.normalizeName(this.name()));

  private readonly iconContent = toSignal<SafeHtml | null>(
    toObservable(this.normalizedName).pipe(
      distinctUntilChanged(),
      switchMap((name) => {
        if (!name) {
          return of(this.emptyIcon);
        }

        return this.iconService.getSvg(name).pipe(catchError(() => of(this.emptyIcon)));
      }),
    ),
    { initialValue: null, requireSync: false },
  );

  protected readonly svgContent = computed(() => this.iconContent() ?? this.emptyIcon);

  protected readonly numericSize = computed(() => {
    const current = this.size();
    return typeof current === 'number' ? current : null;
  });

  protected readonly sizeClass = computed(() => {
    const currentSize = this.size();
    if (typeof currentSize === 'string') {
      return SIZE_VARIANTS.has(currentSize) ? currentSize : 'md';
    }

    return 'md';
  });

  protected readonly roleAttr = computed(() => (this.ariaLabelAttr() ? 'img' : null));

  protected readonly ariaLabelAttr = computed(() => {
    const label = this.ariaLabel();
    if (!label) {
      return null;
    }
    const trimmed = label.trim();
    return trimmed.length > 0 ? trimmed : null;
  });

  protected readonly ariaHiddenAttr = computed(() =>
    this.ariaLabelAttr() === null ? 'true' : null,
  );

  private normalizeName(name: string): string {
    return name.trim().replace(/\.svg$/i, '');
  }
}
