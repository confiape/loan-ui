import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import {
  TableToolbarComponent,
  ToolbarAction,
} from '../../../components/ui/table-toolbar/table-toolbar';
import { ModalComponent } from '../../../components/ui/modal/modal';
import { CompanyApiService } from '../../../core/openapi/api/company.service';
import { CompanyDto } from '../../../core/openapi/model/companyDto';
import { CompanyFormComponent } from '../company-form/company-form';
import { TableComponent, TableColumn, TableRowAction } from '../../../components/ui/table/table';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-companies-list',
  standalone: true,
  imports: [
    CommonModule,
    TableToolbarComponent,
    ModalComponent,
    CompanyFormComponent,
    TableComponent,
  ],
  templateUrl: './companies-list.html',
})
export class CompaniesListComponent implements OnInit {
  // State
  allCompanies = signal<CompanyDto[]>([]);
  loading = signal<boolean>(false);
  showModal = signal<boolean>(false);
  editingCompany = signal<CompanyDto | null>(null);
  showDeleteConfirm = signal<boolean>(false);
  deletingCompany = signal<CompanyDto | null>(null);
  searchTerm = signal<string>('');
  selectedCompanies = signal<Set<string>>(new Set());

  // Computed
  filteredCompanies = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const companies = this.allCompanies();

    if (!term) return companies;

    return companies.filter(
      (company) =>
        company.name.toLowerCase().includes(term) || company.id.toLowerCase().includes(term),
    );
  });

  hasSelection = computed(() => this.selectedCompanies().size > 0);

  companyService = inject(CompanyApiService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  // Table configuration
  columns: TableColumn<CompanyDto>[] = [
    { key: 'name', label: 'Name', sortable: true },
    {
      key: 'id',
      label: 'ID',
      sortable: true,
      customTemplate: (row) => `<span class="font-mono">${row.id}</span>`,
    },
  ];

  rowActions: TableRowAction[] = [
    {
      label: 'Edit',
      icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>',
      variant: 'secondary',
      inline: true,
      onClick: (row) => this.onEditCompany(row as CompanyDto),
    },
    {
      label: 'Delete',
      icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>',
      variant: 'danger',
      inline: true,
      onClick: (row) => this.onDeleteCompany(row as CompanyDto),
    },
  ];

  // Toolbar configuration
  primaryAction: ToolbarAction = {
    label: 'New Company',
    icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>',
    variant: 'primary',
    onClick: () => this.onNewCompany(),
  };

  bulkActions: ToolbarAction[] = [
    {
      label: 'Delete Selected',
      icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>',
      variant: 'outline',
    },
  ];

  ngOnInit(): void {
    this.loadCompanies();

    // Watch route params to open modal when ID is in URL
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        // Wait for companies to load if not already loaded
        if (this.allCompanies().length === 0) {
          // Companies will load and then this will trigger again
          return;
        }
        const company = this.allCompanies().find((c) => c.id === id);
        if (company) {
          this.editingCompany.set(company);
          this.showModal.set(true);
        } else {
          // Company not found, navigate back to list
          this.router.navigate(['/companies']);
        }
      } else {
        // No ID in route, close modal if open
        if (this.showModal() && this.editingCompany()) {
          this.showModal.set(false);
          this.editingCompany.set(null);
        }
      }
    });
  }

  loadCompanies(): void {
    this.loading.set(true);
    this.companyService.getAllCompanies().subscribe({
      next: (companies) => {
        this.allCompanies.set(companies);
        this.loading.set(false);

        // After loading, check if there's an ID in the route
        const id = this.route.snapshot.params['id'];
        if (id) {
          const company = companies.find((c) => c.id === id);
          if (company) {
            this.editingCompany.set(company);
            this.showModal.set(true);
          } else {
            // Company not found, navigate back to list
            this.router.navigate(['/companies']);
          }
        }
      },
      error: (error) => {
        console.error('Error loading companies:', error);
        this.loading.set(false);
      },
    });
  }

  onSearch(term: string): void {
    this.searchTerm.set(term);
  }

  onNewCompany(): void {
    this.editingCompany.set(null);
    this.showModal.set(true);
    // No need to navigate for new company
  }

  onEditCompany(company: CompanyDto): void {
    // Navigate to /companies/:id
    this.router.navigate(['/companies', company.id]);
  }

  onDeleteCompany(company: CompanyDto): void {
    this.deletingCompany.set(company);
    this.showDeleteConfirm.set(true);
  }

  onBulkAction(action: ToolbarAction): void {
    if (action.label === 'Delete Selected') {
      this.showDeleteConfirm.set(true);
    }
  }

  onSelectionChange(selected: Set<string>): void {
    this.selectedCompanies.set(selected);
  }

  onSelectAll(selectAll: boolean): void {
    if (selectAll) {
      const allIds = new Set(this.filteredCompanies().map((c) => c.id));
      this.selectedCompanies.set(allIds);
    } else {
      this.selectedCompanies.set(new Set());
    }
  }

  onFormSave(): void {
    this.showModal.set(false);
    this.editingCompany.set(null);
    this.loadCompanies();
    // Navigate back to list
    this.router.navigate(['/companies']);
  }

  onFormCancel(): void {
    this.showModal.set(false);
    this.editingCompany.set(null);
    // Navigate back to list
    this.router.navigate(['/companies']);
  }

  confirmDelete(): void {
    const selected = this.selectedCompanies();
    const singleCompany = this.deletingCompany();

    if (selected.size > 0) {
      // Bulk delete
      const deleteRequests = Array.from(selected).map((id) =>
        this.companyService.deleteCompany(id),
      );

      forkJoin(deleteRequests).subscribe({
        next: () => {
          this.showDeleteConfirm.set(false);
          this.selectedCompanies.set(new Set());
          this.loadCompanies();
        },
        error: (error) => {
          console.error('Error deleting companies:', error);
          this.showDeleteConfirm.set(false);
        },
      });
    } else if (singleCompany) {
      // Single delete
      this.companyService.deleteCompany(singleCompany.id).subscribe({
        next: () => {
          this.showDeleteConfirm.set(false);
          this.deletingCompany.set(null);
          this.loadCompanies();
        },
        error: (error) => {
          console.error('Error deleting company:', error);
          this.showDeleteConfirm.set(false);
        },
      });
    }
  }

  cancelDelete(): void {
    this.showDeleteConfirm.set(false);
    this.deletingCompany.set(null);
  }

  get deleteMessage(): string {
    const selected = this.selectedCompanies();
    if (selected.size > 0) {
      return `Are you sure you want to delete ${selected.size} ${selected.size === 1 ? 'company' : 'companies'}? This action cannot be undone.`;
    }
    const company = this.deletingCompany();
    return `Are you sure you want to delete <strong class="font-semibold">${company?.name}</strong>? This action cannot be undone.`;
  }
}
