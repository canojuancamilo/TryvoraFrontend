import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { NotificationModel } from '../../../core/models/notification.model';

@Component({
  selector: 'app-notifications',
  imports: [],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Notifications { 
   private notificationsSignal = signal<NotificationModel[]>([
    {
      id: 1,
      message: 'Recordatorio: 8 comprobantes pendientes de aprobación',
      time: new Date(Date.now() - 30 * 60000), // 30 minutos ago
      read: false
    },
    {
      id: 2,
      message: 'El administrador actualizó la cuota mensual a $55.00 para el próximo mes',
      time: new Date(Date.now() - 2 * 60 * 60000), // 2 horas ago
      read: false
    },
    {
      id: 3,
      message: 'Nuevo jugador registrado: Luis Torres — Sub-15 Masculino',
      time: new Date(Date.now() - 5 * 60 * 60000), // 5 horas ago
      read: false
    },
    {
      id: 4,
      message: 'Reporte mensual de Febrero generado y disponible para descarga',
      time: new Date(Date.now() - 24 * 60 * 60000), // 1 día ago
      read: true
    },
    {
      id: 5,
      message: 'Pago de entrenador Carlos Vega procesado exitosamente — $800.00',
      time: new Date(Date.now() - 48 * 60 * 60000), // 2 días ago
      read: true
    }
  ]);

  readonly notifications = this.notificationsSignal.asReadonly();
  
  readonly unreadCount = computed(() => 
    this.notifications().filter(n => !n.read).length
  );

  formatTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `Hace ${diffMins} minutos`;
    } else if (diffHours < 24) {
      return `Hace ${diffHours} horas`;
    } else if (diffDays === 1) {
      return 'Ayer';
    } else {
      return `Hace ${diffDays} días`;
    }
  }
}
