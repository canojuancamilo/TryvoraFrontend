import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ClubService } from '../../../servicios/club.service';
import { StatCard } from "../../../shared/componentes/stat-card/stat-card";

@Component({
  selector: 'app-stats-grid',
  imports: [StatCard],
  templateUrl: './stats-grid.html',
  styleUrl: './stats-grid.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsGrid {
  private clubService = inject(ClubService);
  stats = this.clubService.stats();
}
