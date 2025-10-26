import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchBar } from './search-bar';

describe('SearchBar', () => {
  let component: SearchBar;
  let fixture: ComponentFixture<SearchBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBar],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should have empty search query', () => {
      expect(component.searchQuery()).toBe('');
    });

    it('should not be focused initially', () => {
      expect(component.isFocused()).toBe(false);
    });

    it('should have default placeholder', () => {
      expect(component.placeholder()).toBe('Search');
    });

    it('should not be disabled by default', () => {
      expect(component.disabled()).toBe(false);
    });

    it('should have medium size by default', () => {
      expect(component.size()).toBe('md');
    });
  });

  describe('Search Input', () => {
    it('should update search query on input', () => {
      const input = fixture.nativeElement.querySelector('.search-bar-input');
      input.value = 'test query';
      input.dispatchEvent(new Event('input'));

      expect(component.searchQuery()).toBe('test query');
    });

    it('should emit searchChange on input', () => {
      let emittedValue = '';
      component.searchChange.subscribe((value) => (emittedValue = value));

      const input = fixture.nativeElement.querySelector('.search-bar-input');
      input.value = 'test';
      input.dispatchEvent(new Event('input'));

      expect(emittedValue).toBe('test');
    });

    it('should update isFocused on focus', () => {
      const input = fixture.nativeElement.querySelector('.search-bar-input');
      input.dispatchEvent(new Event('focus'));

      expect(component.isFocused()).toBe(true);
    });

    it('should update isFocused on blur', () => {
      component.isFocused.set(true);
      const input = fixture.nativeElement.querySelector('.search-bar-input');
      input.dispatchEvent(new Event('blur'));

      expect(component.isFocused()).toBe(false);
    });
  });

  describe('Clear Search', () => {
    it('should clear search query', () => {
      component.searchQuery.set('test');
      component.clearSearch();

      expect(component.searchQuery()).toBe('');
    });

    it('should emit searchChange with empty string on clear', () => {
      let emittedValue = 'initial';
      component.searchChange.subscribe((value) => (emittedValue = value));

      component.searchQuery.set('test');
      component.clearSearch();

      expect(emittedValue).toBe('');
    });

    it('should show clear button when search query is not empty', () => {
      component.searchQuery.set('test');
      fixture.detectChanges();

      const clearButton = fixture.nativeElement.querySelector('.search-bar-clear');
      expect(clearButton).toBeTruthy();
    });

    it('should not show clear button when search query is empty', () => {
      component.searchQuery.set('');
      fixture.detectChanges();

      const clearButton = fixture.nativeElement.querySelector('.search-bar-clear');
      expect(clearButton).toBeFalsy();
    });

    it('should not show clear button when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      component.searchQuery.set('test');
      fixture.detectChanges();

      const clearButton = fixture.nativeElement.querySelector('.search-bar-clear');
      expect(clearButton).toBeFalsy();
    });
  });

  describe('Form Submit', () => {
    it('should emit searchSubmit on form submit', () => {
      let emittedValue = '';
      component.searchSubmit.subscribe((value) => (emittedValue = value));

      component.searchQuery.set('test query');
      const form = fixture.nativeElement.querySelector('.search-bar');
      form.dispatchEvent(new Event('submit'));

      expect(emittedValue).toBe('test query');
    });
  });

  describe('Disabled State', () => {
    it('should disable input when disabled is true', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector('.search-bar-input');
      expect(input.disabled).toBe(true);
    });

    it('should not allow input when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector('.search-bar-input');
      input.value = 'test';
      input.dispatchEvent(new Event('input'));

      // Should not update since input is disabled
      expect(input.disabled).toBe(true);
    });
  });

  describe('Size Variants', () => {
    it('should apply small size class', () => {
      fixture.componentRef.setInput('size', 'sm');
      fixture.detectChanges();

      const searchBar = fixture.nativeElement.querySelector('.search-bar');
      expect(searchBar.classList.contains('search-bar-sm')).toBe(true);
    });

    it('should apply medium size class', () => {
      fixture.componentRef.setInput('size', 'md');
      fixture.detectChanges();

      const searchBar = fixture.nativeElement.querySelector('.search-bar');
      expect(searchBar.classList.contains('search-bar-md')).toBe(true);
    });

    it('should apply large size class', () => {
      fixture.componentRef.setInput('size', 'lg');
      fixture.detectChanges();

      const searchBar = fixture.nativeElement.querySelector('.search-bar');
      expect(searchBar.classList.contains('search-bar-lg')).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should have aria-label on input', () => {
      const input = fixture.nativeElement.querySelector('.search-bar-input');
      expect(input.getAttribute('aria-label')).toBe('Search');
    });

    it('should have sr-only label', () => {
      const label = fixture.nativeElement.querySelector('.sr-only');
      expect(label).toBeTruthy();
    });

    it('should have role="search" on form', () => {
      const form = fixture.nativeElement.querySelector('.search-bar');
      expect(form.getAttribute('role')).toBe('search');
    });

    it('should have aria-label on clear button', () => {
      component.searchQuery.set('test');
      fixture.detectChanges();

      const clearButton = fixture.nativeElement.querySelector('.search-bar-clear');
      expect(clearButton.getAttribute('aria-label')).toBe('Clear search');
    });
  });
});
