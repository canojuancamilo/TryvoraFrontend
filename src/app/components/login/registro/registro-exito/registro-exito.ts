import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RegistroService } from '../../../../core/services/registro.service';

@Component({
  selector: 'app-registro-exito',
  imports: [],
  templateUrl: './registro-exito.html',
  styleUrl: './registro-exito.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistroExito {
  private registroService = inject(RegistroService);
  private router = inject(Router);

  // Obtener datos del registro para el resumen
  private data = this.registroService.data;

  // Señales computadas para el resumen
  clubNombre = computed(() => this.data().club.nombre);
  deporte = computed(() => this.data().club.deporte);
  adminNombre = computed(() => this.data().admin.nombre);

  ramasTexto = computed(() => {
    const ramas = this.data().ramas;
    const ramasList = [];
    if (ramas.masculina) ramasList.push('Masculina');
    if (ramas.femenina) ramasList.push('Femenina');
    return ramasList.length ? ramasList.join(' y ') : 'Sin ramas específicas';
  });

  resetForm(): void {
    this.registroService.resetForm();
  }

  toLogin(): void {
    this.registroService.resetForm();
    this.router.navigate(['/login']);
  }
}
