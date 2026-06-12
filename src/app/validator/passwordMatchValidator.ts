import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get("password");
    const passwordConfirm = control.get("passwordConfirm");
    
    if (!password || !passwordConfirm) {
        return null;
    }

    if (password.value !== passwordConfirm.value) {
        passwordConfirm.setErrors({ passwordMismatch : true });
        return { passwordMismatch : true };
    }

    // Clear the specific error if they do match, while preserving other errors.
    if (passwordConfirm.hasError("passwordMismatch")) {
        const errors = passwordConfirm.errors;
        if (errors) {
            delete errors["passwordMismatch"];
            passwordConfirm.setErrors(Object.keys(errors).length ? errors : null);
        }
    }

    return null;
}