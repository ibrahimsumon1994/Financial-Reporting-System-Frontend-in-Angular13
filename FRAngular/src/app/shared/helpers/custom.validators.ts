import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AsyncValidationService } from '../services/async-validation.service';

export class CustomValidators {
  // Number only validation
  static numeric(control: AbstractControl) {
    const val = control.value;
    if (val === null || val === '') {
      return null;
    }
    const pattern = /^[0-9]+(\.?[0-9]+)?$/;
    if (!val.toString().match(pattern)) {
      return { invalidNumber: true };
    }
    return null;
  }

  static isIdentityExist(
    asyncValidationService: AsyncValidationService,
    fieldName: string
  ): AsyncValidatorFn {


    return (
      control: AbstractControl
    ):
      | Promise<ValidationErrors | null>
      | Observable<ValidationErrors | null> => {
        return new Observable(obs => obs.next({invalidIdentity: false}))
      return asyncValidationService
        .isIdentityValid({ [fieldName]: control.value })
        .pipe(
          map(isValid => {
            return !isValid ? { invalidIdentity: true } : {invalidIdentity: false};
          })
        );
    };
  }

  static requiredIf(controlName: string, value: any): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const targetControl = control.parent && control.parent.get(controlName);
      if (targetControl && targetControl.value === value) {
        if (!control.value) {
          return { requiredIf: true };
        }
        return null;
      }
      return null;
    };
  }

  static match(controlName: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const targetControl = control.parent && control.parent.get(controlName);
      if (!targetControl || targetControl.value !== control.value) {
        return { match: true };
      }
      return null;
    };
  }

  static removeSpaces(control: AbstractControl) {
    if (control && control.value && !control.value.replace(/\s/g, '').length) {
      control.setValue('');
    }
    return null;
  }
}
