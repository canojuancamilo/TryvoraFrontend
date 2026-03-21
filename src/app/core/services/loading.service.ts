import { Injectable, signal, computed } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loadingSubject.asObservable();
  
  // Usando signals (moderno)
  private activeRequests = signal(0);
  private pendingMessages = signal<string[]>([]);
  
  isLoading = computed(() => this.activeRequests() > 0);
  currentMessage = computed(() => {
    const messages = this.pendingMessages();
    return messages.length > 0 ? messages[messages.length - 1] : 'Cargando';
  });
  
  private requestsCount = 0;
  private messageTimeout: any;

  showLoading(message?: string): void {
    this.requestsCount++;
    this.activeRequests.set(this.requestsCount);
    
    if (message) {
      this.pendingMessages.update(msgs => [...msgs, message]);
    }
    
    if (this.requestsCount === 1) {
      // Pequeño delay para evitar flashes en peticiones muy rápidas
      setTimeout(() => {
        if (this.requestsCount > 0) {
          this.loadingSubject.next(true);
        }
      }, 100);
    }
  }

  hideLoading(): void {
    this.requestsCount--;
    this.activeRequests.set(this.requestsCount);
    
    if (this.requestsCount === 0) {
      // Delay para asegurar que no hay más peticiones
      setTimeout(() => {
        if (this.requestsCount === 0) {
          this.loadingSubject.next(false);
          this.pendingMessages.set([]); // Limpiar mensajes
        }
      }, 200);
    }
  }
  
  setLoadingMessage(message: string): void {
    this.pendingMessages.update(msgs => [...msgs.slice(0, -1), message]);
  }

  resetLoading(): void {
    this.requestsCount = 0;
    this.activeRequests.set(0);
    this.loadingSubject.next(false);
    this.pendingMessages.set([]);
    if (this.messageTimeout) {
      clearTimeout(this.messageTimeout);
    }
  }
}