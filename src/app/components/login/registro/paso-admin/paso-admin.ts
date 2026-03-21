import {
  ChangeDetectionStrategy,
  Component,
  inject,
  DestroyRef,
  signal,
  effect
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { CampoCheck } from "../../../../shared/componentes/inputs/campo-check/campo-check";
import { CampoTexto } from "../../../../shared/componentes/inputs/campo-texto/campo-texto";
import { PasswordStrength } from "../password-strength/password-strength";
import { RegistroService } from '../../../../core/services/registro.service';
import { ScrollErrorDirective } from "../../../../core/directives/scroll-error.directive";

@Component({
  selector: 'app-paso-admin',
  standalone: true,
  imports: [CampoCheck, CampoTexto, PasswordStrength, ReactiveFormsModule, ScrollErrorDirective],
  templateUrl: './paso-admin.html',
  styleUrls: ['./paso-admin.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasoAdmin {
  private fb = inject(FormBuilder);
  private registroService = inject(RegistroService);
  private destroyRef = inject(DestroyRef);

  showPassword = signal(false);
  showConfirmPassword = signal(false);
  isSubmitting = signal(false);
  isValid = signal(false);
  adminForm: FormGroup;

  constructor() {
    this.adminForm = this.fb.group({
      nombres: ['', [Validators.required, Validators.minLength(2)]],
      apellidos: ['', [Validators.required, Validators.minLength(2)]],
      documento: ['', [Validators.required, Validators.minLength(5)]],
      telefono: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      aceptaTerminos: [false, Validators.requiredTrue],
      aceptaComunicaciones: [false]
    }, { validators: this.passwordMatchValidator });

    effect(() => {
      const data = this.registroService.data();
      if (data.admin) {
        this.adminForm.patchValue(data.admin, { emitEvent: false });
      }
      this.isValid.set(this.adminForm.valid);
    });

    this.adminForm.valueChanges.pipe(
      debounceTime(300),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(value => {
      this.registroService.updateAdminData(value);
      this.isValid.set(this.adminForm.valid);
    });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      control.get('confirmPassword')?.setErrors({
        ...control.get('confirmPassword')?.errors,
        passwordMismatch: true
      });
      return { passwordMismatch: true };
    }

    if (control.get('confirmPassword')?.errors) {
      const errors = { ...control.get('confirmPassword')?.errors };
      delete errors['passwordMismatch'];
      control.get('confirmPassword')?.setErrors(Object.keys(errors).length ? errors : null);
    }

    return null;
  }

  togglePassword(): void {
    this.showPassword.update(value => !value);
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword.update(value => !value);
  }

  onAnterior(): void {
    this.registroService.prevStep();
  }

  onSubmit(): void {
    if (this.adminForm.invalid) {
      Object.keys(this.adminForm.controls).forEach(key => {
        const control = this.adminForm.get(key);
        control?.markAsTouched();
      });

      return;
    }

    this.isSubmitting.set(true);
    this.registroService.submitRegistro();
    this.isSubmitting.set(false);
  }
}