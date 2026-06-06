import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { passwordMatchValidator } from '../../validators/passwordMatchValidator';
import { minAgeValidator } from '../../validators/minAgeValidator';

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  public isLoading = signal(false);

  public signUpForm = this.formBuilder.nonNullable.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(10)]],
    passwordConfirm: ['', [Validators.required, Validators.minLength(10)]],
    dob: ['', [Validators.required, minAgeValidator(12)]],
    sex: ['', [Validators.required]],
    phone: [''],
    country: [''],
    city: ['']
  }, {
    validators: [passwordMatchValidator] // Cross-field validator.
  });

  public onSubmit(): void {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    this.authService.signUp(this.signUpForm.getRawValue()).subscribe({
      next: () => {
        this.snackBar.open("Signup successful!", "Close", { duration: 3000 });
        this.signUpForm.reset();

        setTimeout(() => {
          this.router.navigate(['/sign-in']);
        }, 1000);
      }
    })
  }
}
