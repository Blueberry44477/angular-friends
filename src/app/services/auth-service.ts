import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

interface SignInData {
  email: string,
  password: string
}

interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  dob: string;
  sex: string;
  country: string;
  city: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:8080/api/v1/auth';

  private _isAuthenticated = signal<boolean>(this.hasToken());
  public isAuthenticated = this._isAuthenticated.asReadonly();

  public signIn(data: SignInData): Observable<string> {
    return this.http.post(`${this.apiUrl}/signin`, data, {responseType: 'text'}).pipe(
      tap((token) => {
        localStorage.setItem('token', token);
        this._isAuthenticated.set(true);
      })
    );
  }

  public signUp(data: SignUpData): Observable<void> {
    const body = {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      password: data.password,
      dob: data.dob,
      phone: data.phone,
      sex: data.sex,
      country: data.country,
      city: data.city
    }

    return this.http.post<void>(`${this.apiUrl}/signup`, body);
  }

  public logout(): void {
    localStorage.removeItem('token');
    this._isAuthenticated.set(false);
    this.router.navigate(['/sign-in']);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }
}
