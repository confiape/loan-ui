import { Component, inject } from '@angular/core';
import { GenericCrudListComponent } from '../../../components/generic-crud';
import { RolesListService } from './roles-list.service';

@Component({
  selector: 'app-roles-list',
  standalone: true,
  imports: [GenericCrudListComponent],
  providers: [RolesListService],
  template: `<app-generic-crud-list [service]="service" testIdPrefix="roles" />`,
})
export class RolesListComponent {
  service = inject(RolesListService);
}
