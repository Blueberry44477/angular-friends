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
        this.snackBar.open('signIn successful!', 'Close', { duration: 3000 });
        this.signInForm.reset();
        
        setTimeout(() => {
          this.router.navigate(['/app']);
        }, 1000);
      },
      error: (err) => {
        this.isLoading.set(false);
        const message = err.status === 401 ? 'Invalid email or password' : 'An unexpected error occurred';
        this.snackBar.open(message, 'Close', { duration: 5000 });
      }
    });
  }
}
