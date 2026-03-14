import { Pipe, PipeTransform } from '@angular/core';
import { Tesorero } from '../../../../core/models/tesorero.model';

@Pipe({
  name: 'filterTesoreros',
  standalone: true
})
export class FilterTesorerosPipe implements PipeTransform {
  transform(tesoreros: Tesorero[], searchTerm: string): Tesorero[] {
    if (!searchTerm || !tesoreros) {
      return tesoreros;
    }

    const term = searchTerm.toLowerCase();
    return tesoreros.filter(t => 
      t.nombre.toLowerCase().includes(term) ||
      t.email.toLowerCase().includes(term) ||
      t.telefono.includes(term)
    );
  }
}