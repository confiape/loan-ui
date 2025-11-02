import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BaseCrudService } from '../../../core/services/base-crud.service';
import { CompanyApiService } from '../../../core/openapi/api/company.service';
import { CompanyDto } from '../../../core/openapi/model/companyDto';

/**
 * Service for managing companies list with CRUD operations
 */
@Injectable()
export class CompaniesListService extends BaseCrudService<CompanyDto> {
  private companyApi = inject(CompanyApiService);
  private router = inject(Router);

  constructor() {
    super({
      enablePagination: true, // Companies uses pagination
      defaultPageSize: 10,
      enableRouterNavigation: true, // Companies uses router navigation
    });
  }

  protected loadAllItems(): Observable<CompanyDto[]> {
    return this.companyApi.getAllCompanies();
  }

  protected deleteItem(id: string): Observable<unknown> {
    return this.companyApi.deleteCompany(id);
  }

  protected matchesSearch(item: CompanyDto, term: string): boolean {
    return item.name.toLowerCase().includes(term) || item.id.toLowerCase().includes(term);
  }

  protected getItemTypeName(): string {
    return 'company';
  }

  protected getItemTypePluralName(): string {
    return 'companies';
  }

  protected getItemDisplayName(item: CompanyDto): string {
    return item.name;
  }

  // ==================== ROUTER NAVIGATION HOOKS ====================
  /**
   * Navigate to /companies/:id for editing
   */
  protected override onEditWithRouter(item: CompanyDto): void {
    this.router.navigate(['/companies', item.id]);
  }

  /**
   * Navigate back to /companies after save
   */
  protected override onAfterFormSave(): void {
    this.router.navigate(['/companies']);
  }

  /**
   * Navigate back to /companies after cancel
   */
  protected override onAfterFormCancel(): void {
    this.router.navigate(['/companies']);
  }
}
