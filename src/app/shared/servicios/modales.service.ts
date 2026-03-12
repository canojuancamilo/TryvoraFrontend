import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalesService {
  mensaje = signal<string | null>(null);
  titulo = signal<string | null>(null);
  type = signal<string>("primary");
  ocultarCancelar = signal<boolean>(false);

  private onConfirm?: () => void;

  confirm(titulo: string, mensaje: string, confirmaCallBack: () => void, ocultarCancelar: boolean =  false) {
    this.mensaje.set(mensaje);
    this.titulo.set(titulo);
    this.onConfirm = confirmaCallBack;
  }

  aceptar() {
    if (this.onConfirm) {
      this.onConfirm();
    }
  }

  cerrar() {
    this.titulo.set(null);
    this.mensaje.set(null);
    this.onConfirm = undefined;
  }

}