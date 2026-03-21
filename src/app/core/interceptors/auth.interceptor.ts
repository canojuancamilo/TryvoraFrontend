import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service'; 
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const tokenService = inject(TokenService); 
  const router = inject(Router);
  
  if (req.url.includes('/auth/login') || req.url.includes('/auth/Refresh-token')) {
    return next(req);
  }

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
          if (!req.url.includes('/auth/Refresh-token') ) {
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