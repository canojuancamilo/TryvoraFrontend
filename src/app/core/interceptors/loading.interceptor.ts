// src/app/core/interceptors/loading.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  
  // Ignorar ciertas peticiones (opcional)
  if (req.url.includes('/health') || req.url.includes('/poll')) {
    return next(req);
  }
  
  loadingService.showLoading();
  
  return next(req).pipe(
    finalize(() => loadingService.hideLoading())
  );
};