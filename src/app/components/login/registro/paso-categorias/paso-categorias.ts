// app/pages/registro/componentes/paso-categorias/paso-categorias.component.ts
import { 
  ChangeDetectionStrategy, 
  Component, 
  inject,
  computed,
  DestroyRef
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CategorySection } from '../CategorySection/CategorySection';
import { CategoriasInfo, RamasInfo } from '../../../../core/models/registro.models';
import { RegistroService } from '../../../../servicios/registro.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-paso-categorias',
  standalone: true,
  imports: [CategorySection, ReactiveFormsModule],
  templateUrl: './paso-categorias.html',
  styleUrls: ['./paso-categorias.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasoCategorias {
  // Inyección moderna
  private registroService = inject(RegistroService);
  private destroyRef = inject(DestroyRef);

  // Señales computadas basadas en el servicio
  private data = this.registroService.data;
  
  // Exponemos solo lo necesario como señales computadas
  ramas = computed(() => this.data().ramas);
  categorias = computed(() => this.data().categorias);
  
  // Señales computadas para la lógica de negocio
  tieneRamas = computed(() => {
    const ramas = this.ramas();
    return ramas.masculina || ramas.femenina;
  });

  isValid = computed(() => {
    const ramas = this.ramas();
    const categorias = this.categorias();

    if (!this.tieneRamas()) {
      return categorias.masculina.length > 0;
    }

    let valid = true;
    if (ramas.masculina) {
      valid = valid && categorias.masculina.length > 0;
    }
    if (ramas.femenina) {
      valid = valid && categorias.femenina.length > 0;
    }
    return valid;
  });

  // Getter para el template (también podría ser una señal)
  get nombreRamaMasculina(): string {
    return this.ramas().nombreMasculina || 'Rama Masculina';
  }

  get nombreRamaFemenina(): string {
    return this.ramas().nombreFemenina || 'Rama Femenina';
  }

  onCategoriasChange(tipo: 'masculina' | 'femenina', nuevasCategorias: string[]): void {
    const update = { [tipo]: nuevasCategorias };
    this.registroService.updateCategoriasData(update);
  }

  onAnterior(): void {
    this.registroService.prevStep();
  }

  onSiguiente(): void {
    if (this.isValid()) {
      this.registroService.nextStep();
    }
  }
}