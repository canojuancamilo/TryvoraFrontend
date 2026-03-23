import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';
import { IClubBasico } from '../../../core/interfaces/apis/auth/ILogin';
import { IUser } from '../../../core/interfaces/apis/auth/IUser';

export interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge?: number;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class Sidebar {
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);

  isOpen = input<boolean>(true);
  isMobile = input<boolean>(false);

  toggleSidebar = output<void>();

  usuarioInfo = input.required<IUser | null>();

  isUserMenuOpen = signal(false);


  // mainNavItems = signal<NavItem[]>([
  //   { label: 'Dashboard', icon: 'bi-grid-1x2-fill', route: '/dashboard' },
  //   { label: 'Jugadores', icon: 'bi-people-fill', route: '/jugadores', badge: 124 },
  //   { label: 'Entrenadores', icon: 'bi-person-badge-fill', route: '/entrenadores' },
  //   { label: 'Tesoreros', icon: 'bi-wallet2', route: '/tesoreros' },
  //   { label: 'Pagos', icon: 'bi-credit-card-fill', route: '/pagos', badge: 8 },
  //   { label: 'Notificaciones', icon: 'bi-bell-fill', route: '/notificaciones', badge: 3 },
  //   { label: 'Configuración', icon: 'bi-gear-fill', route: '/configuracion' }
  // ]);
 mainNavItems = signal<NavItem[]>([]);

  constructor() {
    effect(() => {
      const rol = this.usuarioInfo()?.roles[0]?.nombre;

      if (rol == 'super-admin') {
        this.mainNavItems.set([
          { label: 'Dashboard', icon: 'bi-grid-1x2-fill', route: '/' }
        ]);
      }

      if (rol == 'club-admin') {
        this.mainNavItems.set([
          { label: 'Dashboard', icon: 'bi-grid-1x2-fill', route: '/' },
          { label: 'Tesoreros', icon: 'bi-wallet2', route: '/entrenadores' }
        ]);
      }

      if (rol == 'tesorero') {
        this.mainNavItems.set([
          { label: 'Dashboard', icon: 'bi-grid-1x2-fill', route: '/' }
        ]);
      }

      if (rol == 'jugador') {
        this.mainNavItems.set([
          { label: 'Dashboard', icon: 'bi-grid-1x2-fill', route: '/' }
        ]);
      }
    });



  }

  sidebarClass = computed(() => ({
    'sidebar': true,
    'collapsed': !this.isOpen() && !this.isMobile(),
    'mobile-open': this.isOpen() && this.isMobile()
  }));


  goToProfile(): void {
    this.router.navigate(['/perfil']);
    this.isUserMenuOpen.set(false);

    // Si es móvil, cerrar sidebar
    if (this.isMobile()) {
      this.onToggle();
    }
  }

  /**
   * Navega a la configuración
   */
  goToSettings(): void {
    this.router.navigate(['/configuracion']);
    this.isUserMenuOpen.set(false);

    // Si es móvil, cerrar sidebar
    if (this.isMobile()) {
      this.onToggle();
    }
  }

  /**
   * Maneja el cierre de sesión
   */
  onLogout(): void {
    this.isUserMenuOpen.set(false);
    this.notificationService.info('Cerrando sesión...');

    // Aquí iría la lógica real de logout
    this.authService.logout();

    // Simulación
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1500);
  }

  // ===== MÉTODOS PARA MANEJO DE CLICKS =====

  /**
   * Maneja el click en el usuario (versión simplificada)
   * Alternativa: usar este método en lugar del menú desplegable
   */
  onUserClick(): void {
    // Versión 1: Navegar directamente al perfil
    this.goToProfile();

    // Versión 2: Alternar menú desplegable (descomentar si prefieres menú)
    // this.toggleUserMenu();
  }

  /**
   * Alterna el menú desplegable del usuario
   */
  toggleUserMenu(): void {
    this.isUserMenuOpen.update(open => !open);
  }

  onLogoClick(): void {
    this.router.navigate(['/']);

    if (this.isMobile()) {
      this.onToggle();
    }
  }

  /**
   * Maneja el click en la información del club
   */
  onClubInfoClick(): void {
    this.router.navigate(['/club-info']);
    this.notificationService.info(`Club: ${this.usuarioInfo()?.clubInfo?.nombre}`);
  }

  /**
   * Maneja el click en un item de navegación
   */
  onNavItemClick(item: NavItem): void {
    // Si es móvil, cerrar sidebar después de navegar
    if (this.isMobile()) {
      this.onToggle();
    }
  }

  /**
   * Cierra el menú del usuario
   */
  closeUserMenu(): void {
    this.isUserMenuOpen.set(false);
  }

  /**
   * Emite el evento para toggle del sidebar
   */
  onToggle(): void {
    this.toggleSidebar.emit();
  }
}