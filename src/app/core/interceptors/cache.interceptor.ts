// src/app/core/interceptors/cache.interceptor.ts
import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { of, tap } from 'rxjs';
import { CacheService } from '../services/cache.service';

// Configuración de caché por endpoint
const CACHE_CONFIG = new Map<string, { ttl: number }>([
  ['/api/products', { ttl: 300000 }], // 5 minutos
  ['/api/categories', { ttl: 3600000 }], // 1 hora
  ['/api/configuration', { ttl: 86400000 }] // 24 horas
]);

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
  const cacheService = inject(CacheService);
  
  // Solo cachear GET requests
  if (req.method !== 'GET') {
    return next(req);
  }
  
  // Verificar si el endpoint debe cachearse
  let shouldCache = false;
  let ttl = 0;
  
  for (const [endpoint, config] of CACHE_CONFIG.entries()) {
    if (req.url.includes(endpoint)) {
      shouldCache = true;
      ttl = config.ttl;
      break;
    }
  }
  
  if (!shouldCache) {
    return next(req);
  }
  
  // Crear clave de caché (incluye query params)
  const cacheKey = `${req.method}:${req.url}`;
  
  // Intentar obtener de caché
  const cachedResponse = cacheService.get(cacheKey);
  
  if (cachedResponse) {
    return of(new HttpResponse({
      body: cachedResponse,
      status: 200,
      headers: req.headers
    }));
  }
  
  // Si no está en caché, hacer la petición y cachear
  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        cacheService.set(cacheKey, event.body, ttl);
      }
    })
  );
};