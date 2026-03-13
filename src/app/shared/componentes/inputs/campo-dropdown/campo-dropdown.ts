import { Component, computed, effect, inject, input, output, signal, viewChild } from '@angular/core';
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormValidationComponent } from '../../form-validation/form-validation';
import { CamposService } from '../../../servicios/campos.service';

@Component({
  selector: 'app-campo-dropdown',
  standalone: true,
  imports: [FormValidationComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './campo-dropdown.html',
  styleUrl: './campo-dropdown.css'
})
export class CampoDropDown {

  camposService = inject(CamposService);

  nombreCampo = input.required<string>();
  controlForm = input.required<AbstractControl>();

  opciones = input.required<any[]>();
  textoOpciones = input.required<string>();
  keyOpciones = input.required<string>();

  placeholder = input<string>("Seleccionar...");
  filterable = input<boolean>(false);

  blur = output<void>();

  validationComp = viewChild(FormValidationComponent);

  opcionesFiltradas = signal<any[]>([]);

  get formControlGet(): FormControl {
    return this.camposService.formControlGet(this.controlForm());
  }

  constructor() {

    effect(() => {

      const datos = this.opciones() ?? [];
      this.opcionesFiltradas.set(datos);

      const formControl = this.formControlGet;
      const valorActual = formControl.value;

      const tienePlaceholder = !!this.placeholder();

      if (!tienePlaceholder && datos.length && (valorActual === null || valorActual === undefined)) {
        formControl.setValue(datos[0][this.keyOpciones()], { emitEvent: false });
      }

    });

  }

  hasError = computed(() => {
    const validator = this.validationComp();
    return validator?.hasError() || false;
  });

  esRequerido = computed(() => {
    return this.camposService.esRequerido(this.formControlGet);
  });

  onBlur() {
    this.blur.emit();
  }

  handleFilter(value: string) {

    const datos = this.opciones();

    if (!value) {
      this.opcionesFiltradas.set(datos);
      return;
    }

    const filtered = datos.filter(x =>
      x[this.textoOpciones()]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase())
    );

    this.opcionesFiltradas.set(filtered);

  }

}