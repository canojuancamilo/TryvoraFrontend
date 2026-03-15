// src/app/core/services/auth.service.ts
import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, tap, delay } from 'rxjs/operators';
import { TokenService } from './token.service';
import { environment } from '../../../environments/environment';

export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: UserRole[];
  permissions: string[];
  avatar?: string;
  token?: string;
  refreshToken?: string;
  expiresIn?: number;
}

export type UserRole = 'super-admin' | 'club-admin' | 'tesorero' | 'jugador';

export interface Permission {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    tokenService = inject(TokenService);

  // Signals para estado reactivo
  private authState = signal<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  });

  // Signals computados
  public user = computed(() => this.authState().user);
  public isAuthenticated = computed(() => this.authState().isAuthenticated);
  public isLoading = computed(() => this.authState().isLoading);
  public error = computed(() => this.authState().error);

  // Getters para roles y permisos (mantener compatibilidad)
  public get currentUser(): User | null {
    return this.authState().user;
  }

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.loadStoredUser();
  }

  // ============== MÉTODOS DE AUTENTICACIÓN ==============

  /**
   * LOGIN - Versión real con backend
   */
  login(username: string, password: string): Observable<User> {
    this.setLoading(true);
    
    return this.http.post<{ user: User; token: string; refreshToken: string }>(
      `${environment.apiUrl}/auth/login`,
      { username, password }
    ).pipe(
      tap(response => {
        this.tokenService.setToken(response.token);
        this.tokenService.setRefreshToken(response.refreshToken);
        this.setUser(response.user);
        this.setLoading(false);
      }),
      map(response => response.user),
      catchError(error => {
        this.setError('Error al iniciar sesión');
        this.setLoading(false);
        return throwError(() => error);
      })
    );
  }

  /**
   * LOGIN SIMULADO (para desarrollo sin backend)
   */
  loginMock(username: string, password: string): Observable<User> {
    this.setLoading(true);
    
    // Simular delay de red
    return of(this.mockAuthenticate(username, password)).pipe(
      delay(1000),
      tap(user => {
        if (user) {
          const token = `fake-jwt-token-${user.id}-${Date.now()}`;
          this.tokenService.setToken(token);
          this.setUser(user);
        }
        this.setLoading(false);
      }),
      map(user => {
        if (!user) throw new Error('Credenciales inválidas');
        return user;
      }),
      catchError(error => {
        this.setError('Credenciales inválidas');
        this.setLoading(false);
        return throwError(() => error);
      })
    );
  }

  /**
   * REGISTRO
   */
  register(userData: Partial<User> & { password: string }): Observable<User> {
    this.setLoading(true);
    
    return this.http.post<{ user: User; token: string }>(
      `${environment.apiUrl}/auth/register`,
      userData
    ).pipe(
      tap(response => {
        this.tokenService.setToken(response.token);
        this.setUser(response.user);
        this.setLoading(false);
      }),
      map(response => response.user),
      catchError(error => {
        this.setError('Error al registrar usuario');
        this.setLoading(false);
        return throwError(() => error);
      })
    );
  }

  /**
   * LOGOUT
   */
  logout(): void {
    // Opcional: notificar al backend
    if (this.isAuthenticated() && !environment.production) {
      this.http.post(`${environment.apiUrl}/auth/logout`, {}).subscribe({
        error: () => {} // Ignorar errores
      });
    }
    
    // Limpiar todo
    this.tokenService.clearTokens();
    this.clearUser();
    this.router.navigate(['/login']);
  }

  /**
   * REFRESH TOKEN
   */
  refreshToken(): Observable<string> {
    const refreshToken = this.tokenService.getRefreshToken();
    
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }
    
    return this.http.post<{ token: string }>(
      `${environment.apiUrl}/auth/refresh`,
      { refreshToken }
    ).pipe(
      map(response => response.token),
      tap(token => this.tokenService.setToken(token)),
      catchError(error => {
        this.logout(); // Si falla refresh, hacer logout
        return throwError(() => error);
      })
    );
  }

  // ============== MÉTODOS DE ROLES ==============

  /**
   * Obtener roles del usuario actual
   */
  getUserRoles(): UserRole[] {
    return this.authState().user?.roles || [];
  }

  /**
   * Verificar si el usuario tiene un rol específico
   */
  hasRole(role: UserRole): boolean {
    return this.getUserRoles().includes(role);
  }

  /**
   * Verificar si el usuario tiene ALGUNO de los roles especificados
   */
  hasAnyRole(roles: UserRole[]): boolean {
    const userRoles = this.getUserRoles();
    return roles.some(role => userRoles.includes(role));
  }

  /**
   * Verificar si el usuario tiene TODOS los roles especificados
   */
  hasAllRoles(roles: UserRole[]): boolean {
    const userRoles = this.getUserRoles();
    return roles.every(role => userRoles.includes(role));
  }

  /**
   * Verificar si el usuario es admin
   */
  isAdmin(): boolean {
    return this.hasAnyRole(['super-admin', 'club-admin']);
  }

  /**
   * Verificar si el usuario es manager o admin
   */
  isManager(): boolean {
    return this.hasAnyRole(['super-admin', 'club-admin', 'tesorero']);
  }

  // ============== MÉTODOS DE PERMISOS ==============

  /**
   * Obtener permisos del usuario actual
   */
  getUserPermissions(): string[] {
    return this.authState().user?.permissions || [];
  }

  /**
   * Verificar si el usuario tiene un permiso específico
   */
  hasPermission(permission: string): boolean {
    return this.getUserPermissions().includes(permission);
  }

  /**
   * Verificar permiso por recurso y acción
   */
  can(resource: string, action: string): boolean {
    const permissionString = `${resource}:${action}`;
    return this.hasPermission(permissionString) || this.isAdmin(); // Admin tiene todos los permisos
  }

  /**
   * Verificar múltiples permisos
   */
  canAny(permissions: string[]): boolean {
    return permissions.some(p => this.hasPermission(p)) || this.isAdmin();
  }

  /**
   * Verificar todos los permisos
   */
  canAll(permissions: string[]): boolean {
    return permissions.every(p => this.hasPermission(p)) || this.isAdmin();
  }

  // ============== MÉTODOS DE GESTIÓN DE USUARIO ==============

  /**
   * Obtener información del usuario
   */
  getUserInfo(): Observable<User> {
    this.setLoading(true);
    
    return this.http.get<User>(`${environment.apiUrl}/auth/me`).pipe(
      tap(user => {
        this.setUser(user);
        this.setLoading(false);
      }),
      catchError(error => {
        this.setError('Error al obtener información del usuario');
        this.setLoading(false);
        return throwError(() => error);
      })
    );
  }

  /**
   * Actualizar perfil
   */
  updateProfile(userData: Partial<User>): Observable<User> {
    this.setLoading(true);
    
    return this.http.patch<User>(
      `${environment.apiUrl}/auth/profile`,
      userData
    ).pipe(
      tap(user => {
        this.updateUser(user);
        this.setLoading(false);
      }),
      catchError(error => {
        this.setError('Error al actualizar perfil');
        this.setLoading(false);
        return throwError(() => error);
      })
    );
  }

  /**
   * Cambiar contraseña
   */
  changePassword(currentPassword: string, newPassword: string): Observable<boolean> {
    this.setLoading(true);
    
    return this.http.post<{ success: boolean }>(
      `${environment.apiUrl}/auth/change-password`,
      { currentPassword, newPassword }
    ).pipe(
      tap(() => this.setLoading(false)),
      map(response => response.success),
      catchError(error => {
        this.setError('Error al cambiar contraseña');
        this.setLoading(false);
        return throwError(() => error);
      })
    );
  }

  // ============== MÉTODOS PRIVADOS ==============

  /**
   * Establecer usuario en el estado
   */
  private setUser(user: User): void {
    this.authState.update(state => ({
      ...state,
      user,
      isAuthenticated: true,
      error: null
    }));
    
    // Guardar en localStorage para persistencia
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  /**
   * Actualizar usuario parcialmente
   */
  private updateUser(userData: Partial<User>): void {
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

  /**
   * Establecer estado de carga
   */
  private setLoading(isLoading: boolean): void {
    this.authState.update(state => ({ ...state, isLoading }));
  }

  /**
   * Establecer error
   */
  private setError(error: string): void {
    this.authState.update(state => ({ ...state, error }));
  }

  /**
   * Cargar usuario almacenado
   */
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

  /**
   * Simulación de autenticación (para desarrollo)
   */
  private mockAuthenticate(username: string, password: string): User | null {
    const mockUsers: User[] = [
      {
        id: 1,
        username: 'super-admin',
        email: 'admin@ejemplo.com',
        firstName: 'Admin',
        lastName: 'Sistema',
        roles: ['super-admin'],
        permissions: ['users:manage', 'products:manage', 'settings:manage', 'dashboard:view'],
        avatar: 'https://ui-avatars.com/api/?name=Admin+Sistema'
      },
      {
        id: 2,
        username: 'admin',
        email: 'manager@ejemplo.com',
        firstName: 'Manager',
        lastName: 'Empresa',
        roles: ['club-admin'],
        permissions: ['products:manage', 'products:create', 'products:edit', 'dashboard:view'],
        avatar: 'https://ui-avatars.com/api/?name=Manager+Empresa'
      },
      {
        id: 3,
        username: 'tesorero',
        email: 'editor@ejemplo.com',
        firstName: 'Editor',
        lastName: 'Contenido',
        roles: ['tesorero'],
        permissions: ['products:edit', 'products:view', 'dashboard:view'],
        avatar: 'https://ui-avatars.com/api/?name=Editor+Contenido'
      },
      {
        id: 4,
        username: 'jugador',
        email: 'user@ejemplo.com',
        firstName: 'Usuario',
        lastName: 'Regular',
        roles: ['jugador'],
        permissions: ['products:view', 'profile:manage'],
        avatar: 'https://ui-avatars.com/api/?name=Usuario+Regular'
      }
    ];

    return mockUsers.find(u => u.username === username) || null;
  }
}