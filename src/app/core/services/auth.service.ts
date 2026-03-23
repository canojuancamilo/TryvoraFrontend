import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { TokenService } from './token.service';
import { environment } from '../../../environments/environment';
import { AuthApiService } from './apis/auth.api.services';
import { ILogin, IPermiso, IRol } from '../interfaces/apis/auth/ILogin';
import { IUser } from '../interfaces/apis/auth/IUser';
import { IAuthState } from '../interfaces/apis/auth/IAuthState';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  tokenService = inject(TokenService);
  uthApiService = inject(AuthApiService);
  http = inject(HttpClient);
  router = inject(Router);

  public authState = signal<IAuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  });

  public user = computed(() => this.authState().user);
  public isAuthenticated = computed(() => this.authState().isAuthenticated);
  public isLoading = computed(() => this.authState().isLoading);
  public error = computed(() => this.authState().error);

  constructor() {
    this.loadStoredUser();
  }

  login(email: string, password: string, recordarSesion: boolean) {
    const data: ILogin = {
      email: email,
      password: password,
      recordarSesion: recordarSesion
    };

    this.uthApiService.login(data).subscribe({
      next: (result) => {
        this.tokenService.setToken(result.data.token);
        this.tokenService.setRefreshToken(result.data.refreshToken);
        this.setUser({
          id: result.data.usuarioId,
          username: result.data.username,
          email: result.data.email,
          nombre: result.data.nombre,
          apellido: result.data.apellido,
          roles: result.data.roles,
          permissions: result.data.permisos,
          avatar: result.data.avatar,
          token: result.data.token,
          refreshToken: result.data.refreshToken,
          expiresIn: result.data.expiration,
          clubInfo: result.data.clubActivo
        });

        this.redirigirSegunRol(this.authState().user!);
      }
    });
  }

  public redirigirSegunRol(user: IUser): void {
    if (!user || !user.roles || !Array.isArray(user.roles)) {
      this.router.navigate(['/login']);
      return;
    }

    const roleNames = user.roles.map(rol => rol.nombre);

    if (roleNames.includes('super-admin')) {
      this.router.navigate(['/super-admin']);
    }
    else if (roleNames.includes('club-admin')) {
      this.router.navigate(['/admin-club']);
    }
    else if (roleNames.includes('liga-admin')) {
      this.router.navigate(['/admin-liga']);
    }
    else if (roleNames.includes('tesorero')) {
      this.router.navigate(['/tesorero-dashboard']);
    }
    else if (roleNames.includes('entrenador')) {
      this.router.navigate(['/entrenador-dashboard']);
    }
    else if (roleNames.includes('jugador')) {
      this.router.navigate(['/jugador-dashboard']);
    }
    else {
      this.router.navigate(['/dashboard']);
    }
  }


  logout(): void {
    if (this.isAuthenticated()) {
      this.uthApiService.logout().subscribe({});
    }

    this.tokenService.clearTokens();
    this.clearUser();
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<string> {
    const refreshToken = this.tokenService.getRefreshToken();

    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<{ token: string }>(
    `${environment.apiUrl}/auth/Refresh-token`,
    { refreshToken }, 
    { 
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': environment.apiKey
      }
    }
  ).pipe(
    map(response => response.token),
    tap(token => this.tokenService.setToken(token)),
    catchError(error => {
      this.logout();
      return throwError(() => error);
    })
  );
  }

  // ============== MÉTODOS DE ROLES ==============

  getUserRoles(): IRol[] {
    return this.authState().user?.roles || [];
  }

  getUserRoleNames(): string[] {
    return this.getUserRoles().map(rol => rol.nombre);
  }

  hasRole(roleName: string): boolean {
    const userRoles = this.getUserRoles();
    return userRoles.some(rol => rol.nombre === roleName);
  }

  hasAnyRole(roleNames: string[]): boolean {
    const userRoles = this.getUserRoles();
    return roleNames.some(roleName =>
      userRoles.some(rol => rol.nombre === roleName)
    );
  }

  hasAllRoles(roleNames: string[]): boolean {
    const userRoles = this.getUserRoles();
    return roleNames.every(roleName =>
      userRoles.some(rol => rol.nombre === roleName)
    );
  }

  hasRol(rol: IRol): boolean {
    return this.hasRole(rol.nombre);
  }

  hasAnyRol(roles: IRol[]): boolean {
    const roleNames = roles.map(r => r.nombre);
    return this.hasAnyRole(roleNames);
  }

  hasAllRols(roles: IRol[]): boolean {
    const roleNames = roles.map(r => r.nombre);
    return this.hasAllRoles(roleNames);
  }

  isAdmin(): boolean {
    return this.hasAnyRole(['super-admin', 'club-admin']);
  }

  isLigaAdmin(): boolean {
    return this.hasRole('liga-admin');
  }

  isTesorero(): boolean {
    return this.hasRole('tesorero');
  }

  isManager(): boolean {
    return this.hasAnyRole(['super-admin', 'club-admin', 'tesorero', 'liga-admin']);
  }

  isSuperAdmin(): boolean {
    return this.hasRole('super-admin');
  }

  isEntrenador(): boolean {
    return this.hasRole('entrenador');
  }

  isJugador(): boolean {
    return this.hasRole('jugador');
  }

  hasFinancialAccess(): boolean {
    return this.hasAnyRole(['super-admin', 'club-admin', 'tesorero', 'liga-admin']);
  }

  // ============== MÉTODOS DE PERMISOS ==============

  getUserPermissions(): IPermiso[] {
    return this.authState().user?.permissions || [];
  }

  getUserPermissionNames(): string[] {
    return this.getUserPermissions().map(p => p.nombre);
  }

  hasPermission(permissionName: string): boolean {
    return this.getUserPermissionNames().includes(permissionName);
  }

  hasPermiso(permiso: IPermiso): boolean {
    return this.hasPermission(permiso.nombre);
  }

  can(resource: string, action: string): boolean {
    if (this.isSuperAdmin()) return true;

    const permissionString = `${resource}:${action}`;
    return this.hasPermission(permissionString);
  }

  canAny(permissions: string[]): boolean {
    if (this.isSuperAdmin()) return true;
    return permissions.some(p => this.hasPermission(p));
  }

  canAll(permissions: string[]): boolean {
    if (this.isSuperAdmin()) return true;
    return permissions.every(p => this.hasPermission(p));
  }

  canWithPermisos(resource: string, action: string): boolean {
    const permissionString = `${resource}:${action}`;
    return this.hasPermission(permissionString) || this.isSuperAdmin();
  }
  // ============== MÉTODOS DE GESTIÓN DE USUARIO ==============

  /**
   * Obtener información del usuario
   */
  getUserInfo(): Observable<IUser> {
    return this.http.get<IUser>(`${environment.apiUrl}/auth/me`).pipe(
      tap(user => {
        this.setUser(user);
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Cambiar contraseña
   */
  changePassword(currentPassword: string, newPassword: string): Observable<boolean> {
    return this.http.post<{ success: boolean }>(
      `${environment.apiUrl}/auth/change-password`,
      { currentPassword, newPassword }
    ).pipe(
      map(response => response.success),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  private setUser(user: IUser): void {
    this.authState.update(state => ({
      ...state,
      user,
      isAuthenticated: true,
      error: null
    }));

    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  /**
   * Actualizar usuario parcialmente
   */
  private updateUser(userData: Partial<IUser>): void {
    const currentUser = this.authState().user;
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      this.setUser(updatedUser);
    }
  }

  /**
   * Limpiar usuario del estado
   */
  private clearUser(): void {
    this.authState.set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
    localStorage.removeItem('currentUser');
  }

  private loadStoredUser(): void {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      try {
        const user = JSON.parse(stored);
        this.setUser(user);
      } catch (e) {
        localStorage.removeItem('currentUser');
      }
    }
  }
}