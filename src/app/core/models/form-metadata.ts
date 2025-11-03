import { ValidatorFn, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';

/**
 * Supported form field types
 */
export type FormFieldType =
  | 'text'
  | 'number'
  | 'email'
  | 'password'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'date'
  | 'checkbox'
  | 'radio';

/**
 * Option for select/multiselect/radio fields
 */
export interface SelectOption {
  label: string;
  value: any;
  disabled?: boolean;
}

/**
 * Configuration for a form field
 */
export interface FormFieldMetadata {
  /**
   * Field key/name (must match property in DTO)
   */
  key: string;

  /**
   * Display label
   */
  label: string;

  /**
   * Field type
   */
  type: FormFieldType;

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Angular validators (use Validators from @angular/forms)
   */
  validators?: ValidatorFn[];

  /**
   * Angular async validators (for server-side validation, uniqueness checks, etc.)
   */
  asyncValidators?: AsyncValidatorFn[];

  /**
   * Initial/default value
   */
  defaultValue?: any;

  /**
   * For select/multiselect/radio: static options
   */
  options?: SelectOption[];

  /**
   * For select/multiselect/radio: function to load options dynamically
   */
  loadOptions?: () => Observable<SelectOption[]>;

  /**
   * Help text displayed below field
   */
  helpText?: string;

  /**
   * CSS class for field wrapper
   */
  cssClass?: string;

  /**
   * Whether field is disabled
   */
  disabled?: boolean;

  /**
   * Whether field is read-only
   */
  readonly?: boolean;

  /**
   * Custom attributes for the input element
   */
  attributes?: Record<string, any>;

  /**
   * Transform value from item to form value
   * Used when loading an item into the form (e.g., convert object arrays to ID arrays)
   * @example
   * valueTransformer: (item) => item.permissions?.map(p => p.name) || []
   */
  valueTransformer?: (item: any) => any;
}

/**
 * Table column configuration
 */
export interface TableColumnMetadata<T = any> {
  /**
   * Column key (property name in DTO)
   */
  key: string;

  /**
   * Display label for column header
   */
  label: string;

  /**
   * Whether column is sortable
   */
  sortable?: boolean;

  /**
   * Custom function to get value from item
   * Use this for computed values or nested properties
   * @example
   * valueGetter: (role) => role.permissions?.length || 0
   */
  valueGetter?: (item: T) => any;

  /**
   * Custom function to format value for display
   * @example
   * formatter: (value) => value ? 'Yes' : 'No'
   */
  formatter?: (value: any) => string;

  /**
   * CSS class for column cells
   */
  cssClass?: string;

  /**
   * Column width (CSS value: '100px', '20%', 'auto')
   */
  width?: string;
}
