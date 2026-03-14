// src/app/core/guards/role.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService, UserRole } from '../services/auth.service';

export const RoleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // Verificar autenticación
  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url }
    });
  }
  
  // Obtener roles requeridos y CASTEAR a UserRole[]
  const requiredRoles = route.data['roles'] as UserRole[];
  
  // Si no hay roles requeridos, permitir acceso
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }
  
  // Ahora requiredRoles es UserRole[], no string[]
  if (authService.hasAnyRole(requiredRoles)) {
    return true;
  }
  
  // No tiene los roles necesarios
  return router.createUrlTree(['/unauthorized'], {
    queryParams: {
      reason: 'role',
      required: requiredRoles.join(', '),
      userRoles: authService.getUserRoles().join(', '),
      returnUrl: state.url
    }
  });
};