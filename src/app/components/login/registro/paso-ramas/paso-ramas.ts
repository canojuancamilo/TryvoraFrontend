// app/pages/registro/componentes/paso-ramas/paso-ramas.component.ts
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  DestroyRef,
  computed,
  signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { BranchCard } from '../branch-card/branch-card';
import { CampoTexto } from '../../../../shared/componentes/inputs/campo-texto/campo-texto';
import { RegistroService } from '../../../../core/services/registro.service';

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

  esMasculina = signal<boolean>(false);
  esFemenina = signal<boolean>(false);

  // Señales computadas (podemos crear getters o signals computadas)
  tieneRamasSeleccionadas = computed(() =>
    this.esMasculina() || this.esFemenina()
  );

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
    if (rama === 'masculina') {
      this.esMasculina.set(value);
    } else {
      this.esFemenina.set(value);
    }

    // Actualizar formulario en una sola operación
    const update: any = { [rama]: value };

    // Si se deselecciona, limpiar el nombre
    if (!value) {
      const nombreCampo = rama === 'masculina' ? 'nombreMasculina' : 'nombreFemenina';
      update[nombreCampo] = '';
    }

    this.ramasForm.patchValue(update);
  }

  onAnterior(): void {
    this.registroService.prevStep();
  }

  onSiguiente(): void {
    this.registroService.nextStep();
  }
}