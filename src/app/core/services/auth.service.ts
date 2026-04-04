import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api.config';
import { ApiEnvelope, AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'vaultwise_token';
  private readonly currentUserKey = 'vaultwise_user';
  readonly isAuthenticated = signal<boolean>(this.hasToken());

  constructor(private readonly http: HttpClient) {}

  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<ApiEnvelope<AuthResponse>>(`${API_BASE_URL}${API_ENDPOINTS.auth}/login`, payload)
      .pipe(
        map((response) => response.data),
        tap((response) => this.persistSession(response))
      );
  }

  register(payload: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<ApiEnvelope<AuthResponse>>(`${API_BASE_URL}${API_ENDPOINTS.auth}/register`, payload)
      .pipe(map((response) => response.data));
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.currentUserKey);
    this.isAuthenticated.set(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUser(): { id: number; name: string; email: string } | null {
    const raw = localStorage.getItem(this.currentUserKey);
    return raw ? JSON.parse(raw) : null;
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }

  private persistSession(response: AuthResponse): void {
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.currentUserKey, JSON.stringify(response.user));
    this.isAuthenticated.set(true);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }
}
