import { ChangeDetectionStrategy, Component, inject, Pipe, signal, viewChild } from '@angular/core';
import { ConfirmModal } from "../../../shared/componentes/confirm-modal/confirm-modal";
import { NotificationService, ToastType } from '../../../servicios/notification.service';
import { Toast } from '../../../shared/componentes/toast/toast';
import { ClubService } from '../../../servicios/club.service';
import { ClubFilters, SortField } from '../../../core/models/club.model';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-clubs-table',
  imports: [ConfirmModal, Toast, DecimalPipe, DatePipe, FormsModule],
  templateUrl: './clubs-table.html',
  styleUrl: './clubs-table.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClubsTable {
  private clubService = inject(ClubService);
    private notificationService = inject(NotificationService);
  
  // Referencias a componentes
  confirmModal = viewChild.required<ConfirmModal>('confirmModal');
  toast = viewChild.required<Toast>('toast');

  // Señales del servicio
  paginatedClubs = this.clubService.paginatedClubs;
  filters = this.clubService.filters;
  sortField = this.clubService.sortField;
  currentPage = this.clubService.currentPage;
  paginationInfo = this.clubService.paginationInfo;
  totalPages = this.clubService.totalPages;

  // Estado local
  selectedClub = signal<any>(null);
  actionType = signal<'toggle' | 'delete' | null>(null);

   // Señales para el modal
  modalTitle = signal('¿Confirmar acción?');
  modalMessage = signal('Esta acción no se puede deshacer.');
  modalConfirmText = signal('Confirmar');
  modalConfirmColor = signal('var(--danger)');
  modalIcon = signal('bi-exclamation-triangle-fill');
  modalIconBg = signal('#FEF2F2');
  modalIconColor = signal('var(--danger)');

  private sportEmojis: Record<string, string> = {
    'Fútbol': '⚽',
    'Baloncesto': '🏀',
    'Voleibol': '🏐',
    'Natación': '🏊',
    'Fútbol Sala': '🥅'
  };

  private statusLabels: Record<string, string> = {
    'active': 'Activo',
    'inactive': 'Inactivo',
    'pending': 'Pendiente',
    'suspended': 'Suspendido'
  };

  updateFilter(field: keyof ClubFilters, value: string) {
    this.clubService.updateFilters({ [field]: value });
  }

  getInitials(name: string): string {
    return name.split(' ').slice(0,2).map(w => w[0]).join('').toUpperCase();
  }

  getSportEmoji(sport: string): string {
    return this.sportEmojis[sport] || '🏅';
  }

  getStatusLabel(status: string): string {
    return this.statusLabels[status] || status;
  }

  sort(field: SortField) {
    this.clubService.sort(field);
  }

  changePage(direction: number) {
    this.clubService.changePage(direction);
  }

  goToPage(page: number) {
    this.clubService.goToPage(page);
  }

  viewClub(club: any) {
    // Emitir evento para que el padre maneje el modal de vista
  }

  editClub(club: any) {
    // Emitir evento para que el padre maneje el modal de edición
  }

toggleStatus(club: any) {
    this.selectedClub.set(club);
    this.actionType.set('toggle');
    
    const newStatus = club.status === 'active' ? 'desactivar' : 'activar';
    const action = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
    
    // Actualizar las señales del modal
    this.modalTitle.set(`¿${action} club?`);
    this.modalMessage.set(`¿Estás seguro de que deseas ${newStatus} el club "${club.name}"?`);
    this.modalConfirmText.set(action);
    this.modalConfirmColor.set(club.status === 'active' ? 'var(--warning)' : 'var(--success)');
    this.modalIcon.set('bi-exclamation-triangle-fill');
    this.modalIconBg.set('#FEF2F2');
    this.modalIconColor.set(club.status === 'active' ? 'var(--warning)' : 'var(--success)');
    
    this.confirmModal().open();
  }

  deleteClub(club: any) {
    this.selectedClub.set(club);
    this.actionType.set('delete');
    
    // Actualizar las señales del modal
    this.modalTitle.set('¿Eliminar club?');
    this.modalMessage.set(`Esta acción eliminará permanentemente el club "${club.name}" y todos sus datos.`);
    this.modalConfirmText.set('Eliminar');
    this.modalConfirmColor.set('var(--danger)');
    this.modalIcon.set('bi-exclamation-triangle-fill');
    this.modalIconBg.set('#FEF2F2');
    this.modalIconColor.set('var(--danger)');
    
    this.confirmModal().open();
  }


  handleConfirmAction() {
    const club = this.selectedClub();
    if (!club) return;

    if (this.actionType() === 'toggle') {
      this.clubService.toggleStatus(club.id);
      this.notificationService.success(`Club ${club.status === 'active' ? 'desactivado' : 'activado'} correctamente`);
    } else if (this.actionType() === 'delete') {
      this.clubService.deleteClub(club.id);
      this.notificationService.success('Club eliminado correctamente');
    }

    this.clearSelectedClub();
  }

  clearSelectedClub() {
    this.selectedClub.set(null);
    this.actionType.set(null);
  }

  refreshTable() {
    // Resetear filtros
    this.clubService.updateFilters({
      search: '',
      sport: '',
      status: '',
      period: ''
    });

    
    this.notificationService.success('Tabla actualizada');
  }
 }
