import { Injectable, signal } from '@angular/core';
import { IAlert } from '../interfaces/IAlert';

@Injectable({
  providedIn: 'root'
})
export class AlertasService {

  alert = signal<IAlert | null>(null);

  success(mensaje: string) {
    this.show('success', mensaje);
  }

  error(mensaje: string) {
    this.show('danger', mensaje);
  }

  warning(mensaje: string) {
    this.show('warning', mensaje);
  }

  info(mensaje: string) {
    this.show('info', mensaje);
  }

  private show(tipo: IAlert['tipo'], mensaje: string) {
    this.alert.set({ tipo, mensaje });

    setTimeout(() => {
      this.alert.set(null);
    },  4500);
  }

}
