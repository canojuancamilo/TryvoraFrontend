import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { environment } from '../../../environments/environment';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  function getErrorMessage(error: HttpErrorResponse): string {
    debugger
    if (error.error?.mensaje) {
      return error.error?.mensaje;
    }

    if (error.error?.message && !environment.production) {
      let message = error.error?.message.replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n');

      if (message.includes('--') && message.includes('Severity:')) {
        const cleanMessages = message
          .split('\n')
          .filter((line: string) => line.includes('--'))
          .map((line: string) => line.replace(/^--\s*/, '').replace(/\s*Severity:\s*\w+\.?\s*$/, '').replace('--', '-'))
          .filter((m: string) => m);

        if (cleanMessages.length) {
          return cleanMessages.join('<br>');
        }
      }

      return message.replace(/\n/g, '<br>');
    }

    switch (error.status) {
      case 0: return 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
      case 400: return 'La solicitud no pudo ser procesada. Verifica los datos ingresados.';
      case 401: return error.url?.includes('/Login') ? 'Credenciales invalidas.' : 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
      case 403: return 'No tienes permisos para realizar esta acción.';
      case 404: return 'El recurso solicitado no existe.';
      case 422: return 'Los datos proporcionados no son válidos.';
      case 500: return 'Error interno del servidor. Estamos trabajando para solucionarlo.';
      case 503: return 'El servicio está temporalmente no disponible. Intenta más tarde.';
      default: return `Error ${error.status}: ${error.message || 'Ha ocurrido un error inesperado.'}`;
    }
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = getErrorMessage(error);
      notificationService.error(message, 7000);

      return throwError(() => error);
    })
  );
};