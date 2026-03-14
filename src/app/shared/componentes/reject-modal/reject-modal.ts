import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { Payment } from '../../../core/models/payment.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reject-modal',
  imports: [FormsModule],
  templateUrl: './reject-modal.html',
  styleUrl: './reject-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RejectModal {
   payment = input<Payment | null>();
  confirmed = output<string>();
  closed = output<void>();
  
  reason = signal('');

  confirm() {
    this.confirmed.emit(this.reason());
  }

  close() {
    this.reason.set('');
    this.closed.emit();
  }
 }
