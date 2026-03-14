import { ChangeDetectionStrategy, Component, effect, input, output, signal } from '@angular/core';
import { Tesorero } from '../../../../core/models/tesorero.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tesorero-modal',
  imports: [FormsModule],
  templateUrl: './tesorero-modal.html',
  styleUrl: './tesorero-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TesoreroModal {
  isOpen = input<boolean>(false);
  tesorero = input<Tesorero | null>(null);

  closeModal = output<void>();
  saveTesorero = output<Omit<Tesorero, 'id' | 'createdAt'>>();

  formData: Omit<Tesorero, 'id' | 'createdAt'> = {
    nombre: '',
    email: '',
    telefono: '',
    estado: true,
    password: ''
  };

  confirmPassword = '';
  isEditMode = signal(false);

  constructor() {
    effect(() => {
      const tesoreroData = this.tesorero();
      if (tesoreroData) {
        this.isEditMode.set(true);
        this.formData = {
          nombre: tesoreroData.nombre,
          email: tesoreroData.email,
          telefono: tesoreroData.telefono,
          estado: tesoreroData.estado
        };
      } else {
        this.isEditMode.set(false);
        this.resetForm();
      }
    });
  }

  resetForm(): void {
    this.formData = {
      nombre: '',
      email: '',
      telefono: '',
      estado: true,
      password: ''
    };
    this.confirmPassword = '';
  }

  save(): void {
    if (!this.isEditMode() && this.formData.password !== this.confirmPassword) {
      return;
    }
    this.saveTesorero.emit(this.formData);
  }

  close(): void {
    this.closeModal.emit();
    this.resetForm();
  }
}
