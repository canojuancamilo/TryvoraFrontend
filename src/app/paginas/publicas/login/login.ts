import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Contexto } from '../../../componentes/login/contexto/contexto';
import { CampoTexto } from '../../../shared/componentes/inputs/campo-texto/campo-texto';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, Contexto, CampoTexto],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit {
  loginForm: FormGroup;
  showPassword = false;
  isLoading = false;
  showError = false;
  errorMessage = 'Credenciales incorrectas. Verifica tu correo y contraseña.';

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false]
    });
  }

  ngOnInit(): void {
    // Auto-focus en email después de que el componente se renderice
    setTimeout(() => {
      const emailInput = document.getElementById('email');
      if (emailInput) emailInput.focus();
    }, 100);
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched)) : false;
  }

  isFieldValid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return field ? (field.valid && (field.dirty || field.touched)) : false;
  }

  shouldShowError(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched)) : false;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return fieldName === 'email' 
          ? 'El correo electrónico es obligatorio.'
          : 'La contraseña es obligatoria.';
      }
      if (field.errors['email']) {
        return 'Introduce un correo válido (ej: admin@miclub.com).';
      }
      if (field.errors['minlength']) {
        return 'Mínimo 6 caracteres.';
      }
    }
    return '';
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    this.showError = false;

    // Simular llamada API
    setTimeout(() => {
      this.isLoading = false;
      this.showError = true;
      
      // Aquí iría la lógica real de autenticación
      // Si el login es exitoso:
      // this.router.navigate(['/dashboard']);
    }, 1800);
  }
}