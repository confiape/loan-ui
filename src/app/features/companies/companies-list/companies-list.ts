import { Component, inject } from '@angular/core';
import { GenericCrudListComponent } from '../../../components/generic-crud';
import { CompaniesListService } from './companies-list.service';

@Component({
  selector: 'app-companies-list',
  standalone: true,
  imports: [GenericCrudListComponent],
  providers: [CompaniesListService],
  template: `<app-generic-crud-list [service]="service" testIdPrefix="companies" />`,
})
export class CompaniesListComponent {
  service = inject(CompaniesListService);
}
