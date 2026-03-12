import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  loading = signal(false);

  mostrar() {
    this.loading.set(true);
  }

  ocultar() {
    this.loading.set(false);
  }
}
