import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { LoadingService } from '../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  
  const ignoredUrls = ['/health', '/poll', '/metrics'];
  if (ignoredUrls.some(url => req.url.includes(url))) {
    return next(req);
  }
  
  const loadingMessage = getLoadingMessage(req.url, req.method);
  
  loadingService.showLoading(loadingMessage);
  
  console.log(`[Interceptor] Iniciando petición: ${req.method} ${req.url}`, loadingMessage);
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error(`[Interceptor] Error en petición: ${req.method} ${req.url}`, error);
      return throwError(() => error);
    }),
    finalize(() => {
      console.log(`[Interceptor] Finalizando petición: ${req.method} ${req.url}`);
      loadingService.hideLoading();
    })
  );
};

function getLoadingMessage(url: string, method?: string): string {
  if (method === 'POST') return 'Guardando información';
  if (method === 'PUT') return 'Actualizando datos';
  if (method === 'DELETE') return 'Eliminando registro';
  if (method === 'GET') return 'Cargando información';
  
  return 'Cargando información';
}