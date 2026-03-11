import { Component, computed, inject, input, output, viewChild } from '@angular/core';
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormValidationComponent } from '../../form-validation/form-validation';
import { CamposService } from '../../../servicios/campos/campos.service';

export type TipoCampo = 'text' | 'password' | 'number';

@Component({
  selector: 'app-campo-texto',
  imports: [FormValidationComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './campo-texto.html',
})
export class CampoTexto {
  camposService = inject(CamposService);

  nombreCampo = input.required<string>();
  controlForm = input.required<AbstractControl>();
  placeholder = input<string>("");
  type = input<TipoCampo>("text");
  esDecimal = input<boolean>(false);
  blur = output<void>();

  ngOnInit() {
    this.agregarValidadorNoCero();
  }

  validationComp = viewChild(FormValidationComponent);

  get formControlGet(): FormControl {
    return this.camposService.formControlGet(this.controlForm());
  }

  hasError = computed(() => {
    const validator = this.validationComp();
    return validator?.hasError() || false;
  });

  formato = computed(() => {
    return this.esDecimal() ? "n2" : "n0";
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

  private agregarValidadorNoCero() {
    const control = this.formControlGet;
    
    if (this.type() === 'number' && this.esRequerido()) {
      const validadoresExistentes = control.validator ? [control.validator] : [];
      
      const validadorNoCero = (c: AbstractControl) => {
        if (c.value === 0 || c.value === '0' || c.value === 0.0) {
          return { nonZero: true };
        }
        return null;
      };

      control.setValidators([...validadoresExistentes, validadorNoCero]);
      control.updateValueAndValidity();
    }
  }
}