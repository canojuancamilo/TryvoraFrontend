// src/app/core/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

export const AuthGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  
  if (tokenService.hasToken()) {
    return true;
  }
  
  // Guardar URL para redirigir después del login
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};