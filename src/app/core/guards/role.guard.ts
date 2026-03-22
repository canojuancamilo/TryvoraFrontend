import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const RoleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url }
    });
  }
  
  const requiredRoles = route.data['roles'] as string[];
  
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }
  
  if (authService.hasAnyRole(requiredRoles)) {
    return true;
  }
  
  return router.createUrlTree(['/unauthorized'], {
    queryParams: {
      reason: 'role',
      required: requiredRoles.join(', '),
      userRoles: authService.getUserRoleNames().join(', '),
      returnUrl: state.url
    }
  });
};