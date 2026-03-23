// src/app/core/services/token.service.ts
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface TokenPayload {
  id: number;
  username: string;
  roles: string[];
  exp: number; // Expiración
  iat: number; // Emitido en
}

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly TOKEN_EXPIRY_KEY = 'token_expiry';

  constructor() {
    // Limpiar tokens expirados al iniciar
    this.cleanExpiredTokens();
  }

  // ============== TOKEN PRINCIPAL ==============

  /**
   * Guardar token de acceso
   */
  setToken(token: string, expiresIn?: number): void {
    try {
      if (environment.production) {
        // En producción, usar sessionStorage (se borra al cerrar el navegador)
        sessionStorage.setItem(this.TOKEN_KEY, token);
        
        // Guardar expiración si se proporciona
        if (expiresIn) {
          const expiryTime = Date.now() + (expiresIn * 1000);
          sessionStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());
        }
      } else {
        // En desarrollo, usar localStorage (persiste)
        localStorage.setItem(this.TOKEN_KEY, token);
        
        if (expiresIn) {
          const expiryTime = Date.now() + (expiresIn * 1000);
          localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());
        }
      }
    } catch (error) {
      console.error('Error al guardar el token:', error);
    }
  }

  /**
   * Obtener token de acceso
   */
  getToken(): string | null {
    try {
      // Intentar obtener de sessionStorage primero (producción)
      let token = sessionStorage.getItem(this.TOKEN_KEY);
      
      // Si no está en sessionStorage, intentar en localStorage (desarrollo)
      if (!token) {
        token = localStorage.getItem(this.TOKEN_KEY);
      }
      
      // Verificar si el token ha expirado
      if (token && this.isTokenExpired()) {
        this.clearTokens();
        return null;
      }
      
      return token;
    } catch (error) {
      console.error('Error al obtener el token:', error);
      return null;
    }
  }

  /**
   * Verificar si hay token
   */
  hasToken(): boolean {
    return !!this.getToken();
  }

  // ============== REFRESH TOKEN ==============

  /**
   * Guardar refresh token
   */
  setRefreshToken(token: string): void {
    try {
      if (environment.production) {
        // En producción, idealmente debería ser HttpOnly cookie
        // Pero mientras, lo guardamos en sessionStorage
        sessionStorage.setItem(this.REFRESH_TOKEN_KEY, token);
      } else {
        localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
      }
    } catch (error) {
      console.error('Error al guardar refresh token:', error);
    }
  }

  /**
   * Obtener refresh token
   */
  getRefreshToken(): string | null {
    try {
      let token = sessionStorage.getItem(this.REFRESH_TOKEN_KEY);
      if (!token) {
        token = localStorage.getItem(this.REFRESH_TOKEN_KEY);
      }
      return token;
    } catch (error) {
      console.error('Error al obtener refresh token:', error);
      return null;
    }
  }

  // ============== GESTIÓN DE EXPIRACIÓN ==============

  /**
   * Verificar si el token ha expirado
   */
  isTokenExpired(): boolean {
    const expiryTime = this.getTokenExpiry();
    
    if (!expiryTime) {
      // Si no hay tiempo de expiración, asumimos que no ha expirado
      return false;
    }
    
    return Date.now() > expiryTime;
  }

  /**
   * Obtener tiempo de expiración del token
   */
  private getTokenExpiry(): number | null {
    try {
      let expiry = sessionStorage.getItem(this.TOKEN_EXPIRY_KEY);
      if (!expiry) {
        expiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
      }
      
      return expiry ? parseInt(expiry, 10) : null;
    } catch (error) {
      console.error('Error al obtener expiración:', error);
      return null;
    }
  }

  /**
   * Limpiar tokens expirados
   */
  private cleanExpiredTokens(): void {
    if (this.isTokenExpired()) {
      this.clearTokens();
    }
  }

  // ============== DECODIFICAR TOKEN (JWT) ==============

  /**
   * Decodificar token JWT (sin verificar firma)
   */
  decodeToken(): TokenPayload | null {
    const token = this.getToken();
    
    if (!token) {
      return null;
    }
    
    try {
      // Los tokens JWT tienen 3 partes: header.payload.signature
      const parts = token.split('.');
      
      if (parts.length !== 3) {
        console.warn('Token no es un JWT válido');
        return null;
      }
      
      // Decodificar payload (segunda parte)
      const payload = atob(parts[1]);
      return JSON.parse(payload) as TokenPayload;
    } catch (error) {
      console.error('Error al decodificar token:', error);
      return null;
    }
  }

  /**
   * Obtener información del usuario desde el token
   */
  getUserFromToken(): { id: number; username: string; roles: string[] } | null {
    const payload = this.decodeToken();
    
    if (!payload) {
      return null;
    }
    
    return {
      id: payload.id,
      username: payload.username,
      roles: payload.roles || []
    };
  }

  // ============== LIMPIEZA ==============

  /**
   * Limpiar todos los tokens
   */
  clearTokens(): void {
    try {
      // Limpiar sessionStorage
      sessionStorage.removeItem(this.TOKEN_KEY);
      sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
      sessionStorage.removeItem(this.TOKEN_EXPIRY_KEY);
      
      // Limpiar localStorage
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
    } catch (error) {
      console.error('Error al limpiar tokens:', error);
    }
  }

  // ============== MÉTODOS DE UTILIDAD ==============

  /**
   * Verificar si el token está próximo a expirar (menos de 5 minutos)
   */
  isTokenNearExpiry(thresholdMinutes: number = 5): boolean {
    const expiryTime = this.getTokenExpiry();
    
    if (!expiryTime) {
      return false;
    }
    
    const thresholdMs = thresholdMinutes * 60 * 1000;
    return (expiryTime - Date.now()) < thresholdMs;
  }

  /**
   * Obtener tiempo restante del token en segundos
   */
  getTokenRemainingTime(): number {
    const expiryTime = this.getTokenExpiry();
    
    if (!expiryTime) {
      return 0;
    }
    
    const remainingMs = expiryTime - Date.now();
    return Math.max(0, Math.floor(remainingMs / 1000));
  }

  /**
   * Guardar token con expiración personalizada
   */
  setTokenWithCustomExpiry(token: string, expiresInSeconds: number): void {
    this.setToken(token, expiresInSeconds);
  }
}