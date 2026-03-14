import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  imports: [],
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatCard { 
  icon = input.required<string>();
  value = input.required<string | number>();
  label = input.required<string>();
  color = input<'indigo' | 'cyan' | 'green' | 'amber'>('indigo');
  change = input<string>();
  changeDirection = input<'up' | 'down'>('up');
}
