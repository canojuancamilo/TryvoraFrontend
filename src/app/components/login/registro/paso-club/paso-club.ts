import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { CampoTexto } from "../../../../shared/componentes/inputs/campo-texto/campo-texto";
import { CampoDropDown } from "../../../../shared/componentes/inputs/campo-dropdown/campo-dropdown";
import { CampoAreaTexto } from "../../../../shared/componentes/inputs/campo-area-texto/campo-area-texto";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RegistroService } from '../../../../core/services/registro.service';
import { CatalogosApiService } from '../../../../core/services/apis/catalogos.api.service';
import { IDepartamento } from '../../../../core/interfaces/apis/catalogos/IDepartamento';
import { IDeporte } from '../../../../core/interfaces/apis/catalogos/IDeporte';
import { ICiudad } from '../../../../core/interfaces/apis/catalogos/ICiudad';
import { ScrollErrorDirective } from '../../../../core/directives/scroll-error.directive';

@Component({
  selector: 'app-paso-club',
  imports: [ReactiveFormsModule, CampoTexto, CampoDropDown, CampoAreaTexto, ScrollErrorDirective],
  templateUrl: './paso-club.html',
  styleUrl: './paso-club.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasoClub implements OnInit {
  private fb = inject(FormBuilder);
  private registroService = inject(RegistroService);
  private destroyRef = inject(DestroyRef);
  private catalogosApiService = inject(CatalogosApiService);

  opcionesDepartamentos = signal<IDepartamento[]>([]);
  opcionesDeportes = signal<IDeporte[]>([]);
  opcionesCiudades = signal<ICiudad[]>([]);

  clubForm: FormGroup;

  constructor() {
    this.clubForm = this.fb.group({
      nombre: [null, [Validators.required, Validators.minLength(2)]],
      deporteId: [null, Validators.required],
      ciudadId: [null, [Validators.required, Validators.minLength(2)]],
      telefono: [null, [Validators.required, Validators.minLength(6)]],
      email: [null, [Validators.required, Validators.email]],
      direccion: [null],
      descripcion: [null],
      departamentoId: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.cargarCatalogos();

    const data = this.registroService.data();
    if (data.club) {
      this.clubForm.patchValue(data.club, { emitEvent: false });
    }

    this.clubForm.get('departamentoId')!
      .valueChanges
      .pipe(
        debounceTime(300),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((departamentoId) => {

        if (!departamentoId) {
          this.opcionesCiudades.set([]);
          this.clubForm.get('ciudadId')?.setValue(null);
          return;
        }

        this.cargarCiudades(departamentoId);
      });

    if (this.clubForm.get('departamentoId')?.value) {
      this.cargarCiudades(this.clubForm.get('departamentoId')?.value);
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

  cargarCatalogos() {
    this.catalogosApiService.obtenerDepartamentos().subscribe({
      next: (res) => {
        this.opcionesDepartamentos.set(res);
      },
    });

    this.catalogosApiService.obtenerDeportes().subscribe({
      next: (res) => {
        this.opcionesDeportes.set(res);
      },
    });
  }

  cargarCiudades(departamentoId: number) {
    this.catalogosApiService.obtenerCiudades(departamentoId).subscribe({
      next: (res) => {
        this.opcionesCiudades.set(res);
      },
    });
  }
}
