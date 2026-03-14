// src/app/app.config.ts
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core'; // 👈 Cambio aquí
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch, withXsrfConfiguration } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';

// Importar interceptores FUNCIONALES
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // ✅ LO MÁS MODERNO: Sin Zone.js
    provideZonelessChangeDetection(),
    
    // Routing
    provideRouter(routes),
    
    // Animaciones
    provideAnimations(),
    
    // HTTP Client con INTERCEPTORES MODERNOS
    provideHttpClient(
      withFetch(),
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN'
      }),
      withInterceptors([
        authInterceptor,
        loadingInterceptor,
        errorInterceptor
      ])
    )
  ]
};