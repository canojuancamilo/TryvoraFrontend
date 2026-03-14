import { Injectable, signal, computed } from '@angular/core';
import { Payment, PaymentStats } from '../models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private payments = signal<Payment[]>([
    { id: 1, player: 'Carlos Ruiz', category: 'Sub-15', branch: 'masculino', amount: 50, date: new Date(), initials: 'CR', status: 'pending' },
    { id: 2, player: 'María López', category: 'Sub-18', branch: 'femenino', amount: 50, date: new Date(), initials: 'ML', status: 'pending' },
    { id: 3, player: 'Diego Vargas', category: 'Primera', branch: 'masculino', amount: 50, date: new Date(), initials: 'DV', status: 'pending' },
    { id: 4, player: 'Valentina Cruz', category: 'Sub-15', branch: 'femenino', amount: 50, date: new Date(), initials: 'VC', status: 'pending' },
    { id: 5, player: 'Andrés Mora', category: 'Sub-18', branch: 'masculino', amount: 50, date: new Date(), initials: 'AM', status: 'pending' },
    { id: 6, player: 'Camila Ríos', category: 'Primera', branch: 'femenino', amount: 50, date: new Date(), initials: 'CR', status: 'pending' },
    { id: 7, player: 'Sebastián Pino', category: 'Sub-15', branch: 'masculino', amount: 50, date: new Date(), initials: 'SP', status: 'pending' },
    { id: 8, player: 'Daniela Fuentes', category: 'Sub-18', branch: 'femenino', amount: 50, date: new Date(), initials: 'DF', status: 'pending' },
  ]);

  private recentApproved = signal<Payment[]>([
    { id: 9, player: 'Juan Pérez', category: 'Sub-18', branch: 'masculino', amount: 50, date: new Date(), initials: 'JP', status: 'approved' },
    { id: 10, player: 'Ana Martínez', category: 'Sub-15', branch: 'femenino', amount: 50, date: new Date(), initials: 'AM', status: 'approved' },
    { id: 11, player: 'Sofía Torres', category: 'Sub-18', branch: 'femenino', amount: 50, date: new Date(), initials: 'ST', status: 'approved' },
    { id: 12, player: 'Luis Ramírez', category: 'Sub-15', branch: 'masculino', amount: 50, date: new Date(), initials: 'LR', status: 'approved' },
  ]);

  private recentRejected = signal<Payment[]>([
    { id: 13, player: 'Pedro Gómez', category: 'Primera', branch: 'masculino', amount: 50, date: new Date(), initials: 'PG', status: 'rejected' },
  ]);

  readonly pendingPayments = computed(() => this.payments());
  
  readonly stats = computed<PaymentStats>(() => ({
    pending: this.payments().length,
    approved: this.recentApproved().length,
    rejected: this.recentRejected().length,
    totalMonth: 4820
  }));

  readonly recentPayments = computed(() => [
    ...this.recentApproved().map(p => ({ ...p, status: 'approved' as const })),
    ...this.recentRejected().map(p => ({ ...p, status: 'rejected' as const }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime()));

  approvePayment(id: number) {
    const payment = this.payments().find(p => p.id === id);
    if (payment) {
      this.payments.update(payments => payments.filter(p => p.id !== id));
      this.recentApproved.update(approved => [payment, ...approved]);
    }
  }

  rejectPayment(id: number) {
    const payment = this.payments().find(p => p.id === id);
    if (payment) {
      this.payments.update(payments => payments.filter(p => p.id !== id));
      this.recentRejected.update(rejected => [payment, ...rejected]);
    }
  }

  filterPaymentsByBranch(branch: 'todos' | 'masculino' | 'femenino') {
    if (branch === 'todos') return this.payments();
    return this.payments().filter(p => p.branch === branch);
  }
}