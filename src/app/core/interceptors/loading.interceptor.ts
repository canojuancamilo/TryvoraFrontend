import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  
  const ignoredUrls = ['/health', '/poll', '/metrics'];
  if (ignoredUrls.some(url => req.url.includes(url))) {
    return next(req);
  }
  
  let loadingMessage = getLoadingMessage(req.url, req.method);
  
  if (req.method === 'POST') {
    loadingMessage = 'Guardando información';
  } else if (req.method === 'PUT') {
    loadingMessage = 'Actualizando datos';
  } else if (req.method === 'DELETE') {
    loadingMessage = 'Eliminando registro';
  } else if (req.method === 'GET') {
    loadingMessage = getLoadingMessage(req.url);
  }
  
  loadingService.showLoading(loadingMessage);
  
  return next(req).pipe(
    finalize(() => loadingService.hideLoading())
  );
};

function getLoadingMessage(url: string, method?: string): string {
  if (url.includes('Departamentos')) return 'Cargando departamentos';
  if (url.includes('Ciudadades')) return 'Cargando ciudades';
  if (url.includes('Deportes')) return 'Cargando deportes';
  if (url.includes('registro')) return 'Procesando registro';
  if (url.includes('login')) return 'Iniciando sesión';
  return 'Cargando información';
}