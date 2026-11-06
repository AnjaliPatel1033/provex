import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

interface LoginResponse { success: boolean; token: string; admin: { email: string }; expiresIn: number; }
@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly url = `${environment.apiUrl}/admin`;
  get token(): string | null { return sessionStorage.getItem('provex_admin_token'); }
  get isAuthenticated(): boolean { return !!this.token; }
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.url}/login`, { email, password }).pipe(tap(res => sessionStorage.setItem('provex_admin_token', res.token)));
  }
  logout(): void { sessionStorage.removeItem('provex_admin_token'); void this.router.navigate(['/admin/login']); }
}
