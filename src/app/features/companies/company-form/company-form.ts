import { Component, input, output, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseInputComponent } from '../../../components/ui/base-input/base-input';
import { CompanyApiService } from '../../../core/openapi/api/company.service';
import { CompanyDto } from '../../../core/openapi/model/companyDto';
import { SaveCompanyDto } from '../../../core/openapi/model/saveCompanyDto';

@Component({
  selector: 'app-company-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BaseInputComponent],
  templateUrl: './company-form.html',
})
export class CompanyFormComponent {
  // Inputs
  company = input<CompanyDto | null>(null);

  // Outputs
  save = output<CompanyDto>();
  cancel = output<void>();

  // State
  companyForm: FormGroup;
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyApiService,
  ) {
    this.companyForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
    });

    // Update form when company input changes
    effect(() => {
      const currentCompany = this.company();
      if (currentCompany) {
        this.companyForm.patchValue({
          name: currentCompany.name,
        });
      } else {
        this.companyForm.reset();
      }
    });
  }

  onSubmit(): void {
    if (this.companyForm.invalid) {
      this.companyForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const formValue = this.companyForm.value;
    const currentCompany = this.company();

    if (currentCompany) {
      // Update existing company
      const updateDto: CompanyDto = {
        id: currentCompany.id,
        name: formValue.name,
      };

      this.companyService.updateCompany(updateDto).subscribe({
        next: (response) => {
          this.loading.set(false);
          this.save.emit(response);
        },
        error: (error) => {
          console.error('Error updating company:', error);
          this.error.set('Failed to update company. Please try again.');
          this.loading.set(false);
        },
      });
    } else {
      // Create new company
      const createDto: SaveCompanyDto = {
        name: formValue.name,
      };

      this.companyService.createCompany(createDto).subscribe({
        next: (response) => {
          this.loading.set(false);
          this.save.emit(response);
        },
        error: (error) => {
          console.error('Error creating company:', error);
          this.error.set('Failed to create company. Please try again.');
          this.loading.set(false);
        },
      });
    }
  }

  onCancel(): void {
    this.cancel.emit();
    this.companyForm.reset();
    this.error.set(null);
  }

  get nameControl() {
    return this.companyForm.get('name');
  }

  get isEditMode(): boolean {
    return this.company() !== null;
  }
}
