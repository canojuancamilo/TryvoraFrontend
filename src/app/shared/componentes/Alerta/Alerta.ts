import { Component, inject } from '@angular/core';
import { AlertasService } from '../../servicios/alertas.service';

@Component({
  selector: 'app-alerta',
  imports: [],
  templateUrl: './Alerta.html'
})
export class Alerta {
  alertService = inject(AlertasService);
 }
