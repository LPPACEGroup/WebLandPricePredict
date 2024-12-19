import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function PasswordMatchValidator(password: string, confirmPassword: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const passwordControl = control.get(password);
    const confirmPasswordControl = control.get(confirmPassword);

    if (!passwordControl || !confirmPasswordControl) {
      return null; // Return if controls are missing
    }

    if (confirmPasswordControl.errors && !confirmPasswordControl.errors['passwordMismatch']) {
      return null; // Return if other errors exist
    }

    // Check if passwords match
    if (passwordControl.value !== confirmPasswordControl.value) {
            
      confirmPasswordControl.setErrors({ passwordMismatch: true });
    } else {
      confirmPasswordControl.setErrors(null);
    }

    return null; // Always return null for the group-level validator
  };
}
