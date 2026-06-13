import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, Observable, tap } from 'rxjs';
import { AccessTokenDTO } from '../dto/access-token-dto';

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
  private readonly apiUrl = 'http://localhost:8080/api/v1/auth';
  private accessTokenData = signal<AccessTokenDTO | null>(null);
  public isAuthenticated = computed(() => this.accessTokenData() !== null);

  // Access Token -------------------------------------------------------------
  public setAccessTokenData(data: AccessTokenDTO | null): void {
    this.accessTokenData.set(data);
  }
  
  public getAccessTokenData(): AccessTokenDTO | null {
    return this.accessTokenData();
  }

  public getAccessToken(): string | null {
    return this.accessTokenData()?.accessToken ?? null;
  }
  
  // Auth
  public signIn(signInData: SignInData): Observable<AccessTokenDTO> {
    return this.http.post<AccessTokenDTO>(`${this.apiUrl}/sign-in`, signInData, { withCredentials: true })
    .pipe(tap((accessTokenDTO) => { this.setAccessTokenData(accessTokenDTO); }));
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
    
    return this.http.post<void>(`${this.apiUrl}/sign-up`, body);
  }
  
  public signOut(): void {
    this.http.post<void>(`${this.apiUrl}/sign-out`, {}, { withCredentials: true })
             .pipe(finalize(() => {
                this.accessTokenData.set(null);
                this.router.navigate(['/sign-in']);
             }))
             .subscribe();
  }

  public refreshTokens(): Observable<AccessTokenDTO> {
    return this.http.post<AccessTokenDTO>(`${this.apiUrl}/refresh`, {}, { withCredentials: true })
                    .pipe(tap((accessTokenDTO) => { this.setAccessTokenData(accessTokenDTO) }));
  }
}
