import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { ConfirmModalConfig } from '../../interfaces/IModals';

@Component({
  selector: 'app-confirm-modal',
  imports: [],
  templateUrl: './confirm-modal.html',
  styleUrl: './confirm-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmModal {
 private defaultConfig: ConfirmModalConfig = {
    title: '¿Confirmar acción?',
    message: 'Esta acción no se puede deshacer.',
    confirmText: 'Confirmar',
    confirmColor: 'var(--danger)',
    icon: 'bi-exclamation-triangle-fill',
    iconBg: '#FEF2F2',
    iconColor: 'var(--danger)'
  };

  // Inputs
  title = input(this.defaultConfig.title);
  message = input(this.defaultConfig.message);
  confirmText = input(this.defaultConfig.confirmText);
  confirmColor = input(this.defaultConfig.confirmColor);
  icon = input(this.defaultConfig.icon);
  iconBg = input(this.defaultConfig.iconBg);
  iconColor = input(this.defaultConfig.iconColor);
  
  // Outputs
  onConfirm = output<void>();
  onClose = output<void>();

  // Estado local
  isOpen = signal(false);

  open(config?: Partial<ConfirmModalConfig>) {
    // Si se proporciona configuración, actualizar los inputs no es posible directamente
    // Mejor usar el método con señales locales si necesitas config dinámica
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
    this.onClose.emit();
  }

  confirm() {
    this.onConfirm.emit();
    this.close();
  }
}
