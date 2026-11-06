import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AdminAuthService } from './admin-auth.service';

export const adminAuthInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(AdminAuthService);
  const token = auth.token;
  const outgoing = token && request.url.includes('/api/admin/') && !request.url.endsWith('/login')
    ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : request;
  return next(outgoing).pipe(catchError(error => {
    if (error.status === 401 && request.url.includes('/api/admin/') && !request.url.endsWith('/login')) auth.logout();
    return throwError(() => error);
  }));
};
