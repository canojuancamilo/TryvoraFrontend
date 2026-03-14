import { Injectable, signal, computed } from '@angular/core';
import { Stat } from '../models/stat.model';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private statsSignal = signal<Stat[]>([
    { id: 'pending', value: 8, label: 'Pagos Pendientes', icon: 'bi-hourglass-split', color: 'amber' },
    { id: 'approved', value: 14, label: 'Aprobados Hoy', icon: 'bi-check-circle-fill', color: 'green' },
    { id: 'rejected', value: 2, label: 'Rechazados', icon: 'bi-x-circle-fill', color: 'red' },
    { id: 'total', value: '$4,820', label: 'Total Recaudado del Mes', icon: 'bi-cash-stack', color: 'indigo' }
  ]);

  public stats = computed(() => this.statsSignal());

  updateStat(id: string, value: number | string): void {
    this.statsSignal.update(stats =>
      stats.map(s => s.id === id ? { ...s, value } : s)
    );
  }

  getStats() {
    return this.statsSignal();
  }
}