import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { StatCard } from '../../../models/dashboard-admin.model';

@Component({
  selector: 'app-stats-cards',
  imports: [],
  templateUrl: './StatsCards.html',
  styleUrl: './StatsCards.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsCards {
   stats = input<StatCard[]>([]);
  
  getIconClass(icon: string): string {
    return `bi ${icon}`;
  }
 }
