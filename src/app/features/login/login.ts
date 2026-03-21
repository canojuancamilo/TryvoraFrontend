import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Contexto } from '../../components/login/contexto/contexto';
import { CampoTexto } from '../../shared/componentes/inputs/campo-texto/campo-texto';
import { CampoCheck } from '../../shared/componentes/inputs/campo-check/campo-check';
import { AuthService } from '../../core/services/auth.service';

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
  authService = inject(AuthService);
  router = inject(Router);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      remember: [false]
    });
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated() && this.authService.authState().user) {
      this.authService.redirigirSegunRol(this.authService.authState().user!);
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
    const { email, password, remember } = this.loginForm.value;
    this.authService.login(email, password, remember);
    this.isLoading = false;
  }  
}