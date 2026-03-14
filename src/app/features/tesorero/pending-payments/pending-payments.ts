import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ApproveModal } from '../../../shared/componentes/approve-modal/approve-modal';
import { RejectModal } from '../../../shared/componentes/reject-modal/reject-modal';
import { BranchFilter } from '../../../shared/componentes/branch-filter/branch-filter';
import { PaymentService } from '../../../core/services/payment.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Payment } from '../../../core/models/payment.model';

@Component({
  selector: 'app-pending-payments',
  imports: [ApproveModal, RejectModal, BranchFilter],
  templateUrl: './pending-payments.html',
  styleUrl: './pending-payments.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PendingPayments { 
  private paymentService = inject(PaymentService);
  private toastService = inject(NotificationService);

  activeBranch = signal<'todos' | 'masculino' | 'femenino'>('todos');
  selectedPayment = signal<Payment | null>(null);

  filteredPayments = computed(() => {
    const branch = this.activeBranch();
    const payments = this.paymentService.pendingPayments();
    
    if (branch === 'todos') return payments;
    return payments.filter(p => p.branch === branch);
  });

  formatDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Hoy, ' + date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    if (days === 1) return 'Ayer, ' + date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    return date.toLocaleDateString('es-ES');
  }

  showReceipt(payment: Payment) {
    this.toastService.show(`Vista previa del comprobante de ${payment.player}`, 'info');
  }

  openApproveModal(payment: Payment) {
    this.selectedPayment.set(payment);
  }

  openRejectModal(payment: Payment) {
    this.selectedPayment.set(payment);
  }

  onApprove() {
    const payment = this.selectedPayment();
    if (payment) {
      this.paymentService.approvePayment(payment.id);
      this.toastService.show('Pago aprobado exitosamente', 'success');
      this.selectedPayment.set(null);
    }
  }

  onReject(reason: string) {
    const payment = this.selectedPayment();
    if (payment) {
      this.paymentService.rejectPayment(payment.id);
      this.toastService.show('Pago rechazado', 'error');
      this.selectedPayment.set(null);
    }
  }
}
