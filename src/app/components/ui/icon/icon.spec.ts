import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';
import { of } from 'rxjs';
import { IconService } from './icon.service';
import { IconComponent } from './icon';

describe('IconService', () => {
  let service: IconService;
  let httpMock: HttpTestingController;
  let sanitizer: DomSanitizer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(IconService);
    httpMock = TestBed.inject(HttpTestingController);
    sanitizer = TestBed.inject(DomSanitizer);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should load and sanitize SVG content once and cache subsequent calls', () => {
    const svgContent = '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0" /></svg>';
    const results: SafeHtml[] = [];

    service.getSvg('check').subscribe((value) => results.push(value));

    const request = httpMock.expectOne('assets/icons/check.svg');
    expect(request.request.method).toBe('GET');
    request.flush(svgContent);

    const first = sanitizer.sanitize(SecurityContext.HTML, results[0]);
    expect(first).toContain('<svg');

    service.getSvg('check').subscribe((value) => results.push(value));
    httpMock.expectNone('assets/icons/check.svg');

    const second = sanitizer.sanitize(SecurityContext.HTML, results[1]);
    expect(second).toBe(first);
  });

  it('should normalize names with extension before fetching', () => {
    let received: string | null = null;

    service.getSvg('logo.svg').subscribe((value) => {
      received = sanitizer.sanitize(SecurityContext.HTML, value);
    });

    const request = httpMock.expectOne('assets/icons/logo.svg');
    request.flush('<svg />');

    expect(received).not.toBeNull();
    expect(received).toContain('<svg');
  });

  it('should allow retrying after a failed request', () => {
    const errorResponse = { status: 404, statusText: 'Not Found' };
    const svgContent = '<svg><rect width="10" height="10" /></svg>';
    const successSpy = vi.fn();

    service.getSvg('missing').subscribe({
      next: successSpy,
      error: (error) => {
        expect(error).toBeTruthy();
      },
    });

    const firstRequest = httpMock.expectOne('assets/icons/missing.svg');
    firstRequest.flush('not found', errorResponse);

    service.getSvg('missing').subscribe((value) => {
      const sanitized = sanitizer.sanitize(SecurityContext.HTML, value);
      expect(sanitized).toContain('<svg');
    });

    const secondRequest = httpMock.expectOne('assets/icons/missing.svg');
    secondRequest.flush(svgContent);

    expect(successSpy).not.toHaveBeenCalled();
  });
});

describe('IconComponent', () => {
  let fixture: ComponentFixture<IconComponent>;
  let element: HTMLElement;
  let httpClient: {
    get: Mock;
  };
  let iconService: IconService;

  beforeEach(async () => {
    httpClient = {
      get: vi.fn(() => of('<svg data-test="icon"></svg>')) as Mock,
    };

    await TestBed.configureTestingModule({
      imports: [IconComponent],
      providers: [provideZonelessChangeDetection(), { provide: HttpClient, useValue: httpClient }],
    }).compileComponents();

    iconService = TestBed.inject(IconService);
    fixture = TestBed.createComponent(IconComponent);
    element = fixture.nativeElement;
  });

  it('should render SVG content for provided icon name', () => {
    const serviceSpy = vi.spyOn(iconService, 'getSvg');
    fixture.componentRef.setInput('name', 'check');

    fixture.detectChanges();

    expect(serviceSpy).toHaveBeenCalledWith('check');
    expect(httpClient.get).toHaveBeenCalledWith('assets/icons/check.svg', { responseType: 'text' });
    expect(element.innerHTML).toContain('data-test="icon"');
  });

  it('should apply aria-hidden when no ariaLabel is provided', () => {
    fixture.componentRef.setInput('name', 'check');

    fixture.detectChanges();

    expect(element.getAttribute('aria-hidden')).toBe('true');
    expect(element.getAttribute('role')).toBeNull();
  });

  it('should expose aria-label and role img when provided', () => {
    fixture.componentRef.setInput('name', 'check');
    fixture.componentRef.setInput('ariaLabel', 'Check icon');

    fixture.detectChanges();

    expect(element.getAttribute('aria-label')).toBe('Check icon');
    expect(element.getAttribute('role')).toBe('img');
    expect(element.getAttribute('aria-hidden')).toBeNull();
  });

  it('should reflect size variants with classes', () => {
    fixture.componentRef.setInput('name', 'check');
    fixture.componentRef.setInput('size', 'lg');

    fixture.detectChanges();

    expect(element.classList.contains('app-icon')).toBe(true);
    expect(element.classList.contains('app-icon--lg')).toBe(true);
  });

  it('should support numeric sizes via inline styles', () => {
    fixture.componentRef.setInput('name', 'check');
    fixture.componentRef.setInput('size', 32);

    fixture.detectChanges();

    expect(element.style.width).toBe('32px');
    expect(element.style.height).toBe('32px');
  });
});
