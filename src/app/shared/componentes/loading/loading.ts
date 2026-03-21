import { Component, inject, OnInit } from '@angular/core';
import { LoadingService } from '../../../core/services/loading.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  imports: [CommonModule],
  templateUrl: './loading.html',
  styleUrl:'./loading.css'
})
export class Loading implements OnInit {
  private loadingService = inject(LoadingService);
  
  isLoading$ = this.loadingService.loading$;
  showOverlay = false;
  loadingMessage = 'Cargando';
  showLongWaitMessage = false;
  private longWaitTimeout: any;

  ngOnInit(): void {
    this.isLoading$.subscribe(isLoading => {
      if (isLoading) {
        this.showOverlay = true;
        this.loadingMessage = this.getRandomMessage();
        
        // Si la carga toma más de 3 segundos, mostrar mensaje adicional
        this.longWaitTimeout = setTimeout(() => {
          if (isLoading) {
            this.showLongWaitMessage = true;
          }
        }, 3000);
      } else {
        this.showOverlay = false;
        this.showLongWaitMessage = false;
        if (this.longWaitTimeout) {
          clearTimeout(this.longWaitTimeout);
        }
      }
    });
  }
  
  private getRandomMessage(): string {
    const messages = [
      'Cargando',
      'Preparando todo',
      'Casi listo',
      'Obteniendo datos',
      'Procesando solicitud'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }
}
