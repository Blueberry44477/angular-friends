import { AbstractControl, ValidatorFn } from "@angular/forms";

export function minAgeValidator(minAge: number): ValidatorFn {
    return (control: AbstractControl) => {
        if (!control.value) {
            return null;
        }

        const birthDate = new Date(control.value);
        const today = new Date();

        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
        }

        return age >= minAge ? null : { underage: { requiredAge: minAge, actualAge: age } };
    };
}