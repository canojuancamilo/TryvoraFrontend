import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { StatCard } from '../../../core/models/dashboard-admin.model';

@Component({
  selector: 'app-stats-cards',
  imports: [],
  templateUrl: './stats-grid.html',
  styleUrl: './stats-grid.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsGrid {
   stats = input<StatCard[]>([]);
  
  getIconClass(icon: string): string {
    return `bi ${icon}`;
  }
 }
