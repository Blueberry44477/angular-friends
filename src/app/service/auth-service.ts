import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
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
  private accessTokenData: AccessTokenDTO | null = null;

  // Access Token -------------------------------------------------------------
  public setAccessTokenData(data: AccessTokenDTO): void {
    this.accessTokenData = data;
  }
  
  public getAccessTokenData(): AccessTokenDTO | null {
    return this.accessTokenData ? this.accessTokenData : null;
  }
  public getAccessToken(): string | null {
    return this.accessTokenData ? this.accessTokenData.accessToken : null;
  }

  public isAuthenticated(): boolean { return this.accessTokenData !== null; }

  public logout(): void {
    this.accessTokenData = null;
    this.router.navigate(['/sign-in']);
  }

  // Auth
  public signIn(signInData: SignInData): Observable<AccessTokenDTO> {
    return this.http.post<AccessTokenDTO>(`${this.apiUrl}/signin`, signInData)
                    .pipe(tap((response) => { this.setAccessTokenData(response); }));
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

  public refreshTokens(): Observable<AccessTokenDTO> {
    return this.http.post<AccessTokenDTO>(`${this.apiUrl}/refresh`, {}, { withCredentials: true })
                    .pipe(tap((accessTokenDto) => { this.setAccessTokenData(accessTokenDto) }));
  }
}
