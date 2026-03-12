import { Component, computed, inject, input, output, viewChild } from '@angular/core';
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormValidationComponent } from '../../form-validation/form-validation';
import { CamposService } from '../../../servicios/campos.service';

@Component({
  selector: 'app-campo-area-texto',
  imports: [FormValidationComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './campo-area-texto.html',
  styleUrl: './campo-area-texto.css'
})
export class CampoAreaTexto {
  camposService = inject(CamposService);

  nombreCampo = input.required<string>();
  controlForm = input.required<AbstractControl>();

  placeholder = input<string>("");
  type = input<string>("text");
  filas = input<number>(4);
  
  blur = output<void>();

  validationComp = viewChild(FormValidationComponent);

  get formControlGet(): FormControl {
    return this.camposService.formControlGet(this.controlForm());
  }

  hasError = computed(() => {
    const validator = this.validationComp();
    return validator?.hasError() || false;
  });

  controlName = computed(() => {
    return this.camposService.controlName(this.formControlGet);
  });

  esRequerido = computed(() => {
    return this.camposService.esRequerido(this.formControlGet);
  });

  onBlur() {
    this.blur.emit();
  }
}