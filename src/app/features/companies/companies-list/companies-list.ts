import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import {
  TableToolbarComponent,
  ToolbarAction,
} from '../../../components/ui/table-toolbar/table-toolbar';
import { ModalComponent } from '../../../components/ui/modal/modal';
import { CompanyDto } from '../../../core/openapi/model/companyDto';
import { CompanyFormComponent } from '../company-form/company-form';
import { TableComponent, TableColumn } from '../../../components/ui/table/table';
import { TablePaginationComponent } from '../../../components/ui/table-pagination/table-pagination';
import { CompaniesListService } from './companies-list.service';
import {
  createStandardRowActions,
  createPrimaryAction,
  createBulkActions,
  createIdColumn,
} from '../../../core/utils/crud-helpers';

@Component({
  selector: 'app-companies-list',
  standalone: true,
  imports: [
    CommonModule,
    TableToolbarComponent,
    ModalComponent,
    CompanyFormComponent,
    TableComponent,
    TablePaginationComponent,
  ],
  providers: [CompaniesListService],
  templateUrl: './companies-list.html',
})
export class CompaniesListComponent implements OnInit {
  service = inject(CompaniesListService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  // Table configuration
  columns: TableColumn<CompanyDto>[] = [
    { key: 'name', label: 'Name', sortable: true },
    createIdColumn<CompanyDto>(),
  ];

  rowActions = createStandardRowActions<CompanyDto>(
    (company) => this.service.onEditItem(company),
    (company) => this.service.onDeleteItem(company),
  );

  // Toolbar configuration
  primaryAction: ToolbarAction = createPrimaryAction('New Company', () => this.service.onNewItem());

  bulkActions: ToolbarAction[] = createBulkActions();

  ngOnInit(): void {
    this.service.loadItems();

    // Watch route params to open modal when ID is in URL
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        // Wait for companies to load if not already loaded
        if (this.service.items().length === 0) {
          // Companies will load and then this will trigger again
          return;
        }
        const company = this.service.items().find((c) => c.id === id);
        if (company) {
          this.service.editingItem.set(company);
          this.service.showModal.set(true);
        } else {
          // Company not found, navigate back to list
          this.router.navigate(['/companies']);
        }
      } else {
        // No ID in route, close modal if open
        if (this.service.showModal() && this.service.editingItem()) {
          this.service.showModal.set(false);
          this.service.editingItem.set(null);
        }
      }
    });
  }

  onBulkAction(action: ToolbarAction): void {
    if (action.label === 'Delete Selected') {
      this.service.onBulkDelete();
    }
  }
}
