import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-branch-card',
  imports: [CommonModule],
  templateUrl: './branch-card.html',
  styleUrl: './branch-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BranchCard {
  tipo = input<'masculina' | 'femenina'>('masculina');
  titulo = input<string>('');
  descripcion = input<string>('');
  selected = input<boolean>(false);
  selectedChange = output<boolean>();

  get icono(): string {
    return this.tipo() === 'masculina' ? 'bi bi-gender-male' : 'bi bi-gender-female';
  }

  onClick(): void {
    this.selectedChange.emit(!this.selected);
  }
}
