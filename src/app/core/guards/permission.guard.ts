// src/app/core/guards/permission.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export interface PermissionGuardData {
  permissions: string | string[];  // Permisos requeridos
  mode?: 'all' | 'any';             // 'all' = necesita todos, 'any' = necesita al menos uno (default: 'any')
  redirectTo?: string;              // Dónde redirigir si no tiene permisos (default: '/unauthorized')
  message?: string;                  // Mensaje personalizado
}

export const permissionGuard: CanActivateFn = (route, state) => {
    debugger;
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // Verificar autenticación primero
  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login'], {
      queryParams: { 
        returnUrl: state.url,
        reason: 'auth_required'
      }
    });
  }
  
  // Obtener datos del guard
  const guardData = route.data['permissionGuard'] as PermissionGuardData;
  const requiredPermissions = guardData?.permissions || route.data['permissions'];
  const mode = guardData?.mode || 'any';
  const redirectTo = guardData?.redirectTo || '/unauthorized';
  
  // Si no hay permisos requeridos, permitir acceso
  if (!requiredPermissions || 
      (Array.isArray(requiredPermissions) && requiredPermissions.length === 0)) {
    return true;
  }
  
  // Normalizar permisos a array
  const permissionsArray = Array.isArray(requiredPermissions) 
    ? requiredPermissions 
    : [requiredPermissions];
  
  // Verificar permisos según el modo
  let hasPermission = false;
  
  if (mode === 'all') {
    // Necesita TODOS los permisos
    hasPermission = authService.canAll(permissionsArray);
  } else {
    // Necesita AL MENOS UNO
    hasPermission = authService.canAny(permissionsArray);
  }
  
  if (hasPermission) {
    return true;
  }
  
  // No tiene permisos - redirigir
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