import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class CamposService {

  formControlGet(controlForm: AbstractControl): FormControl {
    if (!(controlForm instanceof FormControl)) {
      return new FormControl();
    }

    return controlForm as FormControl;
  }

  esRequerido(control: FormControl) {
    const validators = control.validator;

    if (!validators) return false;

    const testControl = new FormControl(null, validators);
    const errors = testControl.errors;

    return errors && errors['required'] === true;
  };

  controlName(control: FormControl) {
    if (!control?.parent) return null;

    const parent = control.parent as FormGroup;
    const controlName = Object.keys(parent.controls)
      .find(key => parent.get(key) === control);

    return controlName || null;
  };
}