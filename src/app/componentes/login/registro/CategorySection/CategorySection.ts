import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category-section',
  imports: [CommonModule, FormsModule],
  templateUrl: './CategorySection.html',
  styleUrl: './CategorySection.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategorySection {
  tipo = input<'masculina' | 'femenina'>('masculina');
  nombreRama = input<string>('');
  categorias = input<string[]>([]);
  categoriasChange = output<string[]>();
  nuevaCategoria = signal<string>('');

  get icono(): string {
    return this.tipo() === 'masculina' ? 'bi bi-gender-male' : 'bi bi-gender-female';
  }

  agregarCategoria(): void {
    const cat = this.nuevaCategoria().trim();
    if (!cat) return;

    if (!this.categorias().includes(cat)) {
      const nuevas = [...this.categorias(), cat];
      this.categoriasChange.emit(nuevas);
    }

    this.nuevaCategoria.set('');
  }

  removerCategoria(categoria: string): void {
    const nuevas = this.categorias().filter(c => c !== categoria);
    this.categoriasChange.emit(nuevas);
  }
}
