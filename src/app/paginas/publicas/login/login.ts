import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Contexto } from '../../../componentes/login/contexto/contexto';
import { CampoTexto } from '../../../shared/componentes/inputs/campo-texto/campo-texto';
import { CampoCheck } from "../../../shared/componentes/inputs/campo-check/campo-check";
import { AlertasService } from '../../../shared/servicios/alertas.service';

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

  fb = inject(FormBuilder)
  alertaServices = inject(AlertasService)

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false]
    });
  }

  ngOnInit(): void {
   
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

    // Simular llamada API
    setTimeout(() => {
      this.isLoading = false;

      // Aquí iría la lógica real de autenticación
      // Si el login es exitoso:
      // this.router.navigate(['/dashboard']);
    }, 1800);
  }
}