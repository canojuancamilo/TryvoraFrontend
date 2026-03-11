import {
  Component,
  computed,
  effect,
  input,
  signal,
  ChangeDetectionStrategy,
  NgZone,
  inject,
} from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-validation',
  standalone: true,
  templateUrl: './form-validation.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[style.display]': 'hasError() ? null : "none"' },
})
export class FormValidationComponent {
  private ngZone = inject(NgZone);

  control = input<AbstractControl | null>(null);
  label = input<string>('Campo');

  private controlState = signal({
    touched: false,
    dirty: false,
    errors: null as any,
    value: null as any,
  });

  hasError = computed(() => {
    const state = this.controlState();
    return !!state.errors && (state.touched || state.dirty);
  });

  constructor() {
    effect((onCleanup) => {
      const ctrl = this.control();
      if (!ctrl) return;

      this.updateState(ctrl);

      const statusSub = ctrl.statusChanges.subscribe(() => {
        this.updateState(ctrl);
      });

      const valueSub = ctrl.valueChanges.subscribe(() => {
        this.updateState(ctrl);
      });

      const checkInterval = this.ngZone.runOutsideAngular(() => {
        return setInterval(() => {
          const current = this.controlState();
          if (
            current.touched !== ctrl.touched ||
            current.dirty !== ctrl.dirty
          ) {
            this.ngZone.run(() => {
              this.updateState(ctrl);
            });
          }
        }, 50);
      });

      onCleanup(() => {
        statusSub.unsubscribe();
        valueSub.unsubscribe();
        clearInterval(checkInterval);
      });
    });
  }

  private updateState(ctrl: AbstractControl): void {
    this.controlState.set({
      touched: ctrl.touched,
      dirty: ctrl.dirty,
      errors: ctrl.errors,
      value: ctrl.value,
    });
  }

  errorMessage = computed(() => {
  const state = this.controlState();
  
  if ((!state.touched && !state.dirty) || !state.errors) return null;
  
  const label = this.label();
  const errors = state.errors;
  const errorKey = Object.keys(errors)[0];
  
  if (!errorKey) return null;
  
  switch (errorKey) {
    case 'required':
      return `${label} es obligatorio.`;
    
    case 'email':
      return `${label} debe ser un correo válido.`;
    
    case 'minlength':
      return `${label} debe tener al menos ${errors['minlength'].requiredLength} caracteres.`;
    
    case 'maxlength':
      return `${label} no puede exceder ${errors['maxlength'].requiredLength} caracteres.`;
    
    case 'pattern':
      return `${label} tiene un formato inválido.`;
    
    case 'contenedorInvalido':
      return `El ${label} no es válido.`;

    case 'nonZero':
      return `El ${label} es obligatorio.`;
    
    default:
      return `${label} contiene un error (${errorKey}).`;
  }
});
}
