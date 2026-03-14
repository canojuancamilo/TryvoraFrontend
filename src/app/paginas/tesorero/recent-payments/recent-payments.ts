import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { PaymentService } from '../../../servicios/payment.service';
import { NotificationService } from '../../../servicios/notification.service';

@Component({
  selector: 'app-recent-payments',
  imports: [],
  templateUrl: './recent-payments.html',
  styleUrl: './recent-payments.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentPayments {
  private paymentService = inject(PaymentService);
  private toastService = inject(NotificationService);

  downloading = signal(false);
  recentPayments = this.paymentService.recentPayments;

  formatDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 24) {
      return 'Hoy, ' + date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    } else if (hours < 48) {
      return 'Ayer, ' + date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('es-ES');
  }

  downloadReport() {
    this.downloading.set(true);

    // Simular descarga
    setTimeout(() => {
      this.downloading.set(false);
      this.toastService.show('Reporte generado y listo para descarga', 'success');
    }, 2000);
  }
}
