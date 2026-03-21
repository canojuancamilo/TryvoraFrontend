import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  function getErrorMessage(error: HttpErrorResponse): string {
    debugger;
    if (error.error?.errors) {
      const firstError = Object.values(error.error.errors)[0];
      if (Array.isArray(firstError) && firstError.length) {
        return firstError[0];
      }
    }

    switch (error.status) {
      case 0: return 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
      case 400: return 'La solicitud no pudo ser procesada. Verifica los datos ingresados.';
      case 401: return 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
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