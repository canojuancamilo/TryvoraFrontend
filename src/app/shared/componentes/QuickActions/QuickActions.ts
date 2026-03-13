import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { NotificationService } from '../../../servicios/notification.service';
import { Router } from '@angular/router';
export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  route?: string;
  action?: () => void;
  primary?: boolean;
}
@Component({
  selector: 'app-quick-actions',
  imports: [],
  templateUrl: './QuickActions.html',
  styleUrl: './QuickActions.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickActions {
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  
  // Outputs para acciones personalizadas
  addPlayer = output<void>();
  registerPayment = output<void>();
  sendNotification = output<void>();
  
  actions: QuickAction[] = [
    {
      id: 'add-player',
      label: 'Agregar Jugador',
      icon: 'bi-person-plus-fill',
      primary: true,
      action: () => this.onAddPlayer()
    },
    {
      id: 'register-payment',
      label: 'Registrar Pago',
      icon: 'bi-credit-card-fill',
      action: () => this.onRegisterPayment()
    },
    {
      id: 'send-notification',
      label: 'Enviar Notificación',
      icon: 'bi-bell-fill',
      action: () => this.onSendNotification()
    }
  ];
  
  onAddPlayer(): void {
    this.addPlayer.emit();
    this.notificationService.info('Navegando a agregar jugador...');
    // this.router.navigate(['/jugadores/nuevo']);
  }
  
  onRegisterPayment(): void {
    this.registerPayment.emit();
    this.notificationService.info('Abriendo registro de pago...');
    // this.router.navigate(['/pagos/registrar']);
  }
  
  onSendNotification(): void {
    this.sendNotification.emit();
    this.notificationService.info('Abriendo centro de notificaciones...');
    // this.router.navigate(['/notificaciones/nueva']);
  }
  
  executeAction(action: QuickAction): void {
    if (action.route) {
      this.router.navigate([action.route]);
    } else if (action.action) {
      action.action();
    }
  }
 }
