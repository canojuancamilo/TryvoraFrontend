// src/app/core/services/cache.service.ts
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number; // Tiempo de vida en milisegundos
  etag?: string; // Para validación con el servidor
}

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cache = new Map<string, CacheEntry>();
  private readonly DEFAULT_TTL = 300000; // 5 minutos por defecto
  private readonly MAX_CACHE_SIZE = 100; // Máximo número de entradas

  constructor() {
    // Limpiar caché expirada cada minuto
    if (!environment.production) {
      setInterval(() => this.clearExpired(), 60000);
    }
  }

  /**
   * Obtener dato del caché
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Verificar si expiró
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Guardar dato en caché
   */
  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL, etag?: string): void {
    // Controlar tamaño del caché
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      this.evictOldest();
    }

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
      etag
    };

    this.cache.set(key, entry);
    
    // Log en desarrollo
    if (!environment.production) {
      console.log(`📦 Cache SET: ${key}`, { size: this.cache.size });
    }
  }

  /**
   * Verificar si existe y no ha expirado
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }

    if (this.isExpired(entry)) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Eliminar una entrada específica
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Limpiar todo el caché
   */
  clear(): void {
    this.cache.clear();
    if (!environment.production) {
      console.log('🧹 Cache cleared');
    }
  }

  /**
   * Limpiar entradas expiradas
   */
  clearExpired(): void {
    let expiredCount = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) {
        this.cache.delete(key);
        expiredCount++;
      }
    }

    if (expiredCount > 0 && !environment.production) {
      console.log(`🧹 Cleared ${expiredCount} expired entries`);
    }
  }

  /**
   * Limpiar caché por patrón (ej: /api/users/*)
   */
  clearByPattern(pattern: RegExp): void {
    let deletedCount = 0;
    
    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        this.cache.delete(key);
        deletedCount++;
      }
    }

    if (deletedCount > 0 && !environment.production) {
      console.log(`🧹 Cleared ${deletedCount} entries matching pattern`, pattern);
    }
  }

  /**
   * Actualizar TTL de una entrada
   */
  touch(key: string, ttl: number = this.DEFAULT_TTL): boolean {
    const entry = this.cache.get(key);
    
    if (entry && !this.isExpired(entry)) {
      entry.timestamp = Date.now();
      entry.ttl = ttl;
      return true;
    }
    
    return false;
  }

  /**
   * Obtener estadísticas del caché
   */
  getStats(): CacheStats {
    const stats: CacheStats = {
      size: this.cache.size,
      maxSize: this.MAX_CACHE_SIZE,
      entries: [],
      memoryEstimate: 0
    };

    let totalSize = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      const entrySize = new Blob([JSON.stringify(entry)]).size;
      totalSize += entrySize;
      
      stats.entries.push({
        key,
        age: Date.now() - entry.timestamp,
        ttl: entry.ttl,
        size: entrySize,
        expired: this.isExpired(entry)
      });
    }

    stats.memoryEstimate = totalSize;
    
    return stats;
  }

  /**
   * Obtener ETag para validación
   */
  getEtag(key: string): string | undefined {
    const entry = this.cache.get(key);
    return entry?.etag;
  }

  /**
   * Verificar si una entrada está expirada
   */
  private isExpired(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  /**
   * Eliminar la entrada más antigua
   */
  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTimestamp = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTimestamp) {
        oldestTimestamp = entry.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
      if (!environment.production) {
        console.log(`🗑️ Evicted oldest entry: ${oldestKey}`);
      }
    }
  }
}

export interface CacheStats {
  size: number;
  maxSize: number;
  entries: CacheEntryStats[];
  memoryEstimate: number;
}

export interface CacheEntryStats {
  key: string;
  age: number;
  ttl: number;
  size: number;
  expired: boolean;
}