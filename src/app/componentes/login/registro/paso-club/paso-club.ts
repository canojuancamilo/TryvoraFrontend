import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { RegistroService } from '../../../../servicios/registro.service';
import { CampoTexto } from "../../../../shared/componentes/inputs/campo-texto/campo-texto";
import { CampoDropDown } from "../../../../shared/componentes/inputs/campo-dropdown/campo-dropdown";
import { CampoAreaTexto } from "../../../../shared/componentes/inputs/campo-area-texto/campo-area-texto";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-paso-club',
  imports: [ReactiveFormsModule, CampoTexto, CampoDropDown, CampoAreaTexto],
  templateUrl: './paso-club.html',
  styleUrl: './paso-club.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasoClub implements OnInit {
  private fb = inject(FormBuilder);
  private registroService = inject(RegistroService);
  private destroyRef = inject(DestroyRef);

  clubForm: FormGroup;

  opcionesDeportes = [
    { valor: 'futbol', label: '⚽ Fútbol' },
    { valor: 'futsal', label: '🥅 Fútbol Sala' },
    { valor: 'baloncesto', label: '🏀 Baloncesto' },
    { valor: 'voleibol', label: '🏐 Voleibol' },
    { valor: 'natacion', label: '🏊 Natación' },
    { valor: 'atletismo', label: '🏃 Atletismo' },
    { valor: 'tenis', label: '🎾 Tenis' },
    { valor: 'rugby', label: '🏉 Rugby' },
    { valor: 'hockey', label: '🏑 Hockey' },
    { valor: 'otro', label: '🏅 Otro' }
  ];

  constructor() {
    this.clubForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      deporte: ['', Validators.required],
      ciudad: ['', [Validators.required, Validators.minLength(2)]],
      telefono: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      direccion: [''],
      descripcion: ['']
    });
  }

  ngOnInit(): void {
    // Cargar datos guardados desde la señal
    const data = this.registroService.data();
    if (data.club) {
      this.clubForm.patchValue(data.club, { emitEvent: false });
    }

    // Guardar cambios automáticamente con debounce
    this.clubForm.valueChanges.pipe(
      debounceTime(300),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(value => {
      this.registroService.updateClubData(value);
    });
  }

  onSiguiente(): void {

    if (this.clubForm.invalid) {
      Object.keys(this.clubForm.controls).forEach(key => {
        const control = this.clubForm.get(key);
        control?.markAsTouched();
      });

      return;
    }

    this.registroService.nextStep();
  }
}
