import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-unauthorized',
  imports: [],
  templateUrl: './unauthorized.html',
  styleUrl: './unauthorized.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Unauthorized implements OnInit {
  reason: string | null = null;
  requiredRoles: string | null = null;
  userRoles: string | null = null;
  useMaterial = false; // Cambiar a true si usas Angular Material

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Leer parámetros de la URL
    this.route.queryParams.subscribe(params => {
      this.reason = params['reason'] || null;
      this.requiredRoles = params['required'] || null;
      this.userRoles = params['userRoles'] || this.authService.getUserRoles().join(', ');
    });
  }

  getReasonMessage(): string {
    switch(this.reason) {
      case 'role': return 'No tienes el rol necesario';
      case 'permission': return 'No tienes los permisos requeridos';
      case 'auth': return 'Necesitas iniciar sesión';
      default: return 'No tienes acceso a esta sección';
    }
  }

  goBack() {
    window.history.back();
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  logout() {
    this.authService.logout();
  }
}