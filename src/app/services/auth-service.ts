import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

export interface LoginCredentials {
  email: string,
  password: string
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:8080/api/v1/auth/signin';

  private _isAuthenticated = signal<boolean>(this.hasToken());
  public isAuthenticated = this._isAuthenticated.asReadonly();

  public login(credentials: LoginCredentials): Observable<string> {
    return this.http.post(this.apiUrl, credentials, {responseType: 'text'}).pipe(
      tap((token) => {
        localStorage.setItem('token', token);
        this._isAuthenticated.set(true);
      })
    );
  }

  public logout(): void {
    localStorage.removeItem('token');
    this._isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }
}
