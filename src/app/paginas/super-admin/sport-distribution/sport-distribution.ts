import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-sport-distribution',
  imports: [],
  templateUrl: './sport-distribution.html',
  styleUrl: './sport-distribution.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SportDistribution { 
  distribution = [
    { sport: 'Fútbol', count: 4, color: '#4F46E5' },
    { sport: 'Baloncesto', count: 2, color: '#06B6D4' },
    { sport: 'Voleibol', count: 2, color: '#10B981' },
    { sport: 'Natación', count: 2, color: '#F59E0B' },
    { sport: 'Fútbol Sala', count: 2, color: '#EF4444' }
  ];

  total = this.distribution.reduce((sum, item) => sum + item.count, 0);
}
