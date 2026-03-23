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
  private fb = inject(FormBuilder);
  private registroService = inject(RegistroService);
  private destroyRef = inject(DestroyRef);

  ramasForm: FormGroup = this.fb.group({
    masculina: [false],
    femenina: [false],
    nombreMasculina: [''],
    nombreFemenina: ['']
  });

  esMasculina = signal<boolean>(false);
  esFemenina = signal<boolean>(false);

  tieneRamasSeleccionadas = computed(() =>
    this.esMasculina() || this.esFemenina()
  );

  ngOnInit(): void {
    this.cargarDatosGuardados();    
    this.sincronizarSignalsConFormulario();    
    this.guardarCambiosAutomaticos();
  }

  private cargarDatosGuardados(): void {
    const data = this.registroService.data();
    
    if (data.ramas) {
      this.ramasForm.patchValue(data.ramas, { emitEvent: false });      
      this.esMasculina.set(data.ramas.masculina || false);
      this.esFemenina.set(data.ramas.femenina || false);
    }
  }

  private sincronizarSignalsConFormulario(): void {
    this.ramasForm.get('masculina')?.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(value => {
      this.esMasculina.set(value);
    });

    this.ramasForm.get('femenina')?.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(value => {
      this.esFemenina.set(value);
    });
  }

  private guardarCambiosAutomaticos(): void {
    this.ramasForm.valueChanges.pipe(
      debounceTime(300),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(value => {
      this.registroService.updateRamasData(value);
    });
  }

  onToggleRama(rama: 'masculina' | 'femenina', value: boolean): void {    
    const update: any = { [rama]: value };
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