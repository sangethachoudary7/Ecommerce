import { Directive } from '@angular/core';
import {
  NG_VALIDATORS,
  AbstractControl,
  ValidationErrors,
  Validator,
} from '@angular/forms';

@Directive({
  selector: '[appCustomPasswordValidator]',
  standalone: true,
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: CustomPasswordValidatorDirective,
      multi: true,
    },
  ],
})
export class CustomPasswordValidatorDirective implements Validator {
  constructor() {}
  validate(control: AbstractControl): ValidationErrors | null {
    const passWord = control.value;

    if (!passWord) {
      return { required: 'Password is required' };
    }
    // Custom validation logic (example: minimum 8 characters, one uppercase letter, one lowercase letter,  one number)
    const hasUpperCase = /[A-Z]/.test(passWord);
    const hasLowerCase = /[a-z]/.test(passWord);
    const hasNumeric = /[0-9]/.test(passWord);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(passWord);
    const hasMinLength = passWord.length >= 8;

    // if (!hasUpperCase || !hasNumeric || !hasMinLength || !hasLowerCase) {
    //   return { customPasswordValidator: true }; // Return error object
    // }
    // return null; // Return null if valid

    const validationErrors: ValidationErrors = {};
    if (!hasUpperCase) {
      validationErrors['uppercase'] =
        'Password must contain at least one uppercase letter';
    }

    if (!hasLowerCase) {
      validationErrors['lowercase'] =
        'Password must contain at least one lowercase letter';
    }

    if (!hasNumeric) {
      validationErrors['numeric'] = 'Password must contain at least one number';
    }

    if (!hasMinLength) {
      validationErrors['minLength'] =
        'Password must be at least 8 characters long';
    }

    // Return the object if any validation errors are present
    return Object.keys(validationErrors).length ? validationErrors : null;
  }
}
