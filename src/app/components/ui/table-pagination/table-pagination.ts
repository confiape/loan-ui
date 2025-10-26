import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalItems: number;
}

@Component({
  selector: 'app-table-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-pagination.html',
  styleUrl: './table-pagination.css',
})
export class TablePaginationComponent {
  // ==================== INPUTS ====================
  currentPage = input.required<number>();
  pageSize = input.required<number>();
  totalItems = input.required<number>();
  maxVisiblePages = input<number>(5);
  showInfo = input<boolean>(true);
  showPageNumbers = input<boolean>(true);

  // ==================== OUTPUTS ====================
  pageChange = output<number>();

  // ==================== COMPUTED ====================
  totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()));

  startItem = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize() + 1;
    return Math.min(start, this.totalItems());
  });

  endItem = computed(() => {
    const end = this.currentPage() * this.pageSize();
    return Math.min(end, this.totalItems());
  });

  visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const max = this.maxVisiblePages();

    if (total <= max) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const half = Math.floor(max / 2);
    let start = current - half;
    let end = current + half;

    if (start < 1) {
      start = 1;
      end = max;
    }

    if (end > total) {
      end = total;
      start = total - max + 1;
    }

    const pages: (number | string)[] = [];

    // Add first page and ellipsis if needed
    if (start > 1) {
      pages.push(1);
      if (start > 2) {
        pages.push('...');
      }
    }

    // Add visible pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add ellipsis and last page if needed
    if (end < total) {
      if (end < total - 1) {
        pages.push('...');
      }
      pages.push(total);
    }

    return pages;
  });

  canGoPrevious = computed(() => this.currentPage() > 1);
  canGoNext = computed(() => this.currentPage() < this.totalPages());

  // ==================== METHODS ====================
  goToPage(page: number | string): void {
    if (typeof page === 'string') return;

    if (page >= 1 && page <= this.totalPages() && page !== this.currentPage()) {
      this.pageChange.emit(page);
    }
  }

  goToPrevious(): void {
    if (this.canGoPrevious()) {
      this.pageChange.emit(this.currentPage() - 1);
    }
  }

  goToNext(): void {
    if (this.canGoNext()) {
      this.pageChange.emit(this.currentPage() + 1);
    }
  }
}
