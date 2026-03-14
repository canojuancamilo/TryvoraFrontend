import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-delete-confirm-modal',
  imports: [],
  templateUrl: './delete-confirm-modal.html',
  styleUrl: './delete-confirm-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteConfirmModal {
  isOpen = input<boolean>(false);
  tesoreroName = input<string>('');

  closeModal = output<void>();
  confirmDelete = output<void>();

  close(): void {
    this.closeModal.emit();
  }

  confirm(): void {
    this.confirmDelete.emit();
    this.close();
  }
}
