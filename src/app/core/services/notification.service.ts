import { Injectable, signal, computed } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private toasts = signal<Toast[]>([]);
  
  public readonly activeToasts = computed(() => this.toasts());
  public readonly hasToasts = computed(() => this.toasts().length > 0);
  
  show(message: string, type: ToastType = 'info', duration: number = 3000): void {
    const id = this.generateId();
    const toast: Toast = { id, message, type, duration };
    
    this.toasts.update(current => [...current, toast]);
    
    if (duration > 0) {
      setTimeout(() => this.remove(id), duration);
    }
  }
  
  success(message: string, duration?: number): void {
    this.show(message, 'success', duration);
  }
  
  error(message: string, duration?: number): void {
    this.show(message, 'error', duration);
  }
  
  warning(message: string, duration?: number): void {
    this.show(message, 'warning', duration);
  }
  
  info(message: string, duration?: number): void {
    this.show(message, 'info', duration);
  }
  
  remove(id: string): void {
    this.toasts.update(current => current.filter(t => t.id !== id));
  }
  
  clear(): void {
    this.toasts.set([]);
  }
  
  private generateId(): string {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}