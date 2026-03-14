import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Sidebar } from "../../../shared/componentes/sidebar/sidebar";
import { Topbar } from "../../../shared/componentes/topbar/topbar";
import { TesoreroModal } from "../../../shared/componentes/Modals/tesorero-modal/tesorero-modal";
import { DeleteConfirmModal } from "../../../shared/componentes/Modals/delete-confirm-modal/delete-confirm-modal";
import { UiService } from '../../../core/services/ui.service';
import { TesoreroService } from '../../../core/services/tesorero.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-gestion-tesoreros',
  imports: [Sidebar, Topbar, TesoreroModal, DeleteConfirmModal],
  templateUrl: './gestion-tesoreros.html',
  styleUrl: './gestion-tesoreros.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GestionTesoreros {
  uiService = inject(UiService);  
  tesoreroService = inject(TesoreroService);
  toastService = inject(NotificationService);

  isModalOpen = signal(false);
  isDeleteModalOpen = signal(false);
  selectedTesorero = signal<any>(null);
  selectedTesoreroName = signal('');
  deleteId: string | null = null;

   // Señales del UI Service
  public readonly sidebarOpen = this.uiService.sidebarOpen;
  public readonly isMobile = this.uiService.isMobile;
  public readonly sidebarClass = this.uiService.sidebarClass;
  public readonly mainWrapperClass = this.uiService.mainWrapperClass;

  // Datos del club y usuario
  public readonly clubInfo = {
    name: 'FC Deportivo Norte',
    avatar: 'FC',
    role: 'Administrador'
  };

  public readonly userInfo = {
    name: 'Carlos Administrador',
    avatar: 'CA',
    role: 'Admin del Club'
  };

  filteredTesoreros = computed(() => {
    const term = this.tesoreroService.searchTerm();
    return this.tesoreroService.tesoreros().filter(t =>
      !term ||
      t.nombre.toLowerCase().includes(term.toLowerCase()) ||
      t.email.toLowerCase().includes(term.toLowerCase()) ||
      t.telefono.includes(term)
    );
  });

   toggleSidebar(): void {
    this.uiService.toggleSidebar();
  }


  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  }

  onSearch(event: Event): void {
    const term = (event.target as HTMLInputElement).value;
    this.tesoreroService.setSearchTerm(term);
  }

  openAddModal(): void {
    this.selectedTesorero.set(null);
    this.isModalOpen.set(true);
  }

  openEditModal(tesorero: any): void {
    this.selectedTesorero.set(tesorero);
    this.isModalOpen.set(true);
  }

  openDeleteModal(tesorero: any): void {
    this.deleteId = tesorero.id;
    this.selectedTesoreroName.set(tesorero.nombre);
    this.isDeleteModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.selectedTesorero.set(null);
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.deleteId = null;
    this.selectedTesoreroName.set('');
  }

  saveTesorero(tesoreroData: any): void {
    if (this.selectedTesorero()) {
      // Editar
      this.tesoreroService.updateTesorero(this.selectedTesorero().id, tesoreroData);
      this.toastService.success(`✅ Tesorero "${tesoreroData.nombre}" actualizado correctamente`);
    } else {
      // Crear
      this.tesoreroService.addTesorero(tesoreroData);
      this.toastService.success(`✅ Tesorero "${tesoreroData.nombre}" creado correctamente`);
    }
    this.closeModal();
  }

  toggleEstado(id: string): void {
    this.tesoreroService.toggleEstado(id);
    const tesorero = this.tesoreroService.getTesoreroById(id);
    const estado = tesorero?.estado ? 'activado' : 'desactivado';
    this.toastService.info(`ℹ️ Tesorero ${tesorero?.nombre} ${estado}`);
  }

  confirmDelete(): void {
    if (this.deleteId) {
      const nombre = this.selectedTesoreroName();
      this.tesoreroService.deleteTesorero(this.deleteId);
      this.toastService.error(`🗑️ Tesorero "${nombre}" eliminado`);
      this.closeDeleteModal();
    }
  }
}
