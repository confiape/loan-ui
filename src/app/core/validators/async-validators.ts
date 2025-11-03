import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime, switchMap, first } from 'rxjs/operators';

/**
 * Creates an async validator that checks if a value is unique
 * by calling a validation function
 *
 * @param checkFn Function that returns true if value is unique (available)
 * @param currentValue Current value when editing (to exclude from uniqueness check)
 * @param debounceMs Debounce time in milliseconds (default: 500ms)
 * @returns AsyncValidatorFn
 *
 * @example
 * ```typescript
 * const nameControl = new FormControl('', {
 *   validators: [Validators.required],
 *   asyncValidators: [
 *     uniqueValueValidator(
 *       (value) => this.service.isNameAvailable(value),
 *       this.editingItem()?.name // Exclude current name when editing
 *     )
 *   ]
 * });
 * ```
 */
export function uniqueValueValidator(
  checkFn: (value: string) => Observable<boolean>,
  currentValue?: string | null,
  debounceMs = 500,
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    // Don't validate if empty (let required validator handle that)
    if (!control.value) {
      return of(null);
    }

    // Don't validate if value hasn't changed (when editing)
    if (currentValue && control.value === currentValue) {
      return of(null);
    }

    return of(control.value).pipe(
      debounceTime(debounceMs),
      switchMap((value) => checkFn(value)),
      map((isUnique) => (isUnique ? null : { notUnique: true })),
      catchError(() => of(null)), // On error, don't block form
      first(),
    );
  };
}
