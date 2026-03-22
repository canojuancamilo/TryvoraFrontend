import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export interface PermissionGuardData {
  permissions: string | string[];
  mode?: 'all' | 'any';
  redirectTo?: string;
  message?: string;
}

export const permissionGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login'], {
      queryParams: {
        returnUrl: state.url,
        reason: 'auth_required'
      }
    });
  }

  const guardData = route.data['permissionGuard'] as PermissionGuardData;
  const requiredPermissions = guardData?.permissions || route.data['permissions'];
  const mode = guardData?.mode || 'any';
  const redirectTo = guardData?.redirectTo || '/unauthorized';

  if (!requiredPermissions ||
    (Array.isArray(requiredPermissions) && requiredPermissions.length === 0)) {
    return true;
  }

  const permissionsArray = Array.isArray(requiredPermissions)
    ? requiredPermissions
    : [requiredPermissions];

  let hasPermission = false;

  if (mode === 'all')
    hasPermission = authService.canAll(permissionsArray);
  else
    hasPermission = authService.canAny(permissionsArray);

  if (hasPermission)
    return true;

  return router.createUrlTree([redirectTo], {
    queryParams: {
      reason: 'permission',
      required: permissionsArray.join(', '),
      userPermissions: authService.getUserPermissions().join(', '),
      mode: mode,
      returnUrl: state.url,
      message: guardData?.message || null
    }
  });
};