// src/app/core/interceptors/error.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'Ha ocurrido un error';
      
      if (error.error instanceof ErrorEvent) {
        // Error de cliente
        message = `Error de conexión: ${error.error.message}`;
      } else {
        // Error de servidor
        switch (error.status) {
          case 400: message = 'Solicitud incorrecta'; break;
          case 401: message = 'Sesión expirada'; break;
          case 403: message = 'Acceso prohibido'; break;
          case 404: message = 'Recurso no encontrado'; break;
          case 409: message = 'Conflicto de datos'; break;
          case 422: message = 'Datos inválidos'; break;
          case 500: message = 'Error interno del servidor'; break;
          default: message = `Error ${error.status}`;
        }
      }
      
      snackBar.open(message, 'Cerrar', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
      
      return throwError(() => error);
    })
  );
};