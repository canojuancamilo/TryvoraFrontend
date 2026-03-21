// src/app/core/interceptors/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service'; // ← IMPORTAR
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const tokenService = inject(TokenService); // ← INYECTAR
  const router = inject(Router);
  
  // No interceptar peticiones de autenticación
  if (req.url.includes('/auth/login') || req.url.includes('/auth/refresh-token')) {
    return next(req);
  }

  // Usar TokenService para obtener el token
  const token = tokenService.getToken();
  
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return next(authReq).pipe(
      catchError((error) => {
        if (error.status === 401 && !req.url.includes('/auth/logout')) {
          // Token expirado - intentar refresh
          if (!req.url.includes('/auth/refresh') ) {
            return authService.refreshToken().pipe(
              switchMap((newToken) => {
                // Reintentar con nuevo token
                const newReq = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${newToken}`,
                    'Content-Type': 'application/json'
                  }
                });
                return next(newReq);
              }),
              catchError((refreshError) => {
                tokenService.clearTokens();
                router.navigate(['/login'], {
                  queryParams: { sessionExpired: true }
                });
                return throwError(() => refreshError);
              })
            );
          }
        }
        return throwError(() => error);
      })
    );
  }
  
  return next(req);
};