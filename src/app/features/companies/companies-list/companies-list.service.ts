import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Validators } from '@angular/forms';
import { BaseCrudService } from '../../../core/services/base-crud.service';
import { CompanyApiService } from '../../../core/openapi/api/company.service';
import { CompanyDto } from '../../../core/openapi/model/companyDto';
import { SaveCompanyDto } from '../../../core/openapi/model/saveCompanyDto';
import { TableColumnMetadata, FormFieldMetadata } from '../../../core/models/form-metadata';

/**
 * Service for managing companies list with CRUD operations
 * Implements ICrudService interface via BaseCrudService
 */
@Injectable()
export class CompaniesListService extends BaseCrudService<CompanyDto, SaveCompanyDto> {
  private companyApi = inject(CompanyApiService);
  private router = inject(Router);

  constructor() {
    super({
      enablePagination: true,
      defaultPageSize: 10,
      enableRouterNavigation: true,
    });
  }

  // ==================== DATA OPERATIONS ====================
  loadAllItems(): Observable<CompanyDto[]> {
    return this.companyApi.getAllCompanies();
  }

  saveItem(dto: SaveCompanyDto): Observable<CompanyDto> {
    // Check if we're updating (has id) or creating (no id)
    if ((dto as any).id) {
      // Update existing company
      const updateDto: CompanyDto = {
        id: (dto as any).id,
        name: dto.name,
      };
      return this.companyApi.updateCompany(updateDto);
    } else {
      // Create new company
      return this.companyApi.createCompany(dto);
    }
  }

  deleteItem(id: string): Observable<unknown> {
    return this.companyApi.deleteCompany(id);
  }

  matchesSearch(item: CompanyDto, term: string): boolean {
    return item.name.toLowerCase().includes(term) || item.id.toLowerCase().includes(term);
  }

  // ==================== METADATA ====================
  getTableColumns(): TableColumnMetadata<CompanyDto>[] {
    return [
      { key: 'name', label: 'Name', sortable: true },
      { key: 'id', label: 'ID', sortable: true },
    ];
  }

  getFormFields(): FormFieldMetadata[] {
    return [
      {
        key: 'name',
        label: 'Company Name',
        type: 'text',
        placeholder: 'Enter company name',
        validators: [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(15),
          Validators.pattern(/^[a-zA-Z0-9\s-]+$/),
        ],
        helpText: 'Company name must be 2-15 characters, alphanumeric only',
      },
    ];
  }

  getItemTypeName(): string {
    return 'company';
  }

  getItemTypePluralName(): string {
    return 'companies';
  }

  getItemDisplayName(item: CompanyDto): string {
    return item.name;
  }

  getRouteBasePath(): string {
    return '/companies';
  }

  // ==================== ROUTER NAVIGATION HOOKS ====================
  protected override onEditWithRouter(item: CompanyDto): void {
    this.router.navigate(['/companies', item.id]);
  }

  protected override onAfterFormSave(): void {
    this.router.navigate(['/companies']);
  }

  protected override onAfterFormCancel(): void {
    this.router.navigate(['/companies']);
  }
}
