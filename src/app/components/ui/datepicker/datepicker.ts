import {
  Component,
  computed,
  effect,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type SelectionMode = 'single' | 'range' | 'multiple';
export type DisplayMode = 'inline' | 'popup';
export type ViewMode = 'days' | 'months' | 'years';

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export type DisabledDateFn = (date: Date) => boolean;

@Component({
  selector: 'app-datepicker',
  imports: [CommonModule],
  templateUrl: './datepicker.html',
  styleUrl: './datepicker.css',
})
export class Datepicker {
  // ========================================
  // INPUTS
  // ========================================

  // Selection configuration
  selectionMode = input<SelectionMode>('single');
  displayMode = input<DisplayMode>('popup');
  showTime = input<boolean>(false);

  // Date constraints
  minDate = input<Date | null>(null);
  maxDate = input<Date | null>(null);
  disabledDates = input<Date[]>([]);
  disabledDateFn = input<DisabledDateFn | null>(null);

  // Display configuration
  placeholder = input<string>('Seleccionar fecha');
  label = input<string>('');
  disabled = input<boolean>(false);
  readonly = input<boolean>(false);
  required = input<boolean>(false);
  size = input<'sm' | 'md' | 'lg'>('md');

  // Initial values
  value = input<Date | null>(null);
  rangeValue = input<DateRange | null>(null);
  multipleValue = input<Date[]>([]);

  // Quick navigation
  showMonthYearPicker = input<boolean>(true);
  showTodayButton = input<boolean>(true);
  showClearButton = input<boolean>(true);

  // ========================================
  // OUTPUTS
  // ========================================

  dateChange = output<Date | null>();
  rangeChange = output<DateRange>();
  multipleChange = output<Date[]>();
  datePickerOpen = output<void>();
  datePickerClose = output<void>();

  // ========================================
  // STATE
  // ========================================

  // Calendar state
  currentDate = signal<Date>(new Date());
  viewMode = signal<ViewMode>('days');
  isOpen = signal<boolean>(false);

  // Selection state
  selectedDate = signal<Date | null>(null);
  selectedRange = signal<DateRange>({ start: null, end: null });
  selectedMultiple = signal<Date[]>([]);
  rangeHoverDate = signal<Date | null>(null);

  // Time state
  selectedHour = signal<number>(0);
  selectedMinute = signal<number>(0);

  // UI state
  focusedDay = signal<number | null>(null);

  // ViewChild references
  inputElement = viewChild<ElementRef<HTMLInputElement>>('dateInput');

  // ========================================
  // COMPUTED
  // ========================================

  calendarDays = computed(() => {
    const date = this.currentDate();
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days: Date[] = [];
    const currentDate = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  });

  monthsGrid = computed(() => {
    const months = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];
    return months;
  });

  yearsGrid = computed(() => {
    const currentYear = this.currentDate().getFullYear();
    const startYear = Math.floor(currentYear / 10) * 10;
    const years: number[] = [];
    for (let i = startYear - 1; i < startYear + 11; i++) {
      years.push(i);
    }
    return years;
  });

  displayValue = computed(() => {
    const mode = this.selectionMode();
    const showTime = this.showTime();

    if (mode === 'single') {
      const date = this.selectedDate();
      return date ? this.formatDate(date, showTime) : '';
    } else if (mode === 'range') {
      const range = this.selectedRange();
      if (range.start && range.end) {
        return `${this.formatDate(range.start, showTime)} - ${this.formatDate(range.end, showTime)}`;
      } else if (range.start) {
        return this.formatDate(range.start, showTime);
      }
      return '';
    } else {
      const dates = this.selectedMultiple();
      if (dates.length === 0) return '';
      if (dates.length === 1) return this.formatDate(dates[0], showTime);
      return `${dates.length} fechas seleccionadas`;
    }
  });

  currentMonthYear = computed(() => {
    const date = this.currentDate();
    const months = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  });

  currentYearRange = computed(() => {
    const currentYear = this.currentDate().getFullYear();
    const startYear = Math.floor(currentYear / 10) * 10;
    return `${startYear} - ${startYear + 9}`;
  });

  // ========================================
  // CONSTRUCTOR
  // ========================================

  constructor() {
    // Initialize with input values
    effect(() => {
      const val = this.value();
      if (val) this.selectedDate.set(val);
    });

    effect(() => {
      const val = this.rangeValue();
      if (val) this.selectedRange.set(val);
    });

    effect(() => {
      const val = this.multipleValue();
      if (val) this.selectedMultiple.set(val);
    });

    // Close on outside click
    if (typeof document !== 'undefined') {
      document.addEventListener('click', this.handleOutsideClick.bind(this));
    }
  }

  // ========================================
  // METHODS - Calendar Navigation
  // ========================================

  previousMonth(): void {
    const date = new Date(this.currentDate());
    date.setMonth(date.getMonth() - 1);
    this.currentDate.set(date);
  }

  nextMonth(): void {
    const date = new Date(this.currentDate());
    date.setMonth(date.getMonth() + 1);
    this.currentDate.set(date);
  }

  previousYear(): void {
    const date = new Date(this.currentDate());
    date.setFullYear(date.getFullYear() - 1);
    this.currentDate.set(date);
  }

  nextYear(): void {
    const date = new Date(this.currentDate());
    date.setFullYear(date.getFullYear() + 1);
    this.currentDate.set(date);
  }

  previousYearRange(): void {
    const date = new Date(this.currentDate());
    date.setFullYear(date.getFullYear() - 10);
    this.currentDate.set(date);
  }

  nextYearRange(): void {
    const date = new Date(this.currentDate());
    date.setFullYear(date.getFullYear() + 10);
    this.currentDate.set(date);
  }

  goToToday(): void {
    this.currentDate.set(new Date());
    this.viewMode.set('days');
  }

  // ========================================
  // METHODS - View Mode
  // ========================================

  showMonthPicker(): void {
    if (this.showMonthYearPicker()) {
      this.viewMode.set('months');
    }
  }

  showYearPicker(): void {
    if (this.showMonthYearPicker()) {
      this.viewMode.set('years');
    }
  }

  selectMonth(monthIndex: number): void {
    const date = new Date(this.currentDate());
    date.setMonth(monthIndex);
    this.currentDate.set(date);
    this.viewMode.set('days');
  }

  selectYear(year: number): void {
    const date = new Date(this.currentDate());
    date.setFullYear(year);
    this.currentDate.set(date);
    this.viewMode.set('months');
  }

  // ========================================
  // METHODS - Date Selection
  // ========================================

  selectDate(date: Date): void {
    if (this.isDateDisabled(date)) return;

    const mode = this.selectionMode();

    if (mode === 'single') {
      this.selectedDate.set(date);
      if (this.showTime()) {
        const newDate = new Date(date);
        newDate.setHours(this.selectedHour());
        newDate.setMinutes(this.selectedMinute());
        this.dateChange.emit(newDate);
      } else {
        this.dateChange.emit(date);
        if (this.displayMode() === 'popup') {
          this.close();
        }
      }
    } else if (mode === 'range') {
      this.selectRangeDate(date);
    } else if (mode === 'multiple') {
      this.selectMultipleDate(date);
    }
  }

  selectRangeDate(date: Date): void {
    const range = this.selectedRange();

    if (!range.start || (range.start && range.end)) {
      this.selectedRange.set({ start: date, end: null });
    } else {
      if (date < range.start) {
        this.selectedRange.set({ start: date, end: range.start });
      } else {
        this.selectedRange.set({ start: range.start, end: date });
      }

      const finalRange = this.selectedRange();
      if (this.showTime() && finalRange.start && finalRange.end) {
        const startDate = new Date(finalRange.start);
        const endDate = new Date(finalRange.end);
        startDate.setHours(this.selectedHour());
        startDate.setMinutes(this.selectedMinute());
        endDate.setHours(this.selectedHour());
        endDate.setMinutes(this.selectedMinute());
        this.rangeChange.emit({ start: startDate, end: endDate });
      } else {
        this.rangeChange.emit(this.selectedRange());
      }

      if (!this.showTime() && this.displayMode() === 'popup') {
        setTimeout(() => this.close(), 200);
      }
    }
  }

  selectMultipleDate(date: Date): void {
    const dates = [...this.selectedMultiple()];
    const index = dates.findIndex((d) => this.isSameDay(d, date));

    if (index >= 0) {
      dates.splice(index, 1);
    } else {
      dates.push(date);
    }

    dates.sort((a, b) => a.getTime() - b.getTime());
    this.selectedMultiple.set(dates);

    if (this.showTime()) {
      const datesWithTime = dates.map((d) => {
        const newDate = new Date(d);
        newDate.setHours(this.selectedHour());
        newDate.setMinutes(this.selectedMinute());
        return newDate;
      });
      this.multipleChange.emit(datesWithTime);
    } else {
      this.multipleChange.emit(dates);
    }
  }

  // ========================================
  // METHODS - Time Selection
  // ========================================

  setHour(hour: number): void {
    this.selectedHour.set(hour);
    this.updateTimeInSelection();
  }

  setMinute(minute: number): void {
    this.selectedMinute.set(minute);
    this.updateTimeInSelection();
  }

  updateTimeInSelection(): void {
    const mode = this.selectionMode();

    if (mode === 'single' && this.selectedDate()) {
      const date = new Date(this.selectedDate()!);
      date.setHours(this.selectedHour());
      date.setMinutes(this.selectedMinute());
      this.dateChange.emit(date);
    } else if (mode === 'range') {
      const range = this.selectedRange();
      if (range.start && range.end) {
        const start = new Date(range.start);
        const end = new Date(range.end);
        start.setHours(this.selectedHour());
        start.setMinutes(this.selectedMinute());
        end.setHours(this.selectedHour());
        end.setMinutes(this.selectedMinute());
        this.rangeChange.emit({ start, end });
      }
    } else if (mode === 'multiple') {
      const dates = this.selectedMultiple().map((d) => {
        const newDate = new Date(d);
        newDate.setHours(this.selectedHour());
        newDate.setMinutes(this.selectedMinute());
        return newDate;
      });
      this.multipleChange.emit(dates);
    }
  }

  // ========================================
  // METHODS - Popup Control
  // ========================================

  toggle(): void {
    if (this.disabled() || this.readonly()) return;

    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  open(): void {
    if (this.displayMode() === 'inline') return;
    if (this.disabled() || this.readonly()) return;

    this.isOpen.set(true);
    this.datePickerOpen.emit();
  }

  close(): void {
    if (this.displayMode() === 'inline') return;

    this.isOpen.set(false);
    this.viewMode.set('days');
    this.datePickerClose.emit();
  }

  clear(): void {
    const mode = this.selectionMode();

    if (mode === 'single') {
      this.selectedDate.set(null);
      this.dateChange.emit(null);
    } else if (mode === 'range') {
      this.selectedRange.set({ start: null, end: null });
      this.rangeChange.emit({ start: null, end: null });
    } else if (mode === 'multiple') {
      this.selectedMultiple.set([]);
      this.multipleChange.emit([]);
    }

    this.close();
  }

  // ========================================
  // METHODS - Date Utilities
  // ========================================

  isDateDisabled(date: Date): boolean {
    const min = this.minDate();
    const max = this.maxDate();
    const disabledDates = this.disabledDates();
    const disabledFn = this.disabledDateFn();

    if (min && date < min) return true;
    if (max && date > max) return true;
    if (disabledDates.some((d) => this.isSameDay(d, date))) return true;
    if (disabledFn && disabledFn(date)) return true;

    return false;
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  isToday(date: Date): boolean {
    return this.isSameDay(date, new Date());
  }

  isSelected(date: Date): boolean {
    const mode = this.selectionMode();

    if (mode === 'single') {
      const selected = this.selectedDate();
      return selected ? this.isSameDay(selected, date) : false;
    } else if (mode === 'range') {
      const range = this.selectedRange();
      if (range.start && this.isSameDay(range.start, date)) return true;
      if (range.end && this.isSameDay(range.end, date)) return true;
      return false;
    } else {
      return this.selectedMultiple().some((d) => this.isSameDay(d, date));
    }
  }

  isInRange(date: Date): boolean {
    if (this.selectionMode() !== 'range') return false;

    const range = this.selectedRange();
    if (!range.start || !range.end) return false;

    return date >= range.start && date <= range.end;
  }

  isRangeStart(date: Date): boolean {
    if (this.selectionMode() !== 'range') return false;
    const range = this.selectedRange();
    return range.start ? this.isSameDay(range.start, date) : false;
  }

  isRangeEnd(date: Date): boolean {
    if (this.selectionMode() !== 'range') return false;
    const range = this.selectedRange();
    return range.end ? this.isSameDay(range.end, date) : false;
  }

  isInHoverRange(date: Date): boolean {
    if (this.selectionMode() !== 'range') return false;

    const range = this.selectedRange();
    const hover = this.rangeHoverDate();

    if (!range.start || range.end || !hover) return false;

    const start = range.start < hover ? range.start : hover;
    const end = range.start < hover ? hover : range.start;

    return date >= start && date <= end;
  }

  isOtherMonth(date: Date): boolean {
    return date.getMonth() !== this.currentDate().getMonth();
  }

  onDayHover(date: Date): void {
    if (this.selectionMode() === 'range') {
      this.rangeHoverDate.set(date);
    }
  }

  formatDate(date: Date, includeTime = false): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    let formatted = `${day}/${month}/${year}`;

    if (includeTime) {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      formatted += ` ${hours}:${minutes}`;
    }

    return formatted;
  }

  // ========================================
  // METHODS - Keyboard Navigation
  // ========================================

  onKeyDown(event: KeyboardEvent): void {
    const key = event.key;

    if (key === 'Escape') {
      event.preventDefault();
      this.close();
      return;
    }

    if (key === 'Enter') {
      event.preventDefault();
      if (!this.isOpen() && this.displayMode() === 'popup') {
        this.open();
      } else if (this.focusedDay() !== null) {
        const days = this.calendarDays();
        this.selectDate(days[this.focusedDay()!]);
      }
      return;
    }

    if (!this.isOpen() && this.displayMode() === 'popup') {
      if (key === 'ArrowDown' || key === ' ') {
        event.preventDefault();
        this.open();
      }
      return;
    }

    if (this.viewMode() === 'days') {
      this.handleDaysKeyboard(event);
    }
  }

  handleDaysKeyboard(event: KeyboardEvent): void {
    const key = event.key;
    const days = this.calendarDays();
    let currentFocus = this.focusedDay();

    if (currentFocus === null) {
      const today = days.findIndex((d) => this.isToday(d));
      currentFocus = today >= 0 ? today : 15;
    }

    let newFocus = currentFocus;

    if (key === 'ArrowLeft') {
      event.preventDefault();
      newFocus = Math.max(0, currentFocus - 1);
    } else if (key === 'ArrowRight') {
      event.preventDefault();
      newFocus = Math.min(days.length - 1, currentFocus + 1);
    } else if (key === 'ArrowUp') {
      event.preventDefault();
      newFocus = Math.max(0, currentFocus - 7);
    } else if (key === 'ArrowDown') {
      event.preventDefault();
      newFocus = Math.min(days.length - 1, currentFocus + 7);
    }

    this.focusedDay.set(newFocus);
  }

  // ========================================
  // METHODS - Event Handlers
  // ========================================

  handleOutsideClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const element = this.inputElement()?.nativeElement;

    if (element && !element.contains(target) && !target.closest('.datepicker-popup')) {
      this.close();
    }
  }
}
