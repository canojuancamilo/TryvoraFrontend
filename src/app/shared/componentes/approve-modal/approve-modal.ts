import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Payment } from '../../../core/models/payment.model';

@Component({
  selector: 'app-approve-modal',
  imports: [],
  templateUrl: './approve-modal.html',
  styleUrl: './approve-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApproveModal {
  payment = input<Payment | null>();
  confirmed = output<void>();
  closed = output<void>();

  confirm() {
    this.confirmed.emit();
  }

  close() {
    this.closed.emit();
  }
}
