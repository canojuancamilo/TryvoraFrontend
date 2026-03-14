// src/app/pages/login/login.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Contexto } from '../../components/login/contexto/contexto';
import { CampoTexto } from '../../shared/componentes/inputs/campo-texto/campo-texto';
import { CampoCheck } from '../../shared/componentes/inputs/campo-check/campo-check';
import { AlertasService } from '../../shared/servicios/alertas.service';
import { AuthService } from '../../core/services/auth.service'; // Ajusta la ruta según tu estructura

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, Contexto, CampoTexto, CampoCheck],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit {
  loginForm: FormGroup;
  showPassword = false;
  isLoading = false;

  fb = inject(FormBuilder);
  alertaServices = inject(AlertasService);
  authService = inject(AuthService); // Inyecta AuthService
  router = inject(Router);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false]
    });
  }

  ngOnInit(): void {
    // Si ya está autenticado, redirigir al dashboard
    if (this.authService.isAuthenticated()) {
      this.redirigirSegunRol(this.authService.getUserInfo());
    }
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
    
    // Extraer credenciales del formulario
    const { email, password } = this.loginForm.value;
    
    // Usar el método de login del AuthService
    this.authService.loginMock(email, password).subscribe({
      next: (user) => {
        this.isLoading = false;
        
        // Redirigir según el rol del usuario
        this.redirigirSegunRol(user);
      },
      error: (error) => {
        this.isLoading = false;
        this.alertaServices.error('Credenciales inválidas');
      }
    });
  }
  
  private redirigirSegunRol(user: any): void {
    if (user.roles.includes('super-admin')) {
      this.router.navigate(['/super-admin']);
    } else if (user.roles.includes('admin')) {
      this.router.navigate(['/admin-club']);
    } else if (user.roles.includes('tesorero')) {
      this.router.navigate(['/tesorero-dashboard']);
    } else {
      this.router.navigate(['/tesorero-dashboard']);
    }
  }
}