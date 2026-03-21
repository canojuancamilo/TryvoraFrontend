// services/loading.service.ts
import { Injectable, signal, computed, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  // Usamos solo signals para mantener consistencia con zoneless
  private activeRequests = signal(0);
  private messages = signal<string[]>([]);
  
  // Computed values para el estado del loading
  readonly isLoading = computed(() => this.activeRequests() > 0);
  readonly currentMessage = computed(() => {
    const messages = this.messages();
    return messages.length > 0 ? messages[messages.length - 1] : 'Cargando información';
  });
  
  // Para debug (eliminar en producción)
  constructor() {
    effect(() => {
      console.log('[LoadingService] Estado:', {
        activeRequests: this.activeRequests(),
        isLoading: this.isLoading(),
        message: this.currentMessage(),
        messages: this.messages()
      });
    });
  }

  showLoading(message?: string): void {
    console.log('[LoadingService] showLoading llamado', { message });
    
    // Incrementar contador
    this.activeRequests.update(count => count + 1);
    
    // Agregar mensaje si se proporcionó
    if (message) {
      this.messages.update(msgs => [...msgs, message]);
    }
  }

  hideLoading(): void {
    console.log('[LoadingService] hideLoading llamado');
    
    // Decrementar contador (nunca menor a 0)
    this.activeRequests.update(count => Math.max(0, count - 1));
    
    // Si no hay peticiones activas, limpiar mensajes
    if (this.activeRequests() === 0) {
      this.messages.set([]);
    } else {
      // Si hay más peticiones, solo quitar el último mensaje
      this.messages.update(msgs => msgs.slice(0, -1));
    }
  }
  
  // Método para resetear en caso de error
  reset(): void {
    console.log('[LoadingService] reset llamado');
    this.activeRequests.set(0);
    this.messages.set([]);
  }
}