// app/pages/registro/registro.component.ts
import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { RegistroExito } from '../../../componentes/login/registro/registro-exito/registro-exito';
import { PasoAdmin } from '../../../componentes/login/registro/paso-admin/paso-admin';
import { PasoCategorias } from '../../../componentes/login/registro/paso-categorias/paso-categorias';
import { PasoRamas } from '../../../componentes/login/registro/paso-ramas/paso-ramas';
import { PasoClub } from '../../../componentes/login/registro/paso-club/paso-club';
import { RegistroStepper } from '../../../componentes/login/registro/registro-stepper/registro-stepper';
import { RegistroHeader } from '../../../componentes/login/registro/registro-header/registro-header';
import { RegistroNavbar } from '../../../componentes/login/registro/registro-navbar/registro-navbar';
import { RegistroService } from '../../../servicios/registro.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    RegistroNavbar,
    RegistroHeader,
    RegistroStepper,
    PasoClub,
    PasoRamas,
    PasoCategorias,
    PasoAdmin,
    RegistroExito
  ],
  templateUrl: './registro-club.html',
  styleUrls: ['./registro-club.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistroClub {
   private registroService = inject(RegistroService);
  
  // Señal del paso actual
  currentStep = this.registroService.step;
  
  // Señal computada para saber si estamos en la pantalla de éxito
  isSuccessStep = computed(() => this.currentStep() === 5);
  
  // Señal computada para mostrar/ocultar el stepper
  showStepper = computed(() => this.currentStep() < 5);
  
  // Señal computada para el título de la página (opcional)
  pageTitle = computed(() => {
    const step = this.currentStep();
    if (step === 5) return '¡Registro Completado!';
    return 'Registro del Club';
  });
}