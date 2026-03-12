// app/pages/registro/componentes/paso-ramas/paso-ramas.component.ts
import { 
  ChangeDetectionStrategy, 
  Component, 
  OnInit, 
  inject, 
  DestroyRef 
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { BranchCard } from '../branch-card/branch-card';
import { CampoTexto } from '../../../../shared/componentes/inputs/campo-texto/campo-texto';
import { RegistroService } from '../../../../servicios/registro.service';

@Component({
  selector: 'app-paso-ramas',
  standalone: true,
  imports: [ReactiveFormsModule, BranchCard, CampoTexto],
  templateUrl: './paso-ramas.html',
  styleUrls: ['./paso-ramas.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasoRamas implements OnInit {
  // Inyección moderna con inject()
  private fb = inject(FormBuilder);
  private registroService = inject(RegistroService);
  private destroyRef = inject(DestroyRef);
  
  // Formulario
  ramasForm: FormGroup;

  // Señales computadas (podemos crear getters o signals computadas)
  get tieneRamasSeleccionadas(): boolean {
    return this.ramasForm.get('masculina')?.value || this.ramasForm.get('femenina')?.value;
  }

  constructor() {
    // Inicializar formulario
    this.ramasForm = this.fb.group({
      masculina: [false],
      femenina: [false],
      nombreMasculina: [''],
      nombreFemenina: ['']
    });
  }

  ngOnInit(): void {
    // Cargar datos guardados - usando la señal directamente
    const data = this.registroService.data();
    if (data.ramas) {
      this.ramasForm.patchValue(data.ramas, { emitEvent: false });
    }

    // Guardar cambios automáticamente con debounce
    this.ramasForm.valueChanges.pipe(
      debounceTime(300), // Pequeño debounce para mejor rendimiento
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(value => {
      this.registroService.updateRamasData(value);
    });
  }

  onToggleRama(rama: 'masculina' | 'femenina', value: boolean): void {
    this.ramasForm.patchValue({ [rama]: value });
    
    // Si se deselecciona, limpiar el nombre
    if (!value) {
      const nombreCampo = rama === 'masculina' ? 'nombreMasculina' : 'nombreFemenina';
      this.ramasForm.patchValue({ [nombreCampo]: '' });
    }
  }

  onAnterior(): void {
    this.registroService.prevStep();
  }

  onSiguiente(): void {
    // Opcional: validar algo específico antes de avanzar
    this.registroService.nextStep();
  }
}