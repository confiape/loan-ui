import { Component, inject } from '@angular/core';
import { GenericCrudListComponent } from '../../../components/generic-crud';
import { UsersListService } from './users-list.service';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [GenericCrudListComponent],
  providers: [UsersListService],
  template: `<app-generic-crud-list [service]="service" testIdPrefix="users" />`,
})
export class UsersListComponent {
  service = inject(UsersListService);
}
