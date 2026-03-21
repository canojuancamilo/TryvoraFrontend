// src/app/app.component.ts
import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Confirm } from "./shared/componentes/Modals/confirm/confirm";
import { Loading } from "./shared/componentes/loading/loading";
import { Toast } from "./shared/componentes/toast/toast";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Confirm, Loading, Toast],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('TryvoraFrontend');
  
  ngOnInit() {
    // Verificar sesión al iniciar
    this.checkInitialAuth();
  }
  
  private checkInitialAuth(): void {
    // Implementar lógica de verificación de token
    console.log('Verificando autenticación inicial...');
  }
}