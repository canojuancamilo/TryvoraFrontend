// app/pages/registro/registro.component.ts
import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { RegistroNavbar } from '../../components/login/registro/registro-navbar/registro-navbar';
import { RegistroHeader } from '../../components/login/registro/registro-header/registro-header';
import { RegistroStepper } from '../../components/login/registro/registro-stepper/registro-stepper';
import { PasoClub } from '../../components/login/registro/paso-club/paso-club';
import { PasoRamas } from '../../components/login/registro/paso-ramas/paso-ramas';
import { PasoCategorias } from '../../components/login/registro/paso-categorias/paso-categorias';
import { PasoAdmin } from '../../components/login/registro/paso-admin/paso-admin';
import { RegistroExito } from '../../components/login/registro/registro-exito/registro-exito';
import { RegistroService } from '../../core/servicios/registro.service';
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