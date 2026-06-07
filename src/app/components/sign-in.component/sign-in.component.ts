import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sign-in',
  imports: [ReactiveFormsModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
})
export class SignInComponent {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  public isLoading = signal<boolean>(false);
  public isPasswordVisible = signal<boolean>(false);

  public signInForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(10)]]
  });

  public onSubmit(): void {
    if (this.signInForm.invalid) {
      this.signInForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    this.authService.signIn(this.signInForm.getRawValue()).subscribe({
      next: () => {
        this.snackBar.open('Sign In successful!', 'Close', { duration: 3000 });
        this.signInForm.reset();
        
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading.set(false);

        switch (err.status) {
          case 401:
            this.snackBar.open('Invalid email or password', 'Close', { duration: 5000 });
            this.signInForm.patchValue({password: ''});
            this.signInForm.controls['password'].markAsUntouched();
            break;

          default:
            this.snackBar.open('An unexpected error occurred', 'Close', { duration: 5000 });
            break;
        }
      }
    });
  }
}
