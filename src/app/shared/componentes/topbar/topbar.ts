// src/app/shared/components/topbar/topbar.component.ts
import { Component, computed, inject, input, output, signal, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { NotificationService } from '../../../servicios/notification.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './topbar.html',
  styleUrls: ['./topbar.css']
})
export class Topbar {
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private elementRef = inject(ElementRef);
  
  // Inputs
  userAvatar = input<string>('CA');
  userName = input<string>('Carlos Administrador');
  userRole = input<string>('Admin del Club');
  notificationCount = input<number>(3);
  
  // Outputs
  toggleSidebar = output<void>();
  search = output<string>();
  
  // Estado
  searchQuery = signal<string>('');
  isUserMenuOpen = signal<boolean>(false);
  
  // Referencias al DOM
  @ViewChild('userMenuButton') userMenuButton!: ElementRef;
  @ViewChild('userDropdownMenu') userDropdownMenu!: ElementRef;
  
  // Señal computada para clases del menú
  userMenuClass = computed(() => ({
    'show': this.isUserMenuOpen()
  }));
  
  /**
   * Alterna el menú de usuario
   */
  toggleUserMenu(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    this.isUserMenuOpen.update(open => !open);
  }
  
  /**
   * Cierra el menú de usuario
   */
  closeUserMenu(): void {
    this.isUserMenuOpen.set(false);
  }
  
  /**
   * Maneja el click en notificaciones
   */
  onNotificationsClick(): void {
    this.notificationService.info('Abriendo notificaciones...');
    
    if (this.notificationCount() > 0) {
      this.notificationService.info(`Tienes ${this.notificationCount()} notificaciones sin leer`);
    } else {
      this.notificationService.info('No tienes notificaciones nuevas');
    }
  }
  
  /**
   * Maneja el toggle del sidebar
   */
  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }
  
  /**
   * Maneja la búsqueda
   */
  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    this.searchQuery.set(value);
    this.search.emit(value);
  }
  
  /**
   * Limpia la búsqueda
   */
  clearSearch(): void {
    this.searchQuery.set('');
    this.search.emit('');
  }
  
  /**
   * Navega al perfil
   */
  goToProfile(): void {
    this.closeUserMenu();
    this.router.navigate(['/perfil']);
  }
  
  /**
   * Navega a configuración
   */
  goToSettings(): void {
    this.closeUserMenu();
    this.router.navigate(['/configuracion']);
  }
  
  /**
   * Maneja el logout
   */
  onLogout(): void {
    this.closeUserMenu();
    this.notificationService.info('Cerrando sesión...');
    
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1500);
  }
  
  // ===== CORRECCIÓN: HostListeners con tipado correcto =====
  
  /**
   * Listener global para cerrar menú al hacer click fuera
   * NOTA: Usamos Event en lugar de MouseEvent porque el evento real puede ser de diferentes tipos
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (this.isUserMenuOpen()) {
      const target = event.target as HTMLElement;
      const isClickInside = this.elementRef.nativeElement.contains(target);
      
      if (!isClickInside) {
        this.closeUserMenu();
      }
    }
  }
  
  /**
   * Listener para tecla ESC
   * CORRECCIÓN: No pasamos el evento porque no lo necesitamos
   */
  @HostListener('document:keydown.escape')
  onEscapePress(): void {
    if (this.isUserMenuOpen()) {
      this.closeUserMenu();
    }
  }
  
  /**
   * Alternativa si necesitas el evento (con tipado correcto)
   */
  /*
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.isUserMenuOpen()) {
      this.closeUserMenu();
    }
  }
  */
}