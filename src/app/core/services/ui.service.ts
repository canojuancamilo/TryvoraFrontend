// src/app/core/services/ui.service.ts
import { Injectable, signal, computed, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  // Señales para el estado de la UI
  private sidebarOpenSignal = signal<boolean>(true);
  private isMobileSignal = signal<boolean>(false);
  private darkModeSignal = signal<boolean>(false);
  
  // Señales computadas
  public readonly sidebarOpen = this.sidebarOpenSignal.asReadonly();
  public readonly isMobile = this.isMobileSignal.asReadonly();
  public readonly darkMode = this.darkModeSignal.asReadonly();
  
  // Computado para la clase del sidebar
  public readonly sidebarClass = computed(() => ({
    'sidebar': true,
    'collapsed': !this.sidebarOpenSignal() && !this.isMobileSignal(),
    'mobile-open': this.sidebarOpenSignal() && this.isMobileSignal()
  }));
  
  // Computado para la clase del main wrapper
  public readonly mainWrapperClass = computed(() => ({
    'main-wrapper': true,
    'expanded': !this.sidebarOpenSignal()
  }));
  
  constructor() {
    // Detectar tamaño inicial
    this.checkScreenSize();
    
    // Escuchar cambios de tamaño
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => this.checkScreenSize());
    }
  }
  
  private checkScreenSize(): void {
    const isMobile = window.innerWidth < 992;
    this.isMobileSignal.set(isMobile);
    
    // Auto-cerrar sidebar en móvil
    if (isMobile && this.sidebarOpenSignal()) {
      this.sidebarOpenSignal.set(false);
    }
  }
  
  // Toggle sidebar
  toggleSidebar(): void {
    this.sidebarOpenSignal.update(open => !open);
  }
  
  // Abrir sidebar
  openSidebar(): void {
    this.sidebarOpenSignal.set(true);
  }
  
  // Cerrar sidebar
  closeSidebar(): void {
    this.sidebarOpenSignal.set(false);
  }
  
  // Setear estado móvil manualmente
  setIsMobile(isMobile: boolean): void {
    this.isMobileSignal.set(isMobile);
  }
  
  // Toggle dark mode
  toggleDarkMode(): void {
    this.darkModeSignal.update(mode => !mode);
    // Aquí podrías aplicar la clase dark-mode al body
    if (this.darkModeSignal()) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
  
  // Resetear UI
  reset(): void {
    this.sidebarOpenSignal.set(true);
    this.isMobileSignal.set(false);
    this.darkModeSignal.set(false);
  }
}